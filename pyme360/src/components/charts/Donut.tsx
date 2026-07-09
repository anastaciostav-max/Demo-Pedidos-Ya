import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { palette } from '@/theme';

interface DonutSlice {
  value: number;
  color: string;
}

interface DonutProps {
  slices: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function Donut({ slices, size = 120, strokeWidth = 16, children }: DonutProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = Math.max(
    1,
    slices.reduce((s, sl) => s + sl.value, 0),
  );
  let offsetAcc = 0;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={palette.gray100}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {slices.map((slice, i) => {
            const fraction = slice.value / total;
            const dash = fraction * circumference;
            const el = (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offsetAcc}
                strokeLinecap="butt"
                fill="none"
              />
            );
            offsetAcc += dash;
            return el;
          })}
        </G>
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>{children}</View>
    </View>
  );
}
