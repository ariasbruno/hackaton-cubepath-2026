# Paso 02: Gestión de Estado (Zustand)

## Objetivo
Implementar los almacenes de estado (stores) centralizados para manejar la sesión del usuario, la configuración de la sala y el estado de la partida en tiempo real.

## Requerimientos Técnicos
- **Librería**: Zustand.
- **Persistencia**: Middleware `persist` para `localStorage`.
- **Arquitectura**: Separación de estados por dominio.

## Pasos de Ejecución

### 1. Store de Autenticación (`useAuthStore`)
- **Estado**: `playerId`, `profile`, `status`.
- **Acciones**: `setProfile`, `clearAuth`.
- **Persistencia**: Guardar `playerId` en `localStorage`.

### 2. Store de Juego (`useGameStore`)
- **Estado**: `roomCode`, `players`, `phase`, `currentMatch`, `history`.
- **Acciones**: `updateRoom`, `addClue`, `setPhase`.
- **Reset**: Limpiar estado al salir de una sala.

### 3. Sincronización con el Servidor
Configurar la lógica base para que los cambios en el Game Store puedan dispararse tanto localmente como por eventos de Socket (que se implementarán en el Paso 06).

## Verificación
- El `playerId` se mantiene en el navegador tras recargar la página.
- Se puede modificar el nickname en el store y verlo reflejado en los componentes que lo usan.
- No hay "fugas de estado" entre salas (el estado se limpia correctamente).
