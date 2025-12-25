# Google Places API Photos Setup

## Overview

The system now automatically fetches **real, accurate photos** of destinations, hotels, and restaurants from Google Places API. This ensures you get actual photos of the places, not generic stock images.

## How It Works

1. **AI generates travel plan** with place names and coordinates
2. **System searches Google Places** for each place using name + coordinates
3. **System fetches real photos** from Google Places API
4. **Photos are added** to the travel plan automatically

## Setup Instructions

### Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

### Step 2: Add API Key to Environment

Add to `backend/.env`:

```bash
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

## Features

- ✅ **Real Photos** - Actual photos of the places from Google Maps
- ✅ **Automatic** - No manual work needed, happens automatically
- ✅ **Accurate** - Uses place name + coordinates for precise matching
- ✅ **Fallback** - If photo not found, uses default images

## Cost

Google Places API has a free tier:
- **$200 free credit** per month
- **$17 per 1,000 photo requests** (after free tier)
- For most use cases, the free tier is more than enough

## What Gets Photos

- ✅ **Destinations** - Tourist attractions, landmarks, museums
- ✅ **Hotels** - Real hotel photos
- ✅ **Restaurants** - Real restaurant photos

## How Photos Are Fetched

1. System searches Google Places for each place name
2. Uses coordinates to find the exact location
3. Fetches the first available photo
4. Adds photo URL to the travel plan

## Troubleshooting

### No photos appearing
- Check that `GOOGLE_PLACES_API_KEY` is in `.env`
- Verify Places API is enabled in Google Cloud Console
- Check API key has proper permissions
- Check console logs for errors

### Rate limit errors
- Google Places API has rate limits
- Free tier: 1,000 requests/day
- If exceeded, photos will be skipped (not critical)

### Photos not matching places
- Google Places uses name + coordinates for matching
- If coordinates are wrong, might get wrong photos
- System will fallback to default images if no match found

## Benefits

- **User Experience** - Users see actual photos of places
- **Trust** - Real photos increase credibility
- **Accuracy** - Photos match the actual places
- **Automatic** - No manual work required

