import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateMayaResponse, generateRealityCheck, transcribeAudio, initializeGeminiClient } from './services/gemini.js';

// Load environment variables (supports server/.env as well as root .env in Netlify)
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Initialize Gemini client
initializeGeminiClient();

// Create API Router to handle endpoints cleanly
const router = express.Router();

// 1. API Health Check Endpoint
router.get('/health', (req, res) => {
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

// 2. API Chat Endpoint
router.post('/chat', async (req, res) => {
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

// 3. API Reality Check Endpoint
router.post('/reality-check', async (req, res) => {
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

// 4. API Audio Transcription Endpoint (Fallback when browser speech service drops audio)
router.post('/transcribe', async (req, res) => {
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

// Mount router on multiple base paths for complete compatibility:
// - /api (standard relative calls)
// - /.netlify/functions/api (Netlify serverless function execution)
// - / (handles rewrites if path prefix is stripped)
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/', router);

export default app;
