# Sessions: COMP4511 Beta App

A React Native (Expo) app for finding, joining and creating local sport sessions with friends. The app was built and tested on **iOS** (iPhone, in Expo Go and the iOS Simulator).

## Requirements

- [Node.js](https://nodejs.org/) LTS (tested with Node 24)
- One of:
  - **Expo Go** on an iPhone ([App Store](https://apps.apple.com/app/expo-go/id982107779)), with the iPhone and computer on the same Wi-Fi network
  - **Xcode** with the iOS Simulator (Mac only)

No accounts, API keys or backend are needed. All data is sample data stored on the device.

## Running the app

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/benstander/4511-Beta-Application-Development.git
   cd 4511-Beta-Application-Development
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Open the app:
   - **iPhone:** scan the QR code in the terminal with the Camera app. It opens in Expo Go.
   - **iOS Simulator:** press `i` in the terminal. Expo Go installs in the simulator automatically the first time.

## Using the app

You are signed in as the sample user **Ben**. The app has four tabs:

- **Sessions:** browse upcoming sessions by sport, filter them, and open one to join it. The bell in the top right opens your notifications (invites, replies to your sessions and reminders).
- **My Sessions:** sessions you're going to, invites waiting for an answer, sessions you created and your history. Open one to leave, edit or delete it, or to accept or decline an invite.
- **Create:** a step-by-step flow to create a session (details, time, location, session type, invite friends, summary).
- **Profile:** your profile, editing your name and bio, and managing friends.

Other people, their replies and the notification history are simulated so the app looks like it's in real use.

## Project structure

- `src/app/`: screens and navigation (Expo Router; each folder is a tab)
- `src/components/`: shared UI components
- `src/data/`: sample data and the on-device stores
- `src/screens/`: screens shared between tabs (session details)
- `assets/`: icons and images
