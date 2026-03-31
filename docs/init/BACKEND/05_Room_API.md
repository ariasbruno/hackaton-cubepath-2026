# Paso 05: Gestión de Salas (CRUD)

## Objetivo
Implementar la API REST para la gestión de salas de juego en el **Server 2**. Esto permite a los usuarios configurar sus partidas y a otros jugadores encontrar salas públicas.

## Requerimientos Técnicos
- **Frontend**: React, `Stepper` para creación.
- **Backend (API)**: Hono, PostgreSQL Nativo.
- **Arquitectura**: Hexagonal (Domain -> Application -> Infrastructure).
- **Contrato**: `roomSettingsSchema`, `roomCodeSchema` de `@impostor/shared`.

## Pasos de Ejecución

### 1. Capa de Dominio (`apps/api/src/domain`)
1.  **Entidad `Room`**: Definir el modelo con `id`, `code`, `hostId`, `settings` (JSON), `status` y `createdAt`.
2.  **Interfaz `IRoomRepository`**: Definir métodos:
    - `create(room)`: Guarda la nueva sala.
    - `findByCode(code)`: Busca sala activa por su código de 4 letras.
    - `findPublicActive()`: Lista salas con `isPublic: true` y `status: LOBBY`.

### 2. Capa de Aplicación (`apps/api/src/application`)
1.  **`RoomUseCase`**: Clase que implementa la lógica:
    - `createRoom(settings, hostId)`: 
        - Genera un código de 4 caracteres alfanuméricos único.
        - Valida que el código no esté en uso.
        - Crea la sala en la DB.
    - `listPublicRooms()`: Retorna salas disponibles para unirse.
    - `validateRoom(code)`: Comprueba si una sala es válida para que el frontend permita el acceso.

### 3. Capa de Infraestructura (`apps/api/src/infrastructure`)
1.  **`SqlRoomRepository`**: Implementar queries SQL nativas para manejar el objeto `settings` como JSONB en PostgreSQL.
2.  **`RoomController`**: Adaptador de Hono:
    - `POST /rooms`: Crea la sala (usando el ID del usuario autenticado).
    - `GET /rooms`: Lista salas públicas.
    - `GET /rooms/check/:code`: Devuelve 200 si la sala existe o 404 si no.

### 4. Estrategia de Mantenimiento (Anti-Bloat)
1.  **Purga de Salas Inactivas**: Implementar un script (cron job) que elimine salas que cumplan:
    - `updated_at < (ahora - 24 horas)`.
    - Esto asegura que las salas abandonadas en el lobby o partidas terminadas hace más de un día no ocupen espacio innecesario.

### 5. Implementación en el Frontend (`apps/web`)
1.  **Home**: Input de código...

## Verificación
- Se puede crear una sala y el código generado es de 4 caracteres en mayúsculas.
- Las salas creadas como "Privadas" no aparecen en el listado de `GET /rooms`.
- Al intentar entrar con un código inventado, el sistema muestra un error de "Sala no encontrada".
