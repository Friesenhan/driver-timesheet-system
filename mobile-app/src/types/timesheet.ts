export interface TimesheetSubmission {
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
  uta?: string;
  utl?: string;
  nsl?: string;
  bc?: string;
  rejDmg?: string;
  oodt?: string;
  fdd?: string;
  extra?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}