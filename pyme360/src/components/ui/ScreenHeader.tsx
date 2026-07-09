import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { palette, spacing } from '@/theme';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, onBack, showBack = true, right }: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <IconButton onPress={onBack ?? (() => router.back())} style={styles.backBtn}>
            <ChevronLeft size={22} color={palette.navy900} />
          </IconButton>
        )}
        <View style={styles.titleWrap}>
          <AppText variant="title" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="caption" numberOfLines={1}>
              {subtitle}
            </AppText>
          )}
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
    minWidth: 0,
  },
  titleWrap: {
    flexShrink: 1,
    minWidth: 0,
  },
  backBtn: {
    marginRight: spacing.xxs,
  },
});
