import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Logo } from '@/components/ui/Logo';
import { useAppReady } from '@/lib/useAppReady';
import { useAuthStore } from '@/stores/useAuthStore';
import { palette } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function useAuthGate(ready: boolean) {
  const router = useRouter();
  const segments = useSegments();
  const currentUserId = useAuthStore((s) => s.currentUserId);

  useEffect(() => {
    if (!ready) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!currentUserId && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (currentUserId && inAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [ready, currentUserId, segments, router]);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const dataReady = useAppReady();
  const ready = fontsLoaded && dataReady;

  useAuthGate(ready);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Logo size={88} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.gray50,
  },
});
