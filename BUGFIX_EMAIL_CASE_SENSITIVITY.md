# Bugfix: Email Case Sensitivity Issue

## Problem
Users were experiencing "Email non trouvé" (Email not found) errors when attempting to login, even though they had successfully registered their account with an email and password.

## Root Cause
The issue was caused by **case-sensitive email comparison** in PostgreSQL queries. 

For example:
- User registers with: `Test@Example.com`
- User attempts to login with: `test@example.com`
- PostgreSQL's default `WHERE email = ${email}` comparison is case-sensitive
- Query fails to find a match, returning "Email non trouvé"

## Solution
Implemented case-insensitive email handling across all authentication and member management endpoints:

### 1. Login Endpoint (`api/login.ts`)
- Changed email lookup query from `WHERE email = ${email}` to `WHERE LOWER(email) = LOWER(${email})`
- This allows users to login regardless of the case they use for their email

### 2. Registration Endpoint (`api/register.ts`)
- Made duplicate email check case-insensitive: `WHERE LOWER(email) = LOWER(${email})`
- Normalized email to lowercase before storing: `const normalizedEmail = email.toLowerCase()`
- This ensures all emails are stored consistently in the database

### 3. Members Update Endpoint (`api/members.ts`)
- Made duplicate email check case-insensitive when updating member information
- Normalized email to lowercase before updating
- Added validation to prevent email conflicts with other members

## Technical Details

### Before
```typescript
// Login query
const result = await sql`
  SELECT id, name, email, password_hash, role, avatar_color
  FROM members
  WHERE email = ${email}
`;

// Register query
const existingUser = await sql`
  SELECT id FROM members WHERE email = ${email}
`;

// Insert new user
VALUES (${name}, ${email}, ${passwordHash}, ${role}, ${avatarColor})
```

### After
```typescript
// Login query (case-insensitive)
const result = await sql`
  SELECT id, name, email, password_hash, role, avatar_color
  FROM members
  WHERE LOWER(email) = LOWER(${email})
`;

// Register - normalize email first
const normalizedEmail = email.toLowerCase();

// Register query (case-insensitive)
const existingUser = await sql`
  SELECT id FROM members WHERE LOWER(email) = ${normalizedEmail}
`;

// Insert with normalized email
VALUES (${name}, ${normalizedEmail}, ${passwordHash}, ${role}, ${avatarColor})
```

## Impact
- Users can now login with any case variation of their email address
- New registrations will store emails in lowercase format
- Prevents duplicate accounts with different email cases (e.g., Test@example.com and test@example.com)
- Backwards compatible: existing accounts with mixed-case emails will still work

## Testing Recommendations
1. Register with an email using mixed case (e.g., `Test@Example.COM`)
2. Attempt to login with all lowercase (e.g., `test@example.com`)
3. Verify successful login
4. Attempt to register again with different case variation
5. Verify duplicate email error is shown
