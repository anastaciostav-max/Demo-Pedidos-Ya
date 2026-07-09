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
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Logo } from '@/components/ui/Logo';
import { useAppReady } from '@/lib/useAppReady';
import { useAuthStore } from '@/stores/useAuthStore';
import { palette, spacing, WEB_CONTAINER_MAX_WIDTH } from '@/theme';

/** On web, keeps the app phone-width and centered instead of stretching across a wide browser window. */
function WebFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>{children}</View>
    </View>
  );
}

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
      <WebFrame>
        <View style={styles.loading}>
          <Logo size={96} />
          <ActivityIndicator color={palette.blue600} style={styles.loadingSpinner} />
          <AppText variant="captionMedium" style={styles.loadingLabel}>
            Cargando…
          </AppText>
        </View>
      </WebFrame>
    );
  }

  return (
    <WebFrame>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </WebFrame>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.gray50,
  },
  loadingSpinner: {
    marginTop: spacing.lg,
  },
  loadingLabel: {
    marginTop: spacing.sm,
  },
  webOuter: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: palette.gray200,
  },
  webInner: {
    flex: 1,
    width: '100%',
    maxWidth: WEB_CONTAINER_MAX_WIDTH,
    boxShadow: '0 0 0 1px rgba(11,27,63,0.06), 0 24px 48px rgba(11,27,63,0.12)',
  },
});
