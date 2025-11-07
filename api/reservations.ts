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
      // Get all reservations with member names
      const result = await sql`
        SELECT 
          r.id, r.member_id, r.start_date, r.end_date, 
          r.number_of_people, r.status,
          m.name as member_name
        FROM reservations r
        JOIN members m ON r.member_id = m.id
        ORDER BY r.start_date DESC
      `;

      const reservations = result.rows.map(row => ({
        id: row.id.toString(),
        memberId: row.member_id.toString(),
        memberName: row.member_name,
        startDate: row.start_date,
        endDate: row.end_date,
        numberOfPeople: row.number_of_people,
        status: row.status,
      }));

      return res.status(200).json(reservations);
    }

    if (req.method === 'POST') {
      // Create new reservation
      const { memberId, startDate, endDate, numberOfPeople, status } = req.body;

      if (!memberId || !startDate || !endDate || !numberOfPeople || !status) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Check for overlapping reservations
      const overlap = await sql`
        SELECT id FROM reservations
        WHERE status != 'completed'
          AND NOT (
            end_date < ${startDate} OR start_date > ${endDate}
          )
      `;

      if (overlap.rows.length > 0) {
        return res.status(400).json({ error: 'Cette période est déjà réservée' });
      }

      const result = await sql`
        INSERT INTO reservations (member_id, start_date, end_date, number_of_people, status)
        VALUES (${parseInt(memberId)}, ${startDate}, ${endDate}, ${parseInt(numberOfPeople)}, ${status})
        RETURNING id, member_id, start_date, end_date, number_of_people, status
      `;

      const newReservation = result.rows[0];

      // Get member name
      const memberResult = await sql`SELECT name FROM members WHERE id = ${parseInt(memberId)}`;
      const memberName = memberResult.rows[0]?.name || '';

      return res.status(201).json({
        id: newReservation.id.toString(),
        memberId: newReservation.member_id.toString(),
        memberName,
        startDate: newReservation.start_date,
        endDate: newReservation.end_date,
        numberOfPeople: newReservation.number_of_people,
        status: newReservation.status,
      });
    }

    if (req.method === 'PUT') {
      // Update reservation
      const { id, memberId, startDate, endDate, numberOfPeople, status } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID manquant' });
      }

      // Check for overlapping reservations (excluding current one)
      if (startDate && endDate) {
        const overlap = await sql`
          SELECT id FROM reservations
          WHERE id != ${parseInt(id)}
            AND status != 'completed'
            AND NOT (
              end_date < ${startDate} OR start_date > ${endDate}
            )
        `;

        if (overlap.rows.length > 0) {
          return res.status(400).json({ error: 'Cette période est déjà réservée' });
        }
      }

      const result = await sql`
        UPDATE reservations
        SET 
          member_id = COALESCE(${memberId ? parseInt(memberId) : null}, member_id),
          start_date = COALESCE(${startDate || null}, start_date),
          end_date = COALESCE(${endDate || null}, end_date),
          number_of_people = COALESCE(${numberOfPeople ? parseInt(numberOfPeople) : null}, number_of_people),
          status = COALESCE(${status || null}, status)
        WHERE id = ${parseInt(id)}
        RETURNING id, member_id, start_date, end_date, number_of_people, status
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Réservation non trouvée' });
      }

      const updatedReservation = result.rows[0];

      // Get member name
      const memberResult = await sql`SELECT name FROM members WHERE id = ${updatedReservation.member_id}`;
      const memberName = memberResult.rows[0]?.name || '';

      return res.status(200).json({
        id: updatedReservation.id.toString(),
        memberId: updatedReservation.member_id.toString(),
        memberName,
        startDate: updatedReservation.start_date,
        endDate: updatedReservation.end_date,
        numberOfPeople: updatedReservation.number_of_people,
        status: updatedReservation.status,
      });
    }

    if (req.method === 'DELETE') {
      // Delete reservation
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID manquant' });
      }

      await sql`DELETE FROM reservations WHERE id = ${parseInt(id)}`;

      return res.status(200).json({ message: 'Réservation supprimée' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Reservations API error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
