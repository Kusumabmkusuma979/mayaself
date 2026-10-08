import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, '../client/dist');

// Serve static frontend assets directly from client/dist when running as a unified server
app.use(express.static(distPath));

// Single-Page Application (SPA) catch-all route:
// Serve the complete MAYA web application for any non-API request
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server on 0.0.0.0 to support all local network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌌 [MAYA Unified] Full-stack website is live on single URL: http://localhost:${PORT}`);
  console.log(`📡 [MAYA Unified] API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔑 [MAYA Unified] Gemini API Key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
