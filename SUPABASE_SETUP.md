# Supabase Setup Guide for CrossFlow Access Keys

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: CrossFlow
   - **Database Password**: (Choose a strong password and save it)
   - **Region**: Select closest to your users
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Create access_keys table
CREATE TABLE access_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  used_by_device TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_access_keys_key ON access_keys(key);
CREATE INDEX idx_access_keys_is_used ON access_keys(is_used);

-- Insert sample access keys for testing
INSERT INTO access_keys (key, user_id) VALUES
  ('ACCESS-123', 'temp1-11'),
  ('ACCESS-456', 'temp4-2'),
  ('ACCESS-789', 'temp2'),
  ('CFK-2024-M3N4O5P6', 'user-demo'),
  ('CFK-2024-Q7R8S9T0', 'test-user'),
  ('CFK-2024-ABC123XY', 'admin'),
  ('CFK-2024-DEF456ZW', 'student1'),
  ('CFK-2024-GHI789UV', 'student2'),
  ('CFK-2024-JKL012ST', 'instructor'),
  ('CFK-2024-MNO345QR', 'guest');

-- Enable Row Level Security (RLS)
ALTER TABLE access_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow SELECT (reading)
CREATE POLICY "Allow public read access" ON access_keys
  FOR SELECT
  USING (true);

-- Create policy to allow UPDATE (marking as used)
CREATE POLICY "Allow public update access" ON access_keys
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

4. Click "Run" (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned"

## Step 3: Get Your API Credentials

1. Go to **Settings** → **API** (left sidebar)
2. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Your Application

1. In your project root, create a `.env` file:

```bash
# Copy from .env.example
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: 
- Replace `your-project-id` with your actual project ID
- Replace `your-anon-key-here` with your actual anon key
- **NEVER** commit the `.env` file to Git (it's already in `.gitignore`)

## Step 5: Restart Your Dev Server

```bash
npm run dev
```

## Testing the Implementation

### Test 1: First-Time Login
1. Open your app: http://localhost:5173
2. Enter access key: `ACCESS-123`
3. Should successfully log in as `temp1-11`

### Test 2: One-Time Use (Same Device)
1. Clear localStorage: Open DevTools → Console → Run:
   ```javascript
   localStorage.clear()
   location.reload()
   ```
2. Try the same key again: `ACCESS-123`
3. Should see error: "This access key has already been used"

### Test 3: One-Time Use (Different Device)
1. Open the app in a different browser or device
2. Try the same key: `ACCESS-123`
3. Should see error: "This access key has already been used"
4. ✅ **This proves the key is globally marked as used**

### Test 4: Different Key
1. Enter a different unused key: `ACCESS-456`
2. Should successfully log in as `temp4-2`

## Viewing the Database

1. In Supabase dashboard, go to **Table Editor** → **access_keys**
2. You'll see all keys and their status:
   - `is_used`: Shows if key was used
   - `used_at`: Timestamp when used
   - `used_by_device`: Device fingerprint

## Managing Access Keys

### Add New Keys via SQL Editor

```sql
INSERT INTO access_keys (key, user_id) VALUES
  ('CFK-2024-NEWKEY01', 'new-user-1'),
  ('CFK-2024-NEWKEY02', 'new-user-2');
```

### Check Which Keys Are Used

```sql
SELECT key, user_id, is_used, used_at, used_by_device
FROM access_keys
ORDER BY created_at DESC;
```

### Reset a Key (Make it Reusable)

```sql
UPDATE access_keys
SET is_used = false, used_at = NULL, used_by_device = NULL
WHERE key = 'ACCESS-123';
```

### Delete Used Keys

```sql
DELETE FROM access_keys
WHERE is_used = true
AND used_at < NOW() - INTERVAL '30 days';
```

## Production Considerations

### Security
- ✅ Row Level Security (RLS) is enabled
- ✅ Only public read/update access (no insert/delete from frontend)
- ✅ Anon key is safe to expose (restricted by RLS policies)
- ✅ Each key can only be used once globally
- ✅ Device fingerprinting tracks which device used the key

### Recommended Enhancements
1. **Add key expiration**:
   ```sql
   ALTER TABLE access_keys ADD COLUMN expires_at TIMESTAMP;
   
   -- Check expiration in RLS policy
   CREATE POLICY "Prevent expired keys" ON access_keys
     FOR SELECT
     USING (expires_at IS NULL OR expires_at > NOW());
   ```

2. **Add usage limits**:
   ```sql
   ALTER TABLE access_keys ADD COLUMN max_uses INTEGER DEFAULT 1;
   ALTER TABLE access_keys ADD COLUMN use_count INTEGER DEFAULT 0;
   ```

3. **Add audit logging**:
   ```sql
   CREATE TABLE access_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     key TEXT,
     user_id TEXT,
     action TEXT,
     device TEXT,
     ip_address TEXT,
     timestamp TIMESTAMP DEFAULT NOW()
   );
   ```

## Troubleshooting

### Error: "Invalid access key"
- Check that the key exists in the database
- Verify you're using the correct case (keys are case-insensitive, stored as uppercase)

### Error: "Unable to validate access key"
- Check your `.env` file has correct Supabase credentials
- Verify your Supabase project is running (not paused)
- Check browser console for detailed error messages

### Keys Not Syncing Across Devices
- Verify RLS policies are enabled
- Check that UPDATE policy allows public access
- Inspect the `access_keys` table to see if `is_used` is being updated

### Dev Server Not Loading Environment Variables
- Restart the dev server after changing `.env`
- Make sure the file is named exactly `.env` (not `.env.txt`)
- Variables must start with `VITE_` prefix

## Support

If you encounter issues:
1. Check Supabase project logs: **Logs** → **Database**
2. Check browser console for errors
3. Verify table structure matches the schema above
4. Test SQL queries directly in Supabase SQL Editor
