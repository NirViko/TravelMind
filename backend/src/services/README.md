# Services

This directory contains service modules for external API integrations.

## Hugging Face Service

The `huggingface.ts` service provides integration with Hugging Face Inference API for AI-powered features.

### Usage

```typescript
import { HuggingFaceService } from './services/huggingface';

// Chat completion
const response = await HuggingFaceService.chatCompletion([
  { role: 'user', content: 'Hello!' }
]);

// Text generation
const text = await HuggingFaceService.textGeneration('Write a travel guide');
```

### Environment Variables

Make sure to set `HUGGINGFACE_TOKEN` in your `.env` file.

