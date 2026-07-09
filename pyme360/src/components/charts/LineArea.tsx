import React, { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { palette } from '@/theme';

interface LineAreaProps {
  values: number[];
  height?: number;
  width?: number;
  strokeColor?: string;
}

function buildPath(values: number[], width: number, height: number, pad = 6) {
  if (values.length === 0) return { line: '', area: '' };
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - min);
  const stepX = (width - pad * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return [x, y];
  });
  let line = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [cx, cy] = points[i];
    const mx = (px + cx) / 2;
    line += ` C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`;
  }
  const area = `${line} L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`;
  return { line, area, last: points[points.length - 1] };
}

export function LineArea({ values, height = 120, width = 320, strokeColor = palette.blue600 }: LineAreaProps) {
  const gradId = `areaGrad-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { line, area, last } = buildPath(values, width, height);
  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={strokeColor} stopOpacity={0.25} />
            <Stop offset="1" stopColor={strokeColor} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {area && <Path d={area} fill={`url(#${gradId})`} />}
        {line && <Path d={line} stroke={strokeColor} strokeWidth={2.5} fill="none" strokeLinecap="round" />}
        {last && <Circle cx={last[0]} cy={last[1]} r={4} fill={strokeColor} />}
      </Svg>
    </View>
  );
}
