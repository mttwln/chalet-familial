import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyPassword, generateToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Find user by email
    const result = await sql`
      SELECT id, name, email, password_hash, role, avatar_color
      FROM members
      WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email non trouvé' });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: `Bienvenue ${user.name}!`,
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatar_color,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}
