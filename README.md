# Documents App

This repository was created as part of a recruitment task for a **Senior React Native Developer** position.

It is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). The application displays **documents and notifications** fetched from a simple Go server that generates random mock data.

The server exposes two endpoints:

- **Documents** — an HTTP endpoint that returns an array of randomly generated `Document` objects on each request.
- **Notifications** — a WebSocket endpoint that continuously sends randomly generated notifications to connected clients.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Expo development environment
- Xcode and an iOS Simulator for iOS development
- Android Studio and an Android Emulator for Android development

### 1. Clone the server repository

Clone the server repository into the same parent directory as this repository and rename the server directory to `documents-server`.

The resulting directory structure should look like:

```text
parent-directory/
├── documents-app/
└── documents-server/
```

### 2. Start the server

Navigate to the application directory:

```bash
cd documents-app
```

Start the Go server:

```bash
npm run server
```

### 3. Install application dependencies

In a separate terminal, install the application dependencies:

```bash
npm install
```

### 4. Configure the API URLs

Create a `.env` file in the root of the `documents-app` directory:

```env
EXPO_PUBLIC_API_URL_IOS=http://localhost:8080
EXPO_PUBLIC_API_URL_ANDROID=http://10.0.2.2:8080
```

Separate URLs are required because on an Android Emulator, `10.0.2.2` is used to access the host machine running the server.

### 5. Run on iOS simulator

Start the iOS development server:

```bash
npm run ios
```

### 6. Run on Android emulator

In another terminal, run:

```bash
npm run android
```

Confirm that you want to use a different port.

### Running Both Platforms

When running both platforms simultaneously, you should have three active processes:

1. **Go server** — serves the mock documents and notifications.
2. **Metro/Expo server for iOS** — serves the iOS application.
3. **Metro/Expo server for Android** — serves the Android application.

Once all three are running, both the iOS and Android applications should be able to connect to the Go server and fetch/display data on launch.

## Project Structure

_More details about the project structure and architecture will be added here._

## Implementation Notes

_Details about the implementation, technical decisions, and trade-offs will be added here._

## Development

_Development commands and additional workflows will be documented here._

## Testing

_Testing strategy and instructions will be added here._

## Known Limitations

_Known limitations and potential improvements will be documented here._
