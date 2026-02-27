import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { updateTimesheet, batchUpdateTimesheets, TimesheetData } from '../services/googleSheets';

const router = Router();

let pendingSubmissions: TimesheetData[] = [];

router.post('/submit', [
  body('code').trim().notEmpty().withMessage('Code is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const submission: TimesheetData = {
      code: req.body.code,
      startingKm: req.body.startingKm,
      endingKm: req.body.endingKm,
      shiftStart: req.body.shiftStart,
      loadOut: req.body.loadOut,
      firstStop: req.body.firstStop,
      lastStop: req.body.lastStop,
      lastReattempt: req.body.lastReattempt,
      stationReturn: req.body.stationReturn,
      clockOut: req.body.clockOut,
      zone: req.body.zone,
      uta: req.body.uta,
      utl: req.body.utl,
      nsl: req.body.nsl,
      bc: req.body.bc,
      rejDmg: req.body.rejDmg,
      oodt: req.body.oodt,
      fdd: req.body.fdd,
      extra: req.body.extra,
    };

    pendingSubmissions.push(submission);

    return res.status(200).json({
      success: true,
      message: 'Timesheet submitted successfully. Waiting for batch update.',
    });
  } catch (error: any) {
    console.error('Submit error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

router.get('/pending', (req: Request, res: Response) => {
  res.json({
    count: pendingSubmissions.length,
    submissions: pendingSubmissions,
  });
});

router.post('/batch-update', async (req: Request, res: Response) => {
  try {
    if (pendingSubmissions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No pending submissions to update',
      });
    }

    const spreadsheetId = req.body.spreadsheetId;
    
    if (!spreadsheetId) {
      return res.status(400).json({
        success: false,
        message: 'Spreadsheet ID is required',
      });
    }

    console.log('Starting batch update for', pendingSubmissions.length, 'submissions');
    console.log('Spreadsheet ID:', spreadsheetId);

    const result = await batchUpdateTimesheets(pendingSubmissions, spreadsheetId);

    console.log('Batch update result:', result);

    pendingSubmissions = [];

    return res.status(200).json({
      success: true,
      message: `Updated ${result.success} timesheets. ${result.failed} failed. ${result.cancelled.length} codes cancelled (duplicates).`,
      ...result,
    });
  } catch (error: any) {
    console.error('Batch update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to batch update spreadsheet',
      error: error.message || 'Unknown error',
    });
  }
});

router.post('/clear-pending', (req: Request, res: Response) => {
  pendingSubmissions = [];
  return res.json({
    success: true,
    message: 'Pending submissions cleared',
  });
});

export default router;