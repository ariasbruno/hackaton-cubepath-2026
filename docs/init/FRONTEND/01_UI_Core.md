# Paso 01: Setup de Tailwind v4 y Componentes Core

## Objetivo
Configurar el motor de estilos Tailwind CSS v4 y crear la librería de componentes básicos (Atomic Design) que garantice la fidelidad visual al estilo "Party Pop".

## Requerimientos Técnicos
- **Framework**: React + Vite.
- **Estilos**: Tailwind CSS v4.
- **Iconos**: Material Symbols Outlined.
- **Tipografías**: Fredoka One, Nunito, Varela Round.

## Pasos de Ejecución

### 1. Configuración de Tailwind v4
1. En `apps/web`, instalar y configurar el plugin de Tailwind v4 en `vite.config.ts`.
2. Configurar el archivo de estilos global (`index.css`) con las variables del [Design System](../references/ui_ux/design_system.md):
   - Colores solid y muted.
   - Sombras `hard` y `hard-lg`.
   - Bordes `card` y `btn`.

### 2. Librería de Componentes Base (`src/components/ui`)
Crear componentes reutilizables y altamente tipados:
- **`Button`**: Variantes `primary`, `secondary`, `accent`, `danger`. Debe incluir el efecto `active:translate-y-1`.
- **`Card`**: Contenedor con borde grueso y sombra sólida.
- **`Typography`**: Componentes `Heading` y `Text` que usen las fuentes correctas.
- **`Input`**: Estilo con sombra interna (`inner-hard`).

### 3. Layout Principal
Crear el contenedor `AppLayout` que gestione el fondo `bg-paper` con el patrón de puntos (`pattern-dots`).

## Verificación
- Existe una página de "Style Guide" local en la web donde se pueden ver todos los botones, tarjetas e inputs.
- Los estilos coinciden exactamente con los de la [Guía de Estilo](../references/ui_ux/design_system.md).
- El hot-reload de Tailwind v4 funciona correctamente.
