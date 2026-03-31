# Concepto Core & Roles

El juego del **Impostor** es una experiencia de deducción social basada en palabras, diseñada para ser rápida, divertida y altamente rejugable gracias a la Inteligencia Artificial.

## 🎮 Modos de Juego

La **Partida** se puede configurar en tres modos distintos, cada uno con una dinámica de sospecha única:

### 1. Modo Tradicional (Agentes vs Impostor)
- **Agentes**: Reciben la `Palabra_Secreta`.
- **Impostor**: No recibe ninguna palabra.
- **Meta**: El impostor debe deducir la palabra escuchando a los agentes para camuflarse y sobrevivir a las votaciones.

### 2. Palabras Cercanas (Infiltrado Ciego)
- **Agentes**: Reciben la `Palabra_A`.
- **Infiltrado**: Recibe la `Palabra_B`, semánticamente muy parecida pero diferente (ej: *Pizza* vs *Calzone*).
- **Mecánica Crítica**: El infiltrado **no sabe que es el infiltrado**. Su pantalla le indica que es un "Agente" y le muestra su palabra. Cree que su palabra es la misma que la del resto.
- **Meta**: Los Agentes deben detectar quién tiene una palabra distinta basándose en las inconsistencias de las pistas, mientras que el Infiltrado defenderá su palabra pensando que es la correcta.

### 3. Modo Caos (Vinculados vs Dispersos) - [SOLO ONLINE]
- **🔗 Vinculados (2 Jugadores)**: Reciben la misma palabra. Deben encontrarse (vincularse) sin ser detectados.
- **👥 Dispersos (Resto)**: Cada uno recibe una palabra distinta pero relacionada. Deben acusar a la pareja antes de que ellos se encuentren.

---

## 🧱 Estructura del Juego

Para garantizar la fluidez, el juego se organiza en tres niveles jerárquicos:

1.  **Sala (Room)**: El espacio persistente (Lobby). Aquí es donde los jugadores se unen mediante un código de 4 letras. Se mantiene activa a lo largo de varias partidas.
2.  **Partida (Match)**: Un ciclo completo desde el reparto de roles hasta la victoria. Una partida termina cuando un bando cumple su objetivo.
3.  **Ronda (Round)**: La unidad básica de juego. Cada ronda consiste en una fase de pistas, debate y resolución (votación/decisión). Una partida puede tener varias rondas.

---

## 🎭 Los Roles y sus Objetivos

| Rol | Modo | Objetivo Principal |
| --- | --- | --- |
| **Agente** | Tradicional / Cercanas | Eliminar al Impostor/Infiltrado mediante votación. |
| **Impostor** | Tradicional | Sobrevivir hasta que queden solo 2 jugadores sin conocer la palabra. |
| **Infiltrado** | Cercanas | Camuflarse usando su "palabra similar" para confundir a los Agentes. |
| **Vinculado** | Caos | Encontrar a su pareja (Vincular) antes de ser descubierto. |
| **Disperso** | Caos | Identificar quiénes forman la pareja vinculada (Acusar). |

---

## 🔡 Las Palabras (Motor de IA)

Las palabras son generadas **100% por IA** al inicio de cada partida, asegurando que nunca se repitan las mismas situaciones. El sistema utiliza categorías cerradas para mantener el control y la calidad:

1.  **Comidas**: Frutas, Chatarra, Postres.
2.  **Entretenimiento**: Películas, Series, Videojuegos.
3.  **Mundo**: Países, Capitales, Monumentos.
4.  **Vida**: Animales, Profesiones, Deportes.

> [!IMPORTANT]
> El servidor utiliza **prompts blindados** para garantizar que la IA genere palabras adecuadas para el modo de juego seleccionado, optimizando el uso de tokens y evitando errores.

---

## 📝 Ejemplo de Partida (Modo Tradicional)
- **Palabra Secreta**: Bicicleta.
- **Pepe (Impostor)**: Dice "Sirve para viajar" (Pista vaga para no quemarse).
- **Franco (Agente)**: Dice "Usás las piernas para moverte" (Pista clara para agentes, pero peligrosa).
- **El Debate**: Bruno sospecha: "Viajar es muy genérico, Pepe es el impostor".
- **Resultado**: Los Agentes votan a Pepe y ganan la partida.

---
[[docs/references/ui_ux/game_flow.md|Ver Flujo Detallado de Juego →]]
