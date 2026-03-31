# 🧪 Estrategia de Testing Minimalista: El Impostor

Utilizaremos únicamente `bun test` nativo para validar que cada pieza del sistema produce el **output esperado** basándonos en sus inputs. Sin dependencias extras.

## 🧱 Niveles de Prueba

### 1. Tests Unitarios (Lógica Pura)
- **Foco**: Probar que las funciones y clases de `domain` y `application` devuelven el resultado correcto.
- **Ubicación**: Archivos `.test.ts` junto al código fuente.
- **Mocks**: Crearemos mocks manuales (objetos simples) que implementen las interfaces necesarias.
- **Ejemplo**: Pasar una configuración de sala al `Match` y verificar que el reparto de roles es coherente.

### 2. Tests de Integración (Persistencia y S2S)
- **Foco**: Validar que las queries SQL funcionan y que la comunicación entre servidores es correcta.
- **Integración SQL**: Ejecutar queries reales contra la base de datos y comparar el JSON resultante con el esperado.
- **Integración S2S**: Probar que el `HttpApiClient` del Game Server genera el JSON exacto que la API espera recibir.

## Verificación por Contrato
Cada test comparará el resultado contra el **Contrato Shared** (@impostor/shared). Si el output de una función de la API cambia y rompe el contrato, el test fallará inmediatamente.

---

## 🛠️ Comandos
```json
"scripts": {
  "test": "bun test"
}
```
