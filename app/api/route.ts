import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import express from 'express';
import axios from 'axios';

const router = express.Router();

export const maxDuration = 30

// Create a simple logging utility
const logger = {
  info: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp}: ${message}`, data ? data : '');
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp}: ${message}`, error ? error : '');
  }
};

router.post('/chat', async (req, res) => {
    const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    logger.info(`[${requestId}] Received POST request to /chat`);
    
    // Log request body but sanitize or truncate sensitive content if needed
    const sanitizedMessages = req.body.messages ? req.body.messages.map(msg => ({
      role: msg.role,
      contentLength: msg.content ? msg.content.length : 0,
      contentPreview: msg.content ? msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : '') : null
    })) : [];
    
    logger.info(`[${requestId}] Request payload:`, {
      messageCount: sanitizedMessages.length,
      messages: sanitizedMessages
    });

    const { messages } = req.body;

    const systemMessage = {
        role: "system",
        content: `You are LearnBot, a friendly and engaging AI tutor designed to help students at the ACCESS STEM Success Stories Conference. 
        Your responses should be:
        1. Educational and accurate
        2. Age-appropriate
        3. Encouraging and supportive
        4. Clear and easy to understand
        5. Include relevant examples when helpful
        6. Use emoji occasionally to maintain engagement
        
        Only return JSON format when the user explicitly asks to change themes with phrases like "change to X theme" or "switch to X theme".
        For normal conversation, just respond with plain text.
        
        When asked to change themes, use this JSON format:
        {
          "message": "Your response text here",
          "styleChanges": {
            "customProperties": {
              "--primary-color": "#HEXCODE",
              "--secondary-color": "#HEXCODE",
              "--accent-color": "#HEXCODE"
            },
            "elements": {
              "body": { "background-color": "#HEXCODE" },
              ".ai-message": { "background-color": "#HEXCODE" }
            }
          }
        }
        
        Always mention that you're a bot for the ACCESS STEM Success Stories Conference when introducing yourself.`,
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        logger.error(`[${requestId}] API key not found`);
        return res.status(500).json({ error: 'API key not found' });
    }

    try {
        logger.info(`[${requestId}] Sending request to OpenAI`);
        const startTime = Date.now();
        
        const result = streamText({
            model: openai("gpt-4o-mini"),
            messages: [systemMessage, ...messages],
            temperature: 0.7,
        });
        
        const duration = Date.now() - startTime;
        logger.info(`[${requestId}] OpenAI request completed in ${duration}ms`);
        
        // Log some basic info about the response - you can't log the whole stream
        logger.info(`[${requestId}] Response sent to client`);
        
        // Set up error handling on the stream
        result.on('error', (error) => {
            logger.error(`[${requestId}] Stream error:`, error);
        });
        
        result.on('end', () => {
            logger.info(`[${requestId}] Stream ended successfully`);
        });
        
        res.json(result);
    } catch (error) {
        logger.error(`[${requestId}] Error calling OpenAI API:`, error);
        
        // Log detailed error information
        if (error.response) {
            logger.error(`[${requestId}] OpenAI API response error:`, {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers,
                data: error.response.data
            });
        } else if (error.request) {
            logger.error(`[${requestId}] No response received:`, error.request);
        }
        
        res.status(500).json({ 
            error: 'Failed to call OpenAI API',
            message: error.message,
            requestId: requestId
        });
    }
});

// Add middleware to log all requests
router.use((req, res, next) => {
    const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    logger.info(`[${requestId}] ${req.method} ${req.originalUrl}`);
    
    // Track response time
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`[${requestId}] Response sent with status ${res.statusCode} in ${duration}ms`);
    });
    
    next();
});

export default router;