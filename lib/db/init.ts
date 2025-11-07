import { sql } from '@vercel/postgres';

export interface DbMember {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  avatar_color: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbReservation {
  id: number;
  member_id: number;
  start_date: string;
  end_date: string;
  number_of_people: number;
  status: 'confirmed' | 'pending' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface DbConsumptionRecord {
  id: number;
  type: 'fioul' | 'electricite';
  date: string;
  quantity: number;
  cost: number;
  added_by: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Initialize the database schema
 * This will be called by the setup API endpoint
 */
export async function initializeDatabase() {
  const schemaSQL = `
    -- Members/Users table
    CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
        avatar_color VARCHAR(7) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Reservations table
    CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
        status VARCHAR(20) NOT NULL CHECK (status IN ('confirmed', 'pending', 'completed')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_date_range CHECK (end_date >= start_date)
    );

    -- Consumption records table
    CREATE TABLE IF NOT EXISTS consumption_records (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL CHECK (type IN ('fioul', 'electricite')),
        date DATE NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
        cost DECIMAL(10, 2) NOT NULL CHECK (cost >= 0),
        added_by INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for better query performance
    CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
    CREATE INDEX IF NOT EXISTS idx_reservations_member_id ON reservations(member_id);
    CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(start_date, end_date);
    CREATE INDEX IF NOT EXISTS idx_consumption_records_type ON consumption_records(type);
    CREATE INDEX IF NOT EXISTS idx_consumption_records_date ON consumption_records(date);
    CREATE INDEX IF NOT EXISTS idx_consumption_records_added_by ON consumption_records(added_by);
  `;

  await sql.query(schemaSQL);
}

/**
 * Check if database is initialized
 */
export async function isDatabaseInitialized(): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'members'
      ) as table_exists;
    `;
    return result.rows[0]?.table_exists === true;
  } catch (error) {
    console.error('Error checking database initialization:', error);
    return false;
  }
}
