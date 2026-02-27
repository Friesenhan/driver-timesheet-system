import { SHEETS_CONFIG } from '../config/sheetsConfig';

export function columnToNumber(column: string): number {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return result;
}

export function getCellRange(row: number, column: string): string {
  return `${SHEETS_CONFIG.SHEET_NAME}!${column}${row}`;
}

export function getRowRange(row: number, columns: string[]): string {
  const startCol = columns[0];
  const endCol = columns[columns.length - 1];
  return `${SHEETS_CONFIG.SHEET_NAME}!${startCol}${row}:${endCol}${row}`;
}