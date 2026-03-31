# Flujo de Juego (Detallado)

Este documento desglosa el ciclo de vida del juego según el entorno de conexión y las reglas de la partida.

## 📱 1. Bucle por Tipo de Sala

### A. Sala Local (Un solo dispositivo)
*Mecánica: "Pasar el Teléfono". El dispositivo actúa como el único mediador.*

1.  **Lobby**: Registro manual de nombres de jugadores.
2.  **Inicio de Partida**: El sistema genera los roles internamente.
3.  **Asignación de Seguridad (Doble Barrera)**:
    *   **Pantalla 1**: "Turno de [Jugador A]". El jugador toma el móvil, mantiene presionado para ver su rol/palabra. Al soltar, presiona "Listo, pasar".
    *   **Pantalla 2 (Transición)**: "Pasa el teléfono a [Jugador B]". Pantalla neutra sin información sensible. Requiere que el Jugador B presione "Ya tengo el móvil" para continuar.
    *   **Pantalla 3**: "Turno de [Jugador B]". El ciclo se repite hasta que todos conocen su rol.
4.  **Ronda de Pistas (Física)**:
    *   El móvil se coloca en el centro de la mesa.
    *   Muestra el **Orden de Intervención** de todos los jugadores.
    *   **Temporizador (Opcional)**: Si se configuró tiempo por turno, el jugador actual debe presionar un botón en pantalla para iniciar su cuenta atrás antes de hablar.
    *   Los jugadores realizan sus pistas **verbalmente** siguiendo el orden en pantalla. No se escribe nada en el dispositivo.
5.  **Debate y Votación**:
    *   Discusión física cara a cara.
    *   Si el tiempo de votación está activo, el móvil mostrará un cronómetro global para tomar la decisión.
    *   Para votar, el móvil circula o se usa en la mesa para seleccionar y confirmar al eliminado.

6.  **Revelación**: Animación final y regreso al Lobby Local.

### B. Sala Online (Multi-dispositivo)
*Mecánica: Sincronización en tiempo real vía Sockets.*

1.  **Lobby**: Los jugadores se unen con código. El Host ve la lista en tiempo real.
2.  **Inicio de Partida**: El servidor emite `match_started`. Todos los clientes saltan a la vez.
3.  **Asignación**: Cada uno ve su rol en su propia pantalla simultáneamente.
4.  **Ronda de Pistas**:
    *   Turnos estrictos controlados por el servidor. Solo el jugador activo tiene el input habilitado.
    *   Las pistas aparecen en los móviles de todos en tiempo real.
5.  **Debate**: Chat habilitado con timer sincronizado.
6.  **Votación**: Voto secreto en cada móvil. El servidor procesa el resultado al terminar el tiempo.
7.  **Revelación**: Evento global de revelación y regreso al Lobby Online.

---

## 🎲 2. Bucle por Modo de Juego (Lógica Interna)

### 1. Modo Tradicional (Disponible en Local y Online)
*   **Asignación**: `1 Impostor (Palabra: null)` / `N-1 Agentes (Palabra: A)`.
*   **Meta**: Identificar al "vacío" de información.

### 2. Modo Palabras Cercanas (Disponible en Local y Online)
*   **Asignación**: `1 Infiltrado (Palabra: B)` / `N-1 Agentes (Palabra: A)`.
    *   *Nota*: Palabra A y B deben ser semánticamente similares (IA).
*   **Meta**: Detectar inconsistencias sutiles en la pista del infiltrado.

### 3. Modo Caos (SOLO DISPONIBLE EN ONLINE)
*   **Asignación**: `2 Jugadores (Palabra: A)` / `Resto de Jugadores (Cada uno con una palabra única: B, C, D...)`.
*   **Meta**:
    *   Identificar si tienes un aliado (alguien con tu misma palabra).
    *   **La Pareja**: Debe sobrevivir y eliminar a los solitarios.
    *   **Los Solitarios**: Deben eliminar a los dos integrantes de la pareja.
    *   **Victoria**: Los solitarios ganan si eliminan a la pareja. La pareja gana si sobrevive hasta el final eliminando a los solitarios.

---
[[02_UX_UI/Wireframes|Ver Wireframes de Pantallas →]]
