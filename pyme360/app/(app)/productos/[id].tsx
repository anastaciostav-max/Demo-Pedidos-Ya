import { useLocalSearchParams, useRouter } from 'expo-router';
import { History, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ProductForm } from '@/components/domain/ProductForm';
import { AppText, Button, IconButton, ScreenContainer, ScreenHeader } from '@/components/ui';
import { confirmAction } from '@/lib/confirm';
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
                confirmAction(
                  'Eliminar producto',
                  `¿Eliminar "${product.name}" del catálogo?`,
                  'Eliminar',
                  () => {
                    removeProduct(product.id);
                    router.back();
                  },
                  { destructive: true },
                )
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
          photoUri: product.photoUri,
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
