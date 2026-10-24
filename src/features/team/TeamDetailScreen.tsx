import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { mockFavoriteTeams, mockFixtures } from '@/src/data/mock/fixtures';
import { MatchRow } from '@/src/ui/MatchRow';
import { Screen } from '@/src/ui/Screen';
import { SectionHeader } from '@/src/ui/SectionHeader';
import { TeamCrest } from '@/src/ui/TeamCrest';
import { colors, fonts, spacing } from '@/src/ui/theme';

export function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = mockFavoriteTeams.find((t) => t.id === id);
  const fromFixture =
    mockFixtures.find((m) => m.home.id === id)?.home ??
    mockFixtures.find((m) => m.away.id === id)?.away;
  const name = team?.name ?? fromFixture?.name ?? (typeof id === 'string' ? id : 'Squadra');
  const crest = team?.crestUrl ?? fromFixture?.crestUrl;
  const related = mockFixtures.filter((m) => m.home.id === id || m.away.id === id).slice(0, 2);

  return (
    <Screen>
      <View style={styles.header}>
        <TeamCrest uri={crest} name={name} size={72} delay={60} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{name}</Text>
          {team ? <Text style={styles.comp}>{team.competition}</Text> : null}
        </View>
      </View>

      <View style={styles.formRow}>
        {['V', 'V', 'N', 'P', 'V'].map((r, i) => (
          <View
            key={`${r}-${i}`}
            style={[
              styles.formCell,
              r === 'V' && styles.formWin,
              r === 'N' && styles.formDraw,
              r === 'P' && styles.formLoss,
            ]}>
            <Text style={styles.formText}>{r}</Text>
          </View>
        ))}
      </View>

      {related.length > 0 ? (
        <>
          <SectionHeader title="Partite" />
          {related.map((m, i) => (
            <MatchRow key={m.id} match={m} enterDelay={100 + i * 40} />
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerText: { flex: 1, gap: 4 },
  title: {
    fontFamily: fonts.brand,
    fontSize: 40,
    lineHeight: 42,
    color: colors.text,
    letterSpacing: 1,
  },
  comp: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  formCell: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal,
  },
  formWin: { backgroundColor: colors.pitchLit },
  formDraw: { backgroundColor: colors.charcoal },
  formLoss: { backgroundColor: 'rgba(255, 92, 77, 0.35)' },
  formText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
});
