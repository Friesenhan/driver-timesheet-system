import { google } from 'googleapis';
import { getGoogleAuth } from '../config/auth';
import { SHEETS_CONFIG } from '../config/sheetsConfig';

const sheets = google.sheets({ version: 'v4' });

export interface TimesheetData {
  code: string;
  startingKm?: string;
  endingKm?: string;
  shiftStart?: string;
  loadOut?: string;
  firstStop?: string;
  lastStop?: string;
  lastReattempt?: string;
  stationReturn?: string;
  clockOut?: string;
  zone?: string;
  uta?: string;
  utl?: string;
  nsl?: string;
  bc?: string;
  rejDmg?: string;
  oodt?: string;
  fdd?: string;
  extra?: string;
}

export async function findEmployeeRow(employeeCode: string, spreadsheetId: string): Promise<number | null> {
  
const auth = getGoogleAuth();
  
  try {
    const codeColumn = SHEETS_CONFIG.CODE_COLUMN;
    const range = `${SHEETS_CONFIG.SHEET_NAME}!${codeColumn}:${codeColumn}`;
    
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    
    for (let i = SHEETS_CONFIG.DATA_START_ROW - 1; i < rows.length; i++) {
      if (rows[i] && rows[i][0] && rows[i][0].toString().trim().toUpperCase() === employeeCode.toUpperCase()) {
        return i + 1;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding employee row:', error);
    throw error;
  }
}

export async function updateTimesheet(data: TimesheetData, spreadsheetId: string): Promise<{ success: boolean; row?: number; message: string }> {
  const auth = getGoogleAuth();
  
  try {
   console.log('updateTimesheet - received data:', JSON.stringify(data, null, 2));
    const row = await findEmployeeRow(data.code, spreadsheetId);
    
    if (!row) {
      return {
        success: false,
        message: `Code "${data.code}" not found in spreadsheet`,
      };
    }

    const mappings = SHEETS_CONFIG.COLUMN_MAPPINGS;
    const updates: Array<{ range: string; values: any[][] }> = [];

   Object.entries(mappings).forEach(([field, column]) => {
  const value = (data as any)[field];
  console.log(`Processing field: ${field}, value: ${value}, column: ${column}`);
  
  if (value !== undefined && value !== null && value !== '') {
    // Special handling for zone - convert zone name to letter
    let finalValue = value;
    if (field === 'zone') {
      console.log('Zone field detected, value:', value);
      const zoneMap: { [key: string]: string } = {
        'Campbell River': 'a',
        'Black Creek': 'b',
        'Comox': 'c',
        'Courtenay': 'd',
        'Cumberland': 'e',
        'Royston/Union Bay': 'f',
        'Fanny Bay/Bowser': 'g',
        'Port Alberni': 'h',
        'Qualicum Beach': 'i',
        'Errington': 'j',
        'Parksville': 'k',
        'Nanoose Bay': 'l',
        'Lantzville': 'm',
        'Nanaimo': 'n',
        'Cedar': 'o',
        'Ladysmith': 'p',
        'Chemainus': 'q',
      };
      finalValue = zoneMap[value] || value;
      console.log('Zone mapped to:', finalValue);
    }
    
    updates.push({
      range: `${SHEETS_CONFIG.SHEET_NAME}!${column}${row}`,
      values: [[finalValue]],
    });
    console.log(`Added update for ${field} (column ${column}): ${finalValue}`);
  } else {
    console.log(`Skipping ${field} - value is empty or undefined`);
  }
});

if (updates.length === 0) {
      return {
        success: false,
        message: 'No data to update',
      };
    }

    console.log('About to update spreadsheet with', updates.length, 'updates');
    console.log('Updates:', JSON.stringify(updates, null, 2));

    await sheets.spreadsheets.values.batchUpdate({
      auth,
      spreadsheetId: spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: updates,
      },
    });

    console.log('Google Sheets API call completed successfully');

    return {
      success: true,
      row,
      message: `Updated row ${row} successfully`,
    };

  } catch (error: any) {
    console.error('Error updating timesheet:', error);
    return {
      success: false,
      message: error.message || 'Failed to update timesheet',
    };
  }
}

export async function batchUpdateTimesheets(
  submissions: TimesheetData[],
  spreadsheetId: string
): Promise<{
  success: number;
  failed: number;
  cancelled: string[];
  results: Array<{ code: string; success: boolean; message: string; row?: number }>;
}> {
  const results: Array<{ code: string; success: boolean; message: string; row?: number }> = [];
  const codeCounts = new Map<string, number>();
  const cancelled: string[] = [];

  submissions.forEach(sub => {
    const codeUpper = sub.code.toUpperCase();
    codeCounts.set(codeUpper, (codeCounts.get(codeUpper) || 0) + 1);
  });

  codeCounts.forEach((count, code) => {
    if (count > 1) {
      cancelled.push(code);
    }
  });

  for (const submission of submissions) {
    const codeUpper = submission.code.toUpperCase();
    
    if (cancelled.includes(codeUpper)) {
      results.push({
        code: submission.code,
        success: false,
        message: 'Duplicate code - cancelled out (both submissions skipped)',
      });
      continue;
    }

    const result = await updateTimesheet(submission, spreadsheetId);
    results.push({
      code: submission.code,
      success: result.success,
      message: result.message,
      row: result.row,
    });
  }

  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    success,
    failed,
    cancelled,
    results,
  };
}