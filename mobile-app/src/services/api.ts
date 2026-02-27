import { TimesheetSubmission, ApiResponse } from '../types/timesheet';

const API_BASE_URL = 'https://driver-timesheet-system.onrender.com/api';
const API_KEY = 'timesheet-appAPI_KEY';

export async function submitTimesheet(
  data: TimesheetSubmission
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/timesheet/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection and that the server is running.',
    };
  }
}