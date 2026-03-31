# 🛣️ Mapa de Endpoints: API (Server 2)

Este servidor maneja las peticiones REST mediante **Hono**. Todas las rutas (excepto las internas) son consumidas por el Frontend.

## 👤 Autenticación y Perfiles
| Ruta | Método | Input (Zod) | Descripción |
| :--- | :---: | :--- | :--- |
| `/auth/login` | `POST` | `loginSchema` (opcional) | Genera un nuevo UUID y perfil inicial. |
| `/auth/me/:id` | `GET` | `playerId` (param) | Obtiene los datos del perfil y puntos globales. |
| `/auth/profile` | `PATCH` | `loginSchema` | Actualiza nickname y avatar. |

## 🏠 Gestión de Salas (Pre-Juego)
| Ruta | Método | Input (Zod) | Descripción |
| :--- | :---: | :--- | :--- |
| `/rooms` | `POST` | `roomSettingsSchema` | Crea una sala y devuelve el código de 4 letras. |
| `/rooms` | `GET` | - | Lista las salas con `isPublic: true`. |
| `/rooms/check/:code` | `GET` | `roomCodeSchema` | Verifica si una sala existe y está activa. |

## 📊 Estadísticas y Leaderboards
| Ruta | Método | Input | Descripción |
| :--- | :---: | :--- | :--- |
| `/leaderboard/:roomId`| `GET` | `roomId` (param) | Obtiene el ranking de la sesión de una sala. |

## 🔒 Rutas Internas (Server-to-Server)
Requieren el header `x-api-key: INTERNAL_API_KEY`.
| Ruta | Método | Input | Descripción |
| :--- | :---: | :--- | :--- |
| `/matches/archive` | `POST` | `matchResultSchema` | El Game Server reporta el fin de una partida. |
