import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Card } from './Card';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  accentBg?: string;
  trend?: { value: string; positive: boolean };
  compact?: boolean;
}

export function StatCard({ icon, label, value, accent = palette.blue600, accentBg = palette.infoBg, trend, compact }: StatCardProps) {
  return (
    <Card style={[styles.card, styles.compact, compact && styles.compact]}>
      <View style={[styles.iconWrap, { backgroundColor: accentBg }]}>{icon}</View>
      <AppText variant="caption" style={styles.label} numberOfLines={2}>
        {label}
      </AppText>
      <AppText variant="title" style={styles.value} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.75}>
        {value}
      </AppText>
      {trend && (
        <AppText
          variant="captionMedium"
          color={trend.positive ? palette.success : palette.danger}
          style={{ marginTop: 2 }}
        >
          {trend.positive ? '↑' : '↓'} {trend.value}
        </AppText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
  compact: {
    padding: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: 2,
  },
  value: {
    fontSize: 19,
  },
});
