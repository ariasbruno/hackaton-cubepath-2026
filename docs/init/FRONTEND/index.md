# 🎨 Plan de Implementación Detallado: Frontend "El Impostor"

Este índice marca el camino para construir la interfaz de usuario. Cada paso se enfoca en la fidelidad visual basada en los prototipos y la robustez de la lógica.

---

## 🏗️ Bloque 1: Cimientos y UI Base
- [ ] **[Paso 01: Setup de Tailwind v4 y Componentes Core](01_UI_Core.md)**
    - *Planos:* [Design System](../references/ui_ux/design_system.md)
- [ ] **[Paso 02: Gestión de Estado (Zustand)](02_State_Management.md)**
- [ ] **[Paso 03: Capa de Servicios (API Client)](03_Services_Layer.md)**

## 👤 Bloque 2: Experiencia de Usuario (Flujos)
- [ ] **[Paso 04: Autenticación y Perfil](04_Auth_Flow.md)**
    - *Prototipos:* [01_Home.html](../references/ui_ux/prototypes/01_Home.html), [09_Profile.html](../references/ui_ux/prototypes/09_Profile.html)
- [ ] **[Paso 05: Creación y Búsqueda de Salas](05_Room_Flow.md)**
    - *Prototipos:* [02_Rooms.html](../references/ui_ux/prototypes/02_Rooms.html), [03_Create_Steps.html](../references/ui_ux/prototypes/)

## 🎲 Bloque 3: El Juego (Real-Time)
- [ ] **[Paso 06: Integración de WebSockets (Lobby)](06_WS_Integration.md)**
    - *Prototipos:* [04_Lobby_Tradicional.html](../references/ui_ux/prototypes/04_Lobby_Tradicional.html)
- [ ] **[Paso 07: Vistas de Juego (Assign & Clues)](07_Game_Views_1.md)**
    - *Prototipos:* [05_Assign_Steps.html](../references/ui_ux/prototypes/), [06_Pistas.html](../references/ui_ux/prototypes/06_Pistas.html)
- [ ] **[Paso 08: Vistas de Juego (Discuss & Vote)](08_Game_Views_2.md)**
    - *Prototipos:* [07_Discussion.html](../references/ui_ux/prototypes/07_Discussion.html), [08_Vote.html](../references/ui_ux/prototypes/08_Vote.html)
- [ ] **[Paso 09: Animaciones de Clímax y Resultados](09_Climax_Animations.md)**
    - *Prototipos:* [08_Elimination_Steps.html](../references/ui_ux/prototypes/), [09_Results_Steps.html](../references/ui_ux/prototypes/)

## 📱 Bloque 4: Modo Local y Pulido
- [ ] **[Paso 10: Flujo "Pasar el Teléfono"](10_Local_Mode.md)**
    - *Prototipos:* [05_Local_PassPhone.html](../references/ui_ux/prototypes/05_Local_PassPhone.html), [05_Local_RevealRole.html](../references/ui_ux/prototypes/05_Local_RevealRole.html)
