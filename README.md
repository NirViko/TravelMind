# TravelMind

A full-stack travel companion application with React Native frontend and Node.js backend.

## Project Structure

```
TravelMind/
├── frontend/          # React Native Expo app (TypeScript)
│   ├── src/
│   │   ├── api/       # API client
│   │   ├── components/# UI components
│   │   ├── constants/ # App constants
│   │   ├── hooks/     # Custom hooks
│   │   ├── navigation/# Navigation setup
│   │   ├── providers/ # Context providers
│   │   ├── screens/   # Screen components
│   │   ├── store/     # Zustand stores
│   │   ├── types/     # TypeScript types
│   │   └── utils/     # Utility functions
│   └── ...
├── backend/           # Node.js Express server (TypeScript)
│   ├── src/
│   │   ├── index.ts   # Main server file
│   │   ├── routes/    # API routes
│   │   ├── middleware/# Custom middleware
│   │   └── types/     # TypeScript types
│   └── ...
└── README.md
```

## Tech Stack

### Frontend

- **React Native** with **Expo**
- **TypeScript**
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **React Native Paper** - UI component library

### Backend

- **Node.js** with **Express**
- **TypeScript**
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **Hugging Face Inference API** - AI-powered features

## Getting Started

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with the following variables:

```bash
PORT=3000
NODE_ENV=development
API_VERSION=v1
HUGGINGFACE_TOKEN=your_token_here
```

4. Start development server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start Expo development server:

```bash
npm start
```

4. Run on iOS:

```bash
npm run ios
```

5. Run on Android:

```bash
npm run android
```

## API Endpoints

### AI Endpoints

- `POST /api/ai/chat` - Chat completion using Hugging Face AI

  ```json
  {
    "messages": [{ "role": "user", "content": "Hello!" }],
    "model": "meta-llama/Meta-Llama-3-8B-Instruct",
    "max_tokens": 500,
    "temperature": 0.7
  }
  ```

- `POST /api/ai/generate` - Text generation using Hugging Face AI
  ```json
  {
    "prompt": "Write a travel guide",
    "model": "mistralai/Mistral-7B-Instruct-v0.2",
    "max_new_tokens": 500,
    "temperature": 0.7
  }
  ```

## Development

- Both frontend and backend use TypeScript for type safety
- Frontend uses Zustand for global state management
- Frontend uses React Query for server state management
- Backend uses Express with TypeScript
- AI features powered by Hugging Face Inference API

### Using AI in Frontend

```typescript
import { useAIChat } from "./hooks/useAI";

const MyComponent = () => {
  const aiChat = useAIChat();

  const handleChat = async () => {
    const result = await aiChat.mutateAsync({
      messages: [{ role: "user", content: "Your question here" }],
    });
    console.log(result.data.content);
  };
};
```

## License

ISC
