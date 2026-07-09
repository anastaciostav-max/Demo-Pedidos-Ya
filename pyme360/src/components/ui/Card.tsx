import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { palette, radius, shadow, spacing } from '@/theme';

interface CardProps extends ViewProps {
  padded?: boolean;
  elevation?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ padded = true, elevation = 'sm', style, children, ...rest }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        padded && styles.padded,
        elevation !== 'none' && shadow[elevation],
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.gray100,
  },
  padded: {
    padding: spacing.lg,
  },
});
