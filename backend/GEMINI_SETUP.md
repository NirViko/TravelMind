# Google Gemini API Setup Guide

## Why Gemini?
- ⭐⭐⭐⭐⭐ **Most Accurate** - Better than Hugging Face models for factual information
- ✅ **Free Tier** - 15 requests/minute, 1,500 requests/day
- 🚀 **Fast** - Quick response times
- 💰 **Cost Effective** - Free for most use cases

## Setup Instructions

### Step 1: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### Step 2: Add API Key to Environment

Add the API key to your `backend/.env` file:

```bash
GEMINI_API_KEY=your_api_key_here
```

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

## How It Works

The system will:
1. **Try Gemini first** - If API key is configured, use Gemini
2. **Fallback to Hugging Face** - If Gemini fails or isn't configured, use Hugging Face

## Available Models

- `gemini-1.5-flash` (default) - Fast and accurate, recommended
- `gemini-pro` - More accurate but slower

To change the model, edit `backend/src/routes/travel.ts` line ~210:

```typescript
aiResponse = await GeminiService.chatCompletion(
  messages,
  "gemini-pro", // Change to gemini-pro for better accuracy
  {
    maxOutputTokens: 4000,
    temperature: 0.3,
  }
);
```

## Free Tier Limits

- **15 requests per minute**
- **1,500 requests per day**

For most development and small-scale use, this is more than enough!

## Troubleshooting

### Error: "Gemini API key is not configured"
- Make sure `GEMINI_API_KEY` is in your `.env` file
- Restart the backend server after adding the key

### Error: "Rate limit exceeded"
- You've hit the free tier limit (15/min or 1500/day)
- Wait a moment and try again
- The system will automatically fallback to Hugging Face

### Error: "Invalid API key"
- Check that your API key is correct
- Make sure there are no extra spaces in the `.env` file

## Cost

**Free tier is generous!** For most use cases, you won't need to pay anything.

If you exceed the free tier:
- Pay-as-you-go pricing is very reasonable
- Check [Google AI Studio pricing](https://ai.google.dev/pricing) for details

