# Paso 07: Máquina de Estados del Juego

## Objetivo
Implementar el motor central del juego en el **Server 1 (Game Server)**. El sistema debe gestionar las fases de la partida (Lobby -> Assigning -> Clues -> Discuss -> Vote -> Results) y controlar las transiciones automáticas basadas en eventos o temporizadores.

## Requerimientos Técnicos
- **Entorno**: Bun (Game Server).
- **Arquitectura**: Hexagonal (Domain -> Application -> Infrastructure).
- **Patrón**: State Machine (Máquina de Estados).
- **Referencias**: `docs/references/game_design/core.md`, `docs/references/ui_ux/game_flow.md`.

## Pasos de Ejecución

### 1. Capa de Dominio (`apps/game-server/src/domain`)
1.  **Entidad `Match`**: Definir el estado de una partida activa (ronda actual, fase, turnos, votos acumulados).
2.  **`TurnManager`**: Clase de dominio para gestionar quién habla en la fase de pistas.
3.  **`ScoringRules`**: Lógica pura para determinar si se cumplen las condiciones de victoria.

### 2. Capa de Aplicación (`apps/game-server/src/application`)
1.  **`GameStateMachine`**: Orquestador de fases.
    - `transitionTo(nextPhase)`: Gestiona el cambio de estado y limpia timers previos.
2.  **`TimerService`**: Clase encargada de la cuenta atrás server-side.
    - Al llegar a 0, invoca el caso de uso `AutoAdvancePhase`.
3.  **Use Cases**:
    - `StartMatch`: Reparto inicial de roles y cambio a `ASSIGNING`.
    - `NextRound`: Reinicio de turnos y avance de la partida.

### 3. Capa de Infraestructura (`apps/game-server/src/infrastructure`)
1.  **`BunTimer`**: Implementación del temporizador usando `setTimeout/setInterval` de Bun.
2.  **WS Broadcaster**: Adaptador que emite el evento `PHASE_CHANGE` a todos los clientes cada vez que la máquina de estados cambia.

### 4. Implementación en el Frontend (`apps/web`)
1.  **`GameLayout`**: Componente que actúa como router interno del juego. Renderiza:
    - `AssignView`, `ClueView`, `DiscussView`, `VoteView` o `ResultView` según el estado del socket.
2.  **`SyncTimer`**: Componente visual que se sincroniza con el `secondsLeft` enviado por el servidor.

## Verificación
- Al iniciar la partida, todos los jugadores saltan a la pantalla de "Asignación" a la vez.
- Si nadie hace nada, el juego debe avanzar de fase automáticamente al agotarse el tiempo del servidor.
- El servidor muestra logs de: "Room [CODE] transition: CLUES -> DISCUSSING".
