import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ImageStyle;
}

/**
 * Renders the official Pyme360 logo (never redraw or recolor the artwork).
 * Uses a background-removed crop of the original asset (assets/logo-transparent.png,
 * derived from assets/logo.png by flood-filling only the contiguous outer white
 * canvas — the artwork itself is untouched) so it blends into any surface
 * instead of showing a white square behind it.
 */
export function Logo({ size = 96, style }: LogoProps) {
  return (
    <Image
      source={require('@assets/logo-transparent.png')}
      style={[{ width: size, height: size * (914 / 954), resizeMode: 'contain' }, style]}
    />
  );
}
