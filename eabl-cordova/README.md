# EABL Stock Monitoring Application - Cordova Migration

This project is a migration from Intel XDK to Apache Cordova with a local SQLite database backend.

## Project Structure

```
eabl-cordova/
├── config.xml              # Cordova configuration
├── package.json            # Node.js dependencies for Cordova
├── www/                    # Web application files
│   ├── index.html          # Login screen
│   ├── app.html            # Main application
│   ├── stores.html         # Store management
│   ├── js/                 # JavaScript files
│   ├── css/                # Stylesheets
│   ├── img/                # Images
│   └── data/               # Local SQLite database
├── server/                 # Local server files
│   ├── server.js           # Main server file
│   ├── init-db.js         # Database initialization script
│   └── package.json       # Server dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Cordova CLI: `npm install -g cordova`

### Installation

1. Install Cordova dependencies:
```bash
cd eabl-cordova
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Initialize the database:
```bash
cd server
node init-db.js
```

4. Add platforms:
```bash
cd ..
cordova platform add android
cordova platform add ios
```

5. Add plugins:
```bash
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-file-transfer
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-network-information
```

## Running the Application

### For Development (Web Browser)
1. Start the server:
```bash
cd eabl-cordova/server
npm start
```

2. Open `www/index.html` in a browser (with CORS disabled for testing)

### For Mobile Platforms
1. Build the application:
```bash
cordova build android
# or
cordova build ios
```

2. Run on device/emulator:
```bash
cordova run android
# or
cordova run ios
```

## API Endpoints

The application now uses a local Express server with the following endpoints:

- `GET /api/webservice.php?user_auth=username` - Authenticate user
- `GET /api/stores` - Get all stores
- `POST /api/stores` - Add a new store
- `PUT /api/stores/:id` - Update a store
- `DELETE /api/stores/:id` - Delete a store
- `GET /api/stores/:id` - Get a specific store
- `GET /api/sync` - Get data to sync
- `POST /api/mark-synced` - Mark records as synced

## Database Schema

The application uses a local SQLite database with the following tables:
- `users` - User authentication data
- `stores` - Retail outlet information
- `locations` - Location data for outlets
- `shop_checkin` - Check-in/check-out records
- `activation` - Activation status tracking
- `visibility` - Visibility assessment data
- `placement` - Product placement data
- `availability` - Product availability data
- `my_outlets` - User's assigned outlets
- `focus_areas` - Focus area tracking

## Key Changes from Intel XDK

1. Migrated from Intel XDK to Apache Cordova
2. Replaced PHP web services with Node.js/Express server
3. Using local SQLite database for both frontend and backend
4. Updated server endpoints to point to local server
5. Maintained all original functionality while improving maintainability

## Security Considerations

- The local server runs on `http://localhost:3000`
- Authentication is handled locally
- For production, implement proper authentication and encryption