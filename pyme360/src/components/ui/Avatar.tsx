import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { palette, radius } from '@/theme';
import { AppText } from './AppText';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  colorSeed?: string;
}

const COLORS = [palette.blue600, palette.teal500, palette.navy700, palette.celeste400];

function colorForSeed(seed: string) {
  const idx = seed.split('').reduce((s, c) => s + c.charCodeAt(0), 0) % COLORS.length;
  return COLORS[idx];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Avatar({ name, uri, size = 44, colorSeed }: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }
  const bg = colorForSeed(colorSeed ?? name);
  return (
    <View
      style={[
        styles.base,
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <AppText variant="bodySemibold" color={palette.white} style={{ fontSize: size * 0.38 }}>
        {initials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
