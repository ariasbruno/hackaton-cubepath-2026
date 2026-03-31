-- ============================================================
-- El Impostor: Migración Inicial
-- Archivo: apps/api/scripts/001_initial.sql
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Limpieza Inicial (Idempotencia)
DROP TABLE IF EXISTS match_players CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- ============================================================
-- TABLA: players
-- Almacena los perfiles de los jugadores (auth silenciosa).
-- ============================================================
CREATE TABLE players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname    VARCHAR(20) NOT NULL,
  avatar      VARCHAR(50) NOT NULL,  -- Avatar ID (SVG)
  color       VARCHAR(10) NOT NULL DEFAULT '#FFD166', -- HEX Color
  total_score INTEGER NOT NULL DEFAULT 0,
  
  -- Stats cache for Leaderboard
  impostor_games   INTEGER NOT NULL DEFAULT 0,
  agente_games     INTEGER NOT NULL DEFAULT 0,
  infiltrado_games INTEGER NOT NULL DEFAULT 0,
  disperso_games   INTEGER NOT NULL DEFAULT 0,
  vinculado_games  INTEGER NOT NULL DEFAULT 0,

  total_votes      INTEGER NOT NULL DEFAULT 0,
  correct_votes    INTEGER NOT NULL DEFAULT 0,
  
  last_ip     INET,                   -- Server-only: auditoría (NO expuesto al frontend)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para purga de perfiles inactivos (Anti-Bloat)
CREATE INDEX idx_players_purge ON players (total_score, created_at)
  WHERE total_score = 0;

-- ============================================================
-- TABLA: rooms
-- Salas de juego con su configuración JSONB.
-- ============================================================
CREATE TABLE rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        CHAR(4) NOT NULL,
  host_id     UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  settings    JSONB NOT NULL,         -- roomSettingsSchema completo
  status      VARCHAR(20) NOT NULL DEFAULT 'LOBBY',  -- LOBBY | PLAYING | FINISHED
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Código único solo para salas activas (LOBBY o PLAYING)
CREATE UNIQUE INDEX idx_rooms_code_active ON rooms (code)
  WHERE status IN ('LOBBY', 'PLAYING');

-- Salas públicas en lobby (para GET /rooms)
CREATE INDEX idx_rooms_public_lobby ON rooms (created_at DESC)
  WHERE status = 'LOBBY';

-- Índice para purga de salas inactivas (búsqueda rápida por fecha)
CREATE INDEX idx_rooms_updated_at ON rooms (updated_at);

-- ============================================================
-- TABLA: matches
-- Registro histórico de partidas finalizadas.
-- ============================================================
CREATE TABLE matches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  mode        VARCHAR(20) NOT NULL,   -- TRADICIONAL | CERCANAS | CAOS
  winner_side VARCHAR(20) NOT NULL,   -- AGENTES | IMPOSTORES | CAOS
  rounds      INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consulta de partidas por sala (para leaderboard)
CREATE INDEX idx_matches_room ON matches (room_id, created_at DESC);

-- ============================================================
-- TABLA: match_players
-- Desglose de puntos por jugador por partida.
-- ============================================================
CREATE TABLE match_players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  role        VARCHAR(20) NOT NULL,   -- AGENTE | IMPOSTOR | INFILTRADO | VINCULADO | DISPERSO
  points      INTEGER NOT NULL DEFAULT 0,
  voted_correctly BOOLEAN DEFAULT FALSE,

  UNIQUE(match_id, player_id)
);

-- Índice para calcular leaderboard por sala
CREATE INDEX idx_match_players_player ON match_players (player_id);
CREATE INDEX idx_match_players_match ON match_players (match_id);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_players_updated
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_rooms_updated
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
