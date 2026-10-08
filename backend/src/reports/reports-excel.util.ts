import * as XLSX from 'xlsx-js-style';

// =============================================================================
// COLOR PALETTE & STYLES
// =============================================================================
const PALETTE = {
  navyDark: '0F172A',
  slateDark: '1E293B',
  slateMid: '334155',
  slateBorder: 'CBD5E1',
  cellBorder: 'E2E8F0',
  zebraTint: 'F8FAFC',
  white: 'FFFFFF',
  greenBg: 'DCFCE7',
  greenText: '15803D',
  redBg: 'FEE2E2',
  redText: 'B91C1C',
  amberBg: 'FEF3C7',
  amberText: 'B45309',
  skyBg: 'E0F2FE',
  skyText: '0369A1',
};

// Border presets
const THIN_BORDER = {
  top: { style: 'thin', color: { rgb: PALETTE.cellBorder } },
  bottom: { style: 'thin', color: { rgb: PALETTE.cellBorder } },
  left: { style: 'thin', color: { rgb: PALETTE.cellBorder } },
  right: { style: 'thin', color: { rgb: PALETTE.cellBorder } },
};

const HEADER_BORDER = {
  top: { style: 'thin', color: { rgb: PALETTE.slateMid } },
  bottom: { style: 'medium', color: { rgb: PALETTE.navyDark } },
  left: { style: 'thin', color: { rgb: PALETTE.slateMid } },
  right: { style: 'thin', color: { rgb: PALETTE.slateMid } },
};

