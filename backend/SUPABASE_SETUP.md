# הגדרת Supabase - TravelMind

## שלב 1: קבלת Credentials מ-Supabase

1. היכנס ל-[supabase.com](https://supabase.com)
2. בחר את הפרויקט שלך
3. לך ל-Settings → API
4. העתק:
   - **Project URL** (לדוגמה: `https://xxxxx.supabase.co`)
   - **anon/public key** (המפתח הציבורי)
   - **service_role key** (המפתח הפרטי - רק ל-backend!)

## שלב 2: הוספת משתני סביבה

הוסף ל-`backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## שלב 3: יצירת Tables ב-Supabase

לך ל-SQL Editor ב-Supabase והרץ את ה-SQL הבא:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (מחובר ל-auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  firstName TEXT,
  lastName TEXT,
  dateOfBirth DATE,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Travel Plans table
CREATE TABLE IF NOT EXISTS travel_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  budget TEXT,
  plan_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE travel_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own travel plans
CREATE POLICY "Users can view own travel plans"
  ON travel_plans FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own travel plans
CREATE POLICY "Users can insert own travel plans"
  ON travel_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own travel plans
CREATE POLICY "Users can update own travel plans"
  ON travel_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own travel plans
CREATE POLICY "Users can delete own travel plans"
  ON travel_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Search History table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  destination TEXT,
  budget TEXT,
  dates TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own search history
CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own search history
CREATE POLICY "Users can insert own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own search history
CREATE POLICY "Users can delete own search history"
  ON search_history FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, firstName, lastName, dateOfBirth)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    (NEW.raw_user_meta_data->>'dateOfBirth')::DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## שלב 4: התקנת Supabase Client

```bash
cd backend
npm install @supabase/supabase-js
```

```bash
cd frontend
npm install @supabase/supabase-js
```

## שלב 5: הגדרת Authentication ב-Supabase

1. לך ל-Authentication → Providers
2. הפעל **Email** provider
3. (אופציונלי) הפעל **Google** או **Facebook** אם תרצה

## שלב 6: בדיקה

לאחר ההגדרה, תוכל לבדוק:

- Authentication → Users - לראות משתמשים
- Table Editor - לראות את ה-tables
- API Docs - לראות את ה-API אוטומטי

## הערות חשובות:

1. **Service Role Key** - רק ב-backend! לעולם לא ב-frontend!
2. **Anon Key** - בטוח לשימוש ב-frontend
3. **Row Level Security** - מגן על הנתונים שלך
4. **Profiles** - נוצר אוטומטית כשמשתמש נרשם

## מה הלאה?

עכשיו תוכל:

1. לחבר את ה-backend ל-Supabase
2. לחבר את ה-frontend ל-Supabase
3. להשתמש ב-Authentication מובנה
4. לשמור travel plans ו-search history
