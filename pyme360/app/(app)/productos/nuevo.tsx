import { useRouter } from 'expo-router';
import React from 'react';
import { ProductForm } from '@/components/domain/ProductForm';
import { ScreenContainer, ScreenHeader } from '@/components/ui';
import { useProductStore } from '@/stores/useProductStore';

export default function NuevoProductoScreen() {
  const router = useRouter();
  const addProduct = useProductStore((s) => s.addProduct);

  return (
    <ScreenContainer>
      <ScreenHeader title="Nuevo producto" />
      <ProductForm
        submitLabel="Guardar producto"
        onSubmit={(values) => {
          addProduct({ ...values, active: true });
          router.back();
        }}
      />
    </ScreenContainer>
  );
}
