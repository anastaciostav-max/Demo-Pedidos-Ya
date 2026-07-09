import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const HEIGHTS: Record<Size, number> = { sm: 38, md: 48, lg: 56 };
const FONT_SIZES: Record<Size, number> = { sm: typography.size.sm, md: typography.size.base, lg: typography.size.md };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  icon,
  iconRight,
  fullWidth,
  style,
}: ButtonProps) {
  const palVariant = VARIANT_STYLE[variant];
  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        { height: HEIGHTS[size], backgroundColor: palVariant.bg, borderColor: palVariant.border },
        palVariant.border ? styles.bordered : null,
        fullWidth && styles.fullWidth,
        pressed && !disabled && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palVariant.fg} />
      ) : (
        <View style={styles.content}>
          {icon}
          <AppText
            variant="bodySemibold"
            color={palVariant.fg}
            style={{ fontSize: FONT_SIZES[size] }}
          >
            {label}
          </AppText>
          {iconRight}
        </View>
      )}
    </Pressable>
  );
}

const VARIANT_STYLE: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: palette.blue600, fg: palette.white },
  secondary: { bg: palette.celeste400, fg: palette.navy900 },
  outline: { bg: palette.white, fg: palette.blue600, border: palette.gray200 },
  ghost: { bg: 'transparent', fg: palette.blue600 },
  danger: { bg: palette.danger, fg: palette.white },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
  },
  bordered: {
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
