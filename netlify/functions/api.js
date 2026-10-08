import serverless from 'serverless-http';
import app from '../../server/app.js';

// Netlify Serverless Function wrapping the Express app
export const handler = serverless(app);
