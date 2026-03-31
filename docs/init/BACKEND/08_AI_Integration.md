# Paso 08: Integración del AIService

## Objetivo
Dotar al juego de palabras dinámicas y semánticamente inteligentes utilizando Inteligencia Artificial (Google Gemini). El sistema debe generar contenido adaptado a cada modo de juego y categoría, con un mecanismo de seguridad (fallback) en caso de fallo de la IA.

## Requerimientos Técnicos
- **Entorno**: Bun (Game Server).
- **IA**: Google Gemini API (`@google/generative-ai`).
- **Arquitectura**: Hexagonal (Domain -> Application -> Infrastructure).
- **Referencias**: `docs/references/technical/ai_prompts.md`, `docs/references/game_design/word_base.md`, `docs/references/technical/schemas/room.schema.ts`.

## Pasos de Ejecución

### 1. Capa de Dominio (`apps/game-server/src/domain`)
1.  **Interfaz `IAiService`**: Definir el contrato para la generación de contenido:
    - `generateGameContent(settings: RoomSettings): Promise<GameContent>`.
2.  **Modelo `GameContent`**: (Ya definido en `@impostor/shared`) Asegurar su uso para tipar la respuesta.

### 2. Capa de Aplicación (`apps/game-server/src/application`)
1.  **Use Case `PrepareMatchContent`**:
    - Orquestar la llamada al `IAiService`.
    - Implementar lógica de reintentos (máx 2).
    - **Mecanismo de Fallback**: Si la IA falla tras los reintentos, cargar una palabra aleatoria de un JSON local categorizado.

### 3. Capa de Infraestructura (`apps/game-server/src/infrastructure`)
1.  **`GeminiAiService`**: Implementación de la interfaz usando el SDK de Google.
    - Implementar el **Prompt Engineering** definido en `ai_prompts.md`.
    - Configurar la salida en modo JSON estricto.
    - Sanitizar la respuesta (eliminar bloques ```json ... ``` accidentales).
2.  **`LocalFileFallback`**: Adaptador que lee de `src/infrastructure/data/fallback_words.json`.

### 4. Integración con el `MatchManager`
- El `MatchManager` invoca el caso de uso `PrepareMatchContent` justo antes de cambiar la fase a `ASSIGNING`.
- El estado de la partida se actualiza con las palabras obtenidas.

## Verificación
- Iniciar una partida en "Modo Cercanas" y verificar que la IA genera dos palabras relacionadas (ej: Tigre y León).
- Simular un fallo de API Key y comprobar que el juego inicia correctamente usando una palabra del archivo de fallback.
- Validar que el tiempo de respuesta total no exceda los 5 segundos.
