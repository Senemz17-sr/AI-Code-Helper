/**
 * BACKEND IMPLEMENTATION GUIDE
 * 
 * This file shows how to refactor your backend to support:
 * 1. Public AI endpoints (no auth required)
 * 2. Protected history endpoints (auth required)
 * 3. Rate limiting for public endpoints
 */

// ========================================
// EXPRESS.JS EXAMPLE MIDDLEWARE
// ========================================

import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

// Rate limiter for public AI endpoints
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Use user ID if authenticated, otherwise use IP
    return (req.user?.id || req.ip) as string;
  }
});

// Rate limiter for authenticated users (higher limit)
const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => !req.user // Skip limiting for authenticated users
});

// Middleware to extract auth token (optional)
const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded as any;
    } catch (error) {
      // Continue without user - it's optional
    }
  }
  
  next();
};

// Middleware to require auth
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const app = express();
app.use(express.json());

// ========================================
// PUBLIC ENDPOINTS (No auth required)
// ========================================

/**
 * Generate Code
 * POST /api/ai/generate
 * Public endpoint - rate limited
 */
app.post('/api/ai/generate', publicLimiter, optionalAuth, async (req: Request, res: Response) => {
  try {
    const { prompt, language, context } = req.body;

    if (!prompt || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call your AI service (OpenAI, etc.)
    const response = await generateCodeWithAI({
      prompt,
      language,
      context,
      userId: req.user?.id, // Optional for analytics
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

/**
 * Debug Code
 * POST /api/ai/debug
 * Public endpoint - rate limited
 */
app.post('/api/ai/debug', publicLimiter, optionalAuth, async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await debugCodeWithAI({
      code,
      language,
      userId: req.user?.id,
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to debug code' });
  }
});

/**
 * Explain Code
 * POST /api/ai/explain
 * Public endpoint - rate limited
 */
app.post('/api/ai/explain', publicLimiter, optionalAuth, async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await explainCodeWithAI({
      code,
      language,
      userId: req.user?.id,
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to explain code' });
  }
});

/**
 * Optimize Code
 * POST /api/ai/optimize
 * Public endpoint - rate limited
 */
app.post('/api/ai/optimize', publicLimiter, optionalAuth, async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await optimizeCodeWithAI({
      code,
      language,
      userId: req.user?.id,
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize code' });
  }
});

/**
 * Refactor Code
 * POST /api/ai/refactor
 * Public endpoint - rate limited
 */
app.post('/api/ai/refactor', publicLimiter, optionalAuth, async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await refactorCodeWithAI({
      code,
      language,
      userId: req.user?.id,
    });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to refactor code' });
  }
});

// ========================================
// PROTECTED ENDPOINTS (Auth required)
// ========================================

/**
 * Save History Item
 * POST /api/history/save
 * Requires authentication
 */
app.post('/api/history/save', requireAuth, authenticatedLimiter, async (req: Request, res: Response) => {
  try {
    const { conversationId, mode, prompt, response, code, language } = req.body;
    const userId = req.user.id;

    if (!conversationId || !mode || !prompt || !response) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to database
    const historyItem = await db.history.create({
      userId,
      conversationId,
      mode,
      prompt,
      response,
      code,
      language,
      createdAt: new Date(),
    });

    res.json({ success: true, data: historyItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

/**
 * Get User History
 * GET /api/history
 * Requires authentication
 */
app.get('/api/history', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { conversationId, limit = 50, offset = 0 } = req.query;

    const query: any = { userId };
    if (conversationId) {
      query.conversationId = conversationId;
    }

    const history = await db.history.find(query)
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: -1 });

    const total = await db.history.countDocuments(query);

    res.json({
      success: true,
      data: history,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

/**
 * Get Conversations
 * GET /api/conversations
 * Requires authentication
 */
app.get('/api/conversations', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const conversations = await db.conversations.find({ userId })
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
});

/**
 * Create Conversation
 * POST /api/conversations
 * Requires authentication
 */
app.post('/api/conversations', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { title = 'New Chat' } = req.body;

    const conversation = await db.conversations.create({
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

/**
 * Delete History Item
 * DELETE /api/history/:id
 * Requires authentication
 */
app.delete('/api/history/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const historyId = req.params.id;

    // Verify ownership
    const item = await db.history.findById(historyId);
    if (!item || item.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.history.deleteOne({ _id: historyId });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ========================================
// ERROR HANDLING
// ========================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;

// ========================================
// HELPER FUNCTIONS (Placeholder)
// ========================================

async function generateCodeWithAI(params: any) {
  // Call OpenAI API or your AI service
  return { code: '...generated code...', explanation: '...' };
}

async function debugCodeWithAI(params: any) {
  // Call AI service
  return { issues: [], fixes: [] };
}

async function explainCodeWithAI(params: any) {
  // Call AI service
  return { explanation: '...' };
}

async function optimizeCodeWithAI(params: any) {
  // Call AI service
  return { optimizedCode: '...', improvements: [] };
}

async function refactorCodeWithAI(params: any) {
  // Call AI service
  return { refactoredCode: '...', changes: [] };
}
