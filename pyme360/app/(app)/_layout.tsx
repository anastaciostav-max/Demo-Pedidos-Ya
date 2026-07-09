import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="productos/index" />
      <Stack.Screen name="productos/nuevo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="productos/[id]" />
      <Stack.Screen name="clientes/index" />
      <Stack.Screen name="clientes/nuevo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="clientes/[id]" />
      <Stack.Screen name="proveedores/index" />
      <Stack.Screen name="proveedores/nuevo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="proveedores/[id]" />
      <Stack.Screen name="compras/index" />
      <Stack.Screen name="compras/nueva" options={{ presentation: 'modal' }} />
      <Stack.Screen name="reportes/index" />
      <Stack.Screen name="asistente/index" />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="configuracion" />
      <Stack.Screen name="ventas/nueva" options={{ presentation: 'modal' }} />
      <Stack.Screen name="ventas/[id]" />
      <Stack.Screen name="pedidos/nuevo" options={{ presentation: 'modal' }} />
      <Stack.Screen name="pedidos/[id]" />
      <Stack.Screen name="inventario/entrada" options={{ presentation: 'modal' }} />
      <Stack.Screen name="inventario/salida" options={{ presentation: 'modal' }} />
      <Stack.Screen name="inventario/ajuste" options={{ presentation: 'modal' }} />
      <Stack.Screen name="inventario/escaner" options={{ presentation: 'modal' }} />
      <Stack.Screen name="inventario/[productId]" />
    </Stack>
  );
}
