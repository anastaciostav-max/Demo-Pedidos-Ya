import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { AppText } from './AppText';

interface ListRowProps {
  left?: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  last?: boolean;
}

export function ListRow({ left, title, subtitle, right, onPress, showChevron, last }: ListRowProps) {
  const Container: any = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      style={({ pressed }: any) => [
        styles.row,
        !last && styles.divider,
        pressed && onPress && { backgroundColor: palette.gray50 },
      ]}
    >
      {left && <View style={styles.left}>{left}</View>}
      <View style={styles.body}>
        <AppText variant="bodySemibold" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="caption" numberOfLines={1} style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        )}
      </View>
      {right}
      {showChevron && <ChevronRight size={18} color={palette.gray400} style={{ marginLeft: spacing.xs }} />}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: palette.gray100,
  },
  left: {
    marginRight: spacing.sm,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
});
