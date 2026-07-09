import { Barcode, Package, Plus, Tag } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Input } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useProductStore } from '@/stores/useProductStore';
import { useBusinessStore } from '@/stores/useBusinessStore';
import { palette, radius, spacing } from '@/theme';
import type { Product } from '@/types/models';

export interface ProductFormInitial {
  name?: string;
  barcode?: string;
  sku?: string;
  categoryId?: string;
  brand?: string;
  purchasePrice?: number;
  salePrice?: number;
  stock?: number;
  minStock?: number;
  unit?: string;
}

interface ProductFormProps {
  initial?: ProductFormInitial;
  onSubmit: (values: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'photoUri'>) => void;
  submitLabel: string;
}

export function ProductForm({ initial, onSubmit, submitLabel }: ProductFormProps) {
  const categories = useProductStore((s) => s.categories);
  const addCategory = useProductStore((s) => s.addCategory);
  const business = useBusinessStore((s) => s.business);

  const [name, setName] = useState(initial?.name ?? '');
  const [barcode, setBarcode] = useState(initial?.barcode ?? '');
  const [sku, setSku] = useState(initial?.sku ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '');
  const [brand, setBrand] = useState(initial?.brand ?? '');
  const [purchasePrice, setPurchasePrice] = useState(initial?.purchasePrice !== undefined ? String(initial.purchasePrice) : '');
  const [salePrice, setSalePrice] = useState(initial?.salePrice !== undefined ? String(initial.salePrice) : '');
  const [stock, setStock] = useState(initial?.stock !== undefined ? String(initial.stock) : '0');
  const [minStock, setMinStock] = useState(initial?.minStock !== undefined ? String(initial.minStock) : '5');
  const [unit, setUnit] = useState(initial?.unit ?? 'pza');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const margin = useMemo(() => {
    const pp = parseFloat(purchasePrice) || 0;
    const sp = parseFloat(salePrice) || 0;
    if (sp <= 0) return 0;
    return ((sp - pp) / sp) * 100;
  }, [purchasePrice, salePrice]);

  function handleSubmit() {
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (!categoryId) return setError('Selecciona una categoría.');
    const sp = parseFloat(salePrice);
    if (!sp || sp <= 0) return setError('Ingresa un precio de venta válido.');
    const pp = parseFloat(purchasePrice);
    if (purchasePrice.trim() && (Number.isNaN(pp) || pp < 0)) {
      return setError('El precio de compra no puede ser negativo.');
    }
    const stockValue = parseInt(stock, 10);
    if (stock.trim() && (Number.isNaN(stockValue) || stockValue < 0)) {
      return setError('El stock no puede ser negativo.');
    }
    const minStockValue = parseInt(minStock, 10);
    if (minStock.trim() && (Number.isNaN(minStockValue) || minStockValue < 0)) {
      return setError('El stock mínimo no puede ser negativo.');
    }
    setError(undefined);
    onSubmit({
      name: name.trim(),
      barcode: barcode.trim() || `AUTO-${Date.now()}`,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      categoryId,
      brand: brand.trim(),
      purchasePrice: Math.max(0, pp || 0),
      salePrice: sp,
      stock: Math.max(0, stockValue || 0),
      minStock: Math.max(0, minStockValue || 0),
      unit: unit.trim() || 'pza',
    });
  }

  return (
    <View>
      <Card style={styles.photoCard}>
        <View style={styles.photoPlaceholder}>
          <Package size={28} color={palette.gray400} />
        </View>
        <AppText variant="caption" style={{ marginTop: spacing.xs }}>
          Foto del producto (próximamente)
        </AppText>
      </Card>

      <Input label="Nombre del producto" placeholder="Ej. Agua Mineral 600ml" value={name} onChangeText={setName} containerStyle={styles.field} />
      <Input label="Marca" placeholder="Ej. AquaPura" value={brand} onChangeText={setBrand} containerStyle={styles.field} />

      <AppText variant="captionMedium" style={styles.field}>
        Categoría
      </AppText>
      <View style={styles.chipsRow}>
        {categories.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCategoryId(c.id)}
            style={[styles.chip, categoryId === c.id && styles.chipActive]}
          >
            <AppText variant="captionMedium" color={categoryId === c.id ? palette.white : palette.gray600}>
              {c.name}
            </AppText>
          </Pressable>
        ))}
        <Pressable style={styles.chipAdd} onPress={() => setShowNewCategory((v) => !v)}>
          <Plus size={14} color={palette.blue600} />
        </Pressable>
      </View>
      {showNewCategory && (
        <View style={styles.newCategoryRow}>
          <Input
            placeholder="Nueva categoría"
            value={newCategory}
            onChangeText={setNewCategory}
            containerStyle={{ flex: 1 }}
          />
          <Button
            label="Agregar"
            size="sm"
            onPress={() => {
              if (!newCategory.trim()) return;
              const cat = addCategory(newCategory.trim());
              setCategoryId(cat.id);
              setNewCategory('');
              setShowNewCategory(false);
            }}
          />
        </View>
      )}

      <View style={styles.field} />
      <View style={styles.row2}>
        <Input
          label="Código de barras"
          placeholder="750..."
          value={barcode}
          onChangeText={setBarcode}
          leftIcon={<Barcode size={16} color={palette.gray400} />}
          containerStyle={{ flex: 1 }}
        />
        <Input
          label="SKU"
          placeholder="SKU-001"
          value={sku}
          onChangeText={setSku}
          leftIcon={<Tag size={16} color={palette.gray400} />}
          containerStyle={{ flex: 1 }}
        />
      </View>

      <View style={[styles.row2, styles.field]}>
        <Input
          label={`Precio compra (${business?.currency ?? 'USD'})`}
          keyboardType="decimal-pad"
          value={String(purchasePrice)}
          onChangeText={setPurchasePrice}
          containerStyle={{ flex: 1 }}
        />
        <Input
          label={`Precio venta (${business?.currency ?? 'USD'})`}
          keyboardType="decimal-pad"
          value={String(salePrice)}
          onChangeText={setSalePrice}
          containerStyle={{ flex: 1 }}
        />
      </View>

      <Card style={[styles.marginCard, styles.field]}>
        <AppText variant="caption">Margen estimado</AppText>
        <AppText variant="headline" color={margin >= 0 ? palette.success : palette.danger}>
          {margin.toFixed(1)}%
        </AppText>
        <AppText variant="caption">
          Ganancia por unidad: {formatCurrency((parseFloat(salePrice) || 0) - (parseFloat(purchasePrice) || 0), business?.currency)}
        </AppText>
      </Card>

      <View style={[styles.row2, styles.field]}>
        <Input label="Stock actual" keyboardType="number-pad" value={String(stock)} onChangeText={setStock} containerStyle={{ flex: 1 }} />
        <Input label="Stock mínimo" keyboardType="number-pad" value={String(minStock)} onChangeText={setMinStock} containerStyle={{ flex: 1 }} />
      </View>
      <Input label="Unidad de medida" placeholder="pza, kg, caja..." value={unit} onChangeText={setUnit} containerStyle={styles.field} />

      {error && (
        <AppText variant="caption" color={palette.danger} style={{ marginTop: spacing.sm }}>
          {error}
        </AppText>
      )}

      <Button label={submitLabel} onPress={handleSubmit} fullWidth style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  photoCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: palette.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    marginTop: spacing.sm,
  },
  row2: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: palette.gray50,
    borderWidth: 1,
    borderColor: palette.gray100,
  },
  chipActive: {
    backgroundColor: palette.blue600,
    borderColor: palette.blue600,
  },
  chipAdd: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: palette.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCategoryRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  marginCard: {
    backgroundColor: palette.gray50,
  },
});
