import { Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { AppText, Button, Input, Logo, ScreenHeader } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { palette, spacing } from '@/theme';

export default function RegisterScreen() {
  const register = useAuthStore((s) => s.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      setError('Completa todos los campos.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError(undefined);
    setLoading(true);
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Crear cuenta" showBack />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.logoWrap}>
            <Logo size={64} />
          </View>
          <AppText variant="body" style={{ marginBottom: spacing.lg, textAlign: 'center' }}>
            Agrega un nuevo usuario al equipo de tu negocio en Pyme360.
          </AppText>

          <Input
            label="Nombre completo"
            placeholder="Ej. Ana Gómez"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={18} color={palette.gray400} />}
            containerStyle={{ marginBottom: spacing.sm }}
          />
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
            placeholder="Mínimo 6 caracteres"
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

          <Button label="Crear cuenta" onPress={handleRegister} loading={loading} fullWidth style={{ marginTop: spacing.lg }} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.white },
  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  logoWrap: { alignItems: 'center', marginBottom: spacing.md },
});
