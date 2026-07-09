import { Tabs } from 'expo-router';
import { Boxes, ClipboardList, Grid2x2, House, Receipt } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { palette, typography } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.blue600,
        tabBarInactiveTintColor: palette.gray400,
        tabBarLabelStyle: { fontFamily: typography.fontFamily.semibold, fontSize: 11 },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingTop: 8,
          borderTopColor: palette.gray100,
          backgroundColor: palette.white,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Inicio', tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="ventas/index"
        options={{ title: 'Ventas', tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="pedidos/index"
        options={{ title: 'Pedidos', tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="inventario/index"
        options={{ title: 'Inventario', tabBarIcon: ({ color, size }) => <Boxes color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="mas"
        options={{ title: 'Más', tabBarIcon: ({ color, size }) => <Grid2x2 color={color} size={size} /> }}
      />
    </Tabs>
  );
}
