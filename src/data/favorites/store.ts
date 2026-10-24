import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'appstats.favorites.v1';

export type FavoritesState = {
  teamIds: number[];
  competitionCodes: string[];
};

const empty: FavoritesState = { teamIds: [], competitionCodes: [] };

let memory: FavoritesState | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeFavorites(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function loadFavorites(): Promise<FavoritesState> {
  if (memory) return memory;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      memory = { ...empty, teamIds: [], competitionCodes: [] };
      return memory;
    }
    const parsed = JSON.parse(raw) as FavoritesState;
    memory = {
      teamIds: Array.isArray(parsed.teamIds) ? parsed.teamIds.map(Number) : [],
      competitionCodes: Array.isArray(parsed.competitionCodes)
        ? parsed.competitionCodes.map(String)
        : [],
    };
    return memory;
  } catch {
    memory = { teamIds: [], competitionCodes: [] };
    return memory;
  }
}

async function persist(next: FavoritesState) {
  memory = next;
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

export async function toggleFavoriteTeam(teamId: number): Promise<boolean> {
  const cur = await loadFavorites();
  const has = cur.teamIds.includes(teamId);
  const teamIds = has
    ? cur.teamIds.filter((id) => id !== teamId)
    : [...cur.teamIds, teamId];
  await persist({ ...cur, teamIds });
  return !has;
}

export async function toggleFavoriteCompetition(code: string): Promise<boolean> {
  const cur = await loadFavorites();
  const has = cur.competitionCodes.includes(code);
  const competitionCodes = has
    ? cur.competitionCodes.filter((c) => c !== code)
    : [...cur.competitionCodes, code];
  await persist({ ...cur, competitionCodes });
  return !has;
}

export function getFavoritesSync(): FavoritesState {
  return memory ?? empty;
}
