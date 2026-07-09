import { Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { palette, radius, shadow } from '@/theme';

interface FABProps {
  onPress: () => void;
  icon?: React.ReactNode;
}

export function FAB({ onPress, icon }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, shadow.lg, pressed && { transform: [{ scale: 0.96 }] }]}
    >
      {icon ?? <Plus size={26} color={palette.white} strokeWidth={2.5} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: palette.blue600,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
