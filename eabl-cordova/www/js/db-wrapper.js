// Enhanced IndexedDB wrapper for the EABL application
let idb;
const DB_NAME = 'eabl_app_db';
const DB_VERSION = 1;

// Initialize IndexedDB
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = function(event) {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };
        
        request.onsuccess = function(event) {
            idb = event.target.result;
            console.log('IndexedDB database opened successfully');
            resolve(idb);
        };
        
        request.onupgradeneeded = function(event) {
            idb = event.target.result;
            
            // Create object stores for each table (only if they don't exist)
            createSchema(idb);
        };
    });
}

// Create database schema
function createSchema(db) {
    // Define all the stores we need based on the original SQL schema
    
    // Stores table
    if (!db.objectStoreNames.contains('stores')) {
        const storesStore = db.createObjectStore('stores', { keyPath: 'id', autoIncrement: true });
        storesStore.createIndex('server_id', 'server_id', { unique: false });
        storesStore.createIndex('name', 'name', { unique: false });
        storesStore.createIndex('region', 'region', { unique: false });
        storesStore.createIndex('submitter', 'submitter', { unique: false });
    }
    
    // Locations table
    if (!db.objectStoreNames.contains('locations')) {
        const locationsStore = db.createObjectStore('locations', { keyPath: 'id', autoIncrement: true });
        locationsStore.createIndex('coordinates', 'coordinates', { unique: false });
        locationsStore.createIndex('submitter', 'submitter', { unique: false });
        locationsStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Shop checkin table
    if (!db.objectStoreNames.contains('shop_checkin')) {
        const checkinStore = db.createObjectStore('shop_checkin', { keyPath: 'id', autoIncrement: true });
        checkinStore.createIndex('session_id', 'session_id', { unique: false });
        checkinStore.createIndex('submitter', 'submitter', { unique: false });
        checkinStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Activation table
    if (!db.objectStoreNames.contains('activation')) {
        const activationStore = db.createObjectStore('activation', { keyPath: 'id', autoIncrement: true });
        activationStore.createIndex('coords', 'coords', { unique: false });
        activationStore.createIndex('submitter', 'submitter', { unique: false });
        activationStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Visibility table
    if (!db.objectStoreNames.contains('visibility')) {
        const visibilityStore = db.createObjectStore('visibility', { keyPath: 'id', autoIncrement: true });
        visibilityStore.createIndex('coords', 'coords', { unique: false });
        visibilityStore.createIndex('submitter', 'submitter', { unique: false });
        visibilityStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Placement table
    if (!db.objectStoreNames.contains('placement')) {
        const placementStore = db.createObjectStore('placement', { keyPath: 'id', autoIncrement: true });
        placementStore.createIndex('coords', 'coords', { unique: false });
        placementStore.createIndex('submitter', 'submitter', { unique: false });
        placementStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Availability table
    if (!db.objectStoreNames.contains('availability')) {
        const availabilityStore = db.createObjectStore('availability', { keyPath: 'id', autoIncrement: true });
        availabilityStore.createIndex('coords', 'coords', { unique: false });
        availabilityStore.createIndex('submitter', 'submitter', { unique: false });
        availabilityStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // My outlets table
    if (!db.objectStoreNames.contains('my_outlets')) {
        const outletsStore = db.createObjectStore('my_outlets', { keyPath: 'id', autoIncrement: true });
        outletsStore.createIndex('coords', 'coords', { unique: false });
        outletsStore.createIndex('submitter', 'submitter', { unique: false });
        outletsStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Focus areas table
    if (!db.objectStoreNames.contains('focus_areas')) {
        const focusAreasStore = db.createObjectStore('focus_areas', { keyPath: 'id', autoIncrement: true });
        focusAreasStore.createIndex('coords', 'coords', { unique: false });
        focusAreasStore.createIndex('submitter', 'submitter', { unique: false });
        focusAreasStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Users table
    if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        usersStore.createIndex('username', 'username', { unique: false });
        usersStore.createIndex('userid', 'userid', { unique: false });
    }
    
    // EABL Products table
    if (!db.objectStoreNames.contains('eabl_products')) {
        const productsStore = db.createObjectStore('eabl_products', { keyPath: 'id', autoIncrement: true });
        productsStore.createIndex('product_code', 'product_code', { unique: false });
        productsStore.createIndex('product_name', 'product_name', { unique: false });
    }
    
    // EABL Objectives table
    if (!db.objectStoreNames.contains('eabl_objectives')) {
        const objectivesStore = db.createObjectStore('eabl_objectives', { keyPath: 'id', autoIncrement: true });
        objectivesStore.createIndex('objective', 'objective', { unique: false });
        objectivesStore.createIndex('category', 'category', { unique: false });
    }
    
    // Brand stocks table
    if (!db.objectStoreNames.contains('brandstocks')) {
        const brandstocksStore = db.createObjectStore('brandstocks', { keyPath: 'id', autoIncrement: true });
        brandstocksStore.createIndex('brand', 'brand', { unique: false });
        brandstocksStore.createIndex('submitter', 'submitter', { unique: false });
        brandstocksStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Objectives table
    if (!db.objectStoreNames.contains('objectives')) {
        const objectivesStore = db.createObjectStore('objectives', { keyPath: 'id', autoIncrement: true });
        objectivesStore.createIndex('objective_code', 'objective_code', { unique: false });
        objectivesStore.createIndex('submitter', 'submitter', { unique: false });
        objectivesStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Images table
    if (!db.objectStoreNames.contains('images')) {
        const imagesStore = db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
        imagesStore.createIndex('brand', 'brand', { unique: false });
        imagesStore.createIndex('submitter', 'submitter', { unique: false });
        imagesStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // VOC (Voice of Customer) table
    if (!db.objectStoreNames.contains('voc')) {
        const vocStore = db.createObjectStore('voc', { keyPath: 'id', autoIncrement: true });
        vocStore.createIndex('brand', 'brand', { unique: false });
        vocStore.createIndex('submitter', 'submitter', { unique: false });
        vocStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Competitor activity table
    if (!db.objectStoreNames.contains('competitor_activity')) {
        const competitorActivityStore = db.createObjectStore('competitor_activity', { keyPath: 'id', autoIncrement: true });
        competitorActivityStore.createIndex('brand', 'brand', { unique: false });
        competitorActivityStore.createIndex('submitter', 'submitter', { unique: false });
        competitorActivityStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // EABL Activity table
    if (!db.objectStoreNames.contains('eabl_activity')) {
        const eablActivityStore = db.createObjectStore('eabl_activity', { keyPath: 'id', autoIncrement: true });
        eablActivityStore.createIndex('brand', 'brand', { unique: false });
        eablActivityStore.createIndex('submitter', 'submitter', { unique: false });
        eablActivityStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Quality issues table
    if (!db.objectStoreNames.contains('quality_issues')) {
        const qualityIssuesStore = db.createObjectStore('quality_issues', { keyPath: 'id', autoIncrement: true });
        qualityIssuesStore.createIndex('brand', 'brand', { unique: false });
        qualityIssuesStore.createIndex('submitter', 'submitter', { unique: false });
        qualityIssuesStore.createIndex('store_id', 'store_id', { unique: false });
    }
    
    // Other tables as needed...
    
    console.log('Database schema created');
}

// Simplified transaction wrapper to handle the original code patterns
function transaction(arg1, arg2, arg3) {
    if (!idb) {
        console.error('Database not initialized');
        if (arg2 && typeof arg2 === 'function') {
            arg2(new Error('Database not initialized'));
        }
        return;
    }

    // Determine the calling pattern
    if (typeof arg1 === 'function') {
        // Pattern: db.transaction(function(tx) { ... })
        // or: db.transaction(function(tx) { ... }, errorCb, successCb)
        const txFunction = arg1;
        const errorCallback = typeof arg2 === 'function' ? arg2 : null;
        const successCallback = typeof arg3 === 'function' ? arg3 : null;

        try {
            // Use 'stores' table and 'readonly' mode by default for compatibility
            const transaction = idb.transaction(['stores'], 'readonly');
            const stores = { 'stores': transaction.objectStore('stores') };

            // Call the transaction function with our wrapper
            txFunction({
                executeSql: function(sql, params = [], successCallback = null, errorCallback = null) {
                    executeSql(stores, sql, params, successCallback, errorCallback);
                }
            });

            if (successCallback && typeof successCallback === 'function') {
                successCallback();
            }
        } catch (error) {
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(error);
            }
        }
    } else if (Array.isArray(arg1)) {
        // Pattern: db.transaction(['table1', 'table2'], errorCb, successCb)
        const storeNames = arg1;
        const errorCallback = typeof arg2 === 'function' ? arg2 : null;
        const successCallback = typeof arg3 === 'function' ? arg3 : null;

        try {
            const mode = 'readonly'; // Default mode
            const transaction = idb.transaction(storeNames, mode);
            const stores = {};

            storeNames.forEach(storeName => {
                stores[storeName] = transaction.objectStore(storeName);
            });

            // Call the success callback with our wrapper
            if (successCallback && typeof successCallback === 'function') {
                successCallback({
                    executeSql: function(sql, params = [], successCallback = null, errorCallback = null) {
                        executeSql(stores, sql, params, successCallback, errorCallback);
                    }
                });
            }
        } catch (error) {
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(error);
            }
        }
    } else {
        console.error('Invalid arguments to transaction function');
        if (arg2 && typeof arg2 === 'function') {
            arg2(new Error('Invalid arguments to transaction function'));
        }
    }
}

// Enhanced SQL execution function
function executeSql(stores, sql, params = [], successCallback = null, errorCallback = null) {
    try {
        // Parse the SQL command to determine operation type
        const upperSql = sql.trim().toUpperCase();
        
        if (upperSql.startsWith('INSERT INTO')) {
            handleInsert(stores, sql, params, successCallback, errorCallback);
        } 
        else if (upperSql.startsWith('SELECT')) {
            handleSelect(stores, sql, params, successCallback, errorCallback);
        }
        else if (upperSql.startsWith('UPDATE')) {
            handleUpdate(stores, sql, params, successCallback, errorCallback);
        }
        else if (upperSql.startsWith('DELETE')) {
            handleDelete(stores, sql, params, successCallback, errorCallback);
        }
        else if (upperSql.includes('CREATE TABLE IF NOT EXISTS')) {
            // For compatibility - this is a no-op in IndexedDB since schema is handled differently
            if (successCallback) {
                successCallback(null, { rows: { length: 0, item: function() {} } });
            }
        }
        else {
            console.warn('Unsupported SQL command:', sql);
            if (errorCallback) {
                errorCallback(null, new Error('Unsupported SQL command'));
            }
        }
    } catch (error) {
        console.error('Error executing SQL:', error);
        if (errorCallback) {
            errorCallback(null, error);
        }
    }
}

// Handle INSERT operations
function handleInsert(stores, sql, params, successCallback, errorCallback) {
    try {
        // Extract table name and column names from SQL
        const tableMatch = sql.match(/INSERT INTO (\w+)/i);
        if (!tableMatch) {
            throw new Error('Could not parse table name from INSERT statement');
        }
        
        const tableName = tableMatch[1];
        if (!stores[tableName]) {
            throw new Error(`Table ${tableName} does not exist`);
        }
        
        // Parse column names and values
        const columnsMatch = sql.match(/\(([^)]+)\)/);
        const valuesMatch = sql.match(/VALUES \(([^)]+)\)/i);
        
        if (!columnsMatch || !valuesMatch) {
            throw new Error('Could not parse INSERT statement');
        }
        
        const columns = columnsMatch[1].replace(/\s+/g, '').split(',');
        const placeholders = valuesMatch[1].replace(/\s+/g, '').split(',');
        
        // Create data object
        const data = {};
        columns.forEach((col, index) => {
            // Handle parameter substitution
            if (params && params[index] !== undefined) {
                data[col.trim()] = params[index];
            } else {
                // If no parameter, try to extract from the SQL (not ideal, but for compatibility)
                const placeholder = placeholders[index].trim();
                if (placeholder.startsWith("'") && placeholder.endsWith("'")) {
                    data[col.trim()] = placeholder.substring(1, placeholder.length - 1);
                } else if (placeholder === 'NULL' || placeholder === 'null') {
                    data[col.trim()] = null;
                } else if (!isNaN(placeholder)) {
                    data[col.trim()] = isNaN(placeholder) ? placeholder : Number(placeholder);
                } else {
                    data[col.trim()] = placeholder;
                }
            }
        });
        
        // Add auto-generated fields if needed
        if (tableName === 'stores' && !data.date) {
            data.date = new Date().toISOString();
        }
        
        // Perform the insert
        const request = stores[tableName].add(data);
        
        request.onsuccess = function(event) {
            if (successCallback) {
                // Mock result similar to WebSQL
                successCallback(null, { insertId: event.target.result, rowsAffected: 1 });
            }
        };
        
        request.onerror = function(event) {
            if (errorCallback) {
                errorCallback(null, event.target.error);
            }
        };
    } catch (error) {
        if (errorCallback) {
            errorCallback(null, error);
        }
    }
}

// Handle SELECT operations
function handleSelect(stores, sql, params, successCallback, errorCallback) {
    try {
        // Extract table name
        const fromMatch = sql.match(/FROM\s+(\w+)/i);
        if (!fromMatch) {
            throw new Error('Could not parse table name from SELECT statement');
        }
        
        const tableName = fromMatch[1];
        if (!stores[tableName]) {
            throw new Error(`Table ${tableName} does not exist`);
        }
        
        // Check for WHERE clause
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER BY|\s+LIMIT|\s+GROUP BY|$)/i);
        const orderByMatch = sql.match(/ORDER BY\s+([^LIMIT]+)/i);
        
        let results = [];
        
        // Get all records from the store
        const getAllRequest = stores[tableName].getAll();
        
        getAllRequest.onsuccess = function(event) {
            results = event.target.result;
            
            // Apply WHERE conditions if present
            if (whereMatch) {
                const whereClause = whereMatch[1].trim();
                results = applyWhereCondition(results, whereClause, params);
            }
            
            // Apply ORDER BY if present
            if (orderByMatch) {
                const orderField = orderByMatch[1].trim().split(' ')[0]; // Get field name, ignore ASC/DESC for now
                results.sort((a, b) => {
                    if (a[orderField] < b[orderField]) return -1;
                    if (a[orderField] > b[orderField]) return 1;
                    return 0;
                });
            }
            
            // Create mock result object similar to WebSQL
            const mockResult = {
                rows: {
                    length: results.length,
                    item: function(index) {
                        return results[index];
                    }
                }
            };
            
            if (successCallback) {
                successCallback(null, mockResult);
            }
        };
        
        getAllRequest.onerror = function(event) {
            if (errorCallback) {
                errorCallback(null, event.target.error);
            }
        };
    } catch (error) {
        if (errorCallback) {
            errorCallback(null, error);
        }
    }
}

// Apply WHERE conditions to filter results
function applyWhereCondition(results, whereClause, params) {
    // Simple WHERE condition parser (supports basic equality)
    // Format: column = value or column = ? (with parameter)
    const conditions = whereClause.split(/\s+AND\s+|\s+OR\s+/i);
    
    conditions.forEach(condition => {
        const parts = condition.trim().match(/(\w+)\s*(=|!=|<|>|<=|>=)\s*(.+)/);
        if (parts) {
            const field = parts[1];
            const operator = parts[2];
            let value = parts[3].trim();
            
            // Handle quoted values
            if (value.startsWith("'") && value.endsWith("'")) {
                value = value.substring(1, value.length - 1);
            } else if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            
            // If value is a parameter placeholder (?), use the corresponding param
            if (value === '?' && params && params.length > 0) {
                value = params.shift(); // Use and remove the first parameter
            }
            
            // Apply filter based on operator
            results = results.filter(item => {
                const itemValue = item[field];
                switch (operator) {
                    case '=':
                        return itemValue == value; // Using == to handle type coercion like SQL
                    case '!=':
                        return itemValue != value;
                    case '>':
                        return itemValue > value;
                    case '<':
                        return itemValue < value;
                    case '>=':
                        return itemValue >= value;
                    case '<=':
                        return itemValue <= value;
                    default:
                        return true; // Unknown operator, include all
                }
            });
        }
    });
    
    return results;
}

// Handle UPDATE operations
function handleUpdate(stores, sql, params, successCallback, errorCallback) {
    try {
        // Extract table name
        const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
        if (!tableMatch) {
            throw new Error('Could not parse table name from UPDATE statement');
        }
        
        const tableName = tableMatch[1];
        if (!stores[tableName]) {
            throw new Error(`Table ${tableName} does not exist`);
        }
        
        // Extract SET clause
        const setMatch = sql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
        if (!setMatch) {
            throw new Error('Could not parse SET clause from UPDATE statement');
        }
        
        // Extract WHERE clause
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER BY|\s+LIMIT|$)/i);
        
        // Parse SET assignments
        const setClause = setMatch[1].trim();
        const assignments = parseSetClause(setClause, params);
        
        // Get all records to update
        const getAllRequest = stores[tableName].getAll();
        
        getAllRequest.onsuccess = function(event) {
            let recordsToUpdate = event.target.result;
            
            // Apply WHERE conditions if present
            if (whereMatch) {
                const whereClause = whereMatch[1].trim();
                recordsToUpdate = applyWhereCondition([...recordsToUpdate], whereClause, [...params]);
            }
            
            // Update each matching record
            let updatedCount = 0;
            const updatePromises = recordsToUpdate.map(record => {
                // Apply the SET assignments to the record
                Object.assign(record, assignments);
                
                // Put the updated record back
                return new Promise((resolve, reject) => {
                    const updateRequest = stores[tableName].put(record);
                    updateRequest.onsuccess = () => resolve();
                    updateRequest.onerror = (e) => reject(e.target.error);
                });
            });
            
            Promise.all(updatePromises)
                .then(() => {
                    if (successCallback) {
                        successCallback(null, { rowsAffected: recordsToUpdate.length });
                    }
                })
                .catch(error => {
                    if (errorCallback) {
                        errorCallback(null, error);
                    }
                });
        };
        
        getAllRequest.onerror = function(event) {
            if (errorCallback) {
                errorCallback(null, event.target.error);
            }
        };
    } catch (error) {
        if (errorCallback) {
            errorCallback(null, error);
        }
    }
}

// Parse SET clause to extract field-value pairs
function parseSetClause(setClause, params) {
    const assignments = {};
    const pairs = setClause.split(',');
    
    pairs.forEach(pair => {
        const [field, value] = pair.split('=').map(s => s.trim());
        let processedValue = value;
        
        // Handle quoted values
        if (processedValue.startsWith("'") && processedValue.endsWith("'")) {
            processedValue = processedValue.substring(1, processedValue.length - 1);
        } else if (processedValue.startsWith('"') && processedValue.endsWith('"')) {
            processedValue = processedValue.substring(1, processedValue.length - 1);
        }
        
        // If value is a parameter placeholder (?), use the corresponding param
        if (processedValue === '?' && params && params.length > 0) {
            processedValue = params.shift(); // Use and remove the first parameter
        }
        
        assignments[field] = processedValue;
    });
    
    return assignments;
}

// Handle DELETE operations
function handleDelete(stores, sql, params, successCallback, errorCallback) {
    try {
        // Extract table name
        const tableMatch = sql.match(/DELETE FROM\s+(\w+)/i);
        if (!tableMatch) {
            throw new Error('Could not parse table name from DELETE statement');
        }
        
        const tableName = tableMatch[1];
        if (!stores[tableName]) {
            throw new Error(`Table ${tableName} does not exist`);
        }
        
        // Extract WHERE clause
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER BY|\s+LIMIT|$)/i);
        
        // Get all records to potentially delete
        const getAllRequest = stores[tableName].getAll();
        
        getAllRequest.onsuccess = function(event) {
            let recordsToDelete = event.target.result;
            
            // Apply WHERE conditions if present
            if (whereMatch) {
                const whereClause = whereMatch[1].trim();
                recordsToDelete = applyWhereCondition([...recordsToDelete], whereClause, [...params]);
            }
            
            // Delete each matching record
            let deletedCount = 0;
            const deletePromises = recordsToDelete.map(record => {
                return new Promise((resolve, reject) => {
                    const deleteRequest = stores[tableName].delete(record.id); // Assuming 'id' is the key
                    deleteRequest.onsuccess = () => {
                        deletedCount++;
                        resolve();
                    };
                    deleteRequest.onerror = (e) => reject(e.target.error);
                });
            });
            
            Promise.all(deletePromises)
                .then(() => {
                    if (successCallback) {
                        successCallback(null, { rowsAffected: deletedCount });
                    }
                })
                .catch(error => {
                    if (errorCallback) {
                        errorCallback(null, error);
                    }
                });
        };
        
        getAllRequest.onerror = function(event) {
            if (errorCallback) {
                errorCallback(null, event.target.error);
            }
        };
    } catch (error) {
        if (errorCallback) {
            errorCallback(null, error);
        }
    }
}

// Initialize the database when this script loads
initDatabase()
    .then(() => {
        console.log('Database initialized successfully');
        // Call onDeviceReady if it exists
        if (typeof onDeviceReady === 'function') {
            onDeviceReady();
        }
    })
    .catch(error => {
        console.error('Failed to initialize database:', error);
    });

// Export the database object and functions for use in other scripts
window.db = {
    transaction: transaction
};
// Provide a global alias for legacy code paths that reference `db` directly.
// This ensures callers hit the wrapper instead of the raw IndexedDB instance.
var db = window.db;
