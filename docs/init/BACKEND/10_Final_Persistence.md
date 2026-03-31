# Paso 10: Conteo de Puntos, Leaderboard y Archivo de Partidas

## Objetivo
Implementar la resolución final de la partida, el flujo de guardado entre servidores, y el sistema de Leaderboard consultable por sala. El **Game Server (Server 1)** calcula los puntos y los envía a la **API (Server 2)**, que se encarga de persistirlos en la base de datos y exponerlos vía endpoint.

## Requerimientos Técnicos
- **Comunicación S2S**: Fetch (Server 1 -> Server 2).
- **Seguridad**: Autenticación mediante `INTERNAL_API_KEY`.
- **Referencias**: [`scoring.md`](../references/game_design/scoring.md), [`Sistema_Puntuacion.md`](../../Sistema_Puntuacion.md).

## Pasos de Ejecución

### 1. Implementación en el Game Server (`apps/game-server`)

#### Algoritmo de Puntuación (`ScoringService`)
Implementar la lógica de puntuación pura como clase de dominio, basada en las reglas de [`scoring.md`](../references/game_design/scoring.md):

**Modo Tradicional:**
| Rol | Acción | Puntos |
|---|---|---|
| Agente | Voto Correcto (elimina Impostor) | +10 |
| Agente | Victoria Rápida (Ronda 1) | +15 |
| Agente | Error de Juicio (vota Agente) | -5 |
| Agente | Victoria de Partida | +20 |
| Impostor | Supervivencia (por ronda) | +15 |
| Impostor | Engaño (elimina Agente) | +10 |
| Impostor | Victoria Suprema | +50 |

**Modo Cercanas:**
| Rol | Acción | Puntos |
|---|---|---|
| Agente | Voto Correcto | +15 |
| Agente | Victoria Rápida | +20 |
| Agente | Error de Juicio | -10 |
| Agente | Victoria de Partida | +25 |
| Infiltrado | Supervivencia (por ronda) | +20 |
| Infiltrado | Mimetismo (desvía votos) | +15 |
| Infiltrado | Victoria Suprema | +60 |

**Modo Caos:**
| Acción | Resultado | Puntos |
|---|---|---|
| Buscar Vínculo | Exitoso (mutuo, misma palabra) | +30 |
| Buscar Vínculo | Fallido | -10 |
| Acusar Pareja | Certera (identifica a los 2) | +25 |
| Acusar Pareja | Errónea | -15 |
| Saltar Voto | Abstención | +5 |

**Bonus de Partida (Caos):**
- Supervivencia Vinculada: +15 pts/ronda si la pareja no es descubierta.
- Persistencia Dispersa: +10 pts/ronda si la pareja no logra vincularse.
- Victoria Final: +20 pts para el bando ganador.

**Regla Universal:**
- Saltar Voto / Abstención: +5 pts (todos los modos).
- Los puntos se calculan en bloque al finalizar la partida, NO se muestran durante el juego.

#### Envío de Resultados
1.  Realizar un `POST` a la API (`POST /matches/archive`) usando `matchResultSchema`:
    - `roomId`, `winnerSide`, `mode`.
    - Lista de jugadores: `{ playerId, pointsEarned, role }`.
    - Header `x-api-key: INTERNAL_API_KEY`.
2.  **Evento `GAME_OVER`**: Emitir el resultado a todos los clientes conectados tras recibir la confirmación de la API.

### 2. Implementación en la API (`apps/api`)

#### Endpoint `POST /matches/archive`
1.  Validar la API Key interna (`x-api-key`).
2.  Validar el cuerpo con `matchResultSchema`.
3.  **Transacción SQL** (atomicidad):
    - Insertar registro en `matches` (room_id, mode, winner_side, rounds).
    - Insertar desglose en `match_players` (match_id, player_id, role, points).
    - Actualizar `total_score` de cada jugador en `players` con `UPDATE players SET total_score = total_score + $points`.

#### Endpoint `GET /leaderboard/:roomId`
Implementar el caso de uso `GetLeaderboard`:
1.  **`LeaderboardUseCase`** (`apps/api/src/application`):
    - Recibe `roomId`.
    - Consulta el modo de la sala para determinar las columnas a mostrar.
    - Agrega los puntos por jugador y por rol desde `match_players` + `matches`.
2.  **`SqlLeaderboardRepository`** (`apps/api/src/infrastructure/repositories`):
    - Query SQL que agrupa por jugador y rol:
    ```sql
    SELECT
      p.id, p.nickname, p.avatar,
      mp.role,
      COUNT(mp.id) AS matches_played,
      SUM(mp.points) AS total_points
    FROM match_players mp
    JOIN matches m ON m.id = mp.match_id
    JOIN players p ON p.id = mp.player_id
    WHERE m.room_id = $roomId
    GROUP BY p.id, p.nickname, p.avatar, mp.role
    ORDER BY total_points DESC;
    ```
3.  **`LeaderboardController`**: Adaptador de Hono para `GET /leaderboard/:roomId`.
    - Respuesta JSON: Array de jugadores con su desglose de puntos por rol según el modo de la sala.

### 3. Implementación en el Frontend (`apps/web`)
1.  **Servicio**: `getLeaderboard(roomId)` → `GET /leaderboard/:roomId`.
2.  **Componente `Leaderboard`**: Tabla renderizada en el Lobby que muestra las columnas apropiadas según el modo de la sala (Tradicional/Cercanas/Caos).
3.  **Actualización**: Re-fetch del leaderboard al regresar al Lobby tras una partida.

## Verificación
- Finalizar una partida de prueba.
- Verificar que el Game Server muestra un log de "Resultados enviados a la API".
- Comprobar que los puntos globales de los jugadores han aumentado en la base de datos.
- La tabla de líderes en el Lobby (consultada vía API) debe reflejar los nuevos totales.
- Los puntos negativos (Error de Juicio) se descuentan correctamente.
- El leaderboard muestra las columnas correctas según el modo de la sala.
- La transacción SQL es atómica: si falla algún INSERT, ningún cambio se persiste.
