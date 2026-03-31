import { Hono } from 'hono';
import { GoogleGenAI } from '@google/genai';
import { gameContentSchema } from '@impostor/shared';
import { LocalFallbackService } from '../services/LocalFallbackService';

export const aiController = new Hono();
const fallbackService = new LocalFallbackService();

// Leemos las keys una sola vez al iniciar la aplicación en memoria
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

aiController.post('/generate-game-content', async (c) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key') {
    return c.json({ error: 'GEMINI_API_KEY no configurada' }, 500);
  }

  const { mode, mainCategory, subcategories, previousWords, playerCount = 4 } = await c.req.json();
  
  if (!mode || !mainCategory || !subcategories) {
    return c.json({ error: 'Missing parameters (mode, mainCategory, subcategories)' }, 400);
  }

  const previous = previousWords && previousWords.length > 0 ? previousWords.join(', ') : 'Ninguna';

  // Build prompt
  let rules = '';
  if (mode === 'TRADICIONAL') {
    rules = '- Genera una "mainWord" temática.\n- "infiltradoWord" debe ser null.\n- "relatedWords" debe ser [].';
  } else if (mode === 'CERCANAS') {
    rules = '- Genera una "mainWord" temática.\n- Genera una "infiltradoWord" que sea un concepto similar pero distinto (ej: "Perro" y "Lobo").\n- "relatedWords" debe ser [].';
  } else if (mode === 'CAOS') {
    const relatedCount = Math.max(playerCount - 2, 1);
    rules = `- Genera una "mainWord" temática.\n- "infiltradoWord" debe ser null.\n- Genera una lista "relatedWords" con exactamente ${relatedCount} palabras distintas entre sí, todas relacionadas semánticamente a la principal.`;
  }

  const prompt = `Actúa como el motor central del juego "El Impostor".
Genera contenido para una partida de modo ${mode} sobre la categoría "${mainCategory}" y subcategorías: ${subcategories.join(', ')}.

REGLAS CRÍTICAS:
1. NO repitas NUNCA estas palabras (ya usadas): [${previous}].
2. La palabra debe ser un sustantivo común, concreto y fácil de describir visualmente.
3. El tono debe ser apto para todo público.

REGLAS ESPECÍFICAS DEL MODO ${mode}:
${rules}

Responde ÚNICAMENTE con un JSON válido con esta estructura plana, respetando los nulos:
{"mainWord": "...", "infiltradoWord": null, "relatedWords": [...]}`;

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    // Validate structure
    const validated = gameContentSchema.parse(parsed);

    return c.json(validated);

  } catch (error: any) {
    console.error('[AiController] Primary AI failed, using fallback.', error.message);
    try {
      // Intentar con el plan B (diccionario offline)
      const fallbackData = await fallbackService.generateGameContent(
        { mode: mode as any } as any, // Mock the settings object
        playerCount,
        previousWords || []
      );
      return c.json(fallbackData);
    } catch (fallbackError: any) {
      console.error('[AiController] Fallback also failed', fallbackError.message);
      return c.json({ error: 'Failed to generate content', details: error.message }, 500);
    }
  }
});
