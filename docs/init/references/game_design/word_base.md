# Motor de Generación de Palabras (IA Controlada)

Para garantizar la calidad del juego, el control de costos (tokens) y la estabilidad del sistema, la generación de palabras mediante IA seguirá un flujo **estrictamente controlado por el servidor**.

## 🛡️ Control de Categorías
El usuario **no puede escribir temáticas libres**. El sistema ofrece una lista cerrada y validada de categorías. Esto asegura que la IA siempre reciba un contexto que entiende perfectamente.

### Lista de Categorías de Sistema:
1. **Comidas**: Frutas, Chatarra, Postres.
2. **Entretenimiento**: Películas, Series, Videojuegos.
3. **Mundo**: Países, Capitales, Monumentos.
4. **Vida**: Animales, Profesiones, Deportes.

---

## 🤖 El Proceso de Generación (Server-Side)

El servidor es el único que interactúa con la IA. El flujo es el siguiente:
1. El Host selecciona una categoría de la **lista oficial**.
2. El servidor envía un **Prompt Blindado** (hardcoded) que incluye la categoría y el modo de juego.
3. La IA debe responder en un formato **JSON estricto** que el servidor valida antes de iniciar la partida.

### Ejemplo de Prompt Estricto:
> "Categoría: {Category_ID}. Modo: {Game_Mode}. Genera {N} palabras para el juego 'El Impostor'. Responde ÚNICAMENTE con un objeto JSON: {'word_a': '...', 'word_b': '...'}. No añadidas texto extra."

### Lógica de Prompts por Modo:
1. **Modo Tradicional**: "Genera 1 palabra secreta en {Categoría}."
2. **Modo Cercanas**: "Genera 2 palabras semánticamente muy cercanas en {Categoría}."
3. **Modo Caos**: "Genera 1 palabra principal en {Categoría} y {N-2} palabras distintas pero semánticamente RELACIONADAS con ella."

---

## 💰 Optimización de Tokens
Al usar categorías predefinidas y prompts cortos/estrictos, minimizamos el uso de tokens y evitamos "alucinaciones" de la IA que podrían romper la lógica de la partida.

---
[[03_Tecnico/Arquitectura|Ver Detalles Técnicos de la API →]]
