# Paso 09: Orquestación de Eventos y Sincronización

## Objetivo
Unir la interfaz de usuario con la lógica de tiempo real. El **Game Server (Server 1)** debe procesar las acciones de los jugadores (pistas, votos) mediante casos de uso y emitir las actualizaciones de estado necesarias para mantener la partida sincronizada.

## Requerimientos Técnicos
- **Entorno**: Bun (Game Server).
- **Protocolo**: WebSockets nativos.
- **Validación**: Esquemas `clueSchema` y `castVoteSchema` de `@impostor/shared`.
- **Arquitectura**: Hexagonal (Adapters -> Use Cases -> State).

## Pasos de Ejecución

### 1. Capa de Aplicación (`apps/game-server/src/application`)
1.  **Use Case `SubmitClue`**:
    - Valida que el jugador tenga el turno.
    - Actualiza el historial de la ronda en RAM.
    - Activa el siguiente turno o dispara la transición a `DISCUSSING`.
2.  **Use Case `CastVote`**:
    - Registra el voto (provisional o confirmado).
    - Comprueba si todos los jugadores han confirmado para terminar la fase de votación anticipadamente.
3.  **Use Case `ResolvePhase`**:
    - Calcula resultados de votación o vínculos (Modo Caos).
    - Determina eliminaciones.

### 2. Capa de Infraestructura (`apps/game-server/src/infrastructure`)
1.  **WS Event Handlers**: Adaptadores que escuchan los mensajes del socket:
    - `onSendClue`: Valida con Zod e invoca `SubmitClue`.
    - `onSendChat`: Valida longitud (máx 140 chars), aplica rate-limiting (2 msg/s) y emite `NEW_CHAT_MESSAGE` a todos los jugadores de la sala. No persiste en DB; el historial vive en RAM como parte del `RoomState` (últimos 50 mensajes).
    - `onCastVote`: Valida con Zod e invoca `CastVote`.
2.  **State Broadcaster**: Servicio que envía el nuevo `RoomState` a todos los clientes tras cada acción exitosa.
3.  **Chat Broadcaster**: Servicio ligero que emite `NEW_CHAT_MESSAGE` en la fase `DISCUSSING`. Independiente del State Broadcaster para reducir payload (no reenvía todo el estado por cada mensaje de chat).

### 3. Implementación en el Frontend (`apps/web`)
1.  **Chat de Pistas**: Input controlado que se habilita solo cuando el `turnId` coincide con el `playerId` local.
2.  **Interfaz de Votación**:
    - Grid interactivo para seleccionar objetivos.
    - Botones de "Confirmar" y "Saltar".
    - Feedback visual cuando otros jugadores votan (sin revelar a quién).

## Verificación
- Enviar una pista y confirmar que el turno pasa automáticamente al siguiente jugador en todas las pantallas.
- Realizar una votación completa y verificar que el servidor anuncia correctamente quién fue el más votado.
- Validar que un jugador no pueda enviar una pista si no es su turno (error de validación en el servidor).
