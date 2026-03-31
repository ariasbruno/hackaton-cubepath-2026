# 🏗️ Estructura Técnica: API (Server 2)

La API sigue el patrón de **Arquitectura Hexagonal** para desacoplar la base de datos (PostgreSQL) de la lógica de negocio.

## 📁 Estructura de Directorios

```text
apps/api/src/
 ├── domain/                # CAPA 1: Reglas de Negocio Puras
 │    ├── entities/         # Modelos de datos (Player, Room)
 │    ├── repositories/     # INTERFACES (Puertos de salida)
 │    └── exceptions/       # Errores personalizados
 ├── application/           # CAPA 2: Casos de Uso (Orquestación)
 │    ├── use-cases/        # Clases que ejecutan acciones (Login, CreateRoom)
 │    └── dtos/             # Objetos de transferencia de datos
 ├── infrastructure/        # CAPA 3: Detalles Tecnológicos (Adaptadores)
 │    ├── controllers/      # Adaptadores de entrada (Hono Routes)
 │    ├── repositories/     # Adaptadores de salida (SQL Nativo con postgres.js)
 │    └── db/               # Configuración de conexión y migraciones SQL
 └── index.ts               # COMPOSITION ROOT (Inyección de Dependencias)
```

## 🔄 Flujo de Datos (Input/Output)

| Capa | Input | Acción | Output |
| :--- | :--- | :--- | :--- |
| **Controller** | HTTP Request (Zod) | Valida el esquema y llama al Use Case. | JSON Response / Error. |
| **Use Case** | DTO / Primitivos | Ejecuta la lógica y llama al repositorio. | Entidad de Dominio / Resultado. |
| **Repository** | SQL Query | Interactúa con PostgreSQL nativo. | Row de la DB mapeada a Entidad. |

## 💉 Inyección de Dependencias (DI)
El `index.ts` es el único lugar donde se instancian las clases:
```typescript
// index.ts
const playerRepo = new SqlPlayerRepository(sql); // Infra
const loginUseCase = new LoginUseCase(playerRepo); // Application
const authController = new AuthController(loginUseCase); // Infra
```
