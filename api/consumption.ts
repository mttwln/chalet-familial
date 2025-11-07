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
      // Get all consumption records
      const result = await sql`
        SELECT 
          c.id, c.type, c.date, c.quantity, c.cost, c.added_by,
          m.name as added_by_name
        FROM consumption_records c
        JOIN members m ON c.added_by = m.id
        ORDER BY c.date DESC
      `;

      const records = result.rows.map(row => ({
        id: row.id.toString(),
        type: row.type,
        date: row.date,
        quantity: parseFloat(row.quantity),
        cost: parseFloat(row.cost),
        addedBy: row.added_by.toString(),
        addedByName: row.added_by_name,
      }));

      return res.status(200).json(records);
    }

    if (req.method === 'POST') {
      // Create new consumption record
      const { type, date, quantity, cost } = req.body;

      if (!type || !date || !quantity || !cost) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      if (!['fioul', 'electricite'].includes(type)) {
        return res.status(400).json({ error: 'Type invalide' });
      }

      const result = await sql`
        INSERT INTO consumption_records (type, date, quantity, cost, added_by)
        VALUES (${type}, ${date}, ${parseFloat(quantity)}, ${parseFloat(cost)}, ${payload.userId})
        RETURNING id, type, date, quantity, cost, added_by
      `;

      const newRecord = result.rows[0];

      // Get member name
      const memberResult = await sql`SELECT name FROM members WHERE id = ${payload.userId}`;
      const memberName = memberResult.rows[0]?.name || '';

      return res.status(201).json({
        id: newRecord.id.toString(),
        type: newRecord.type,
        date: newRecord.date,
        quantity: parseFloat(newRecord.quantity),
        cost: parseFloat(newRecord.cost),
        addedBy: newRecord.added_by.toString(),
        addedByName: memberName,
      });
    }

    if (req.method === 'PUT') {
      // Update consumption record
      const { id, type, date, quantity, cost } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID manquant' });
      }

      if (type && !['fioul', 'electricite'].includes(type)) {
        return res.status(400).json({ error: 'Type invalide' });
      }

      const result = await sql`
        UPDATE consumption_records
        SET 
          type = COALESCE(${type || null}, type),
          date = COALESCE(${date || null}, date),
          quantity = COALESCE(${quantity ? parseFloat(quantity) : null}, quantity),
          cost = COALESCE(${cost ? parseFloat(cost) : null}, cost)
        WHERE id = ${parseInt(id)}
        RETURNING id, type, date, quantity, cost, added_by
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Enregistrement non trouvé' });
      }

      const updatedRecord = result.rows[0];

      // Get member name
      const memberResult = await sql`SELECT name FROM members WHERE id = ${updatedRecord.added_by}`;
      const memberName = memberResult.rows[0]?.name || '';

      return res.status(200).json({
        id: updatedRecord.id.toString(),
        type: updatedRecord.type,
        date: updatedRecord.date,
        quantity: parseFloat(updatedRecord.quantity),
        cost: parseFloat(updatedRecord.cost),
        addedBy: updatedRecord.added_by.toString(),
        addedByName: memberName,
      });
    }

    if (req.method === 'DELETE') {
      // Delete consumption record
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID manquant' });
      }

      await sql`DELETE FROM consumption_records WHERE id = ${parseInt(id)}`;

      return res.status(200).json({ message: 'Enregistrement supprimé' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Consumption API error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
