import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { palette, typography } from '@/theme';

type Variant =
  | 'display'
  | 'title'
  | 'headline'
  | 'body'
  | 'bodyMedium'
  | 'bodySemibold'
  | 'caption'
  | 'captionMedium'
  | 'label';

const VARIANT_STYLES: Record<Variant, TextStyle> = {
  display: { fontFamily: typography.fontFamily.extrabold, fontSize: typography.size.xxxl, color: palette.navy900 },
  title: { fontFamily: typography.fontFamily.bold, fontSize: typography.size.xxl, color: palette.navy900 },
  headline: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.lg, color: palette.navy900 },
  body: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.base, color: palette.gray700 },
  bodyMedium: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.base, color: palette.navy900 },
  bodySemibold: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.base, color: palette.navy900 },
  caption: { fontFamily: typography.fontFamily.regular, fontSize: typography.size.sm, color: palette.gray500 },
  captionMedium: { fontFamily: typography.fontFamily.medium, fontSize: typography.size.sm, color: palette.gray600 },
  label: { fontFamily: typography.fontFamily.semibold, fontSize: typography.size.xs, color: palette.gray500 },
};

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  return <Text style={[VARIANT_STYLES[variant], color ? { color } : null, style]} {...rest} />;
}
