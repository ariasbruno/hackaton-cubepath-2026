# Paso 05: Creación y Búsqueda de Salas

## Objetivo
Implementar las interfaces que permiten a los jugadores conectarse entre sí: el buscador de salas públicas y el flujo de configuración para el host.

## Requerimientos Técnicos
- **Planos**: [Lobbies & Create Specs](../references/ui_ux/screen_specs.md).
- **Componentes**: Stepper dinámico.

## Pasos de Ejecución

### 1. Pantalla de Selección de Salas (`src/pages/Lobbies.tsx`)
1. **Buscador**: Input de 4 caracteres con verificación inmediata vía API.
2. **Post-its Locales**: Fila horizontal de salas locales guardadas.
3. **Lista Pública**: Renderizar las salas devueltas por `GET /rooms` en tarjetas con sombras marcadas.

### 2. Flujo de Creación (`src/pages/Create.tsx`)
Implementar el `Stepper` de 4 pasos sin barra de navegación:
1. **Paso 1 (Conexión)**: Dos tarjetas grandes (Online vs Local).
2. **Paso 2 (Categorías)**: Selector de temas con switches lúdicos.
3. **Paso 3 (Modo de Juego)**: Tarjetas con descripción de Tradicional, Cercanas y Caos.
4. **Paso 4 (Configuración Final)**: Timers y Nombre de sala.
- Al confirmar: Llamar a `POST /rooms` y redirigir al Lobby con el código.

## Verificación
- El buscador de código solo permite 4 caracteres y llama a la API al completarlos.
- El Stepper de creación impide avanzar si no se ha seleccionado una opción requerida.
- Al terminar la creación, el usuario aterriza en la URL `/room/[CODE]`.
