import { Search, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={18} color={palette.gray400} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.gray400}
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <X size={16} color={palette.gray400} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.gray50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: palette.gray100,
    paddingHorizontal: spacing.sm,
    height: 46,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: palette.navy900,
    height: '100%',
  },
});
