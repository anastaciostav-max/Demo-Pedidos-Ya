import { useLocalSearchParams, useRouter } from 'expo-router';
import { History, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ProductForm } from '@/components/domain/ProductForm';
import { AppText, Button, IconButton, ScreenContainer, ScreenHeader } from '@/components/ui';
import { useProductStore } from '@/stores/useProductStore';
import { palette, spacing } from '@/theme';

export default function ProductoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = useProductStore((s) => s.products.find((p) => p.id === id));
  const updateProduct = useProductStore((s) => s.updateProduct);
  const removeProduct = useProductStore((s) => s.removeProduct);
  const [saved, setSaved] = useState(false);

  if (!product) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Producto" />
        <AppText variant="body">Este producto ya no existe.</AppText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title={product.name}
        subtitle={`Actualizado`}
        right={
          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            <IconButton onPress={() => router.push(`/inventario/${product.id}`)}>
              <History size={18} color={palette.navy700} />
            </IconButton>
            <IconButton
              onPress={() =>
                Alert.alert('Eliminar producto', `¿Eliminar "${product.name}" del catálogo?`, [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                      removeProduct(product.id);
                      router.back();
                    },
                  },
                ])
              }
            >
              <Trash2 size={18} color={palette.danger} />
            </IconButton>
          </View>
        }
      />
      <ProductForm
        submitLabel={saved ? 'Guardado ✓' : 'Guardar cambios'}
        initial={{
          name: product.name,
          barcode: product.barcode,
          sku: product.sku,
          categoryId: product.categoryId,
          brand: product.brand,
          purchasePrice: product.purchasePrice,
          salePrice: product.salePrice,
          stock: product.stock,
          minStock: product.minStock,
          unit: product.unit,
        }}
        onSubmit={(values) => {
          updateProduct(product.id, values);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        }}
      />
      <Button
        label="Ver kardex e historial"
        variant="outline"
        fullWidth
        onPress={() => router.push(`/inventario/${product.id}`)}
        style={{ marginTop: spacing.sm }}
      />
    </ScreenContainer>
  );
}
