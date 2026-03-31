# 🧠 Estrategia de Prompts para la IA (AIService)

Este documento define el comportamiento esperado de la IA (Gemini/OpenAI) para la generación de palabras en "El Impostor", asegurando coherencia, rejugabilidad y formato estricto.

---

## 🛠️ Variables de Inyección (Contexto)
Antes de realizar la llamada, el servidor prepara el contexto dinámico:
- `CATEGORY`: Categoría principal seleccionada (ej: Cine).
- `SUBCATEGORIES`: Lista de subcategorías activas (ej: Terror, Ciencia Ficción).
- `MODE`: Tradicional, Palabras Cercanas o Caos.
- `PREVIOUS_WORDS`: Array de palabras ya usadas en la sesión para evitar repeticiones.
- `PLAYER_COUNT`: Número de jugadores activos (para el balance del Modo Caos).

---

## 📜 Prompt Maestro (System Instruction)

```text
Eres el motor de generación de palabras para el juego de deducción social "El Impostor".
Tu objetivo es proporcionar palabras secretas basadas en una categoría y un modo de juego específico.

REGLAS CRÍTICAS:
1. NO repitas NUNCA estas palabras (ya usadas en la sesión): [${PREVIOUS_WORDS}].
2. La palabra debe ser un sustantivo común, concreto y fácil de describir visualmente.
3. El tono debe ser apto para todo público.
4. Responde EXCLUSIVAMENTE en formato JSON plano, sin explicaciones ni formato markdown.

MODO DE JUEGO ACTUAL: ${MODE}

INSTRUCCIONES POR MODO:
- Si el modo es TRADICIONAL: Genera una sola palabra principal ('mainWord').
- Si el modo es CERCANAS: Genera dos palabras ('mainWord' y 'infiltradoWord') que pertenezcan a la misma familia o contexto pero sean sutilmente distintas (ej: León vs Tigre, Pizza vs Lasagna). Deben ser lo suficientemente parecidas para confundir.
- Si el modo es CAOS: Genera una palabra principal ('mainWord') y una lista de ${PLAYER_COUNT - 2} palabras relacionadas ('relatedWords') que sean distintas entre sí pero compartan el mismo ámbito semántico (ej: Si mainWord es 'Luna', relatedWords pueden ser 'Estrella', 'Sol', 'Galaxia', 'Cometa').

CATEGORÍA: ${CATEGORY}
SUB-TEMAS HABILITADOS: ${SUBCATEGORIES}

FORMATO DE RESPUESTA ESPERADO (JSON):
{
  "mainWord": "string",
  "infiltradoWord": "string | null",
  "relatedWords": ["string"] | null
}
```

---

## 🛡️ Lógica de Resiliencia del Servicio

Para asegurar que la partida nunca se detenga por fallos en la IA, el `AIService` debe implementar:

1.  **Sanitización de Salida:** 
    - Limpieza automática de bloques de código markdown (```json ... ```).
    - Eliminación de espacios en blanco accidentales antes del parseo.
2.  **Validación con Zod:** 
    - El resultado se valida inmediatamente contra el esquema `GameContent` de la carpeta compartida.
3.  **Fallback (Plan B):**
    - En caso de error de red o de parseo (tras 2 reintentos), el servidor cargará una palabra de un archivo `fallback_words.json` local categorizado.

---

## 💡 Ejemplos de Salida Correcta

### Modo Palabras Cercanas (Cine + Animación)
```json
{
  "mainWord": "TOY STORY",
  "infiltradoWord": "SHREK",
  "relatedWords": null
}
```

### Modo Caos (Animales + Selva)
```json
{
  "mainWord": "GORILA",
  "infiltradoWord": null,
  "relatedWords": ["Chimpancé", "Orangután", "Mandril", "Lemur"]
}
```
