# Especificaciones de Estructura y Estilos por Página

Este documento detalla la construcción técnica y visual de cada vista de **El Impostor**, aplicando el sistema de diseño **Party Pop**.

---

## 🏠 1. Inicio (Home) - `/`
*Objetivo: Bienvenida e impacto visual.*

- **Estructura**:
  - `Header`: Avatar del usuario (derecha) y marcador de puntos globales (izquierda).
  - `Hero`: Ilustración central dinámica (Emoji gigante o personaje 🤫).
  - `CTA`: Botón gigante `btn-primary` centrado.
  - `Info`: Grid de 2x2 con tarjetas `primary-muted` explicando brevemente: Obtener Rol, Pistas, Votar, Ayuda.
- **Estilos**:
  - Fondo: `bg-paper` con `pattern-dots`.
  - Botón "Jugar": `shadow-hard-lg` naranja.
- **Animaciones**: Entrada con *fade-in* y el personaje central con un ligero *bounce*.

---

## 📂 2. Salas (Lobbies) - `/rooms`
*Objetivo: Navegación rápida entre partidas.*

- **Estructura**:
  - `Input Section`: Campo de 4 caracteres con `inner-hard` shadow para el código.
  - `Horizontal Scroll`: Fila de burbujas circulares (Pop-its) para salas locales guardadas.
  - `Filters`: Chips horizontales para filtrar por modo (Tradicional, Cercanas).
  - `List`: Lista vertical de tarjetas de salas públicas.
- **Estilos**:
  - Tarjetas de sala: `bg-white`, `border-ink/5`, `shadow-hard`.
  - Pop-its locales: Colores vibrantes (`primary`, `secondary`, `purple`, `accent`) con iconos blancos.
- **Animaciones**: Scroll suave horizontal y efecto *scale-up* al tocar un Pop-it.

---

## 🛠️ 3. Crear Partida (Stepper) - `/create`
*Objetivo: Configuración paso a paso sin fricción.*

- **Estructura**: 
  - `Stepper Header`: Indicador de progreso (1/4, 2/4...).
  - `Step Content`: Contenedor central que cambia según el paso.
  - `Navigation`: Botones "Atrás" y "Siguiente" en la parte inferior.
- **Paso 2 (Categorías)**: Lista de tarjetas `bg-white` con `Switch` estilo iOS lúdico.
- **Paso 3 (Modos)**: Tarjetas grandes con ilustraciones y descripción corta.
- **Modal Final**: Fondo oscuro traslúcido y tarjeta central `paper-tear` con resumen.
- **Estilos**:
  - Fondo: `bg-paper` con `pattern-checkers` (opacidad 20%).
  - Tarjeta de paso activo: `shadow-hard-lg`.

---

## 🎮 4. Lobby de Sala - `/room/[id]`
*Objetivo: Espera activa y visualización de la sesión.*

- **Estructura**:
  - `Sticky Header`: Código de sala estilo Post-it (`sticky-yellow`).
  - `Leaderboard`: Tabla compacta `bg-white` con bordes redondeados.
  - `Avatars Grid`: Cuadrícula de avatares circulares con nombre debajo.
  - `Chat Bar`: Input inferior fijo para mensajes rápidos.
- **Estilos**:
  - Avatares: Borde grueso del color del jugador, `shadow-hard-sm`.
  - Botón "Listo": Verde esmeralda (`accent`) con `shadow-hard`.

---

## 👆 5. Asignación de Roles
*Objetivo: Suspenso absoluto.*

- **Estructura**:
  - Pantalla a pantalla completa.
  - `Central Button`: El componente "Hold to Reveal" (3D, huella dactilar).
- **Estilos**:
  - Fondo inicial: `background-dark` (casi negro).
  - Fondo al presionar: Transición radial a `accent` (Agente) o `danger` (Infiltrado).
- **Animaciones**: Vibración háptica al revelar y partículas explotando al soltar el botón.

---

## 🗣️ 6. Fase de Pistas
*Objetivo: Comunicación clara.*

- **Estructura**:
  - `Timeline`: Burbujas de chat que aparecen secuencialmente.
  - `Active Player`: Barra de progreso (`timer-bar`) en la parte superior.
  - `Input`: Campo de texto gigante que solo aparece al jugador en turno.
- **Estilos**:
  - Burbujas: `bg-white` para otros, `bg-secondary` para el usuario local.
  - Sombra de burbujas: `hard-sm`.

---

## 💬 7. Fase de Discusión
*Objetivo: Análisis y debate.*

- **Estructura**:
  - `Upper Half`: Chat de texto libre dinámico.
  - `Lower Half`: Panel scrollable con el historial de pistas de rondas anteriores (estilo tarjetas compactas).
- **Estilos**:
  - Separador: Línea discontinua `border-dashed` con el color `ink/10`.
  - Fondo del historial: `bg-paper` para diferenciarlo del chat activo.

---

## 🗳️ 8. Fase de Votación
*Objetivo: Decisión bajo presión.*

- **Estructura**:
  - `Grid`: Tarjetas de jugadores con botón "VOTAR".
  - `Skip`: Botón `btn-secondary` en la base para "Saltar Voto".
- **Estilos**:
  - Al seleccionar: Borde de la tarjeta se ilumina en `danger`.
  - Confirmación: Modal rápido que bloquea el resto de la pantalla.

---

## 🏆 9. Pantalla de Resultados
*Objetivo: Celebración y cierre.*

- **Estructura**:
  - `Victory Card`: Tarjeta grande central con efecto `paper-tear`.
  - `Points Summary`: Lista de jugadores con sus puntos sumados en la partida.
  - `Actions`: Botones "Jugar de Nuevo" y "Salir".
- **Estilos**:
  - Ganadores: Aura brillante y confeti animado (Canvas).
  - Perdedores: Desaturados en el fondo.

---

## 🔗 10. Mapa de Revelación (Modo Caos)
*Objetivo: Entender el desenlace.*

- **Estructura**:
  - `Graph View`: Avatares posicionados en círculo con flechas animadas conectándolos.
  - `Legend`: Explicación de colores (Flecha azul = Vínculo, Flecha Roja = Acusación).
- **Estilos**:
  - Flechas: Trazo grueso `border-4` con terminación en flecha estilizada.
  - Palabras: Texto `font-mono` flotando sobre cada avatar.
