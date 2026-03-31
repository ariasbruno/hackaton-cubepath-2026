# Paso 04: Autenticación y Perfil

## Objetivo
Hacer realidad el flujo de entrada a la aplicación. El sistema debe reconocer al usuario, crearle un perfil si es nuevo y permitirle personalizar su nickname y avatar.

## Requerimientos Técnicos
- **Planos**: [Home Specs](../references/ui_ux/screen_specs.md).
- **Animaciones**: Fade-in inicial.

## Pasos de Ejecución

### 1. Pantalla Home (`src/pages/Home.tsx`)
1. Implementar la interfaz visual vibrante:
   - Header con avatar y puntos globales.
   - Logo central e ilustración lúdica.
   - Botón gigante "Jugar Ahora".
   - Tarjetas informativas sobre el flujo del juego (Rol -> Pistas -> Votar).

### 2. Lógica de Reconocimiento (Silent Auth)
1. Al montar la app (`App.tsx`), disparar la lógica del `useAuthStore`:
   - Verificar `playerId` en `localStorage`.
   - Llamar a la API para cargar o crear el perfil.

### 3. Modal/Vista de Perfil (`src/pages/Profile.tsx`)
1. Crear la vista para editar datos:
   - Selector de Emojis para el avatar.
   - Input para el nickname (validado por `loginSchema`).
   - Botón de "Guardar Cambios" que llama al servicio de perfil.

## Verificación
- Un usuario nuevo ve un nickname aleatorio (ej: "Agente Misterioso") nada más entrar.
- Al cambiar el nickname a "Pepe", este persiste tras recargar el navegador.
- El botón "Jugar Ahora" redirige correctamente a la vista de creación/búsqueda de salas.
