# 🕵️‍♂️ El Impostor - Hackatón CubePath 2026

![Hero de El Impostor](./hero.png)

## ¿Qué es El Impostor?

El Impostor es un juego de deducción social en el que un grupo de jugadores debe descubrir quién es el impostor entre ellos. Esta versión es la digitalización de un juego popularizado en **Argentina**, principalmente en programas de streaming.

## 🌪️ La Narrativa

Mi motivación para crear este proyecto fue crear algo que me permitiera **exigir al máximo el servidor** con los recursos otorgados.

Un juego con muchas conexiones en tiempo real, con una base de datos y una IA, me pareció un desafío interesante para un servidor con pocos recursos.

Aproveché para innovar en el stack tecnológico con tecnologías que nunca había usado, o había usado poco o nunca había llevado a un proyecto en producción. Entre estas:

*   **⚡ Bun:** Elegí **Bun** como runtime nativo. Fue un salto al vacío para aprender algo nuevo y aprovechar su performance en WebSockets.
*   **🔥 Hono:** Usé **Hono** para el backend para agilizar el desarrollo para la api con Bun.
*   **🧠 IA Dinámica:** Integré **Google Gemini** para que el juego respire. Las palabras no son estáticas; la IA genera categorías y términos semánticamente cercanos para que cada partida sea un desafío nuevo.
*   **📦 Turborepo:** Usé **Turborepo** para gestionar el monorepo. Uno de los primeros desafios con los que me encontre fue la utilizacion de datos compartidos entre el frontend y el backend, para lo cual utilice **Zod** para validar los datos que se envian entre el frontend y el backend.

## 🎮 Modos de Juego

Más allá de los clásicos, introduje una mecánica para cambiar un poco de aire:

*   **🕵️ Tradicional:** 1 Impostor vs Agentes. El clásico juego de deducción.
*   **🔍 Palabras Cercanas:** Un infiltrado con una palabra similar pero distinta. Genera confusión y tensión.
*   **⚡ Modo Caos (Original):** Dos jugadores están **vinculados** (comparten la misma palabra) mientras el resto tienen palabras únicas relacionadas. Los vinculados deben encontrarse en el silencio, y los dispersos deben exponer a la pareja.

## ☁️ Despliegue y Eficiencia con CubePath

Este proyecto está desplegado 100% en CubePath utilizando un servidor **gp.micro** con **Dokploy** como orquestador. La arquitectura está diseñada para maximizar el uso de recursos limitados, configurando subdominios personalizados a través de **Cloudflare** para cada servicio bajo el dominio raíz `brunoarias.dev`.

### 📉 Configuración de Servicios y Límites de RAM

| Servicio | Límite RAM | Build Type | Dominio / URL |
| :--- | :--- | :--- | :--- |
| **Frontend (Web)** | `256 MB` | `Dockerfile` | [impostor.brunoarias.dev](https://impostor.brunoarias.dev) |
| **API Backend** | `256 MB` | `Dockerfile` | [api.brunoarias.dev](https://api.brunoarias.dev) |
| **Game Server** | `512 MB` | `Dockerfile` | [ws.brunoarias.dev](https://ws.brunoarias.dev) |
| **PostgreSQL** | `1 GB` | `Managed` | *Persistencia de Datos* |

## 🚀 Stack Tecnológico

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Hono](https://img.shields.io/badge/Hono-%23ff5000.svg?style=for-the-badge&logo=hono&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini%20AI-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)
![Turborepo](https://img.shields.io/badge/turborepo-%23EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## 🏗️ Arquitectura

El sistema es un **Monorepo** orquestado para la eficiencia máxima:

1.  **API Backend (`apps/api`):** Hono + PostgreSQL. Gestión de perfiles y orquestación de IA.
2.  **Game Server (`apps/game-server`):** Lógica en tiempo real usando **Bun Nativo (WS)** para una latencia casi nula.
3.  **Frontend Web (`apps/web`):** React 19 + Zustand en una interfaz "War Room" oscura, premium y responsiva.
4.  **Shared Core (`packages/shared`):** Contratos de **Zod** compartidos. El frontend y el backend hablan el mismo idioma sin errores.


## 🛠️ Configuración Local

1.  **Instalar el motor:**
    ```bash
    bun install
    ```
2.  **Encender la maquinaria:**
    ```bash
    bun run dev
    ```
    *Dato: Usa `bun run dev:host` para abrir una terminal dividida en Kitty.*


## 🔑 Variables de Entorno

> [!TIP]
> Cada aplicación dentro del monorepo tiene su propio archivo `.env`. Puedes guiarte por los archivos `.env.example` en cada carpeta para la configuración necesaria.

### 📡 API (`apps/api`)
| Variable | Descripción |
| :--- | :--- |
| `DATABASE_URL` | URL de conexión a PostgreSQL. |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS (separados por coma). |
| `INTERNAL_API_KEY` | Clave secreta compartida con el game-server para comunicación S2S. |
| `GEMINI_API_KEY` | API Key de Google Gemini AI. |
| `VITE_WS_URL` | URL interna para descubrimiento del servidor de juegos. |
| `LOG_LEVEL` | Nivel de verbosidad de logs (info, debug, error). |

### 🌐 Web (`apps/web`)
| Variable | Descripción |
| :--- | :--- |
| `VITE_API_URL` | URL base de la API REST. |
| `VITE_WS_URL` | URL del servidor de WebSockets (wss://...). |

### 🎮 Game Server (`apps/game-server`)
| Variable | Descripción |
| :--- | :--- |
| `INTERNAL_API_URL` | URL de la API para callbacks internos y lógica de juego. |
| `INTERNAL_API_KEY` | Debe coincidir con la clave configurada en la API. |
| `VITE_API_URL` | URL base de la API (usada en algunos contextos de cliente). |
| `LOG_LEVEL` | Nivel de logs del servidor de juegos. |


## 📖 Documentación Relacionada

*   [Arquitectura Técnica](docs/ARCHITECTURE.md)
*   [Guía de Base de Datos](docs/DATABASE.md)
*   [Flujo de Usuario](docs/USER_FLOW.md)

Desarrollado con ❤️ para la **Hackatón CubePath 2026**.
