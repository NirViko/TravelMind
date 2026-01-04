# Authentication Setup Guide

## Overview
The app supports three authentication methods:
1. Email/Password login
2. Google OAuth
3. Facebook OAuth

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# Google OAuth
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# Facebook OAuth
EXPO_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application" or "iOS/Android" based on your platform
6. Add authorized redirect URIs:
   - For development: `travelmind://google`
   - For production: Your production redirect URI
7. Copy the Client ID to your `.env` file

### 3. Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Configure OAuth Redirect URIs:
   - For development: `travelmind://facebook`
   - For production: Your production redirect URI
5. Copy the App ID to your `.env` file

### 4. App Configuration

The app is already configured with:
- Scheme: `travelmind` (in `app.json`)
- Redirect URIs: `travelmind://google` and `travelmind://facebook`

### 5. Development Mode

If you don't have OAuth credentials configured, the app will still work in development mode:
- Google/Facebook login will simulate a successful login
- Email/Password login will work with any credentials

### 6. Production Setup

For production, you must:
1. Configure real OAuth credentials
2. Implement backend API endpoints for:
   - Email/Password authentication
   - OAuth token verification
   - User creation/management
3. Update `authService.ts` to call your backend API instead of simulating login

## Current Implementation

- **Auth Store**: Manages user state using Zustand
- **Auth Service**: Handles OAuth flows and email/password login
- **User Storage**: Saves user data in AsyncStorage
- **Auto-login**: Loads saved user on app startup

## Next Steps

1. Set up OAuth credentials (optional for development)
2. Implement backend authentication endpoints
3. Update `authService.ts` to use real API calls
4. Add user profile management
5. Add logout functionality to UI

