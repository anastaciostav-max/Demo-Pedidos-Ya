import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { palette, radius } from '@/theme';
import { AppText } from '@/components/ui/AppText';

interface BarTrendProps {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (v: number) => string;
}

export function BarTrend({ data, height = 140, formatValue }: BarTrendProps) {
  const gradId = `barGrad-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 100 / data.length;
  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={palette.blue600} stopOpacity={1} />
            <Stop offset="1" stopColor={palette.celeste400} stopOpacity={0.85} />
          </LinearGradient>
        </Defs>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 4);
          const x = i * barWidth + barWidth * 0.22;
          const w = barWidth * 0.56;
          return (
            <Rect
              key={i}
              x={x}
              y={height - h}
              width={w}
              height={Math.max(2, h)}
              rx={2}
              fill={i === data.length - 1 ? palette.teal500 : `url(#${gradId})`}
            />
          );
        })}
      </Svg>
      <View style={styles.labelsRow}>
        {data.map((d, i) => (
          <View key={i} style={styles.labelCol}>
            {i % Math.max(1, Math.ceil(data.length / 6)) === 0 && (
              <AppText variant="caption" style={{ fontSize: 10 }} numberOfLines={1}>
                {d.label}
              </AppText>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  labelCol: {
    flex: 1,
    alignItems: 'center',
  },
});
