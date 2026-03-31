# 📡 Protocolo de Comunicación WebSocket

Este documento establece el contrato de comunicación entre el servidor (**Bun**) y el cliente (**React**) para garantizar la sincronización en tiempo real de "El Impostor".

---

## 🛠️ Especificaciones Técnicas
- **Transporte:** WebSockets nativos (Bun.serve).
- **Formato de datos:** JSON.
- **Identificación:** Los jugadores se identifican mediante un `playerId` (UUID) persistente en `localStorage`.

---

## 1. Fase de Lobby y Conexión

### Cliente -> Servidor
| Evento            | Payload                                  | Descripción                                                    |
| :---------------- | :--------------------------------------- | :------------------------------------------------------------- |
| `JOIN_ROOM`       | `{ roomId, playerId, nickname, avatar }` | Intenta unirse a una sala o crearla si no existe.              |
| `TOGGLE_READY`    | `{ isReady: boolean }`                   | Cambia el estado de preparación del jugador.                   |
| `SEND_LOBBY_CHAT` | `{ message: string }`                    | Envía un mensaje de chat mientras se espera en el lobby.       |
| `START_GAME`      | `-`                                      | **(Solo Host)** Inicia la transición a la asignación de roles. |

### Servidor -> Cliente
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `ROOM_UPDATE` | `{ players: [{id, name, avatar, isReady, isHost}], status, settings, chatHistory: [] }` | Lista de jugadores, estado y últimos 20 mensajes del lobby. |
| `NEW_LOBBY_MESSAGE` | `{ playerId, nickname, message, timestamp }` | Notifica un nuevo mensaje de chat en el lobby. |
| `ERROR` | `{ code, message }` | Notifica errores (Sala llena, código inválido, etc.). |

---

## 2. Fase de Asignación de Roles

### Cliente -> Servidor
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `CONFIRM_ROLE` | `-` | El jugador confirma que ha memorizado su rol (pulsar "Entendido"). |

### Servidor -> Cliente (Mensajes Individuales)
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `ROLE_ASSIGNED` | `{ role, word, isConfusing: bool }` | Envía de forma privada el rol y la palabra secreta. No incluye categoría ya que el frontend la conoce del `ROOM_UPDATE`. |

---

## 3. Loop de Juego (Pistas y Debate)

### Cliente -> Servidor
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `SEND_CLUE` | `{ text: string }` | Envía la pista durante el turno del jugador. |
| `SEND_CHAT` | `{ message: string }` | Envía un mensaje al chat de discusión abierta (Fase: `DISCUSSING`). |

### Servidor -> Cliente (Broadcast)
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `PHASE_CHANGE` | `{ phase: GamePhase, turnPlayerId?, round: number }` | Cambia la etapa del juego y asigna turnos. |
| `TIMER_TICK` | `{ secondsLeft: number }` | Sincronización forzada del temporizador global. |
| `NEW_CLUE` | `{ playerId, text, round }` | Notifica la nueva pista recibida para actualizar el historial. |
| `NEW_CHAT_MESSAGE` | `{ playerId, nickname, message, timestamp }` | Notifica un nuevo mensaje en el chat de discusión. |

---

## 4. Votación y Resolución

### Cliente -> Servidor
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `CAST_VOTE` | `{ action: "VOTE" | "LINK" | "ACCUSE" | "SKIP", targets: UUID[], confirm: boolean }` | Envía la decisión. `targets` varía según la acción. `confirm` bloquea la jugada. |

### Servidor -> Cliente
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `VOTE_UPDATED` | `{ playerId, isConfirmed }` | Notifica quién ha tomado una decisión (sin revelar la acción ni los objetivos). |
| `VOTING_COMPLETE` | `{ mostVotedId, voteCount, role, isEliminated: bool }` | Se dispara al terminar el tiempo O cuando todos confirman. |
| `GAME_OVER` | `{ winnerSide, pointsEarned: {playerId: points}, history: [] }` | Finalización de la partida y desglose de puntuación. |

---

## 5. Resiliencia y Reconexión

### Cliente -> Servidor
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `RECONNECT_SESSION` | `{ playerId, roomId }` | Solicita recuperar el estado tras una recarga de página. |

### Servidor -> Cliente
| Evento | Payload | Descripción |
| :--- | :--- | :--- |
| `GAME_STATE_SYNC` | `{ phase, players, me: {role, word}, history, timer }` | "Snapshot" completo para reconstruir la UI de React inmediatamente. |

---

## ⚠️ Validaciones y Seguridad (Rate Limiting)

Para proteger la vCPU del servidor y evitar abusos:

1.  **Chat Anti-Spam:** 
    *   Máximo **2 mensajes por segundo** por jugador.
    *   Mensajes que excedan los **140 caracteres** serán truncados o ignorados.
    *   Si un jugador excede el límite 3 veces, el servidor ignorará sus mensajes de chat por 10 segundos.
