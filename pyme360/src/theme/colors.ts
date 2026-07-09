/**
 * Paleta extraída del logo oficial de Pyme360 (assets/logo.png).
 * navy = arcos oscuros / texto "Pyme", blue = azul principal del maletín,
 * celeste = tono claro del anillo, teal = acento del gráfico ascendente.
 */
export const palette = {
  navy900: '#0B1B3F',
  navy700: '#14295A',
  blue700: '#0A57D6',
  blue600: '#0B7CF6',
  blue500: '#2E96F8',
  celeste400: '#4FC0FA',
  celeste300: '#7ED2FB',
  teal500: '#00D6B4',
  teal400: '#3EE3C6',

  white: '#FFFFFF',
  gray50: '#F6F9FC',
  gray100: '#EEF3F9',
  gray200: '#E4EAF2',
  gray300: '#D3DCE8',
  gray400: '#AEBBCF',
  gray500: '#8A96AC',
  gray600: '#636F85',
  gray700: '#414C61',
  gray800: '#232C3D',

  success: '#1FB877',
  successBg: '#E6F9F0',
  warning: '#F5A623',
  warningBg: '#FEF3E0',
  danger: '#E5484D',
  dangerBg: '#FDEBEC',
  info: '#0B7CF6',
  infoBg: '#E8F3FE',
} as const;

export const gradients = {
  brand: [palette.blue700, palette.blue600, palette.teal500] as const,
  brandSoft: [palette.celeste300, palette.celeste400] as const,
  hero: [palette.navy900, palette.blue700] as const,
};

export const statusColors: Record<string, { fg: string; bg: string }> = {
  pendiente: { fg: '#B4720B', bg: '#FEF3E0' },
  preparando: { fg: '#0B7CF6', bg: '#E8F3FE' },
  enviado: { fg: '#6D4FE0', bg: '#EFEBFD' },
  entregado: { fg: '#1FB877', bg: '#E6F9F0' },
  cancelado: { fg: '#E5484D', bg: '#FDEBEC' },
};
