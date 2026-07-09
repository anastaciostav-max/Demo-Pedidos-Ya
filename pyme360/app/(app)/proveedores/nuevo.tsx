import { useRouter } from 'expo-router';
import React from 'react';
import { SupplierForm } from '@/components/domain/SupplierForm';
import { ScreenContainer, ScreenHeader } from '@/components/ui';
import { useSupplierStore } from '@/stores/useSupplierStore';

export default function NuevoProveedorScreen() {
  const router = useRouter();
  const addSupplier = useSupplierStore((s) => s.addSupplier);

  return (
    <ScreenContainer>
      <ScreenHeader title="Nuevo proveedor" />
      <SupplierForm
        submitLabel="Guardar proveedor"
        onSubmit={(values) => {
          addSupplier(values);
          router.back();
        }}
      />
    </ScreenContainer>
  );
}
