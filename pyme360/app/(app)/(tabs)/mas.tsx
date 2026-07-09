import { useRouter } from 'expo-router';
import {
  Bot,
  Boxes,
  FileChartColumn,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Truck,
  User,
  Users,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Avatar, Card, ScreenContainer } from '@/components/ui';
import { confirmAction } from '@/lib/confirm';
import { useAuthStore } from '@/stores/useAuthStore';
import { palette, radius, spacing } from '@/theme';

const MENU = [
  { href: '/productos', label: 'Productos', icon: Package, color: palette.blue600, bg: palette.infoBg },
  { href: '/inventario', label: 'Inventario', icon: Boxes, color: palette.teal500, bg: palette.successBg },
  { href: '/clientes', label: 'Clientes', icon: Users, color: palette.blue600, bg: palette.infoBg },
  { href: '/proveedores', label: 'Proveedores', icon: Truck, color: palette.navy700, bg: palette.gray100 },
  { href: '/compras', label: 'Compras', icon: ShoppingBag, color: palette.warning, bg: palette.warningBg },
  { href: '/reportes', label: 'Reportes', icon: FileChartColumn, color: palette.blue600, bg: palette.infoBg },
  { href: '/asistente', label: 'Asistente IA', icon: Bot, color: palette.teal500, bg: palette.successBg },
  { href: '/configuracion', label: 'Configuración', icon: Settings, color: palette.gray600, bg: palette.gray100 },
] as const;

export default function MasScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser());
  const logout = useAuthStore((s) => s.logout);

  return (
    <ScreenContainer contentStyle={{ paddingTop: spacing.md }}>
      <AppText variant="title" style={{ marginBottom: spacing.lg }}>
        Más
      </AppText>

      <Pressable onPress={() => router.push('/perfil')}>
        <Card style={styles.profileCard}>
          <Avatar name={currentUser?.name ?? 'Usuario'} size={52} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <AppText variant="bodySemibold">{currentUser?.name}</AppText>
            <AppText variant="caption">{currentUser?.email}</AppText>
          </View>
          <User size={18} color={palette.gray400} />
        </Card>
      </Pressable>

      <View style={styles.grid}>
        {MENU.map((item) => (
          <Pressable key={item.href} style={styles.tile} onPress={() => router.push(item.href as any)}>
            <Card style={styles.tileCard}>
              <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
                <item.icon size={22} color={item.color} />
              </View>
              <AppText variant="bodySemibold" style={{ marginTop: spacing.sm }}>
                {item.label}
              </AppText>
            </Card>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() =>
          confirmAction('Cerrar sesión', '¿Seguro que deseas salir?', 'Cerrar sesión', logout, {
            destructive: true,
          })
        }
        style={styles.logout}
      >
        <LogOut size={18} color={palette.danger} />
        <AppText variant="bodySemibold" color={palette.danger} style={{ marginLeft: spacing.xs }}>
          Cerrar sesión
        </AppText>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    width: '47%',
  },
  tileCard: {
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
  },
});
