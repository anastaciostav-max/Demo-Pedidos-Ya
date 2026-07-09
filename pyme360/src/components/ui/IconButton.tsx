import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { palette, radius } from '@/theme';

interface IconButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  bg?: string;
  style?: ViewStyle;
}

export function IconButton({ children, onPress, size = 40, bg = palette.gray50, style }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, backgroundColor: bg },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
