import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

function escapeCsvValue(value: string | number): string {
  const str = String(value);
  if (/[",\n;]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers.map(escapeCsvValue).join(','), ...rows.map((r) => r.map(escapeCsvValue).join(','))];
  return lines.join('\n');
}

export async function shareCsv(csv: string, filename: string) {
  const uri = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(uri, csv, { encoding: FileSystem.EncodingType.UTF8 });
  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(uri, { mimeType: 'text/csv', dialogTitle: filename, UTI: 'public.comma-separated-values-text' });
  }
  return uri;
}
