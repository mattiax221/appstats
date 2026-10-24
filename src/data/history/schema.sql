-- AppStats historical football DB (finished matches only). Shared by Node ingest + expo-sqlite.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS competitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country TEXT
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  crest_url TEXT
);

CREATE TABLE IF NOT EXISTS team_aliases (
  alias_key TEXT PRIMARY KEY NOT NULL,
  team_id INTEGER NOT NULL REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  source_match_id TEXT,
  competition_id INTEGER NOT NULL REFERENCES competitions(id),
  season TEXT NOT NULL,
  match_date TEXT NOT NULL,
  home_team_id INTEGER NOT NULL REFERENCES teams(id),
  away_team_id INTEGER NOT NULL REFERENCES teams(id),
  home_goals INTEGER NOT NULL,
  away_goals INTEGER NOT NULL,
  ht_home_goals INTEGER,
  ht_away_goals INTEGER,
  status TEXT NOT NULL DEFAULT 'finished',
  UNIQUE (source, source_match_id),
  UNIQUE (competition_id, match_date, home_team_id, away_team_id)
);

CREATE TABLE IF NOT EXISTS goal_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id),
  player_name TEXT,
  minute INTEGER,
  is_home INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS ingest_checkpoints (
  source TEXT NOT NULL,
  cursor_key TEXT NOT NULL,
  cursor_value TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (source, cursor_key)
);

CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_comp_season ON matches(competition_id, season);
CREATE INDEX IF NOT EXISTS idx_matches_home ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away ON matches(away_team_id);
