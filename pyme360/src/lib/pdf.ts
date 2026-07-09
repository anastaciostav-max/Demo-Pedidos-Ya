import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { formatCurrency, formatDateTime } from '@/lib/format';
import type { Business, Sale } from '@/types/models';

export function buildSaleReceiptHtml(sale: Sale, business: Business | null): string {
  const currency = business?.currency ?? 'USD';
  const rows = sale.items
    .map(
      (it) => `
      <tr>
        <td>${it.productName}</td>
        <td style="text-align:center">${it.quantity}</td>
        <td style="text-align:right">${formatCurrency(it.unitPrice, currency)}</td>
        <td style="text-align:right">${formatCurrency(it.unitPrice * it.quantity - it.discount, currency)}</td>
      </tr>`,
    )
    .join('');

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 32px; color: #0B1B3F; }
        .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #0B7CF6; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 22px; font-weight: 800; color: #0B7CF6; }
        .muted { color: #636F85; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { text-align:left; font-size: 12px; text-transform: uppercase; color: #8A96AC; border-bottom: 1px solid #E4EAF2; padding: 8px 4px; }
        td { padding: 10px 4px; border-bottom: 1px solid #F6F9FC; font-size: 14px; }
        .totals { margin-top: 20px; width: 260px; margin-left: auto; }
        .totals div { display:flex; justify-content:space-between; padding: 4px 0; font-size: 14px; }
        .totals .grand { font-size: 18px; font-weight: 800; color: #0B7CF6; border-top: 1px solid #E4EAF2; margin-top: 8px; padding-top: 8px; }
        .footer { margin-top: 40px; text-align:center; color:#8A96AC; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Pyme360</div>
          <div class="muted">${business?.name ?? ''}</div>
          <div class="muted">${business?.address ?? ''}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700;font-size:16px">Folio ${sale.folio}</div>
          <div class="muted">${formatDateTime(sale.createdAt)}</div>
        </div>
      </div>

      <div class="muted">Cliente</div>
      <div style="font-weight:700;font-size:15px">${sale.clientName}</div>

      <table>
        <thead>
          <tr><th>Producto</th><th style="text-align:center">Cant.</th><th style="text-align:right">Precio</th><th style="text-align:right">Importe</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="totals">
        <div><span>Subtotal</span><span>${formatCurrency(sale.subtotal, currency)}</span></div>
        <div><span>Descuento</span><span>-${formatCurrency(sale.discount, currency)}</span></div>
        <div><span>IVA</span><span>${formatCurrency(sale.iva, currency)}</span></div>
        <div class="grand"><span>Total</span><span>${formatCurrency(sale.total, currency)}</span></div>
      </div>

      <div class="footer">Gracias por tu compra · Generado con Pyme360</div>
    </body>
  </html>`;
}

export function buildReportHtml(params: {
  title: string;
  subtitle: string;
  business: Business | null;
  stats: { label: string; value: string }[];
  tableTitle: string;
  headers: string[];
  rows: (string | number)[][];
}): string {
  const { title, subtitle, business, stats, tableTitle, headers, rows } = params;
  const statCards = stats
    .map(
      (s) => `
      <div class="stat">
        <div class="stat-label">${s.label}</div>
        <div class="stat-value">${s.value}</div>
      </div>`,
    )
    .join('');

  const headerRow = headers.map((h) => `<th>${h}</th>`).join('');
  const bodyRows = rows
    .map((r) => `<tr>${r.map((c, i) => `<td style="${i === 0 ? '' : 'text-align:right'}">${c}</td>`).join('')}</tr>`)
    .join('');

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 32px; color: #0B1B3F; }
        .header { border-bottom: 2px solid #0B7CF6; padding-bottom: 16px; margin-bottom: 20px; }
        .brand { font-size: 22px; font-weight: 800; color: #0B7CF6; }
        .muted { color: #636F85; font-size: 12px; }
        h1 { font-size: 20px; margin: 12px 0 2px; }
        .stats { display:flex; flex-wrap:wrap; gap: 12px; margin: 20px 0; }
        .stat { background:#F6F9FC; border-radius: 12px; padding: 12px 16px; min-width: 140px; }
        .stat-label { font-size: 11px; color:#8A96AC; text-transform:uppercase; }
        .stat-value { font-size: 18px; font-weight: 800; color:#0B7CF6; margin-top:4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { text-align:left; font-size: 12px; text-transform: uppercase; color: #8A96AC; border-bottom: 1px solid #E4EAF2; padding: 8px 4px; }
        td { padding: 8px 4px; border-bottom: 1px solid #F6F9FC; font-size: 13px; }
        .footer { margin-top: 32px; text-align:center; color:#8A96AC; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">Pyme360</div>
        <div class="muted">${business?.name ?? ''}</div>
      </div>
      <h1>${title}</h1>
      <div class="muted">${subtitle}</div>

      <div class="stats">${statCards}</div>

      <h1>${tableTitle}</h1>
      <table>
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>

      <div class="footer">Generado con Pyme360 · Tu negocio, 360° bajo control</div>
    </body>
  </html>`;
}

export async function shareHtmlAsPdf(html: string, dialogTitle: string) {
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle, UTI: 'com.adobe.pdf' });
  }
  return uri;
}