// Cell Style Presets
export const STYLES = {
  titleBanner: {
    font: { name: 'Calibri', bold: true, sz: 14, color: { rgb: PALETTE.white } },
    fill: { fgColor: { rgb: PALETTE.navyDark } },
    alignment: { horizontal: 'center', vertical: 'center' },
  },
  subtitle: {
    font: { name: 'Calibri', italic: true, sz: 10, color: { rgb: '475569' } },
    fill: { fgColor: { rgb: 'F1F5F9' } },
    alignment: { horizontal: 'left', vertical: 'center' },
  },
  sectionHeader: {
    font: { name: 'Calibri', bold: true, sz: 11, color: { rgb: PALETTE.white } },
    fill: { fgColor: { rgb: PALETTE.slateDark } },
    alignment: { horizontal: 'left', vertical: 'center' },
  },
  headerCell: {
    font: { name: 'Calibri', bold: true, sz: 10, color: { rgb: PALETTE.white } },
    fill: { fgColor: { rgb: PALETTE.slateDark } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: HEADER_BORDER,
  },
  dataLeft: {
    font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: THIN_BORDER,
  },
  dataCenter: {
    font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: THIN_BORDER,
  },
  dataRight: {
    font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: THIN_BORDER,
  },
  dataRightBold: {
    font: { name: 'Calibri', bold: true, sz: 10, color: { rgb: '0F172A' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: THIN_BORDER,
  },
  statusSuccess: {
    font: { name: 'Calibri', bold: true, sz: 10, color: { rgb: PALETTE.greenText } },
    fill: { fgColor: { rgb: PALETTE.greenBg } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: THIN_BORDER,
  },
  statusWarning: {
    font: { name: 'Calibri', bold: true, sz: 10, color: { rgb: PALETTE.amberText } },
    fill: { fgColor: { rgb: PALETTE.amberBg } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: THIN_BORDER,
  },
  statusDanger: {
    font: { name: 'Calibri', bold: true, sz: 10, color: { rgb: PALETTE.redText } },
    fill: { fgColor: { rgb: PALETTE.redBg } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: THIN_BORDER,
  },
  totalRow: {
    font: { name: 'Calibri', bold: true, sz: 10, color: { rgb: '0F172A' } },
    fill: { fgColor: { rgb: 'E2E8F0' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '94A3B8' } },
      bottom: { style: 'double', color: { rgb: '0F172A' } },
    },
  },
};

// =============================================================================
// FORMATTING HELPERS
// =============================================================================

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toISOString().split('T')[0];
  } catch {
    return '—';
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toISOString().replace('T', ' ').slice(0, 19);
  } catch {
    return '—';
  }
}

export function formatDecimal(val: any, decimals: number = 4): number {
  if (val === null || val === undefined) return 0;
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num)) return 0;
  return Number(num.toFixed(decimals));
}

export function formatJsonForExcel(val: any): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'string') return val;
  try {
    const entries = Object.entries(val);
    if (entries.length <= 4) {
      return entries.map(([k, v]) => `${k}: ${v}`).join('; ');
    }
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

// =============================================================================
// STYLED WORKSHEET CREATOR
// =============================================================================

export function createStyledSheet(
  rows: Record<string, any>[],
  fallbackHeaders: string[],
  colWidths?: number[],
): XLSX.WorkSheet {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : fallbackHeaders;
  const aoaData: any[][] = [];

  // Row 0: Headers
  aoaData.push(headers);

  // Data rows
  if (rows.length === 0) {
    const emptyRow = headers.map(() => '—');
    aoaData.push(emptyRow);
  } else {
    for (const row of rows) {
      const rowValues = headers.map((h) => (row[h] !== undefined ? row[h] : '—'));
      aoaData.push(rowValues);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(aoaData);

  // Apply Cell Styles
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

  // Format Header Row (r = 0)
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = STYLES.headerCell;
  }

  // Format Data Rows (r = 1..end)
  for (let r = 1; r <= range.e.r; r++) {
    const isZebra = r % 2 === 0;

    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = ws[cellAddress];
      if (!cell) continue;

      const headerName = headers[c] || '';
      const isDate =
        headerName.includes('Date') ||
        headerName.includes('Timestamp') ||
        headerName.includes('Created At') ||
        headerName.includes('Updated');
      const isKg = headerName.includes('KG') || headerName.includes('Quantity');
      const isCount =
        headerName.includes('Bags') ||
        headerName.includes('Lots') ||
        headerName.includes('Transactions') ||
        headerName.includes('Number') && !headerName.includes('Transaction Number') && !headerName.includes('Lot Number');
      const isPercent = headerName.includes('%') || headerName.includes('Fulfillment');
      const isStatus = headerName.includes('Status') || headerName.includes('Action');

      let cellStyle: any = isDate
        ? { ...STYLES.dataCenter }
        : typeof cell.v === 'number'
        ? { ...STYLES.dataRight }
        : { ...STYLES.dataLeft };

      // Zebra background
      if (isZebra) {
        cellStyle = {
          ...cellStyle,
          fill: { fgColor: { rgb: PALETTE.zebraTint } },
        };
      }

      // Number formatting
      if (typeof cell.v === 'number') {
        if (isKg) {
          cell.z = '#,##0.0000';
        } else if (isPercent) {
          cell.z = '0.0%';
        } else if (isCount) {
          cell.z = '#,##0';
        } else {
          cell.z = '#,##0.00';
        }
      }

      // Status badges
      if (isStatus && typeof cell.v === 'string') {
        const valUpper = cell.v.toUpperCase();
        if (
          valUpper.includes('COMPLETED') ||
          valUpper.includes('MATCHED') ||
          valUpper.includes('ACTIVE') ||
          valUpper.includes('RECEIVED') ||
          valUpper.includes('PRODUCED') ||
          valUpper.includes('SUCCESS')
        ) {
          cellStyle = { ...STYLES.statusSuccess };
        } else if (
          valUpper.includes('PENDING') ||
          valUpper.includes('PLANNED') ||
          valUpper.includes('IN_PROGRESS') ||
          valUpper.includes('DRAFT') ||
          valUpper.includes('PARTIAL')
        ) {
          cellStyle = { ...STYLES.statusWarning };
        } else if (
          valUpper.includes('CANCEL') ||
          valUpper.includes('MISMATCH') ||
          valUpper.includes('RETIRED') ||
          valUpper.includes('FAILED')
        ) {
          cellStyle = { ...STYLES.statusDanger };
        }
      }

      cell.s = cellStyle;
    }
  }

  // Row heights (Header: 26pt, Data: 20pt)
  const rowHeights: any[] = [{ hpt: 26 }];
  for (let r = 1; r <= range.e.r; r++) {
    rowHeights.push({ hpt: 20 });
  }
  ws['!rows'] = rowHeights;

  // Set Freeze Pane on Header Row
  ws['!views'] = [
    {
      state: 'frozen',
      ySplit: 1,
      xSplit: 0,
      activeCell: 'A2',
    },
  ];

  // Auto-filter
  if (ws['!ref']) {
    ws['!autofilter'] = { ref: ws['!ref'] };
  }

  // Column Widths with auto-padding
  if (colWidths && colWidths.length > 0) {
    ws['!cols'] = colWidths.map((w) => ({ wch: Math.max(w, 12) }));
  } else {
    ws['!cols'] = headers.map((key) => ({
      wch: Math.max(key.length + 5, 14),
    }));
  }

  return ws;
}

// =============================================================================
// EXECUTIVE SUMMARY STYLER
// =============================================================================
export function styleExecutiveSummarySheet(ws: XLSX.WorkSheet, isMatched: boolean): XLSX.WorkSheet {
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
    { s: { r: 26, c: 0 }, e: { r: 26, c: 2 } },
  ];

  const rowHeights: any[] = [];
  rowHeights[0] = { hpt: 30 }; // Title banner
  rowHeights[1] = { hpt: 20 }; // Subtitle
  rowHeights[2] = { hpt: 12 }; // Blank
  rowHeights[3] = { hpt: 24 }; // Section 1 banner
  rowHeights[4] = { hpt: 24 }; // Table 1 header
  for (let r = 5; r <= 24; r++) rowHeights[r] = { hpt: 20 };
  rowHeights[25] = { hpt: 12 }; // Blank
  rowHeights[26] = { hpt: 24 }; // Section 2 banner
  rowHeights[27] = { hpt: 24 }; // Table 2 header
  for (let r = 28; r <= 37; r++) rowHeights[r] = { hpt: 21 };
  ws['!rows'] = rowHeights;

  if (ws['A1']) ws['A1'].s = STYLES.titleBanner;
  if (ws['A2']) ws['A2'].s = STYLES.subtitle;
  if (ws['A4']) ws['A4'].s = STYLES.sectionHeader;

  if (ws['A5']) ws['A5'].s = STYLES.headerCell;
  if (ws['B5']) ws['B5'].s = STYLES.headerCell;
  if (ws['C5']) ws['C5'].s = STYLES.headerCell;

  for (let r = 5; r <= 24; r++) {
    const isZebra = r % 2 === 0;
    const a = ws[XLSX.utils.encode_cell({ r, c: 0 })];
    const b = ws[XLSX.utils.encode_cell({ r, c: 1 })];
    const c = ws[XLSX.utils.encode_cell({ r, c: 2 })];

    if (a) {
      a.s = isZebra
        ? { ...STYLES.dataLeft, fill: { fgColor: { rgb: PALETTE.zebraTint } } }
        : STYLES.dataLeft;
    }
    if (b) {
      b.s = isZebra
        ? { ...STYLES.dataRightBold, fill: { fgColor: { rgb: PALETTE.zebraTint } } }
        : STYLES.dataRightBold;
      if (typeof b.v === 'number') {
        const metricName = a?.v ? String(a.v) : '';
        if (
          metricName.includes('Bags') ||
          metricName.includes('Lots') ||
          metricName.includes('Orders') ||
          metricName.includes('Parties') ||
          metricName.includes('Requirements')
        ) {
          b.z = '#,##0';
        } else {
          b.z = '#,##0.0000';
        }
      }
    }
    if (c) {
      c.s = isZebra
        ? { ...STYLES.dataLeft, fill: { fgColor: { rgb: PALETTE.zebraTint } } }
        : STYLES.dataLeft;
    }
  }

  if (ws['A27']) ws['A27'].s = STYLES.sectionHeader;
  if (ws['A28']) ws['A28'].s = STYLES.headerCell;
  if (ws['B28']) ws['B28'].s = STYLES.headerCell;
  if (ws['C28']) ws['C28'].s = STYLES.headerCell;

  for (let r = 28; r <= 33; r++) {
    const a = ws[XLSX.utils.encode_cell({ r, c: 0 })];
    const b = ws[XLSX.utils.encode_cell({ r, c: 1 })];
    const c = ws[XLSX.utils.encode_cell({ r, c: 2 })];
    if (a) a.s = STYLES.dataLeft;
    if (b) {
      b.s = STYLES.dataRightBold;
      b.z = '#,##0.0000';
    }
    if (c) c.s = STYLES.dataLeft;
  }

  const highlightStyle = {
    font: { name: 'Calibri', bold: true, sz: 10, color: { rgb: '14532D' } },
    fill: { fgColor: { rgb: 'DCFCE7' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: THIN_BORDER,
  };
  if (ws['A35']) ws['A35'].s = { ...highlightStyle, alignment: { horizontal: 'left', vertical: 'center' } };
  if (ws['B35']) {
    ws['B35'].s = highlightStyle;
    ws['B35'].z = '#,##0.0000';
  }
  if (ws['C35']) ws['C35'].s = { ...highlightStyle, alignment: { horizontal: 'left', vertical: 'center' } };

  if (ws['A36']) ws['A36'].s = { ...STYLES.dataLeft, font: { name: 'Calibri', bold: true, sz: 10 } };
  if (ws['B36']) {
    ws['B36'].s = STYLES.dataRightBold;
    ws['B36'].z = '#,##0.0000';
  }
  if (ws['C36']) ws['C36'].s = STYLES.dataLeft;

  if (ws['A37']) ws['A37'].s = { ...STYLES.dataLeft, font: { name: 'Calibri', bold: true, sz: 10 } };
  if (ws['B37']) {
    ws['B37'].s = STYLES.dataRightBold;
    ws['B37'].z = '#,##0.0000';
  }
  if (ws['C37']) ws['C37'].s = STYLES.dataLeft;

  const statStyle = isMatched ? STYLES.statusSuccess : STYLES.statusDanger;
  if (ws['A38']) ws['A38'].s = { ...statStyle, alignment: { horizontal: 'left', vertical: 'center' } };
  if (ws['B38']) ws['B38'].s = statStyle;
  if (ws['C38']) ws['C38'].s = { ...statStyle, alignment: { horizontal: 'left', vertical: 'center' } };

  ws['!cols'] = [{ wch: 42 }, { wch: 22 }, { wch: 50 }];

  return ws;
}

// =============================================================================
// WEEKLY SUMMARY STYLER
// =============================================================================
export function styleWeeklySummarySheet(ws: XLSX.WorkSheet): XLSX.WorkSheet {
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
  ];

  const rowHeights: any[] = [];
  rowHeights[0] = { hpt: 30 };
  rowHeights[1] = { hpt: 20 };
  rowHeights[2] = { hpt: 12 };
  rowHeights[3] = { hpt: 24 };
  rowHeights[4] = { hpt: 24 };
  for (let r = 5; r <= 15; r++) rowHeights[r] = { hpt: 20 };
  ws['!rows'] = rowHeights;

  if (ws['A1']) ws['A1'].s = STYLES.titleBanner;
  if (ws['A2']) ws['A2'].s = STYLES.subtitle;
  if (ws['A4']) ws['A4'].s = STYLES.sectionHeader;
  if (ws['A5']) ws['A5'].s = STYLES.headerCell;
  if (ws['B5']) ws['B5'].s = STYLES.headerCell;
  if (ws['C5']) ws['C5'].s = STYLES.headerCell;

  for (let r = 5; r <= 14; r++) {
    const isZebra = r % 2 === 0;
    const a = ws[XLSX.utils.encode_cell({ r, c: 0 })];
    const b = ws[XLSX.utils.encode_cell({ r, c: 1 })];
    const c = ws[XLSX.utils.encode_cell({ r, c: 2 })];
    if (a) {
      a.s = isZebra
        ? { ...STYLES.dataLeft, fill: { fgColor: { rgb: PALETTE.zebraTint } } }
        : STYLES.dataLeft;
    }
    if (b) {
      b.s = isZebra
        ? { ...STYLES.dataRightBold, fill: { fgColor: { rgb: PALETTE.zebraTint } } }
        : STYLES.dataRightBold;
      if (typeof b.v === 'number') {
        const metricName = a?.v ? String(a.v) : '';
        if (metricName.includes('Logged') || metricName.includes('Initiated') || metricName.includes('Active') || metricName.includes('Recorded')) {
          b.z = '#,##0';
        } else {
          b.z = '#,##0.0000';
        }
      }
    }
    if (c) {
      c.s = isZebra
        ? { ...STYLES.dataLeft, fill: { fgColor: { rgb: PALETTE.zebraTint } } }
        : STYLES.dataLeft;
    }
  }

  ws['!cols'] = [{ wch: 40 }, { wch: 22 }, { wch: 45 }];
  return ws;
}
