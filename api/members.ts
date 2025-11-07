import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractTokenFromHeader, verifyToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Verify authentication
    const token = extractTokenFromHeader(req.headers.authorization as string);
    if (!token) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Token invalide' });
    }

    if (req.method === 'GET') {
      // Get all members
      const result = await sql`
        SELECT id, name, email, role, avatar_color, created_at
        FROM members
        ORDER BY created_at ASC
      `;

      const members = result.rows.map(row => ({
        id: row.id.toString(),
        name: row.name,
        email: row.email,
        role: row.role,
        avatarColor: row.avatar_color,
      }));

      return res.status(200).json(members);
    }

    if (req.method === 'PUT') {
      // Update member (admin only)
      if (payload.role !== 'admin') {
        return res.status(403).json({ error: 'Accès interdit' });
      }

      const { id, name, email, role } = req.body;

      if (!id || !name || !email || !role) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Normalize email to lowercase for consistency
      const normalizedEmail = email.toLowerCase();

      // Check if email is already used by another member (case-insensitive)
      const existingUser = await sql`
        SELECT id FROM members WHERE LOWER(email) = LOWER(${email}) AND id != ${parseInt(id)}
      `;

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé par un autre membre' });
      }

      const result = await sql`
        UPDATE members
        SET name = ${name}, email = ${normalizedEmail}, role = ${role}
        WHERE id = ${parseInt(id)}
        RETURNING id, name, email, role, avatar_color
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Membre non trouvé' });
      }

      const updatedMember = result.rows[0];
      return res.status(200).json({
        id: updatedMember.id.toString(),
        name: updatedMember.name,
        email: updatedMember.email,
        role: updatedMember.role,
        avatarColor: updatedMember.avatar_color,
      });
    }

    if (req.method === 'DELETE') {
      // Delete member (admin only)
      if (payload.role !== 'admin') {
        return res.status(403).json({ error: 'Accès interdit' });
      }

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID manquant' });
      }

      // Don't allow deleting yourself
      if (parseInt(id) === payload.userId) {
        return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
      }

      // Check if this is the last admin
      const adminCount = await sql`SELECT COUNT(*) as count FROM members WHERE role = 'admin'`;
      const memberToDelete = await sql`SELECT role FROM members WHERE id = ${parseInt(id)}`;
      
      if (memberToDelete.rows.length > 0 && 
          memberToDelete.rows[0].role === 'admin' && 
          parseInt(adminCount.rows[0].count) <= 1) {
        return res.status(400).json({ error: 'Impossible de supprimer le dernier administrateur' });
      }

      await sql`DELETE FROM members WHERE id = ${parseInt(id)}`;

      return res.status(200).json({ message: 'Membre supprimé' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Members API error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
