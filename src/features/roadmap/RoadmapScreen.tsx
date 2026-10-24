import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { roadmapPhases, type RoadmapStatus } from '@/src/data/roadmap';
import { durations, useNativeDriver } from '@/src/ui/motion';
import { Screen } from '@/src/ui/Screen';
import { colors, fonts, spacing } from '@/src/ui/theme';

function statusLabel(status: RoadmapStatus): string {
  if (status === 'done') return 'Fatto';
  if (status === 'next') return 'Prossimo';
  return 'In piano';
}

function PhaseRow({
  phase,
  title,
  summary,
  status,
  index,
}: {
  phase: string;
  title: string;
  summary: string;
  status: RoadmapStatus;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(16)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = 80 + index * 70;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durations.enter,
        delay,
        useNativeDriver,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: durations.enter,
        delay,
        useNativeDriver,
      }),
      Animated.timing(bar, {
        toValue: status === 'done' ? 1 : status === 'next' ? 0.45 : 0.12,
        duration: 700,
        delay: delay + 100,
        useNativeDriver: false,
      }),
    ]).start();
  }, [bar, index, opacity, status, translateX]);

  const width = bar.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateX }] }]}>
      <View style={styles.cardTop}>
        <Text style={styles.phase}>{phase}</Text>
        <Text
          style={[
            styles.badge,
            status === 'done' && styles.badgeDone,
            status === 'next' && styles.badgeNext,
          ]}>
          {statusLabel(status)}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSummary}>{summary}</Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            status === 'done' && styles.fillDone,
            status === 'next' && styles.fillNext,
            { width },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export function RoadmapScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Roadmap</Text>
      <Text style={styles.lead}>Cosa c’è già e cosa arriva dopo.</Text>

      {roadmapPhases.map((p, index) => (
        <PhaseRow
          key={p.id}
          phase={p.phase}
          title={p.title}
          summary={p.summary}
          status={p.status}
          index={index}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.brand,
    fontSize: 48,
    lineHeight: 50,
    color: colors.text,
    letterSpacing: 1,
  },
  lead: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.nightLift,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    gap: spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phase: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
    color: colors.lime,
  },
  badge: {
    fontFamily: fonts.bodySemi,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  badgeDone: { color: colors.lime },
  badgeNext: { color: colors.textSoft },
  cardTitle: {
    fontFamily: fonts.bodySemi,
    fontSize: 18,
    color: colors.text,
  },
  cardSummary: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  track: {
    marginTop: spacing.xs,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.limeDim,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.textMuted,
    borderRadius: 2,
  },
  fillDone: { backgroundColor: colors.lime },
  fillNext: { backgroundColor: colors.textSoft },
});
