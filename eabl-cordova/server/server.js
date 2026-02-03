const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('www'));

// Initialize SQLite database
const dbPath = path.join(__dirname, '../www/data/eabl_app_db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

// Initialize tables if they don't exist
function initializeTables() {
  const tables = [
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
    )`,
    
    // Users table for authentication
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
    )`
  ];

  tables.forEach(sql => {
    db.run(sql, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table created successfully or already exists');
      }
    });
  });
}

// API Routes

// User authentication endpoint (replaces the PHP webservice)
app.get('/api/webservice.php', (req, res) => {
  const { user_auth: username } = req.query;
  
  // Query the users table for the provided username
  const query = `SELECT id, userid, username, fullname, userpass, useremail, assigned, is_promoter 
                 FROM users WHERE username = ?`;
                 
  db.get(query, [username], (err, user) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.json("UserNotFound");
    }
    
    // Get all stores assigned to this user
    const storesQuery = `SELECT * FROM stores WHERE submitter = ?`;
    db.all(storesQuery, [username], (err, allshops) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        userdata: [user],
        allshops: allshops
      });
    });
  });
});

// Get all stores
app.get('/api/stores', (req, res) => {
  const query = 'SELECT * FROM stores ORDER BY name ASC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(rows);
  });
});

// Add a new store
app.post('/api/stores', (req, res) => {
  const { 
    server_id, name, account, category, region, location, building, 
    address, phone, email, contactperson, manager_name, manager_phone, 
    manager_email, coordinates, remarks, submitter 
  } = req.body;
  
  const query = `INSERT INTO stores (
    server_id, name, account, category, region, location, building, 
    address, phone, email, contactperson, manager_name, manager_phone, 
    manager_email, coordinates, remarks, submitter
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    server_id, name, account, category, region, location, building,
    address, phone, email, contactperson, manager_name, manager_phone,
    manager_email, coordinates, remarks, submitter
  ], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ id: this.lastID, message: 'Store added successfully' });
  });
});

// Update a store
app.put('/api/stores/:id', (req, res) => {
  const storeId = req.params.id;
  const { 
    name, account, category, region, location, building, 
    address, phone, email, contactperson, manager_name, manager_phone, 
    manager_email, coordinates, remarks, submitter 
  } = req.body;
  
  const query = `UPDATE stores SET 
    name = ?, account = ?, category = ?, region = ?, location = ?, building = ?, 
    address = ?, phone = ?, email = ?, contactperson = ?, manager_name = ?, 
    manager_phone = ?, manager_email = ?, coordinates = ?, remarks = ?, submitter = ?
    WHERE id = ?`;
  
  db.run(query, [
    name, account, category, region, location, building,
    address, phone, email, contactperson, manager_name,
    manager_phone, manager_email, coordinates, remarks, submitter, storeId
  ], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ message: 'Store updated successfully' });
  });
});

// Delete a store
app.delete('/api/stores/:id', (req, res) => {
  const storeId = req.params.id;
  
  const query = 'DELETE FROM stores WHERE id = ?';
  
  db.run(query, [storeId], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ message: 'Store deleted successfully' });
  });
});

// Get store by ID
app.get('/api/stores/:id', (req, res) => {
  const storeId = req.params.id;
  
  const query = 'SELECT * FROM stores WHERE id = ?';
  
  db.get(query, [storeId], (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    res.json(row);
  });
});

// Synchronization endpoint - returns all data that needs to be synced
app.get('/api/sync', (req, res) => {
  // Get all records that have not been synced
  const query = `
    SELECT * FROM (
      SELECT * FROM stores WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM locations WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM shop_checkin WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM activation WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM visibility WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM placement WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM availability WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM my_outlets WHERE last_sync = 'none'
      UNION ALL
      SELECT * FROM focus_areas WHERE last_sync = 'none'
    )
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(rows);
  });
});

// Mark records as synced
app.post('/api/mark-synced', (req, res) => {
  const { table, ids } = req.body;
  
  if (!table || !ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'Invalid request format' });
  }
  
  // Validate table name to prevent SQL injection
  const validTables = [
    'stores', 'locations', 'shop_checkin', 'activation', 
    'visibility', 'placement', 'availability', 'my_outlets', 'focus_areas'
  ];
  
  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }
  
  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE ${table} SET last_sync = ? WHERE id IN (${placeholders})`;
  const params = [new Date().toISOString(), ...ids];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ message: `${this.changes} records marked as synced` });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});