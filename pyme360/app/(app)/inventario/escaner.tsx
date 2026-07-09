import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Package, ScanLine } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, ScreenContainer, ScreenHeader } from '@/components/ui';
import { useProductStore } from '@/stores/useProductStore';
import { palette, radius, spacing } from '@/theme';

export default function EscanerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const products = useProductStore((s) => s.products);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const match = lastCode ? products.find((p) => p.barcode === lastCode) : undefined;

  function handleScanned(code: string) {
    if (locked) return;
    setLocked(true);
    setLastCode(code);
    setTimeout(() => setLocked(false), 1200);
  }

  if (Platform.OS === 'web') {
    return (
      <ScreenContainer>
        <ScreenHeader title="Escáner de códigos" />
        <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
          <ScanLine size={32} color={palette.gray400} />
          <AppText variant="body" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
            El escáner de cámara está disponible en la app móvil (iOS / Android).
          </AppText>
        </Card>
      </ScreenContainer>
    );
  }

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Escáner de códigos" />
        <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
          <ScanLine size={32} color={palette.gray400} />
          <AppText variant="body" style={{ marginTop: spacing.sm, marginBottom: spacing.md, textAlign: 'center' }}>
            Necesitamos acceso a tu cámara para escanear códigos de barras.
          </AppText>
          <Button label="Permitir cámara" onPress={requestPermission} />
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Escáner de códigos" />
      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'] }}
          onBarcodeScanned={(result) => handleScanned(result.data)}
        />
        <View style={styles.frame} />
      </View>

      {lastCode && (
        <Card style={{ margin: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View style={styles.thumb}>
              <Package size={20} color={palette.gray400} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="caption">Código: {lastCode}</AppText>
              <AppText variant="bodySemibold">{match ? match.name : 'Producto no encontrado'}</AppText>
            </View>
          </View>
          {match && (
            <Button
              label="Ver producto"
              size="sm"
              style={{ marginTop: spacing.md }}
              onPress={() => router.replace(`/productos/${match.id}`)}
            />
          )}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.navy900,
  },
  cameraWrap: {
    flex: 1,
    margin: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  frame: {
    position: 'absolute',
    top: '35%',
    left: '15%',
    right: '15%',
    height: '18%',
    borderWidth: 2,
    borderColor: palette.teal400,
    borderRadius: radius.md,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
