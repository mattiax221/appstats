import type { Match, MatchStatus, Standing, TeamRef } from '@/src/domain';

import type { FdMatch, FdStandingRow, FdTeam } from './football-data-types';

export function mapFdStatus(status: string): MatchStatus {
  switch (status) {
    case 'IN_PLAY':
    case 'PAUSED':
    case 'LIVE':
      return 'live';
    case 'FINISHED':
    case 'AWARDED':
      return 'finished';
    case 'POSTPONED':
      return 'postponed';
    case 'CANCELLED':
    case 'SUSPENDED':
      return 'cancelled';
    case 'SCHEDULED':
    case 'TIMED':
      return 'scheduled';
    default:
      return 'unknown';
  }
}

export function mapFdTeam(team: FdTeam): TeamRef {
  return {
    id: String(team.id),
    name: team.name,
    shortName: team.tla ?? team.shortName ?? team.name.slice(0, 3).toUpperCase(),
    crestUrl: team.crest || undefined,
  };
}

export function mapFdMatch(match: FdMatch): Match {
  const status = mapFdStatus(match.status);
  const full = match.score?.fullTime;
  const hasScore =
    full != null && (full.home != null || full.away != null || status === 'live' || status === 'finished');

  return {
    id: String(match.id),
    competitionId: match.competition?.code ?? String(match.competition?.id ?? ''),
    competitionName: match.competition?.name,
    utcDate: match.utcDate,
    status,
    matchday: match.matchday ?? undefined,
    home: mapFdTeam(match.homeTeam),
    away: mapFdTeam(match.awayTeam),
    score: hasScore
      ? { home: full?.home ?? null, away: full?.away ?? null }
      : undefined,
    providerIds: { footballData: String(match.id) },
  };
}

export function mapFdStandingRow(row: FdStandingRow) {
  return {
    position: row.position,
    team: mapFdTeam(row.team),
    played: row.playedGames,
    won: row.won,
    draw: row.draw,
    lost: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference: row.goalDifference,
    points: row.points,
    form: row.form ?? undefined,
  };
}

export function mapFdStandings(
  competitionId: string,
  competitionName: string | undefined,
  table: FdStandingRow[],
): Standing {
  return {
    competitionId,
    competitionName,
    table: table.map(mapFdStandingRow),
  };
}

/** YYYY-MM-DD in local calendar. */
export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dateRangeUpcoming(daysAhead = 7): { from: string; to: string } {
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + daysAhead);
  return { from: isoDate(from), to: isoDate(to) };
}
