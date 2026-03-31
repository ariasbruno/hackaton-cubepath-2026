# Paso 06: Servidor de Sockets y Conexión (Game Server)

## Objetivo
Configurar el **Server 1 (Game Server)** como una aplicación independiente encargada del tiempo real. Debe gestionar las conexiones de los jugadores, la reconexión de sesiones y mantener el estado de las salas activas exclusivamente en memoria RAM.

## Requerimientos Técnicos
- **Entorno**: Bun Nativo (`Bun.serve`).
- **Arquitectura**: Hexagonal (Domain -> Application -> Infrastructure).
- **Comunicación S2S**: Fetch (Server 1 ➔ Server 2).
- **Contrato**: `GameEvents`, `GamePhase` de `@impostor/shared`.

## Pasos de Ejecución

### 1. Capa de Dominio (`apps/game-server/src/domain`)
1.  **Modelos de Estado**: Definir las clases `RoomState` y `PlayerState` que vivirán en la RAM.
    - `PlayerState` debe incluir: `playerId`, `nickname`, `avatar`, `ws: WebSocket | null`, `isConnected`, `lastSeen: Date`.
2.  **Interfaz `IApiClient`**: Definir el contrato para que el Game Server pueda preguntar a la API por los datos de una sala.

### 2. Capa de Aplicación (`apps/game-server/src/application`)
1.  **`RoomManager`**: Clase central que gestiona el `Map<string, RoomState>`.
    - Método `joinPlayer(roomId, playerData)`: Lógica de entrada.
    - Método `leavePlayer(roomId, playerId)`: Lógica de salida/desconexión.
    - Método `reconnectPlayer(roomId, playerId, ws)`: Restaura la conexión de un jugador existente.
2.  **`LobbyUseCase`**: Maneja la lógica de "Listo/No Listo" y sincronización inicial.

### 3. Capa de Infraestructura (`apps/game-server/src/infrastructure`)
1.  **`HttpApiClient`**: Implementación de la interfaz que realiza peticiones a la API (Server 2) para validar códigos de sala.
2.  **WebSocket Server (`Bun.serve`)**:
    - `open`: Identificar al jugador y unirlo a la sala. Si la sala no está en el `Map`, llamar a `HttpApiClient` para traer su configuración de la DB.
    - `message`: Parsear el evento usando los esquemas de `@impostor/shared`.
    - `close`: Marcar al jugador como desconectado (`isConnected: false`) e iniciar el grace period. NO eliminar inmediatamente del estado.

### 4. Estrategia de Reconexión (Resiliencia)

La reconexión es crítica para juegos móviles donde las conexiones son inestables.

#### Flujo de Reconexión:
1.  **Desconexión detectada** (`close`):
    - Marcar `PlayerState.isConnected = false` y `lastSeen = Date.now()`.
    - Iniciar un **grace period de 30 segundos** con `setTimeout`.
    - Emitir `ROOM_UPDATE` al resto de jugadores indicando estado desconectado.
2.  **Reconexión dentro del grace period** (`RECONNECT_SESSION`):
    - Verificar que el `playerId` existe en el `RoomManager` y está marcado como desconectado.
    - Actualizar la referencia del WebSocket (`PlayerState.ws = newSocket`).
    - Marcar `isConnected = true` y cancelar el `setTimeout` de limpieza.
    - Emitir `GAME_STATE_SYNC` al jugador reconectado con snapshot completo:
      ```typescript
      {
        phase: currentPhase,
        players: roomState.players,
        me: { role, word },   // Solo si la partida ya asignó roles
        history: clueHistory,
        timer: { secondsLeft }
      }
      ```
    - Emitir `ROOM_UPDATE` al resto indicando que el jugador volvió.
3.  **Grace period expirado** (sin reconexión):
    - **Si está en LOBBY**: Eliminar al jugador del estado y emitir `ROOM_UPDATE`.
    - **Si está en partida activa**: Marcar al jugador como "AFK" pero mantenerlo en el juego.
      - Sus turnos de pistas se omiten automáticamente (pista vacía).
      - Su voto se registra como `SKIP` automáticamente.
      - Al finalizar la partida, se elimina del estado.

#### Mapa de Conexiones:
Mantener un `Map<string, WebSocket>` auxiliar (`playerConnections`) indexado por `playerId` para resolver rápidamente la reconexión sin iterar sobre todas las salas.

### 5. Implementación en el Frontend (`apps/web`)
1.  **`useGameSocket`**: Custom Hook que se conecta a `VITE_WS_URL`.
    - Implementar lógica de reconexión automática con **backoff exponencial** (1s, 2s, 4s, máx 16s).
    - Al reconectar: enviar `RECONNECT_SESSION` con `{ playerId, roomId }`.
    - Al recibir `GAME_STATE_SYNC`: reconstruir el `useGameStore` completo.
2.  **Sincronización de Estado**: Al recibir `ROOM_UPDATE`, actualizar el `useGameStore` de Zustand para reflejar los jugadores en el Lobby.
3.  **Indicador Visual**: Mostrar "Reconectando..." overlay con spinner cuando la conexión se pierde.

## Verificación
- Abrir dos pestañas. Al entrar en la misma sala, ambas deben verse mutuamente en la cuadrícula de avatares.
- Si el Game Server no tiene la sala en RAM, debe aparecer un log de: "Fetch room settings from API...".
- Al cerrar una pestaña, el avatar correspondiente debe desaparecer de la otra en menos de 1 segundo.
- **Reconexión**: Desconectar WiFi por 10s y reconectar → el jugador debe volver a su estado anterior sin pérdida de datos.
- **Grace period**: Desconectar por más de 30s en lobby → el jugador debe ser eliminado de la sala.
- **AFK en partida**: Desconectar por más de 30s en partida → el turno del jugador AFK se omite y su voto es SKIP.
