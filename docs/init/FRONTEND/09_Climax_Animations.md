# Paso 09: Animaciones de Clímax y Resultados

## Objetivo
Añadir el impacto visual necesario para el final de la partida. El sistema debe mostrar quién ha sido eliminado y, finalmente, quién ha ganado, con animaciones que refuercen la estética "Party Pop".

## Requerimientos Técnicos
- **Animaciones**: CSS Transitions, Framer Motion (opcional) o Web Animations API.
- **Efectos**: `paper-tear`, confeti, vibración háptica.

## Pasos de Ejecución

### 1. Pantalla de Eliminación (`src/game/EliminationView.tsx`)
1. Implementar la animación de suspenso (latido de corazón).
2. Revelación de identidad:
   - Si es **Agente**: Desvanecer en gris con icono de fantasma 👻.
   - Si es **Impostor**: Explosión visual y mensaje de victoria de Agentes.

### 2. Pantalla de Resultados Final (`src/game/ResultsView.tsx`)
1. Renderizar la tarjeta gigante con efecto `paper-tear`.
2. Mostrar el bando ganador con ilustraciones temáticas.
3. **Desglose de Puntos**: Tabla animada que muestra el progreso de cada jugador en la sesión actual.
4. Botón "Volver al Lobby": Resetea el estado del juego pero mantiene la conexión.

### 3. Mapa de Revelación (Solo Modo Caos)
Implementar el gráfico de flechas que muestra quién intentó vincularse con quién y quién acertó las acusaciones.

## Verificación
- Las animaciones de victoria son fluidas y cubren toda la pantalla.
- El desglose de puntos coincide con los datos enviados por el servidor en el evento `GAME_OVER`.
- El botón de "Volver al Lobby" funciona correctamente sin perder el `playerId`.
