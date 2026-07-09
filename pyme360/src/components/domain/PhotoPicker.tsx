import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import { AppText, ListRow, Sheet } from '@/components/ui';
import { notify } from '@/lib/confirm';
import { palette, radius, spacing } from '@/theme';

const MAX_DIMENSION = 640;

interface PhotoPickerProps {
  uri?: string;
  onChange: (uri: string | undefined) => void;
  size?: number;
}

/** Downscales and compresses the picked image into a JPEG data URI so it stores cheaply in local storage. */
async function processImage(sourceUri: string): Promise<string> {
  const result = await manipulateAsync(
    sourceUri,
    [{ resize: { width: MAX_DIMENSION } }],
    { compress: 0.7, format: SaveFormat.JPEG, base64: true },
  );
  return result.base64 ? `data:image/jpeg;base64,${result.base64}` : result.uri;
}

export function PhotoPicker({ uri, onChange, size = 84 }: PhotoPickerProps) {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handlePicked(sourceUri: string) {
    setVisible(false);
    setBusy(true);
    try {
      onChange(await processImage(sourceUri));
    } catch {
      notify('No se pudo procesar la imagen', 'Intenta con otra foto.');
    } finally {
      setBusy(false);
    }
  }

  async function pickFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setVisible(false);
      notify('Permiso necesario', 'Activa el acceso a tus fotos para elegir una imagen.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) await handlePicked(result.assets[0].uri);
    else setVisible(false);
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setVisible(false);
      notify('Permiso necesario', 'Activa el acceso a la cámara para tomar una foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) await handlePicked(result.assets[0].uri);
    else setVisible(false);
  }

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.wrap}>
        <View style={[styles.thumb, { width: size, height: size, borderRadius: radius.lg }]}>
          {busy ? (
            <ActivityIndicator color={palette.blue600} />
          ) : uri ? (
            <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius.lg }} />
          ) : (
            <ImagePlus size={size * 0.32} color={palette.gray400} />
          )}
        </View>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          {uri ? 'Cambiar foto' : 'Agregar foto del producto'}
        </AppText>
      </Pressable>

      <Sheet visible={visible} onClose={() => setVisible(false)} title="Foto del producto">
        <ListRow
          left={<Camera size={20} color={palette.blue600} />}
          title="Tomar foto"
          onPress={takePhoto}
          showChevron
        />
        <ListRow
          left={<ImagePlus size={20} color={palette.blue600} />}
          title="Elegir de galería"
          onPress={pickFromLibrary}
          showChevron
          last={!uri}
        />
        {uri && (
          <ListRow
            left={<Trash2 size={20} color={palette.danger} />}
            title="Quitar foto"
            onPress={() => {
              onChange(undefined);
              setVisible(false);
            }}
            last
          />
        )}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  thumb: {
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
