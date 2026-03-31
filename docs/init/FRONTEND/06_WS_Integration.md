# Paso 06: Integración de WebSockets (Lobby)

## Objetivo
Hacer que el Lobby sea dinámico y en tiempo real. Los jugadores deben ver aparecer a otros avatares, sincronizar sus estados de "Listo" y permitir al Host iniciar la partida cuando todos estén preparados.

## Requerimientos Técnicos
- **Protocolo**: WebSockets nativos.
- **Hook**: `useGameSocket`.
- **Referencias**: [WS Routes](../references/technical/WS_Routes.md).

## Pasos de Ejecución

### 1. Implementación del Hook `useGameSocket`
1. Lógica de conexión a `VITE_WS_URL` al entrar en una sala.
2. Handlers para eventos entrantes:
   - `ROOM_UPDATE`: Actualizar la lista de jugadores y el estado del lobby en el `useGameStore`.
   - `ERROR`: Mostrar un toast/mensaje de error (Sala llena, etc.).

### 2. Interfaz del Lobby Online (`src/pages/Lobby.tsx`)
1. **Header**: Mostrar el código de sala en el componente "Post-it".
2. **Grid de Avatares**: Renderizar a los jugadores con su estado (`isReady`).
3. **Controles**:
   - Botón "Listo": Envía `TOGGLE_READY`.
   - Botón "Empezar" (Solo Host): Envía `START_GAME` (solo se habilita si todos están listos).

## Verificación
- Al abrir la misma sala en dos navegadores, ambos avatares aparecen instantáneamente.
- Cambiar el estado a "Listo" en un navegador se refleja en el otro sin recargar.
- El botón "Empezar" solo es visible y cliqueable para el creador de la sala.
