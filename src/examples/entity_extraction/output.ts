import { Invoice } from './model';

export function outputInvoice(invoice: Invoice): void {
  const useColor = Boolean(process.stdout.isTTY);
  const reset = useColor ? '\x1b[0m' : '';
  const accent = useColor ? '\x1b[36m' : '';
  const heading = useColor ? '\x1b[1;36m' : '';
  const valueColor = useColor ? '\x1b[32m' : '';
  const uncertainColor = useColor ? '\x1b[33m' : '';
  const missingColor = useColor ? '\x1b[90m' : '';
  const fields: Array<[string, string | null]> = [
    ['Invoice number', invoice.invoice_number],
    ['Order number', invoice.order_number],
    ['Total due', invoice.total_due],
    ['Billing email', invoice.billing_email],
  ];
  const labelWidth = Math.max(...fields.map(([label]) => label.length));
  const valueWidth = Math.max(...fields.map(([, value]) => (value ?? 'Not identified').length));
  const border = `+-${'-'.repeat(labelWidth)}-+-${'-'.repeat(valueWidth)}-+`;

  console.log(`\n${heading}INVOICE${reset} ${invoice.invoice_number ?? ''}`);
  console.log(`${accent}${border}${reset}`);
  for (const [label, fieldValue] of fields) {
    const value = fieldValue ?? 'Not identified';
    const color = fieldValue === null
      ? missingColor
      : fieldValue === 'inconfident'
        ? uncertainColor
        : valueColor;
    console.log(`| ${label.padEnd(labelWidth)} | ${color}${value.padEnd(valueWidth)}${reset} |`);
  }
  console.log(`${accent}${border}${reset}`);
}