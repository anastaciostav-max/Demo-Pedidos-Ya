import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { palette, radius, spacing, typography } from '@/theme';
import { AppText } from './AppText';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
}

export function Input({ label, error, leftIcon, rightIcon, containerStyle, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <AppText variant="captionMedium" style={styles.label}>{label}</AppText>}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {leftIcon}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={palette.gray400}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon}
      </View>
      {error && (
        <AppText variant="caption" color={palette.danger} style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.xxs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.gray50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: palette.gray100,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  inputWrapperFocused: {
    borderColor: palette.blue500,
    backgroundColor: palette.white,
  },
  inputWrapperError: {
    borderColor: palette.danger,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    color: palette.navy900,
  },
  errorText: {
    marginTop: spacing.xxs,
  },
});
