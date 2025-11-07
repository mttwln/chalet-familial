import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hashPassword, generateToken } from '../lib/auth';

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', 
  '#EF4444', '#06B6D4', '#6366F1', '#84CC16', '#F97316'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Check if email already exists (case-insensitive)
    const existingUser = await sql`
      SELECT id FROM members WHERE LOWER(email) = LOWER(${email})
    `;

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Check if this is the first user (should be admin)
    const userCount = await sql`SELECT COUNT(*) as count FROM members`;
    const isFirstUser = parseInt(userCount.rows[0].count) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    // Hash password
    const passwordHash = await hashPassword(password);

    // Random avatar color
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.toLowerCase();

    // Insert new user
    const result = await sql`
      INSERT INTO members (name, email, password_hash, role, avatar_color)
      VALUES (${name}, ${normalizedEmail}, ${passwordHash}, ${role}, ${avatarColor})
      RETURNING id, name, email, role, avatar_color, created_at
    `;

    const newUser = result.rows[0];

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      message: isFirstUser ? 'Compte administrateur créé!' : 'Inscription réussie!',
      token,
      user: {
        id: newUser.id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarColor: newUser.avatar_color,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
}
