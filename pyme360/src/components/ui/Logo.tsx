import React from 'react';
import { Image, ImageStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ImageStyle;
}

/** Renders the official Pyme360 logo asset as-is (never redraw or recolor it). */
export function Logo({ size = 96, style }: LogoProps) {
  return (
    <Image
      source={require('@assets/logo.png')}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
    />
  );
}
