# Paso 10: Flujo "Pasar el Teléfono" (Modo Local)

## Objetivo
Implementar la experiencia de juego en un solo dispositivo. Todo el juego corre **localmente en el frontend**, sin WebSockets. Lo único que se consume del servidor es la **generación de palabras** (endpoint de IA). El sistema debe gestionar la privacidad de los jugadores mediante pantallas de transición y permitir un flujo fluido de "pasar y revelar".

## Requerimientos Técnicos
- **Estado**: Gestión puramente local (sin WebSockets).
- **IA**: Única dependencia del servidor → endpoint para generar palabras.
- **Engine**: State Machine client-side (réplica simplificada del Game Server).
- **Referencias**: [`Flujo_de_Juego.md`](../../Flujo_de_Juego.md) (Sección A: Sala Local).

## Pasos de Ejecución

### 1. Motor de Juego Local (`src/engine/LocalGameEngine.ts`)
Implementar una clase de lógica de juego que viva **exclusivamente en el frontend**:

1.  **State Machine Local**: Máquina de estados simplificada que gestiona las fases:
    `LOBBY_LOCAL` → `ASSIGNING` → `CLUES` → `DISCUSSING` → `VOTING` → `ELIMINATION` → `RESULTS`
    - Usa los mismos `GamePhase` de `@impostor/shared`, pero la transición es controlada por el usuario (botones de avanzar), no por el servidor.
2.  **Reparto de Roles**: Lógica pura que asigna roles según el modo:
    - **Tradicional**: 1 Impostor (palabra: null) + N-1 Agentes (palabra: mainWord).
    - **Cercanas**: 1 Infiltrado (palabra: infiltradoWord) + N-1 Agentes (palabra: mainWord).
    - **Caos**: NO disponible en modo local (validar en el Stepper de creación).
3.  **Generación de Palabras**: Al iniciar la partida, hacer una **única llamada HTTP** al Game Server o API para obtener las palabras de la IA:
    - Reutilizar el endpoint/lógica del `AIService` del backend.
    - Si falla: usar el mismo `fallback_words.json` embebido en el bundle del frontend.
4.  **Orden de Turnos**: Generar un array shuffled de jugadores que define el orden de intervención (pistas verbales).
5.  **Cálculo de Puntos**: Reutilizar los mismos algoritmos de `ScoringService`, pero ejecutándolos en el frontend.
    - Los puntos del modo local NO se envían al servidor ni se persisten en DB.

### 2. Pantalla de Transición (`LocalPassView.tsx`)
1. Implementar la vista neutra: "Pasa el móvil a [Nombre]".
2. Botón gigante "Ya tengo el móvil" que desbloquea la vista de revelación.
3. **Seguridad**: No debe haber NINGUNA información del juego visible en esta pantalla (ni roles, ni palabras, ni historial).

### 3. Ciclo de Asignación Local
1. Orquestar el bucle de jugadores:
   - Mostrar `LocalPassView` → Jugador toma el móvil.
   - Mostrar `AssignView` (con el componente Hold to Reveal) → Jugador ve su rol/palabra.
   - Al presionar "Entendido" → Volver a `LocalPassView` para el siguiente jugador.
2. Al terminar todos, saltar a la vista de "Orden de Intervención".

### 4. Ronda de Pistas Local
1. Mostrar el **Orden de Intervención** con la lista completa de jugadores.
2. Las pistas se dan **verbalmente**, no se escriben en la app:
   - El móvil se coloca en el centro de la mesa.
   - Muestra quién tiene el turno actual.
3. **Temporizador (Opcional)**: Si se configuró tiempo por turno en los settings:
   - El jugador actual presiona un botón para iniciar su cuenta atrás.
   - Al llegar a 0, se avanza automáticamente al siguiente turno.
4. Botón "Siguiente Turno" manual para avanzar si no hay temporizador.

### 5. Debate y Votación Local
1. **Debate**: Discusión física cara a cara (el móvil puede mostrar un timer global si está configurado).
2. **Votación**: El móvil circula por la mesa. Cada jugador:
   - Ve la pantalla de `LocalPassView` → Toma el móvil.
   - Selecciona su voto en `VoteView` y confirma.
   - Pasa el móvil al siguiente.
3. **Revelación**: Al terminar la votación, se muestra el resultado y la animación de eliminación.

### 6. Store Local (`useLocalGameStore`)
Store de Zustand independiente del `useGameStore` (que es para modo online):
- **Estado**: `players[]`, `phase`, `currentPlayerIndex`, `roles`, `votes`, `history`, `settings`.
- **NO persiste** en localStorage (se pierde al recargar, es una sesión efímera).
- **Reset**: Se limpia completamente al volver al lobby.

## Verificación
- Es imposible ver el rol de un jugador sin pasar por la pantalla de transición y mantener presionado el botón.
- El flujo local termina correctamente en la pantalla de resultados sin intentar conectar a WebSockets.
- Los nombres de los jugadores en modo local se mantienen correctamente durante toda la sesión.
- El modo Caos NO aparece como opción en el Stepper de creación cuando se selecciona "Local".
- Si el servidor de IA no está disponible, se usan palabras del fallback embebido y el juego funciona sin internet.
- El temporizador local (si configurado) funciona correctamente y avanza el turno al llegar a 0.
