# Paso 04: Autenticación Silenciosa y Perfiles

## Objetivo
Implementar un sistema de autenticación "silenciosa" donde el usuario no necesita registrarse con correo/password. Al entrar por primera vez, se le genera un UUID único que se guarda en su navegador y en la base de datos.

## Requerimientos Técnicos
- **Frontend**: `localStorage`, Zustand.
- **Backend (API)**: Hono REST, PostgreSQL Nativo.
- **Arquitectura**: Hexagonal (Domain -> Application -> Infrastructure).
- **Contrato**: `loginSchema`, `profileSchema` de `@impostor/shared`.

## Pasos de Ejecución

### 1. Capa de Dominio (`apps/api/src/domain`)
1.  **Entidad `Player`**: Definir la clase o tipo `Player` con `id`, `nickname`, `avatar` y `totalScore`.
2.  **Interfaz `IPlayerRepository`**: (Si no se hizo en el Paso 03) Definir métodos `findById`, `create` y `update`.

### 2. Capa de Aplicación (`apps/api/src/application`)
1.  **`AuthUseCase`**: Clase que contenga la lógica de:
    - `login()`: Crea un nuevo jugador con datos aleatorios iniciales.
    - `getProfile(id)`: Recupera un jugador existente.
    - `updateProfile(id, data)`: Valida y actualiza nickname/avatar.

### 3. Capa de Infraestructura (`apps/api/src/infrastructure`)
1.  **Middleware de Seguridad (Rate Limiting)**:
    - Implementar un limitador de peticiones en Hono: Máximo **3 logins por hora por IP**.
    - Bloquear IPs sospechosas temporalmente si exceden el límite.
2.  **`SqlPlayerRepository`**: 
    - Implementar los métodos usando `sql` nativo.
    - **IMPORTANTE**: Guardar el campo `last_ip` en cada login/registro para auditoría. Este campo es **exclusivamente server-side** y NO se expone en el `profileSchema` compartido ni se envía al frontend.
3.  **`AuthController`**: Adaptador de Hono...

### 4. Estrategia de Mantenimiento (Anti-Bloat)
1.  **Purga de Basura**: Implementar un script (cron job) que elimine perfiles que cumplan:
    - `total_score == 0` AND `created_at < (ahora - 24 horas)`.
    - Esto elimina de inmediato a los curiosos que no llegan a jugar una partida.

### 5. Implementación en el Frontend (`apps/web`)
1.  **`useAuthStore` (Zustand)**:
    - Estado: `user`, `status` ('loading' | 'authenticated' | 'unauthenticated').
    - Al cargar la app: 
        - Si hay `playerId` en `localStorage` ➔ `GET /auth/me/:id`.
        - Si no hay (o el server devuelve 404) ➔ `POST /auth/login`.
    - Guardar siempre el `id` resultante en `localStorage`.

## Verificación
- Al entrar de incógnito, se crea un perfil con emoji y nombre aleatorio.
- Al recargar la página, se mantienen los mismos datos (no se crea un nuevo usuario).
- Al editar el perfil, los cambios se guardan en PostgreSQL y se ven tras F5.
