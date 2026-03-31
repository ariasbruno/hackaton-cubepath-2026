# 🏗️ Arquitectura y Patrones de Diseño

El sistema se divide en dos entidades independientes para optimizar el rendimiento y la mantenibilidad.

## 🛰️ Server 1: Game Server (El Corazón)
**Responsabilidad**: Gestión del tiempo real y lógica de juego.
- **Runtime**: Bun.
- **Protocolo**: WebSockets nativos.
- **Estado**: Únicamente en memoria (RAM). Gestiona salas activas, jugadores conectados y turnos.
- **Dependencias**: No tiene conexión directa a la base de datos.
- **Comunicación**: Reporta resultados finales a la API mediante peticiones HTTP internas.

## 🏢 Server 2: App & Data (El Soporte)
**Responsabilidad**: Persistencia, autenticación y entrega de archivos.
- **API (Hono)**: Maneja el login, perfiles, creación de salas en DB y leaderboards.
- **Frontend (React)**: Servido como archivos estáticos.
- **Database (PostgreSQL)**: Única fuente de verdad persistente.

---

## 🔄 Flujo de Comunicación

1.  **Pre-Juego**:
    - `Frontend` ➔ `API` (HTTP): "Crear sala".
    - `API` ➔ `DB`: Guarda sala y devuelve código.
2.  **Juego Activo**:
    - `Frontend` ➔ `Game Server` (WS): "Unirse a partida".
    - `Game Server`: Gestiona turnos, pistas y votos en RAM.
3.  **Finalización**:
    - `Game Server` ➔ `API` (HTTP POST): "Resultados de partida".
    - `API` ➔ `DB`: Actualiza puntos y guarda historial.
4.  **Consulta**:
    - `Frontend` ➔ `API` (HTTP): "Ver Leaderboard".
    - `API` ➔ `DB`: Consulta y devuelve datos.

---

Para garantizar que el sistema sea escalable y que la lógica de negocio esté protegida de cambios tecnológicos (como cambiar la DB o el framework), seguiremos los principios de **Arquitectura Hexagonal** y **Clean Architecture**.

## 🧩 Patrones Core
1.  **Inyección de Dependencias (DI)**: Ninguna clase de lógica de negocio instanciará sus dependencias. Se recibirán a través del constructor (Interfaces/Puertos).
2.  **Repository Pattern**: La lógica no sabe de SQL. Solo conoce una interfaz (ej: `IPlayerRepository`).
3.  **Use Cases (Interactors)**: Cada acción del sistema (Crear Sala, Votar) es una clase independiente que contiene la regla de negocio.

---

## 📁 Estructura de Archivos (API & Game Server)

Cada app en `apps/` seguirá este esquema:

```text
src/
 ├── domain/           # REGLAS PURAS (Entidades, Interfaces de Repositorios, Errores)
 ├── application/      # CASOS DE USO (Orquestación, lógica de aplicación)
 ├── infrastructure/   # DETALLES (Implementación de DB con postgres.js, Controladores Hono/Bun, DI Container)
 └── index.ts          # Punto de entrada y composición (DI Setup)
```

### Detalle de Capas:
- **Domain**: Contiene las interfaces (Puertos). Si cambias PostgreSQL por MongoDB, solo creas una nueva clase en `infrastructure/` que implemente la interfaz del `domain/`.
- **Application**: Aquí viven los "Use Cases". Reciben los repositorios inyectados.
- **Infrastructure**: Aquí vive la "tecnología" (Postgres Nativo, Hono, Bun.serve, validaciones externas).

---

## 💉 Estrategia de Inyección de Dependencias
Usaremos una composición simple en el `index.ts` de cada app (Composition Root):

```typescript
// Ejemplo de composición en index.ts
const db = new SqlPlayerRepository(sqlConnection); // INFRA (Postgres Nativo)
const loginUseCase = new LoginUseCase(db);          // APP
const authController = new AuthController(loginUseCase); // INFRA
```

Esto permite que para **Tests** o **Entorno de Dev**, podamos inyectar un `MockPlayerRepository` que guarde en un array en memoria en lugar de una base de datos real.
