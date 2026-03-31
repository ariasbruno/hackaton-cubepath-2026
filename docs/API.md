# API Reference

La comunicación interna y externa se maneja a través de endpoints JSON.

## Endpoints Públicos

### Autenticación (`/auth`)
- `POST /login`: Crea un nuevo usuario o actualiza uno existente. Acepta IDs de invitado para promoción.
- `GET /me/:id`: Recupera el perfil completo del jugador con estadísticas calculadas.
- `PATCH /profile`: Actualiza avatar, color o nickname.

### Salas (`/rooms`)
- `GET /`: Lista de salas públicas en estado LOBBY.
- `POST /`: Crea una nueva sala (requiere auth).
- `GET /:code`: Información de una sala por su código de 4 letras.

## Endpoints Internos (S2S)

Estos endpoints requieren el header `x-api-key`.

### Gestión de Partidas (`/internal/matches`)
- `POST /archive`: Archiva los resultados de una partida finalizada. Actualiza los puntajes globales de todos los jugadores registrados participantes.

### IA / Orquestación (`/internal/ai`)
- `POST /generate-words`: Solicita a la IA la generación de palabras para una nueva ronda basada en las categorías de la sala.

## WebSockets (`ws://`)

El servidor de juego maneja eventos definidos en `GameEvents` de `@impostor/shared`.

| Evento | Dirección | Propósito |
| :--- | :--- | :--- |
| `JOIN_ROOM` | C -> S | Jugador entra a la sala |
| `PLAYER_READY` | C -> S | Jugador confirma que está listo |
| `START_GAME` | C -> S | El Host inicia la partida |
| `SEND_CLUE` | C -> S | Envío de pista en fase CLUES |
| `CAST_VOTE` | C -> S | Votación en fase VOTING |
| `ROOM_UPDATE` | S -> C | Broadcast del estado actual de la sala |
| `ERROR` | S -> C | Notificación de error en tiempo real |
