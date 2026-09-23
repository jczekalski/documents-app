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

The app keeps route entry points in `src/app/` and organizes the document experience under `src/features/documents/`. Shared UI lives in `src/components/`, while API access, app state, and pure helpers are grouped in `src/services/`, `src/stores/`, and `src/utils/` respectively.

## Dependencies

These dependencies are used directly by the app:

- **`@expo/vector-icons`** — Provides a consistent set of native-friendly icons without maintaining custom image assets.
- **`@gorhom/bottom-sheet`** — Supplies the add-document sheet and keyboard-aware inputs, avoiding custom gesture and sheet behavior. It's the most widely used and reliable bottom sheet library, [recommended by the Reanimated team](https://docs.swmansion.com/react-native-reanimated/examples/bottomsheet/).
- **`axios`** — Handles the app’s HTTP requests with a consistent promise-based API and response errors.
- **`date-fns`** — Used for formatting relative timestamps.
- **`expo-asset`** — Resolves the bundled sample CSV attachments asset across iOS and Android.
- **`expo-crypto`** — Generates document IDs with a cross-platform random UUID implementation.
- **`expo-document-picker`** — Opens the platform file picker for selecting an attachment CSV.
- **`expo-file-system`** — Used for processing CSV files and creates a .json file when sharing documents.
- **`expo-router`** — Provides Expo’s file-based navigation. In this case the app contains only one screen.
- **`expo-sqlite`** — Its `kv-store` persists documents and notifications locally while remaining compatible with Expo Go.
- **`expo-sharing`** — Opens the native share sheet for a temporary JSON export of a document.
- **`react-native-safe-area-context`** — Applies device safe-area insets consistently to sheet and screen controls.
- **`react-native-toast-message`** — Displays incoming WebSocket notifications without building a custom toast UI.

## Features

### Required features

- **Most recent documents in list or grid view — Completed.** Documents are displayed using a single `FlatList`, with the view toggle switching between a single-column list and a two-column grid. Since both views use the same underlying data and only differ in their layout and level of detail, I chose to re-render the list when the view mode changes rather than maintaining two separate `FlatList` instances. This keeps the implementation simpler and avoids duplicating list configuration and behavior. When using grid view, the number of columns can be easily modified be updating the `GRID_MODE_COLUMNS_COUNT` variable. The sort selector is also fully functional and supports sorting by newest date, oldest date, or title order.
- **Real-time notifications for documents created by other users — Completed.** A WebSocket connection receives notification events and displays them as queued in-app toast messages. The WebSocket keeps updates live without polling, and the queue logic spaces out toasts so the user is not spammed with notifications.
- **Create a document — Completed in the app.** The add-document sheet collects a name, version, and attachment CSV, parses attachment names, then adds the new document to the current app state. In development, a bundled CSV supplies sample attachments when no file is selected. The current client adds documents locally; the server API used by this app does not expose a create endpoint for persistence.

### Optional features

- **Basic offline support — Completed.** Intentionally simple: each provider restores its data array from `expo-sqlite/kv-store` at startup and saves it whenever state changes. To try it, run the app with the Go server and wait for documents to load, stop the server, then restart the app. The cached state should load and the app should remain usable offline. Start the Go server again and relaunch the app to fetch fresh documents. A much better production solution would be to use an offline-first architecture or a database with offline synchronization; resolving conflicts and syncing changes manually is difficult and error-prone.
- **Local notifications — Not completed.** New document events currently appear as in-app toasts while the WebSocket is connected. The app does not schedule native local notifications since Expo Go does not support notifications on the simulator. However, at this point swapping out the toast approach for scheduling local notifications would be simple and would only require some additional setup handling platform permission and notification configuration on each platform.
- **Pull to refresh — Completed.** Useful for testing, the app will fetch a new array of documents on each pull.
- **Native share button — Completed.** Each document card shares a JSON file with the document data through the platform share sheet.
- **Relative dates — Completed.** Document cards show created and updated timestamps as relative labels, formatted with `date-fns` (for example, “Created 1 day ago”).

## Development

The pre-commit hook runs ESLint, TypeScript, and Jest checks before each commit.
It is installed automatically when dependencies are installed with `npm install`.
To install it manually, run:

```bash
npm run prepare
```

You can run the checks directly with `npm run lint`, `npm run typecheck`.

## Testing

Run the unit tests with:

```bash
npm test -- --runInBand
```

The tests cover utility behavior such as recursive key normalization and attachment CSV parsing.

## Known Limitations

The mock server returns randomly generated documents on each request. New documents created in the app are added to client state and are not persisted by the server. See [Features](#features) for more detailed information on how each feature was implemented.
