import { GoogleGenerativeAI } from '@google/generative-ai';
import { MAYA_SYSTEM_INSTRUCTION, FALLBACK_RESPONSES, DEFAULT_FALLBACK_RESPONSE } from '../prompts/mayaPersona.js';

let googleGenerativeAIClient = null;

// Primary and candidate models for maximum resilience
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

export function initializeGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️ [MAYA] No valid GEMINI_API_KEY configured in server/.env. Running in graceful offline simulator mode.');
    return false;
  }

  try {
    googleGenerativeAIClient = new GoogleGenerativeAI(apiKey.trim());
    console.log('✅ [MAYA] GoogleGenerativeAI client initialized successfully.');
    return true;
  } catch (error) {
    console.error('❌ [MAYA] Error initializing Gemini client:', error.message);
    return false;
  }
}

/**
 * Clean model output string of markdown json codeblocks if present
 */
function cleanJsonResponse(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Intelligent local fallback when API key is missing or request fails
 */
function getFallbackReply(userMessage) {
  const lowerMsg = (userMessage || '').toLowerCase();
  for (const item of FALLBACK_RESPONSES) {
    if (item.triggers.some(t => lowerMsg.includes(t))) {
      return {
        ...item.response,
        isFallback: true
      };
    }
  }

  return {
    ...DEFAULT_FALLBACK_RESPONSE,
    reply: `I hear you say: "${userMessage.length > 60 ? userMessage.slice(0, 57) + '...' : userMessage}". I'm reflecting on this with full presence. Tell me more about what this means to you!`,
    isFallback: true
  };
}

/**
 * Generate response from Gemini given conversation history
 */
export async function generateMayaResponse(history = [], userMessage = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');

  if (!isKeyConfigured) {
    console.log('[MAYA] No API key present. Using offline persona simulation.');
    const fallback = getFallbackReply(userMessage);
    return {
      ...fallback,
      apiKeyConfigured: false
    };
  }

  // Format messages for Gemini (last 10)
  const recentHistory = history.slice(-10);

  if (!googleGenerativeAIClient) {
    initializeGeminiClient();
  }

  if (googleGenerativeAIClient) {
    // Filter and adapt chat history for Gemini API
    const formattedHistory = [];
    for (const msg of recentHistory) {
      const role = msg.sender === 'user' ? 'user' : 'model';
      if (formattedHistory.length === 0 && role !== 'user') {
        continue; // first message in history must be user
      }
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) {
        formattedHistory[formattedHistory.length - 1].parts[0].text += '\n' + (msg.text || '');
      } else {
        formattedHistory.push({
          role,
          parts: [{ text: msg.text || '' }]
        });
      }
    }

    // Try candidate models in order for resilience
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = googleGenerativeAIClient.getGenerativeModel({
          model: modelName,
          systemInstruction: MAYA_SYSTEM_INSTRUCTION,
          generationConfig: {
            temperature: 0.75,
            responseMimeType: 'application/json'
          }
        });

        const chat = model.startChat({
          history: formattedHistory
        });

        const result = await chat.sendMessage(userMessage);
        const text = result.response.text();
        const parsed = JSON.parse(cleanJsonResponse(text));

        console.log(`✨ [MAYA] Live Gemini response generated using model: ${modelName}`);
        return {
          reply: parsed.reply || text,
          emotion: parsed.emotion || 'warm',
          intensity: typeof parsed.intensity === 'number' ? parsed.intensity : 0.85,
          thoughtNote: parsed.thoughtNote || 'Reflecting on your words.',
          apiKeyConfigured: true,
          isFallback: false,
          modelUsed: modelName
        };
      } catch (modelError) {
        console.warn(`[MAYA] Model ${modelName} attempt error:`, modelError.message);
        // Continue to next candidate model
      }
    }
  }

  // Graceful fallback if all API calls fail
  console.log('[MAYA] Falling back to local empathetic engine.');
  const fallback = getFallbackReply(userMessage);
  return {
    ...fallback,
    apiKeyConfigured: true,
    isFallback: true
  };
}

