import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { AppText } from './AppText';

interface BadgeProps {
  label: string;
  fg?: string;
  bg?: string;
  dot?: boolean;
}

export function Badge({ label, fg = palette.blue600, bg = palette.infoBg, dot }: BadgeProps) {
  return (
    <View style={[styles.base, { backgroundColor: bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: fg }]} />}
      <AppText variant="captionMedium" color={fg} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
  },
});
