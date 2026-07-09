import React from 'react';
import { View } from 'react-native';
import { palette } from '@/theme';

export function Divider({ my = 0 }: { my?: number }) {
  return <View style={{ height: 1, backgroundColor: palette.gray100, marginVertical: my }} />;
}
