# Electron Setup Guide for Hotel Mini ERP

This guide explains how to set up and build the Hotel Mini ERP application as a Windows desktop app using Electron.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Windows 10/11 (for Windows builds)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (including Electron):
```bash
npm install
```

This will install all React dependencies plus:
- `electron` - Electron framework
- `electron-builder` - Build tool for creating installers
- `electron-is-dev` - Utility to detect development mode

## Development

To run the app in development mode with Electron:

1. Start the React development server (in one terminal):
```bash
npm start
```

2. In another terminal, start Electron:
```bash
npm run electron-dev
```

The Electron window will open and connect to your React dev server at `http://localhost:3000`.

## Building for Production

### Step 1: Build React App

First, build the React application:
```bash
npm run build
```

### Step 2: Build Electron App

Build the Windows installer:
```bash
npm run electron-pack
```

This will:
- Create a production build of the React app
- Package it with Electron
- Generate a Windows installer (NSIS) in the `dist` folder

The installer will be located at:
```
frontend/dist/Hotel Mini ERP Setup x.x.x.exe
```

## Configuration

### Electron Main Process

The main Electron process is configured in `electron/main.js`:
- Window size: 1200x800
- Development mode: Opens DevTools automatically
- Production mode: Loads from built React app

### Electron Builder Configuration

Build configuration is in `package.json` under the `build` section:
- App ID: `com.hotelminierp.app`
- Product Name: `Hotel Mini ERP`
- Windows target: NSIS installer (x64)
- Creates desktop and start menu shortcuts

## Customization

### Change Window Size

Edit `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1400,  // Change width
  height: 900,  // Change height
  // ...
});
```

### Change App Icon

1. Place your icon file in `frontend/build/` (e.g., `icon.ico` for Windows)
2. Update `package.json`:
```json
"win": {
  "icon": "build/icon.ico"
}
```

### Change Installer Options

Edit the `nsis` section in `package.json`:
```json
"nsis": {
  "oneClick": true,  // One-click installer
  "allowToChangeInstallationDirectory": false,
  // ...
}
```

## Troubleshooting

### Electron window is blank

- Ensure the React dev server is running (`npm start`)
- Check the Electron console for errors
- Verify the URL in `electron/main.js` matches your dev server port

### Build fails

- Ensure all dependencies are installed: `npm install`
- Check that React build completed successfully: `npm run build`
- Verify Node.js version is compatible (v16+)

### Installer not created

- Check that `electron-builder` is installed
- Verify the `build` section exists in `package.json`
- Check for errors in the build output

## Distribution

After building, distribute the installer from the `dist` folder:
- Windows: `Hotel Mini ERP Setup x.x.x.exe`

Users can install the app by running the installer, which will:
1. Install the application
2. Create desktop shortcut
3. Add to Start Menu
4. Register for auto-updates (if configured)

## Notes

- The app connects to the backend API (configure API URL in React app)
- In production, update the API base URL to point to your production server
- Electron apps are larger than web apps due to bundled Chromium
- Consider code signing for production distribution

