import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Input, Logo } from '@/components/ui';
import { DEMO_CREDENTIALS } from '@/lib/bootstrap';
import { notify } from '@/lib/confirm';
import { useAuthStore } from '@/stores/useAuthStore';
import { gradients, palette, radius, shadow, spacing } from '@/theme';

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandBlock}>
          <Logo size={168} />
          <AppText variant="headline" style={styles.tagline}>
            Tu negocio, 360° bajo control
          </AppText>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={gradients.brand} style={styles.iconBadge}>
              <ShieldCheck size={20} color={palette.white} />
            </LinearGradient>
            <View style={styles.cardHeaderText}>
              <AppText variant="headline">Iniciar sesión</AppText>
              <AppText variant="caption">Ingresa tus credenciales para continuar</AppText>
            </View>
          </View>

          <View style={styles.divider} />

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
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={18} color={palette.gray400} />}
            rightIcon={
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                {showPassword ? (
                  <EyeOff size={18} color={palette.gray400} />
                ) : (
                  <Eye size={18} color={palette.gray400} />
                )}
              </Pressable>
            }
          />

          <Pressable
            onPress={() => notify('Recuperar contraseña', 'Esta es una demo local sin servidor: pedile a tu administrador que revise tu cuenta o creá una nueva.')}
            hitSlop={8}
            style={styles.forgotWrap}
          >
            <AppText variant="captionMedium" color={palette.blue600}>
              ¿Olvidaste tu contraseña?
            </AppText>
          </Pressable>

          {error && (
            <AppText variant="caption" color={palette.danger} style={{ marginBottom: spacing.xs }}>
              {error}
            </AppText>
          )}

          <Button
            label="Iniciar sesión"
            onPress={() => handleLogin()}
            loading={loading}
            fullWidth
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

        <AppText variant="caption" style={styles.copyright}>
          © {new Date().getFullYear()} Pyme360 — Todos los derechos reservados
        </AppText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.gray50,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  tagline: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadow.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: palette.gray100,
    marginVertical: spacing.lg,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
    marginTop: -spacing.xxs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  copyright: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
