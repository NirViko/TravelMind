# TravelMind Frontend

React Native mobile application built with Expo and TypeScript.

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Zustand** for state management
- **React Query** (@tanstack/react-query) for data fetching
- **React Native Paper** for UI components

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client and services
│   ├── components/    # Reusable UI components
│   ├── constants/     # App constants
│   ├── hooks/         # Custom React hooks
│   ├── navigation/    # Navigation configuration
│   ├── providers/     # Context providers (Query, Theme)
│   ├── screens/       # Screen components
│   ├── store/         # Zustand stores
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── assets/            # Images, fonts, etc.
├── App.tsx            # Root component
└── app.json           # Expo configuration
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## API Configuration

The app automatically detects the platform and uses the correct API URL:

- **iOS Simulator**: `http://localhost:3000/api`
- **Android Emulator**: `http://10.0.2.2:3000/api`
- **Physical Device**: You may need to use your computer's local IP address

### Connecting from a Physical Device

If you're testing on a physical device, you need to:

1. Find your computer's local IP address:
   - **Mac/Linux**: Run `ifconfig` or `ip addr show`
   - **Windows**: Run `ipconfig`
   - Look for your local network IP (usually starts with `192.168.x.x` or `10.0.x.x`)

2. Update the API URL in `src/api/client.ts` or `src/constants/index.ts` to use your IP:
   ```typescript
   return "http://YOUR_IP_ADDRESS:3000/api";
   ```

3. Make sure your device and computer are on the same Wi-Fi network

4. Ensure the backend server is running and accessible

## Development

- The app uses TypeScript for type safety
- State management is handled by Zustand
- API calls are managed through React Query
- UI components are from React Native Paper
