# Paso 07: Vistas de Juego (Assign & Clues)

## Objetivo
Implementar las primeras fases del juego activo: la revelación de roles con suspense y la ronda de pistas por turnos.

## Requerimientos Técnicos
- **Componentes**: `HoldToReveal` (Botón de revelación).
- **Hooks**: `useTurnManager`.

## Pasos de Ejecución

### 1. Fase de Asignación (`src/game/AssignView.tsx`)
1. Implementar la pantalla oscura con el botón de huella dactilar.
2. Lógica de "Hold" (presión prolongada):
   - Al presionar: Iniciar animación radial y mostrar rol/palabra.
   - Al soltar: Ocultar datos sensibles.
3. Botón "Entendido": Envía señal al servidor de que el usuario ya conoce su rol.

### 2. Fase de Pistas (`src/game/CluesView.tsx`)
1. **Historial de Pistas**: Lista de burbujas que se actualiza con el evento `NEW_CLUE`.
2. **Turno Activo**:
   - Si es mi turno: Mostrar input de texto gigante y timer agresivo.
   - Si no: Mostrar quién está hablando actualmente.
3. **Validación**: Impedir enviar pistas de más de 140 caracteres.

## Verificación
- La revelación de rol requiere mantener presionado el botón (no basta un click).
- El input de pista solo es visible para el jugador que tiene el turno asignado por el servidor.
- Al enviar una pista, el input desaparece y el historial se actualiza en todos los clientes.
