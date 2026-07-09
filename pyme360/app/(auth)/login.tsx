import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Lock, Mail, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { AppText, Button, Input, Logo } from '@/components/ui';
import { DEMO_CREDENTIALS } from '@/lib/bootstrap';
import { useAuthStore } from '@/stores/useAuthStore';
import { gradients, palette, spacing } from '@/theme';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleLogin(overrides?: { email: string; password: string }) {
    const useEmail = overrides?.email ?? email;
    const usePassword = overrides?.password ?? password;
    if (!useEmail || !usePassword) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setError(undefined);
    setLoading(true);
    const res = await login(useEmail, usePassword);
    setLoading(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.hero} style={styles.hero}>
        <View style={styles.logoWrap}>
          <Logo size={104} />
        </View>
        <AppText variant="title" color={palette.white} style={styles.tagline}>
          Tu negocio, 360° bajo control
        </AppText>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formWrap}
      >
        <View style={styles.card}>
          <AppText variant="headline" style={{ marginBottom: spacing.xs }}>
            Inicia sesión
          </AppText>
          <AppText variant="body" style={{ marginBottom: spacing.lg }}>
            Administra tu negocio desde cualquier lugar.
          </AppText>

          <Input
            label="Correo electrónico"
            placeholder="tucorreo@negocio.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={18} color={palette.gray400} />}
            containerStyle={{ marginBottom: spacing.sm }}
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={18} color={palette.gray400} />}
          />
          {error && (
            <AppText variant="caption" color={palette.danger} style={{ marginTop: spacing.xs }}>
              {error}
            </AppText>
          )}

          <Button
            label="Iniciar sesión"
            onPress={() => handleLogin()}
            loading={loading}
            fullWidth
            style={{ marginTop: spacing.lg }}
          />

          <Button
            label="Usar cuenta demo"
            variant="ghost"
            icon={<Sparkles size={16} color={palette.blue600} />}
            onPress={() => {
              setEmail(DEMO_CREDENTIALS.email);
              setPassword(DEMO_CREDENTIALS.password);
              handleLogin(DEMO_CREDENTIALS);
            }}
            fullWidth
            style={{ marginTop: spacing.xs }}
          />

          <View style={styles.footer}>
            <AppText variant="body">¿Nuevo en tu equipo?</AppText>
            <Link href="/(auth)/register" asChild>
              <AppText variant="bodySemibold" color={palette.blue600}>
                {' '}Crear cuenta
              </AppText>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  hero: {
    height: '38%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoWrap: {
    backgroundColor: palette.white,
    borderRadius: 28,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tagline: {
    paddingHorizontal: spacing.xl,
    textAlign: 'center',
  },
  formWrap: {
    flex: 1,
  },
  card: {
    flex: 1,
    marginTop: -28,
    backgroundColor: palette.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});