2.  **Validación de Turnos:** 
    *   `SEND_CLUE` solo será procesado si el `playerId` coincide con el `turnPlayerId` activo.
    *   **Omisión por Tiempo:** Si el `TIMER_TICK` de la fase `CLUES` llega a 0, el servidor genera una pista vacía automáticamente y avanza el turno.
3.  **Lógica de Votación y Validación:**
    *   **Validación de Cantidad:** 
        *   Si `action: "VOTE"` o `"LINK"` -> `targets` debe tener exactamente **1 ID**.
        *   Si `action: "ACCUSE"` -> `targets` debe tener exactamente **2 IDs**.
        *   Si `action: "SKIP"` -> `targets` debe estar **vacío**. Esta acción se considera **confirmada automáticamente**.
    *   **Voto Provisional:** Si el tiempo expira y no hay confirmación, se cuenta la última acción enviada con `confirm: false`.
    *   **Voto Confirmado (Commit):** Si `confirm: true` (o `action: "SKIP"`), la jugada queda bloqueada.
    *   **Finalización Anticipada:** La fase termina inmediatamente si todos los jugadores vivos tienen una jugada con `confirm: true`. Esto aplica tanto a la fase `ASSIGNING` como a `VOTING`.
4.  **Limpieza de Memoria:** El historial de `SEND_LOBBY_CHAT` se limita a los últimos **20 mensajes** y se destruye al iniciar la partida.

---

# 📡 Mapa Completo de Eventos: Game Server (Server 1)

Este servidor maneja la comunicación en tiempo real mediante **Bun.serve nativo** y WebSockets. Los nombres de los eventos se importan del contrato compartido (`@impostor/shared`).

## 📥 Eventos de Entrada (Cliente -> Servidor)
| Evento | Payload (Input) | Fase | Descripción |
| :--- | :--- | :--- | :--- |
| `JOIN_ROOM` | `{ roomId, playerId, nickname, avatar }` | `LOBBY` | Jugador entra a una sala con sus datos de perfil. |
| `TOGGLE_READY` | `{ isReady: boolean }` | `LOBBY` | Cambia el estado en el Lobby. |
| `SEND_LOBBY_CHAT` | `{ message: string }` | `LOBBY` | Envía un mensaje al chat del lobby. |
| `START_GAME` | `-` | `LOBBY` | Solo el Host puede disparar la transición. |
| `CONFIRM_ROLE` | `-` | `ASSIGNING` | Confirma que el jugador memorizó su rol. |
| `SEND_CLUE` | `clueSchema` | `CLUES` | Envía pista en su turno. |
| `SEND_CHAT` | `{ message: string }` | `DISCUSSING` | Envía mensaje al chat de discusión. |
| `CAST_VOTE` | `castVoteSchema` | `VOTING` | Envía voto o decisión. |
| `RECONNECT_SESSION` | `{ playerId, roomId }` | `*` | Solicita reconexión y sync de estado. |

## 📤 Eventos de Salida (Servidor -> Cliente)
| Evento | Payload (Output) | Fase | Descripción |
| :--- | :--- | :--- | :--- |
| `ROOM_UPDATE` | `RoomState` | `LOBBY` | Sincronización del lobby (jugadores, estados, chat). |
| `NEW_LOBBY_MESSAGE` | `{ playerId, nickname, message, timestamp }` | `LOBBY` | Nuevo mensaje en el chat del lobby. |
| `ERROR` | `{ code, message }` | `*` | Notifica errores (sala llena, código inválido, etc.). |
| `ROLE_ASSIGNED` | `{ role, word, isConfusing? }` | `ASSIGNING` | Envío privado de rol y palabra (individual). |
| `PHASE_CHANGE` | `{ phase: GamePhase, round, turnPlayerId? }` | `*` | Notifica el cambio de etapa del juego. |
| `TIMER_TICK` | `{ secondsLeft: number }` | `CLUES` / `DISCUSSING` / `VOTING` | Sincronización del temporizador global. |
| `NEW_CLUE` | `{ playerId, text, round }` | `CLUES` | Broadcast de la nueva pista recibida. |
| `NEW_CHAT_MESSAGE` | `{ playerId, nickname, message, timestamp }` | `DISCUSSING` | Broadcast de mensaje de chat de discusión. |
| `VOTE_UPDATED` | `{ playerId, isConfirmed }` | `VOTING` | Notifica quién votó (sin revelar decisión). |
| `VOTING_COMPLETE` | `{ mostVotedId, voteCount, role, isEliminated }` | `VOTING` | Resultado de la votación. |
| `GAME_OVER` | `matchResultSchema` | `RESULTS` | Notifica el final y los puntos ganados. |
| `GAME_STATE_SYNC` | `{ phase, players, me, history, timer }` | `*` | Snapshot completo para reconexión. |

---

## 🔒 Validación de Seguridad
- El servidor ignora eventos de entrada si no corresponden a la fase activa (ej: `SEND_CLUE` fuera de la fase `CLUES`).
- Se aplica **Rate Limiting** nativo de Bun por conexión para evitar spam en el chat o flood de eventos.
