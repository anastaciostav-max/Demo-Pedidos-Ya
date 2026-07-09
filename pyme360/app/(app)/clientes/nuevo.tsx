import { useRouter } from 'expo-router';
import React from 'react';
import { ClientForm } from '@/components/domain/ClientForm';
import { ScreenContainer, ScreenHeader } from '@/components/ui';
import { useClientStore } from '@/stores/useClientStore';

export default function NuevoClienteScreen() {
  const router = useRouter();
  const addClient = useClientStore((s) => s.addClient);

  return (
    <ScreenContainer>
      <ScreenHeader title="Nuevo cliente" />
      <ClientForm
        submitLabel="Guardar cliente"
        onSubmit={(values) => {
          addClient(values);
          router.back();
        }}
      />
    </ScreenContainer>
  );
}
