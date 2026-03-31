# Esquema de Base de Datos

El sistema utiliza PostgreSQL para la persistencia de datos. El diseño se enfoca en la extensibilidad para futuros modos de juego.

## Diagrama ER (Simplificado)

```mermaid
erDiagram
    players ||--o{ match_players : participates
    rooms ||--o{ matches : has
    matches ||--o{ match_players : recorded
    players ||--o{ rooms : hosts

    players {
        uuid id PK
        string nickname
        string avatar
        string color
        int total_score
        timestamp created_at
    }

    match_players {
        uuid id PK
        uuid match_id FK
        uuid player_id FK
        string role
        int points
        boolean voted_correctly
    }

    rooms {
        uuid id PK
        string code
        uuid host_id FK
        jsonb settings
        string status
    }

    matches {
        uuid id PK
        uuid room_id FK
        string mode
        string winner_side
        int rounds
    }
```

## Detalles de Tablas

### `players`
Almacena la identidad del usuario. Los invitados se crean localmente y se promocionan a esta tabla cuando eligen un nombre de usuario real.

### `match_players`
Contiene el desglose de cada partida. Es la fuente de la verdad para calcular la **Eficacia de Voto** y las victorias por rol.

## Esquemas Zod (Contratos)

Los contratos S2S (Server-to-Server) y Client-to-Server están definidos en `@impostor/shared`.

### Registro de Partida (`matchResultSchema`)
```typescript
{
  roomId: string,
  winnerSide: 'AGENTES' | 'IMPOSTORES' | 'CAOS',
  mode: 'TRADICIONAL' | 'CERCANAS' | 'CAOS',
  rounds: number,
  players: [
    {
      playerId: string,
      role: string,
      pointsEarned: number,
      votedCorrectly: boolean
    }
  ]
}
```
