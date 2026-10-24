import { useCallback, useEffect, useState } from 'react';

import {
  loadFavorites,
  subscribeFavorites,
  toggleFavoriteCompetition,
  toggleFavoriteTeam,
  type FavoritesState,
} from './store';

export function useFavorites() {
  const [state, setState] = useState<FavoritesState>({
    teamIds: [],
    competitionCodes: [],
  });
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const next = await loadFavorites();
    setState({ ...next, teamIds: [...next.teamIds], competitionCodes: [...next.competitionCodes] });
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
    return subscribeFavorites(() => {
      void refresh();
    });
  }, [refresh]);

  const isTeamFavorite = useCallback(
    (id: number) => state.teamIds.includes(id),
    [state.teamIds],
  );
  const isCompetitionFavorite = useCallback(
    (code: string) => state.competitionCodes.includes(code),
    [state.competitionCodes],
  );

  return {
    ready,
    teamIds: state.teamIds,
    competitionCodes: state.competitionCodes,
    isTeamFavorite,
    isCompetitionFavorite,
    toggleTeam: toggleFavoriteTeam,
    toggleCompetition: toggleFavoriteCompetition,
    refresh,
  };
}
