# פתרון בעיות - הרשמה תקועה

## הבעיה: ההרשמה תקועה על Loader

### שלב 1: בדוק שה-Tables נוצרו

1. היכנס ל-Supabase Dashboard
2. לך ל-**Table Editor**
3. בדוק אם יש את ה-tables הבאים:
   - ✅ `profiles`
   - ✅ `travel_plans`
   - ✅ `search_history`

**אם אין את ה-tables:**
- לך ל-**SQL Editor**
- העתק והרץ את ה-SQL מ-`SUPABASE_SETUP.md`

### שלב 2: בדוק את ה-Logs של Backend

פתח טרמינל נוסף והרץ:
```bash
cd backend
npm run dev
```

נסה להירשם שוב ותראה ב-logs:
- `Signup request received:` - הבקשה הגיעה
- `User created successfully:` - המשתמש נוצר
- או שגיאות אם יש

### שלב 3: בדוק את ה-Logs של Supabase

1. היכנס ל-Supabase Dashboard
2. לך ל-**Logs** → **API Logs**
3. בדוק אם יש שגיאות

### שלב 4: בדוק את החיבור

נסה לבדוק אם ה-backend יכול להתחבר ל-Supabase:

```bash
cd backend
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('profiles').select('count').then(r => console.log('Connection OK:', r)).catch(e => console.error('Connection Error:', e));
"
```

### שלב 5: בדוק את ה-Email Confirmation

ב-Supabase, בדוק את ה-Authentication settings:

1. לך ל-**Authentication** → **Settings**
2. בדוק את **Enable email confirmations**
3. אם זה מופעל - המשתמש צריך לאשר את האימייל לפני שהוא יכול להתחבר

**פתרון:**
- או כבה את **Enable email confirmations** (לפיתוח)
- או לך ל-**Authentication** → **Users** → בחר משתמש → **Confirm email**

### שלב 6: בדוק את ה-API URL

ודא שה-frontend מתחבר ל-backend הנכון:

1. בדוק את `frontend/.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

2. אם אתה על מכשיר פיזי, שנה ל-IP שלך:
```env
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000/api
```

### שלב 7: בדוק את ה-Response

הוספתי console.log ב-backend. בדוק את ה-logs:

אם אתה רואה:
- `Signup request received:` - הבקשה הגיעה
- `Supabase auth error:` - יש שגיאה מ-Supabase
- `No user returned` - Supabase לא החזיר משתמש

### שגיאות נפוצות:

#### 1. "relation 'profiles' does not exist"
**פתרון:** צור את ה-tables (שלב 1)

#### 2. "Invalid API key"
**פתרון:** בדוק שה-keys ב-`.env` נכונים

#### 3. "Email already registered"
**פתרון:** המשתמש כבר קיים, נסה להתחבר במקום

#### 4. "User already registered"
**פתרון:** המשתמש כבר קיים, נסה להתחבר

### בדיקה מהירה:

נסה לבדוק את ה-endpoint ישירות:

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

אם זה עובד - הבעיה ב-frontend
אם זה לא עובד - הבעיה ב-backend או Supabase

---

## מה עשיתי:

1. ✅ הוספתי console.log ל-backend כדי לראות מה קורה
2. ✅ הוספתי fallback ליצירת profile אם ה-trigger לא עובד
3. ✅ שיפרתי error handling

---

## צעדים הבאים:

1. בדוק את ה-logs של ה-backend
2. בדוק אם ה-tables נוצרו
3. נסה להירשם שוב
4. אם עדיין לא עובד - שלח לי את ה-logs

