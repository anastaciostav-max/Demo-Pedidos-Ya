import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <AppText variant="headline" style={styles.title}>
        {title}
      </AppText>
      {subtitle && (
        <AppText variant="body" style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} size="sm" style={{ marginTop: spacing.md }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.xxs,
  },
});