const REALITY_CHECK_SYSTEM_INSTRUCTION = `
You are MAYA's REALITY CHECK engine.
Your purpose is to help the user calmly separate:
- feelings
- facts
- assumptions
- interpretations
- possible alternative perspectives

This is a calm, intelligent perspective tool — NOT a medical or psychological diagnosis.

BEHAVIORAL RULES:
1. NEVER claim to know facts that the user did not explicitly provide.
2. NEVER diagnose mental-health conditions or use clinical jargon.
3. NEVER tell the user that their feelings are wrong.
4. NEVER assume the user is irrational or be judgmental.
5. Use cautious, probabilistic words like "may", "might", or "could".
6. Keep each section concise, warm, clear, and grounded.

OUTPUT FORMAT:
Respond ONLY with a valid JSON object strictly matching this format:
{
  "feelings": "Explain the emotion or concern expressed by the user.",
  "facts": "List only information explicitly supported by what the user said. Do NOT invent facts.",
  "assumptions": "Identify conclusions the user may be making that are not necessarily proven.",
  "alternative": "Give a reasonable alternative interpretation.",
  "balanced": "Give a short, calm and practical conclusion."
}
`.trim();

/**
 * Heuristic fallback for reality check if API is offline
 */
function getFallbackRealityCheck(text) {
  return {
    feelings: "You may be feeling stressed, uncertain, or carrying a weight of concern about this situation.",
    facts: text ? `You noted: "${text.length > 90 ? text.slice(0, 87) + '...' : text}".` : "You shared your current experience with Maya.",
    assumptions: "You might be projecting an outcome that has not yet happened or interpreting events through a lens of worry.",
    alternative: "Things could turn out more neutrally or favorably than they feel in this moment, and other people may have different perspectives.",
    balanced: "Take a steady breath. Focus on what you can directly influence today, and give yourself space to let the situation unfold."
  };
}

/**
 * Generate 5-part Reality Check perspective analysis
 */
export async function generateRealityCheck(userStatement = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');

  if (!isKeyConfigured || !userStatement || !userStatement.trim()) {
    return {
      ...getFallbackRealityCheck(userStatement),
      isFallback: true
    };
  }

  if (!googleGenerativeAIClient) {
    initializeGeminiClient();
  }

  if (googleGenerativeAIClient) {
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = googleGenerativeAIClient.getGenerativeModel({
          model: modelName,
          systemInstruction: REALITY_CHECK_SYSTEM_INSTRUCTION,
          generationConfig: {
            temperature: 0.6,
            responseMimeType: 'application/json'
          }
        });

        const prompt = `Analyze this user's situation and separate feelings, facts, assumptions, alternative interpretations, and balanced perspective:\n\n"${userStatement.trim()}"`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(cleanJsonResponse(text));

        return {
          feelings: parsed.feelings || "You may be experiencing strong feelings about this.",
          facts: parsed.facts || "What was explicitly shared in your statement.",
          assumptions: parsed.assumptions || "There may be assumptions that are not yet confirmed.",
          alternative: parsed.alternative || "There could be alternative ways to interpret what happened.",
          balanced: parsed.balanced || "Take a pause to look at what you know for sure versus what remains open.",
          isFallback: false,
          modelUsed: modelName
        };
      } catch (err) {
        console.warn(`[RealityCheck] Model ${modelName} error:`, err.message);
      }
    }
  }

  return {
    ...getFallbackRealityCheck(userStatement),
    isFallback: true
  };
}

/**
 * Transcribe Audio directly via Gemini multimodal capability
 */
export async function transcribeAudio(audioBase64, mimeType = 'audio/webm', language = 'en-US') {
  if (!googleGenerativeAIClient) {
    initializeGeminiClient();
  }
  if (!googleGenerativeAIClient) {
    throw new Error('Gemini client not initialized or API key missing.');
  }

  const prompt = language === 'kn-IN'
    ? 'Transcribe this spoken audio recording accurately into text. If spoken in Kannada, write the Kannada text. If spoken in English, write the English text. Output ONLY the exact transcribed words with no additional explanation, markdown, quotation marks, or commentary.'
    : 'Transcribe this spoken audio recording accurately into plain text. Output ONLY the exact transcribed words spoken by the user. Do not add quotation marks, commentary, or explanations. If the user said "Hello Maya", return exactly "Hello Maya".';

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = googleGenerativeAIClient.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: audioBase64
          }
        }
      ]);
      const text = result.response.text().trim();
      if (text) {
        return text;
      }
    } catch (err) {
      console.warn(`[AudioTranscribe] Model ${modelName} error:`, err.message);
    }
  }

  throw new Error('Could not transcribe audio with candidate Gemini models.');
}

