import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';
import { AppText } from './AppText';

interface Segment {
  key: string;
  label: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
  scrollable?: boolean;
}

export function SegmentedControl({ segments, value, onChange, scrollable }: SegmentedControlProps) {
  const content = (
    <View style={styles.container}>
      {segments.map((seg) => {
        const active = seg.key === value;
        return (
          <Pressable
            key={seg.key}
            onPress={() => onChange(seg.key)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <AppText variant={active ? 'bodySemibold' : 'bodyMedium'} color={active ? palette.white : palette.gray600}>
              {seg.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.lg }}>
        {content}
      </ScrollView>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: palette.gray50,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  segment: {
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: palette.blue600,
  },
});
