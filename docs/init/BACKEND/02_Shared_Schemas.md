# Paso 02: Contrato Compartido (Shared)

## Objetivo
Definir la "Fuente de Verdad" única para todo el monorepo. El paquete `@impostor/shared` servirá como el contrato formal que garantiza que la API, el Game Server y la Web utilicen los mismos datos y protocolos.

## Requerimientos Técnicos
- **Librerías**: Zod, TypeScript.
- **Estructura**: `src/{schemas,events,types}`.

## Pasos de Ejecución

### 1. Esquemas de Validación (`src/schemas/`)
Centralizar las reglas de negocio en esquemas Zod:
- `auth.schema.ts`: Login, perfiles.
- `room.schema.ts`: Configuración de salas, códigos.
- `game.schema.ts`: Pistas, votos (con lógica de validación interna).

### 2. Definición de Eventos (`src/events/`)
Crear un archivo `game.events.ts` que defina los nombres de todos los eventos de WebSocket como constantes o Enums:
```typescript
export const GameEvents = {
  JOIN_ROOM: 'JOIN_ROOM',
  ROOM_UPDATE: 'ROOM_UPDATE',
  PHASE_CHANGE: 'PHASE_CHANGE',
  // ... resto de eventos
} as const;
```

### 3. Tipos, Modelos y Enums (`src/types/`)
1. Inferencia de tipos desde los esquemas Zod (`z.infer`).
2. Definición de interfaces de dominio compartidas (ej: `Player`, `RoomState`).
3. **Enums compartidos** ([`enums.ts`](../references/technical/schemas/enums.ts)): `GamePhase`, `Role`, `WinnerSide` como esquemas Zod para validación y tipos TypeScript.

### 4. Exportación Centralizada (`src/index.ts`)
Exponer todo para el resto del monorepo:
```typescript
export * from './schemas';
export * from './events';
export * from './types';
```

## Verificación
- Al cambiar un campo en `room.schema.ts`, tanto la API como el Frontend deben mostrar errores de tipado inmediatamente si no se ajustan al cambio.
- Se pueden usar las constantes de `GameEvents` en lugar de strings manuales en el Game Server y el WebHook.
