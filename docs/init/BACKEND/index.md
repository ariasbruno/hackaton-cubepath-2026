# Plan de Implementación Detallado: API "El Impostor"

Este índice marca el camino a seguir para la construcción del backend. **Cada paso debe ser completado, verificado y documentado antes de pasar al siguiente.**

---

## Estrategia Global
- *Guía:* [Estrategia de Testing](../references/technical/Testing_Strategy.md)

---

## Bloque 1: Cimientos
- [ ] **[Paso 01: Inicialización del Monorepo](01_Setup.md)**
    - *Planos:* [Arquitectura General](../references/technical/architecture.md)
    - *Tests:* Setup de `bun test`.
- [ ] **[Paso 02: Contrato Compartido (Shared)](02_Shared_Schemas.md)**
    - *Planos:* [Esquemas Zod](../references/technical/schemas/room.schema.ts)
    - *Tests:* Validación de esquemas Zod.
- [ ] **[Paso 03: Conexión DB y Repositorios SQL](03_Database.md)**
    - *Planos:* [Estructura API](../references/technical/API_Structure.md)
    - *Tests:* Integración SQL (Queries).


## Bloque 2: Capa REST (HTTP - Server 2)
- [ ] **[Paso 04: Autenticación Silenciosa y Perfiles](04_Auth_User.md)**
    - *Planos:* [Endpoints API](../references/technical/API_Endpoints.md)
- [ ] **[Paso 05: Gestión de Salas (CRUD)](05_Room_API.md)**
    - *Planos:* [Endpoints API](../references/technical/API_Endpoints.md)

## Bloque 3: Motor en Tiempo Real (WebSockets - Server 1)
- [ ] **[Paso 06: Servidor de Sockets y Conexión](06_Websocket_Core.md)**
    - *Planos:* [Estructura Game Server](../references/technical/GameServer_Structure.md) | [Rutas WS](../references/technical/WS_Routes.md)
- [ ] **[Paso 07: Máquina de Estados del Juego](07_Game_Logic.md)**
- [ ] **[Paso 08: Integración del AIService](08_AI_Integration.md)**
- [ ] **[Paso 09: Orquestación de Eventos y Sincronización](09_Events_Sync.md)**

## Bloque 4: Finalización
- [ ] **[Paso 10: Conteo de Puntos y Archivo de Partidas](10_Final_Persistence.md)**
    - *Planos:* [Puntuación](../references/game_design/scoring.md)
