import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import timesheetRoutes from './routes/timesheet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiKeyMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid API key' });
  }
  next();
};

app.use('/api/timesheet', apiKeyMiddleware, timesheetRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Timesheet API', 
    version: '1.0.0' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});