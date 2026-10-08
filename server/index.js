import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMayaResponse, generateRealityCheck, transcribeAudio, initializeGeminiClient } from './services/gemini.js';

// Load environment variables from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Path to compiled frontend distribution
const distPath = path.join(__dirname, '../client/dist');

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Serve static frontend assets directly from client/dist
app.use(express.static(distPath));

// Initialize Gemini client
initializeGeminiClient();

// API Health Check Endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  );

  res.json({
    status: 'ok',
    service: 'MAYA AI Companion Backend',
    timestamp: new Date().toISOString(),
    geminiConfigured: hasKey,
    mode: hasKey ? 'live-gemini' : 'offline-simulation'
  });
});

// API Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string.'
      });
    }

    const conversationHistory = Array.isArray(history) ? history : [];
    const responseData = await generateMayaResponse(conversationHistory, message.trim());

    return res.json({
      success: true,
      data: {
        ...responseData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Unhandled error in /api/chat:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

// API Reality Check Endpoint
app.post('/api/reality-check', async (req, res) => {
  try {
    const { text, statement } = req.body || {};
    const input = (text || statement || '').trim();

    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Please describe a situation, thought, or worry to run Reality Check.'
      });
    }

    const analysis = await generateRealityCheck(input);

    return res.json({
      success: true,
      data: {
        ...analysis,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Unhandled error in /api/reality-check:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to complete reality check',
      message: error.message
    });
  }
});

// API Audio Transcription Endpoint (Fallback when browser speech service drops audio)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio, mimeType, lang } = req.body || {};
    if (!audio) {
      return res.status(400).json({
        success: false,
        error: 'No audio data provided'
      });
    }

    const transcript = await transcribeAudio(audio, mimeType || 'audio/webm', lang || 'en-US');

    return res.json({
      success: true,
      transcript,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unhandled error in /api/transcribe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to transcribe audio',
      message: error.message
    });
  }
});

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
