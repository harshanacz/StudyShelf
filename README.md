# StudyShelf 📚

A mobile app designed to help university and school students easily browse, discover, and manage reference books related to their subjects.

## Features

- **Authentication System**: Login/Register with form validation
- **State Management**: Redux Toolkit for global state management
- **User Profile**: Username displayed globally across the app
- **Book Discovery**: Browse books by subject (coming soon)
- **Personal Library**: Save and manage your book collection (coming soon)

## Tech Stack

- React Native with Expo
- TypeScript
- Redux Toolkit for state management
- Expo Router for navigation

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

## Demo Credentials

For testing the authentication:
- **Username**: student
- **Password**: pass123

## Project Structure

```
app/
├── (auth)/          # Authentication screens
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/          # Main app tabs
│   ├── index.tsx    # Home screen
│   └── explore.tsx  # Explore books
store/               # Redux store
├── index.ts         # Store configuration
├── auth-slice.ts    # Authentication state
└── hooks.ts         # Typed Redux hooks
```

## Development

This project uses file-based routing with Expo Router. Edit files in the `app` directory to see changes reflected immediately.
