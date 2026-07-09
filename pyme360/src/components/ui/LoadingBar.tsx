import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { palette, radius } from '@/theme';

interface LoadingBarProps {
  width?: number;
}

/** Indeterminate horizontal loading bar shown while the app boots. */
export function LoadingBar({ width = 120 }: LoadingBarProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const trackWidth = width;
  const barWidth = trackWidth * 0.45;
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-barWidth, trackWidth],
  });

  return (
    <View style={[styles.track, { width: trackWidth }]}>
      <Animated.View style={[styles.bar, { width: barWidth, transform: [{ translateX }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: palette.gray100,
    overflow: 'hidden',
  },
  bar: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: palette.blue600,
  },
});
