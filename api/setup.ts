import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeDatabase, isDatabaseInitialized } from '../lib/db/init';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if already initialized
    const isInitialized = await isDatabaseInitialized();
    
    if (isInitialized) {
      return res.status(200).json({
        message: 'Database already initialized',
        initialized: true,
      });
    }

    // Initialize the database
    await initializeDatabase();

    return res.status(200).json({
      message: 'Database initialized successfully',
      initialized: true,
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return res.status(500).json({
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
