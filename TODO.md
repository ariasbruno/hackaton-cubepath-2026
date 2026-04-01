- Cuidar que no se pueda explotar la api queriendo verificar una id de usuario no valida
- Paginar las salas publicas
- No permitir iniciar una partida de caos si no hay 4 jugadores en la sala.
- [SEGURIDAD] Proteger endpoints de `AdminController.ts` en la API con un middleware de `ADMIN_API_KEY`.
- [SEGURIDAD] Restringir el acceso al endpoint `/admin/status` en el `game-server` mediante `INTERNAL_API_KEY`.
- [SEGURIDAD] Implementar validación de tokens o firma de sesión en el upgrade de WebSockets para evitar suplantación de `playerId`.
- [SEGURIDAD] Endurecer la política de CORS en `apps/api/src/index.ts` sustituyendo el origen dinámico por una lista blanca de dominios autorizados.


- Agregar rate limit
- Asegurarse que lea la ip real