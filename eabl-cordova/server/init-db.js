const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '../www/data/eabl_app_db.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample users data
const sampleUsers = [
  {
    userid: '1',
    username: 'admin',
    fullname: 'Admin User',
    userpass: 'admin123',
    useremail: 'admin@example.com',
    assigned: 'admin',
    is_promoter: 1
  },
  {
    userid: '2',
    username: 'johndoe',
    fullname: 'John Doe',
    userpass: 'password123',
    useremail: 'john@example.com',
    assigned: 'team-leader',
    is_promoter: 1
  },
  {
    userid: '3',
    username: 'janedoe',
    fullname: 'Jane Doe',
    userpass: 'password123',
    useremail: 'jane@example.com',
    assigned: 'promoter',
    is_promoter: 1
  }
];

// Sample stores data
const sampleStores = [
  {
    server_id: 1,
    name: 'Safaricom Moi Avenue',
    account: 'Safaricom',
    category: 'Retail',
    region: 'Nairobi',
    location: 'Moi Avenue',
    building: 'Moi Avenue Plaza',
    address: 'Moi Avenue, Nairobi',
    phone: '+254712345678',
    email: 'contact@safaricom.co.ke',
    contactperson: 'John Kamau',
    manager_name: 'Jane Smith',
    manager_phone: '+254712345679',
    manager_email: 'jane@safaricom.co.ke',
    coordinates: '-1.286389,36.817223',
    remarks: 'Main branch',
    submitter: 'johndoe'
  },
  {
    server_id: 2,
    name: 'Tusker House',
    account: 'EABL',
    category: 'Bar',
    region: 'Nairobi',
    location: 'Upper Hill',
    building: 'Tusker House',
    address: 'Upper Hill, Nairobi',
    phone: '+254712345680',
    email: 'info@tuskerhouse.co.ke',
    contactperson: 'Mike Johnson',
    manager_name: 'Sarah Wilson',
    manager_phone: '+254712345681',
    manager_email: 'sarah@tuskerhouse.co.ke',
    coordinates: '-1.279444,36.822222',
    remarks: 'Popular hangout spot',
    submitter: 'janedoe'
  }
];

// Create tables if they don't exist
const tables = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userid VARCHAR,
    username VARCHAR,
    fullname VARCHAR,
    userpass VARCHAR,
    useremail VARCHAR,
    assigned VARCHAR,
    is_promoter BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  
  // Stores table
  `CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER,
    name VARCHAR,
    account VARCHAR,
    category VARCHAR,
    region VARCHAR,
    location VARCHAR,
    building VARCHAR,
    address VARCHAR,
    phone VARCHAR,
    email VARCHAR,
    contactperson VARCHAR,
    manager_name VARCHAR,
    manager_phone VARCHAR,
    manager_email VARCHAR,
    coordinates VARCHAR,
    remarks VARCHAR,
    submitter VARCHAR,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // Locations table
  `CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coordinates VARCHAR,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    modified TEXT,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // Shop checkin table
  `CREATE TABLE IF NOT EXISTS shop_checkin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id VARCHAR,
    checkin_time VARCHAR,
    checkin_place VARCHAR,
    checkout_time VARCHAR DEFAULT "none",
    checkout_place VARCHAR,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    day VARCHAR,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // Activation table
  `CREATE TABLE IF NOT EXISTS activation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coords VARCHAR,
    activation_status TEXT,
    storming_status VARCHAR,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // Visibility table
  `CREATE TABLE IF NOT EXISTS visibility (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coords VARCHAR,
    wall_branding VARCHAR,
    sign_board VARCHAR,
    eye_level VARCHAR,
    poster_available VARCHAR,
    poster_placement VARCHAR,
    visibility_potential VARCHAR,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // Placement table
  `CREATE TABLE IF NOT EXISTS placement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coords VARCHAR,
    sell_wl_1l VARCHAR,
    sell_wl_35cl VARCHAR,
    sell_wl_75cl VARCHAR,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // Availability table
  `CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coords VARCHAR,
    available_wl_1l VARCHAR,
    available_wl_35cl VARCHAR,
    available_wl_75cl VARCHAR,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // My outlets table
  `CREATE TABLE IF NOT EXISTS my_outlets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coords VARCHAR,
    account VARCHAR,
    shop_name VARCHAR,
    category INTEGER,
    region VARCHAR,
    location VARCHAR,
    manager_name VARCHAR,
    manager_phone INTEGER,
    manager_email INTEGER,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`,
  
  // Focus areas table
  `CREATE TABLE IF NOT EXISTS focus_areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coords VARCHAR,
    focus_type VARCHAR,
    description VARCHAR,
    action_input VARCHAR,
    start_date VARCHAR,
    end_date VARCHAR,
    submitter VARCHAR,
    store VARCHAR,
    store_id INTEGER,
    store_server_id VARCHAR,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_sync TEXT DEFAULT "none"
  )`
];

db.serialize(() => {
  // Create tables
  tables.forEach(sql => {
    db.run(sql, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table created successfully or already exists');
      }
    });
  });

  // Clear existing data and insert samples
  db.run("DELETE FROM users", (err) => {
    if (err) {
      console.error('Error clearing users:', err.message);
    } else {
      console.log('Cleared users table');
    }
  });
  
  db.run("DELETE FROM stores", (err) => {
    if (err) {
      console.error('Error clearing stores:', err.message);
    } else {
      console.log('Cleared stores table');
    }
  });
  
  // Insert sample users
  const userStmt = db.prepare("INSERT INTO users (userid, username, fullname, userpass, useremail, assigned, is_promoter) VALUES (?, ?, ?, ?, ?, ?, ?)");
  
  sampleUsers.forEach(user => {
    userStmt.run([
      user.userid, 
      user.username, 
      user.fullname, 
      user.userpass, 
      user.useremail, 
      user.assigned, 
      user.is_promoter
    ], (err) => {
      if (err) {
        console.error('Error inserting user:', err.message);
      }
    });
  });
  
  userStmt.finalize(() => {
    console.log('Sample users inserted');
  });

  // Insert sample stores
  const storeStmt = db.prepare("INSERT INTO stores (server_id, name, account, category, region, location, building, address, phone, email, contactperson, manager_name, manager_phone, manager_email, coordinates, remarks, submitter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  
  sampleStores.forEach(store => {
    storeStmt.run([
      store.server_id,
      store.name,
      store.account,
      store.category,
      store.region,
      store.location,
      store.building,
      store.address,
      store.phone,
      store.email,
      store.contactperson,
      store.manager_name,
      store.manager_phone,
      store.manager_email,
      store.coordinates,
      store.remarks,
      store.submitter
    ], (err) => {
      if (err) {
        console.error('Error inserting store:', err.message);
      }
    });
  });
  
  storeStmt.finalize(() => {
    console.log('Sample stores inserted');
    console.log('Database initialized with sample data');
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed');
  }
});