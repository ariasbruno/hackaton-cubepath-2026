# Paso 08: Vistas de Juego (Discuss & Vote)

## Objetivo
Implementar la fase de debate abierto y el sistema de votación estratégica, permitiendo a los jugadores interactuar y tomar decisiones sobre quién eliminar.

## Requerimientos Técnicos
- **Planos**: [Discuss & Vote Specs](../references/ui_ux/screen_specs.md).
- **Componentes**: `VoteCard`, `ChatList`.

## Pasos de Ejecución

### 1. Fase de Discusión (`src/game/DiscussView.tsx`)
1. **Chat de Acusaciones**: Implementar un chat de texto libre para el debate en tiempo real.
2. **Historial Permanente**: Mantener visible en la parte inferior todas las pistas dadas en la fase anterior para consulta rápida.
3. **Timer Global**: Cuenta atrás sincronizada para forzar el paso a la votación.

### 2. Fase de Votación (`src/game/VoteView.tsx`)
1. **Grid de Votación**: Renderizar tarjetas de todos los jugadores vivos.
2. **Acciones de Voto**:
   - `VOTE`: Seleccionar a un sospechoso.
   - `SKIP`: Botón secundario para abstenerse y asegurar puntos.
3. **Feedback de Confirmación**: Al votar, mostrar un estado de "Voto Enviado" y bloquear nuevas acciones.

## Verificación
- El historial de pistas es legible durante todo el debate.
- Seleccionar a un jugador en la votación resalta su tarjeta claramente.
- El servidor recibe el voto correctamente y el frontend muestra el feedback de "Esperando al resto...".
