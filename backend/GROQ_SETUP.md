# Groq API Setup Guide

## Why Groq?

- ✅ **100% Free** - Generous free tier (30 requests/minute)
- ⚡⚡⚡⚡⚡ **Very Fast** - Fastest inference available
- ⭐⭐⭐⭐⭐ **Accurate** - Uses Llama 3.1 70B (much better than 8B)
- 🚀 **Easy Setup** - Simple API integration

## Setup Instructions

### Step 1: Get Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for a free account (no credit card required!)
3. Go to [API Keys](https://console.groq.com/keys)
4. Click "Create API Key"
5. Copy the API key

### Step 2: Add API Key to Environment

Add the API key to your `backend/.env` file:

```bash
GROQ_API_KEY=your_api_key_here
```

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

## How It Works

The system will:

1. **Try Groq first** - If API key is configured, use Groq with Llama 3.1 70B
2. **Fallback to Hugging Face** - If Groq fails or isn't configured, use Hugging Face

## Available Models

- `llama-3.1-70b-versatile` (default) - Most accurate, recommended
- `llama-3.1-8b-instant` - Faster but less accurate
- `mixtral-8x7b-32768` - Alternative 70B model

To change the model, edit `backend/src/routes/travel.ts` line ~210:

```typescript
aiResponse = await GroqService.chatCompletion(
  messages,
  "llama-3.1-8b-instant", // Change model here
  {
    maxTokens: 4000,
    temperature: 0.3,
  }
);
```

## Free Tier Limits

- **30 requests per minute**
- **No daily limit!**
- **No credit card required**

Perfect for development and small-scale use!

## Why It's Better

- **70B model** vs 8B - Much more accurate
- **Faster** - Groq's infrastructure is optimized for speed
- **Free** - No cost, no credit card needed
- **Reliable** - Stable API

## Troubleshooting

### Error: "Groq API key is not configured"

- Make sure `GROQ_API_KEY` is in your `.env` file
- Restart the backend server after adding the key

### Error: "Rate limit exceeded"

- You've hit the free tier limit (30/min)
- Wait a moment and try again
- The system will automatically fallback to Hugging Face

### Error: "Invalid API key"

- Check that your API key is correct
- Make sure there are no extra spaces in the `.env` file
- Verify the key is active in Groq Console

## Cost

**100% Free!** No credit card required, no hidden costs.
