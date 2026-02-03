// Script to populate the IndexedDB database with sample data
function populateSampleData() {
    // Wait for the database to be ready
    if (typeof db !== 'undefined' && db.transaction) {
        // Add sample users
        db.transaction(['users'], 'readwrite', function(tx) {
            // Clear existing data first
            const clearUsers = tx.objectStore('users').clear();
            
            clearUsers.onsuccess = function() {
                // Add sample users
                const users = [
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
                
                users.forEach(user => {
                    tx.objectStore('users').add(user);
                });
                
                console.log('Sample users added to database');
            };
        });
        
        // Add sample stores
        db.transaction(['stores'], 'readwrite', function(tx) {
            // Clear existing data first
            const clearStores = tx.objectStore('stores').clear();
            
            clearStores.onsuccess = function() {
                // Add sample stores
                const stores = [
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
                        submitter: 'johndoe',
                        date: new Date().toISOString(),
                        last_sync: 'none'
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
                        submitter: 'janedoe',
                        date: new Date().toISOString(),
                        last_sync: 'none'
                    }
                ];
                
                stores.forEach(store => {
                    tx.objectStore('stores').add(store);
                });
                
                console.log('Sample stores added to database');
            };
        });
    } else {
        console.log('Database not ready, waiting...');
        setTimeout(populateSampleData, 100);
    }
}

// Run the population function when the window loads
window.addEventListener('load', function() {
    // Wait a bit to ensure the database is initialized
    setTimeout(populateSampleData, 500);
});