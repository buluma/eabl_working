# EABL Stock Monitoring Application

## Project Overview

The EABL Stock Monitoring application is a mobile application built using Intel XDK (now discontinued) and Apache Cordova. It serves as a stock monitoring and outlet management system for GBC (Greenbell Communications), primarily used for tracking retail outlets, managing stock levels, and collecting field data for East African Breweries Limited (EABL).

The application is designed for field representatives and team leaders to monitor retail outlets, track stock levels, record quality issues, manage promotions, and synchronize data with a central server. It features offline capabilities using SQLite local storage, allowing users to work without constant internet connectivity.

### Key Features

- **User Authentication**: Secure login system with username/password validation against a remote server
- **Outlet Management**: Create, view, and manage retail outlets/stores with detailed information
- **Stock Monitoring**: Track stock levels of various EABL products at different outlets
- **Data Synchronization**: Sync local data with remote server when online
- **Offline Capability**: Full functionality available offline with SQLite local storage
- **GPS Integration**: Automatic location tracking using device geolocation
- **Quality Issues Tracking**: Record and report quality issues at outlets
- **Promotion Tracking**: Monitor promotional activities at retail locations
- **Activity Reporting**: Track various activities and challenges at outlets

### Technology Stack

- **Platform**: Intel XDK / Apache Cordova
- **Frontend**: HTML5, CSS3, JavaScript
- **Framework**: jQuery, Bootstrap
- **Database**: SQLite (local), MySQL (server-side)
- **Plugins**: Cordova plugins for camera, geolocation, file transfer, notifications
- **Icons**: Icomoon icon font
- **Date Handling**: Moment.js

## Project Structure

```
eabl_working/
├── bulumaeabl.keystore          # Android keystore for signing
├── EABL_App.xdk                 # Intel XDK project file
├── EABL_App.xdke                # Intel XDK export file
├── eabl.sql                     # Database schema
├── intelxdk.config.*.xml        # Intel XDK configuration files
├── xdk-publish-meta-data.json   # Publishing metadata
├── img/                         # Images and icons
├── plugins/                     # Cordova plugins
├── www/                         # Main application source
│   ├── index.html               # Splash screen and login
│   ├── app.html                 # Main application dashboard
│   ├── stores.html              # Store/outlet management
│   ├── storemenu.html           # Individual store menu
│   ├── sync.html                # Data synchronization
│   ├── js/
│   │   ├── index.js             # Login functionality
│   │   ├── app.js               # Main app logic
│   │   ├── stores.js            # Store management
│   │   ├── storage.js           # Database operations
│   │   ├── functions.js         # Utility functions
│   │   ├── userdata.js          # User data handling
│   │   └── ...                  # Other JS files
│   ├── css/                     # Stylesheets
│   ├── bootstrap/               # Bootstrap framework
│   ├── icomoon/                 # Icon fonts
│   └── ...
```

## Building and Running

### Prerequisites
- Intel XDK (discontinued, but project files available)
- Android SDK (for Android builds)
- iOS SDK (for iOS builds, macOS only)

### Setup Instructions
1. Clone the repository
2. Open the project in Intel XDK using the `.xdk` file
3. Configure build settings in Intel XDK
4. Build for desired platforms (Android, iOS, Windows)

### Alternative Cordova Setup
Since Intel XDK is discontinued, the project can be migrated to standard Cordova:

1. Install Node.js and Cordova CLI
2. Create a new Cordova project
3. Copy the `www` folder contents
4. Add the required plugins (see `intelxdk.config.android.xml`)
5. Build using `cordova build android` or `cordova build ios`

### Required Cordova Plugins
Based on the configuration files, the following plugins are used:
- cordova-plugin-camera
- cordova-plugin-device
- cordova-plugin-dialogs
- cordova-plugin-file
- cordova-plugin-file-transfer
- cordova-plugin-geolocation
- cordova-plugin-network-information
- intel.xdk.device
- cordova-plugin-whitelist

## Database Schema

The application uses SQLite for local storage with the following tables:

- `stores`: Retail outlet information
- `locations`: Location data for outlets
- `shop_checkin`: Check-in/check-out records
- `activation`: Activation status tracking
- `visibility`: Visibility assessment data
- `placement`: Product placement data
- `availability`: Product availability data
- `my_outlets`: User's assigned outlets
- `focus_areas`: Focus area tracking
- Various other tables for different data collection aspects

## Key Components

### Authentication Flow
1. User enters credentials on splash screen
2. Credentials are verified against remote server
3. User data and assigned stores are downloaded
4. Local storage is populated with user and store data
5. User is redirected to main application

### Data Synchronization
- Local SQLite database stores all data offline
- Sync functionality uploads local data to server
- Download new store information from server
- Timestamp-based sync to minimize data transfer

### Offline Capability
- Full application functionality available offline
- Data stored locally until connection is restored
- Conflict resolution for data modified both locally and on server

## Development Conventions

### Naming Conventions
- JavaScript: camelCase for variables and functions
- HTML/CSS: lowercase with hyphens for classes
- Database: snake_case for table and column names

### Code Structure
- Separate files for different functionalities (index.js, app.js, stores.js, etc.)
- jQuery-based DOM manipulation
- Modular approach with specific functions for each feature

### Error Handling
- Basic error handling with try/catch blocks
- User notifications for network errors
- Validation for form inputs

## Security Considerations

- Passwords stored locally (should be improved)
- API endpoints may be exposed in code
- Authentication tokens stored in local storage
- Consider implementing additional encryption for sensitive data

## Maintenance Notes

This project uses Intel XDK which is no longer maintained. For continued development:
- Migrate to standard Cordova/PhoneGap
- Update dependencies to current versions
- Consider moving to modern frameworks like Ionic or React Native
- Implement better security practices
- Add automated testing