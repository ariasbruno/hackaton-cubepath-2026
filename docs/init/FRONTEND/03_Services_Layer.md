# Paso 03: Capa de Servicios (API Client)

## Objetivo
Implementar la capa de comunicación con la **API (Server 2)**. Esta capa encapsulará todas las peticiones HTTP y devolverá datos tipados siguiendo el contrato de `@impostor/shared`.

## Requerimientos Técnicos
- **Protocolo**: HTTP/REST.
- **Herramienta**: `fetch` nativo.
- **Tipado**: Uso estricto de los esquemas de `@impostor/shared`.

## Pasos de Ejecución

### 1. Cliente Base (`src/infrastructure/api-client.ts`)
1. Configurar la URL base usando `import.meta.env.VITE_API_URL`.
2. Implementar interceptores básicos para manejar errores (ej: 404 Room Not Found).

### 2. Servicio de Autenticación
Funciones para:
- `login(data?)`: `POST /auth/login`.
- `getMe(id)`: `GET /auth/me/:id`.
- `updateProfile(data)`: `PATCH /auth/profile`.

### 3. Servicio de Salas
Funciones para:
- `createRoom(settings)`: `POST /rooms`.
- `getPublicRooms()`: `GET /rooms`.
- `checkRoom(code)`: `GET /rooms/check/:code`.

### 4. Servicio de Estadísticas
- `getLeaderboard(roomId)`: `GET /leaderboard/:roomId`.

## Verificación
- Las llamadas a la API devuelven los tipos definidos en el contrato shared.
- El cliente maneja correctamente los errores de red y de API (ej: muestra un log claro si el server 2 está caído).
- Se puede testear una llamada a `/rooms` desde la consola del navegador y recibir el JSON esperado.
