import React, { useState } from 'react';
import { View } from 'react-native';
import { AppText, Button, Input } from '@/components/ui';
import { palette, spacing } from '@/theme';
import type { Supplier } from '@/types/models';

export interface SupplierFormInitial {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

interface SupplierFormProps {
  initial?: SupplierFormInitial;
  onSubmit: (values: Omit<Supplier, 'id' | 'createdAt'>) => void;
  submitLabel: string;
}

export function SupplierForm({ initial, onSubmit, submitLabel }: SupplierFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [contactName, setContactName] = useState(initial?.contactName ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState<string | undefined>();

  function handleSubmit() {
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError('Ingresa un correo electrónico válido.');
    }
    setError(undefined);
    onSubmit({
      name: name.trim(),
      contactName: contactName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <View>
      <Input label="Nombre del proveedor" placeholder="Ej. Distribuidora Central" value={name} onChangeText={setName} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Persona de contacto" placeholder="Ej. Luis Vega" value={contactName} onChangeText={setContactName} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Teléfono" keyboardType="phone-pad" value={phone} onChangeText={setPhone} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Correo electrónico" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Dirección" value={address} onChangeText={setAddress} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Notas" multiline numberOfLines={3} value={notes} onChangeText={setNotes} containerStyle={{ marginBottom: spacing.sm }} />

      {error && (
        <AppText variant="caption" color={palette.danger}>
          {error}
        </AppText>
      )}

      <Button label={submitLabel} onPress={handleSubmit} fullWidth style={{ marginTop: spacing.md }} />
    </View>
  );
}
