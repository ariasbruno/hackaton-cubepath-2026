# 🎨 Sistema de Diseño: Party Pop (Diversión Social) - Configuración Final

Este documento detalla el lenguaje visual definitivo de **El Impostor**, integrando los estilos, colores y componentes técnicos proporcionados.

---

## 🎨 1. Paleta de Colores (Definitiva)

Utilizaremos un esquema de colores vibrante con una **Paleta Secundaria (Muted)** para fondos de tarjetas, estados hover y elementos de baja jerarquía.

| Categoría | Principal (Solid) | Secundaria (Muted/Surface) | Uso Recomendado |
| --- | --- | --- | --- |
| **Primario** | `#FF8C42` (Orange) | `#FFF0E5` | Botones principales / Fondos suaves. |
| **Secundario** | `#4D9DE0` (Blue) | `#EBF5FF` | Información / Menús secundarios. |
| **Acento** | `#87C38F` (Green) | `#F0F9F1` | Éxito / Agentes / Checkmarks. |
| **Peligro** | `#E63946` (Red) | `#FFF0F1` | Votación / Infiltrado / Errores. |
| **Especial** | `#9D4EDD` (Purple) | `#F5E6FF` | Modo Caos / Roles épicos. |
| **Nota** | `#FFD166` (Yellow) | `#FFF9E5` | Post-its / Tips / Advertencias. |
| **Texto/Ink** | `#2B2D42` (Dark) | `#8D8FA1` | Texto principal / Texto secundario. |
| **Papel** | `#FDFBF7` (Cream) | `-` | Fondo general de la aplicación. |

---

## ✍️ 2. Tipografía

- **Display**: `Fredoka One`, cursive. (Títulos, botones gigantes).
- **Body**: `Nunito`, sans-serif. (Descripciones, nombres, textos legibles).
- **Mono**: `Varela Round`, monospace. (Códigos de sala, timers).

---

## 📐 3. Elevación y Formas (Hard-Edge Style)

El diseño se basa en el **Neubrutalismo Suave**: bordes redondeados con sombras sólidas y sin difuminado.

- **Sombras (Box Shadows)**:
  - `hard`: `4px 4px 0px rgba(43, 45, 66, 0.15)` (Estándar).
  - `hard-sm`: `2px 2px 0px rgba(43, 45, 66, 0.15)` (Elementos pequeños).
  - `hard-lg`: `6px 6px 0px rgba(43, 45, 66, 0.15)` (Botones de clímax).
  - `inner-hard`: `inset 3px 3px 0px rgba(0,0,0,0.1)` (Efecto presionado).
- **Bordes (Radius)**:
  - `card`: `24px`
  - `btn`: `16px`

---

## 🏁 4. Patrones y Texturas

Para dar profundidad y dinamismo, se usarán fondos con patrones:
- **pattern-checkers**: Cuadrícula diagonal suave.
- **pattern-dots**: Puntos de estilo papel técnico.
- **paper-tear**: Efecto de borde rasgado para tarjetas de roles o resultados.

---

## ✨ 5. Componentes de Juego Especiales

### 🎟️ Tarjeta de Código (Room Code)
Estilo "Post-it" amarillo con inclinación de -2 grados, tipografía mono de 5xl y un clip-path que simula una esquina doblada.

### 👆 Botón de Revelación (Hold to Reveal)
Tarjeta de gran tamaño con patrón checkers, icono de huella dactilar pulsante y animaciones de traslación en los ejes X/Y al ser presionada (cambiando a `inner-hard` shadow).

---
[[02_UX_UI/Style_Guide|Ver Guía de Estilo Interactiva (HTML) →]]
