# 🏗️ Estructura Técnica: Game Server (Server 1)

El Game Server es una aplicación Bun nativa diseñada para el manejo de WebSockets de alta frecuencia y lógica de juego en tiempo real.

## 📁 Estructura de Directorios

```text
apps/game-server/src/
 ├── domain/                # CAPA 1: Reglas de Juego (Estado e Interfaces)
 │    ├── models/           # RoomState, PlayerState, TurnManager
 │    └── services/         # Interfaces para API Externa e IA
 ├── application/           # CAPA 2: Casos de Uso del Juego
 │    ├── use-cases/        # ProcessClue, ProcessVote, CalculateScores
 │    └── state-manager/    # Gestión de la memoria RAM (Rooms Map)
 ├── infrastructure/        # CAPA 3: Adaptadores de Entrada/Salida
 │    ├── websocket/        # Bun.serve nativo y Handlers de Eventos
 │    ├── api-client/       # Cliente HTTP para reportar a la API (Server 2)
 │    └── ai-client/        # Cliente para Google Gemini API
 └── index.ts               # Punto de entrada y gestión de conexiones
```

## 🔄 Flujo de Datos (WebSocket Event Loop)

| Capa | Input | Acción | Output |
| :--- | :--- | :--- | :--- |
| **WS Adapter** | WS Message (Zod) | Identifica el evento (JOIN, VOTE) y el jugador. | Llama al Use Case correspondiente. |
| **Use Case** | Event Payload | Aplica reglas de juego y altera el estado en RAM. | Cambia el `RoomState` / Trigger de Timer. |
| **State Manager** | Actualización | Sincroniza el nuevo estado en el `Map`. | Broadcast de `ROOM_UPDATE` a todos. |
| **API Client** | Fin de Partida | Envía los resultados finales a la API (Server 2). | Confirmación de guardado. |

## 💉 Inyección de Dependencias
```typescript
// index.ts
const apiClient = new HttpApiClient(API_URL, API_KEY); // Infra
const aiService = new GeminiService(AI_KEY); // Infra
const matchUseCase = new MatchUseCase(apiClient, aiService); // Application
```
