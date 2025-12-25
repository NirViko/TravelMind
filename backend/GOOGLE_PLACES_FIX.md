# Google Places API - REQUEST_DENIED Fix

## Problem
You're seeing `REQUEST_DENIED` errors when trying to fetch photos. This means the API key is not properly configured.

## Solution

### Step 1: Enable Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Search for **"Places API"** (NOT "Places API (New)")
5. Click on it and click **"Enable"**

### Step 2: Check API Key Restrictions
1. Go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "API restrictions":
   - Select "Restrict key"
   - Make sure **"Places API"** is checked
   - OR select "Don't restrict key" (for testing)

### Step 3: Verify API Key
Make sure the API key in `.env` matches the one in Google Cloud Console.

### Step 4: Restart Server
```bash
cd backend
npm run dev
```

## Common Issues

### Issue: REQUEST_DENIED
**Cause:** Places API not enabled or API key restrictions
**Fix:** Enable Places API in Google Cloud Console

### Issue: INVALID_REQUEST
**Cause:** API key format is wrong
**Fix:** Check that API key in `.env` is correct

### Issue: OVER_QUERY_LIMIT
**Cause:** Exceeded free tier limits
**Fix:** Wait a bit or upgrade billing

## Testing

After fixing, you should see in logs:
- `✅ Found photo for: [place name]` instead of `REQUEST_DENIED`

## Alternative: Use Unsplash for Photos

If Google Places API doesn't work, we can use Unsplash API which is easier to set up and free.

