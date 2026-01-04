# איך לעדכן את ה-IP Address

## הבעיה:
כשה-IP של המחשב שלך משתנה, ה-frontend לא יכול להתחבר ל-backend.

## פתרון:

### שלב 1: מצא את ה-IP החדש

**ב-Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**או:**
```bash
ipconfig getifaddr en0
```

**ב-Windows:**
```bash
ipconfig
```
חפש את ה-IPv4 Address (בדרך כלל `192.168.x.x`)

### שלב 2: עדכן את ה-.env

ערוך את `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.101:3000/api
```

**החלף `192.168.0.101` ב-IP שלך!**

### שלב 3: הפעל מחדש את Expo

```bash
cd frontend
# עצור את ה-server (Ctrl+C)
npm start
# או
npx expo start --clear
```

## טיפים:

1. **אם ה-IP משתנה לעתים קרובות:**
   - אפשר להשתמש ב-`localhost` אם אתה על סימולטור
   - או להשתמש ב-`ngrok` ל-tunnel קבוע

2. **לבדיקה מהירה:**
   ```bash
   curl http://YOUR_IP:3000/health
   ```

3. **אם אתה על מכשיר פיזי:**
   - ודא שה-backend רץ על `0.0.0.0` (כבר מוגדר)
   - ודא שה-backend וה-frontend באותו רשת WiFi

## IP נוכחי:
ה-IP שלך עכשיו: **192.168.0.101**

עדכן את `frontend/.env`:
```env
EXPO_PUBLIC_API_URL=http://192.168.0.101:3000/api
```

