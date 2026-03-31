# Sistema de Puntuación

Este documento define la lógica de puntos para incentivar el juego competitivo y estratégico. Los puntos se acumulan por **Sala** y se desglosan por roles para garantizar la justicia estadística.

## 📊 Estructura de la Tabla de Líderes (Leaderboard)

En **El Impostor**, cada Sala se configura con un **Modo de Juego único** al momento de su creación. Por lo tanto, el Lobby de la Sala solo mostrará la tabla de puntuación correspondiente a dicho modo. Esto simplifica la interfaz y mantiene el foco en la competencia actual.

### Visualización según el Modo de la Sala:

#### Si la Sala es de Modo Tradicional:
| Jugador | Partidas Agente | Puntos Agente | Partidas Impostor | Puntos Impostor | TOTAL |
| :--- | :---: | :---: | :---: | :---: | :---: |

#### Si la Sala es de Modo Palabras Cercanas:
| Jugador | Partidas Agente | Puntos Agente | Partidas Infiltrado | Puntos Infiltrado | TOTAL |
| :--- | :---: | :---: | :---: | :---: | :---: |

#### Si la Sala es de Modo Caos:
| Jugador | Partidas Disperso | Puntos Disperso | Partidas Vinculado | Puntos Vinculado | TOTAL |
| :--- | :---: | :---: | :---: | :---: | :---: |

---

## 🏆 1. Modo Tradicional

### 👥 Como Agente
| Acción | Puntos |
| --- | --- |
| **Voto Correcto** (Eliminar Impostor) | +10 |
| **Victoria Rápida** (En Ronda 1) | +15 |
| **Error de Juicio** (Votar a un Agente) | -5 |
| **Victoria de Partida** | +20 |

### 🕵️ Como Impostor
| Acción | Puntos |
| --- | --- |
| **Supervivencia** (Por cada ronda vivo) | +15 |
| **Maestro del Engaño** (Eliminar a un Agente) | +10 |
| **Victoria Suprema** (Gana el Impostor) | +50 |

---

## 🎭 2. Modo Palabras Cercanas (Infiltrado)

### 👥 Como Agente
| Acción | Puntos |
| --- | --- |
| **Voto Correcto** | +15 |
| **Victoria Rápida** | +20 |
| **Error de Juicio** | -10 |
| **Victoria de Partida** | +25 |

### 🕵️ Como Infiltrado
| Acción | Puntos |
| --- | --- |
| **Supervivencia** (Por ronda) | +20 |
| **Mimetismo** (Desviar votos a un Agente) | +15 |
| **Victoria Suprema** | +60 |

---

## 🔗 3. Modo Caos (Vinculados vs Dispersos)

En este modo, los puntos se otorgan según el **resultado de la acción elegida**, ya que el jugador desconoce su rol hasta el final de la partida.

| Acción Elegida | Resultado | Puntos |
| --- | --- | :---: |
| **🔗 Buscar Vínculo** | **Vínculo Exitoso** (Mutuo y misma palabra) | **+30** |
| **🔗 Buscar Vínculo** | **Vínculo Fallido** (No mutuo o distinta palabra) | **-10** |
| **🎯 Acusar Pareja** | **Acusación Certera** (Identifica a los 2 Vinculados) | **+25** |
| **🎯 Acusar Pareja** | **Acusación Errónea** (Falla en uno o ambos) | **-15** |
| **⏩ Saltar Voto** | **Abstención** (Decisión segura) | **+5** |

### 💎 Bonus de Partida (Se suman al finalizar)
- **Supervivencia Vinculada**: +15 pts por ronda si la pareja no es descubierta.
- **Persistencia Dispersa**: +10 pts por ronda si la pareja no logra vincularse.
- **Victoria Final**: +20 pts para los miembros del bando que cumpla su objetivo primero.

---

### ⚖️ Regla de Abstención (Todos los modos)
- **Saltar Voto / Decisión (+5 pts)**: Se otorga a cualquier jugador que decida no votar (Modo Tradicional/Cercanas) o no tomar una decisión de vínculo/acusación (Modo Caos). Premia la precaución sobre el error accidental.

---

## 🔒 Visualización y Distribución de Puntos

En **El Impostor**, para mantener la intriga y evitar que los jugadores deduzcan sus roles mediante el puntaje, se aplica la siguiente regla universal:

1.  **Cero información in-game**: Durante el transcurso de una **Partida** (sea Tradicional, Cercanas o Caos), los puntajes no se actualizan ni se muestran en ninguna pantalla.
2.  **Revelación Final**: Los puntos acumulados durante todas las rondas de la partida se calculan y se muestran **únicamente en la Pantalla de Resultados Final**, justo antes de regresar al Lobby.
3.  **Actualización del Lobby**: Una vez que los jugadores regresan al Lobby de la Sala, la Tabla de Líderes se actualiza con los nuevos totales de la sesión.

---
[[01_Game_Design/Concepto_Core|Volver a Concepto Core →]]
