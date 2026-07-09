import React, { useState } from 'react';
import { View } from 'react-native';
import { AppText, Button, Input } from '@/components/ui';
import { palette, spacing } from '@/theme';
import type { Client } from '@/types/models';

export interface ClientFormInitial {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  creditLimit?: number;
}

interface ClientFormProps {
  initial?: ClientFormInitial;
  onSubmit: (values: Omit<Client, 'id' | 'createdAt'>) => void;
  submitLabel: string;
}

export function ClientForm({ initial, onSubmit, submitLabel }: ClientFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [taxId, setTaxId] = useState(initial?.taxId ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [creditLimit, setCreditLimit] = useState(initial?.creditLimit !== undefined ? String(initial.creditLimit) : '0');
  const [error, setError] = useState<string | undefined>();

  function handleSubmit() {
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError('Ingresa un correo electrónico válido.');
    }
    const credit = parseFloat(creditLimit);
    if (creditLimit.trim() && (Number.isNaN(credit) || credit < 0)) {
      return setError('El límite de crédito no puede ser negativo.');
    }
    setError(undefined);
    onSubmit({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      taxId: taxId.trim() || undefined,
      notes: notes.trim() || undefined,
      creditLimit: Math.max(0, credit || 0),
    });
  }

  return (
    <View>
      <Input label="Nombre completo" placeholder="Ej. Mariana López" value={name} onChangeText={setName} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Teléfono" placeholder="55 1234 5678" keyboardType="phone-pad" value={phone} onChangeText={setPhone} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Correo electrónico" placeholder="cliente@correo.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Dirección" placeholder="Calle, número, ciudad" value={address} onChangeText={setAddress} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="RFC / Identificación fiscal" placeholder="Opcional" value={taxId} onChangeText={setTaxId} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Límite de crédito" keyboardType="decimal-pad" value={creditLimit} onChangeText={setCreditLimit} containerStyle={{ marginBottom: spacing.sm }} />
      <Input label="Notas" placeholder="Preferencias, recordatorios..." value={notes} onChangeText={setNotes} multiline numberOfLines={3} containerStyle={{ marginBottom: spacing.sm }} />

      {error && (
        <AppText variant="caption" color={palette.danger}>
          {error}
        </AppText>
      )}

      <Button label={submitLabel} onPress={handleSubmit} fullWidth style={{ marginTop: spacing.md }} />
    </View>
  );
}
