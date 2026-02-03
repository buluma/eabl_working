var localURI = 'http://localhost:3000';
//var stagingURI = 'http://gbc.me.ke/gbc-data-app-staging';
var stagingURI = 'http://gbc.me.ke/barcadi-web';
var liveURI = 'http://gbc.me.ke/barcadi-web';
// var ServerURI = stagingURI;
var ServerURI = localURI;  // Changed to point to local server
// var ServerURI = localURI;

var appversion = '2.0.0';

/*
document.addEventListener("deviceready",function(){
    console.log('device ready ...');
    onDeviceReady();
},false);
*/


String.prototype.truncate = function(n,useWordBoundary){
    var toLong = this.length>n,
        s_ = toLong ? this.substr(0,n-1) : this;
    s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  toLong ? s_ + '&hellip;' : s_;
};
String.prototype.trunc = String.prototype.trunc || function(n){
    return this.length>n ? this.substr(0,n-1)+'&hellip;' : this;
};

// Use the IndexedDB wrapper instead of WebSQL
// The db object is now defined in db-wrapper.js
function onDeviceReady() {
    // Database is initialized in db-wrapper.js
    console.log('Database ready');
    // Create initial tables/data if needed
    createInitialData();
}

// Create initial data structure for IndexedDB
function createInitialData() {
    console.log('Creating initial data structure...');
    // Since IndexedDB schema is created in the upgrade handler,
    // we just need to ensure the database is ready
    // Run the CreateTables function to ensure any initial setup is done
    if (db && db.transaction) {
        try {
            db.transaction(function(tx) {
                // This will trigger the success callback
            }, errorCB, successTableCreation);
        } catch (e) {
            console.error("Error in createInitialData:", e);
            errorCB(e);
        }
    } else {
        console.log('Database not ready, scheduling initialization');
        // Schedule to run when db is ready
        setTimeout(createInitialData, 100);
    }
}

// These functions are kept for compatibility but will be no-ops
// since IndexedDB handles schema differently
function sqliteSuccess(db){
    console.log("success! IndexedDB DB was created/opened successfully");
    alertSuccess("success! IndexedDB DB was created/opened successfully");
}
function sqliteError(err){
    console.log('Open database ERROR: ' + JSON.stringify(err));
    alert('Open database ERROR: ' + JSON.stringify(err));
}
// Populate the database with the tables (for compatibility)
function CreateTables() {
    console.log('Using IndexedDB - tables created in upgrade handler');
    // This function is kept for compatibility but not used with IndexedDB
    // since schema is handled in the upgrade handler
    successTableCreation();
}
// Transaction error callback
function errorCB(err) {
    console.log("Tables not created. Error processing SQL: " + err);
}
// Transaction success callback
function successCB() {
    console.log("success! Tables were created successfully");
}
function successTableCreation() {
    console.log("success! Tables were created successfully");
    // syncProductsTable();
    // syncObjectivesTable();
}
function onReadyTransaction(){
	console.log('Transaction completed');
}

function onSuccessExecuteSql(tx, results ){
	console.log('Execute SQL completed');
}

function onError(err){
	console.log(err.message);
    alert('An error occurred while trying to save/fetch the data with error '+ err.message);
}

function alertDismissed() {
    // do something
}
function alertSuccess(){
	$('#FormNotification').removeClass('hidden');
    setTimeout(function() {
        $('#FormNotification').addClass('hidden');
    }, 3000);

}
// Geolocation: watchposition and getCurrentPosition
var myposition = [];
var watchId = navigator.geolocation.watchPosition(geoSuccess,geoError,{ enableHighAccuracy: true });

function geoSuccess(position){
    var gpscords = position.coords.latitude + ',' + position.coords.longitude;
    myposition.length = 0;
    myposition.push(gpscords);
    localStorage.setItem('gpslocation', gpscords);
}
function geoError(){
    //alert('Error getting current GPS Location');
    console.log('Error getting current GPS Location');
}


// fetch all stores
var myStores = [];
function fetchStores() {
    waitForDbAndExecute(function() {
        var q = "SELECT * FROM stores";

        if (typeof window.db !== 'undefined' && window.db.transaction) {
            window.db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    var sl = '';
                    if (data.rows && data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) {
                            sl += '<a href="storemenu.html?store_id='+data.rows.item(i).id+'&store_name='+encodeURIComponent(data.rows.item(i).name)+'" class="list-group-item list-group-item-info">';
                            sl += '<span class="glyphicon glyphicon-home big-icon2 pull-left"></span><h4>'+data.rows.item(i).name+'</h4>';
                            sl += '<p><span class="glyphicon glyphicon-map-marker"> </span>  '+data.rows.item(i).location+ '</p>';
                            sl += '</a>';
                        }
                    } else {
                        sl += '<div class="list-group-item"><p>No stores found</p></div>';
                    }
                    $('article#storelist .dataList').html(sl);
                });
            });
        } else {
            console.error('Database not available for fetchStores');
            $('article#storelist .dataList').html('<div class="list-group-item"><p>Database not available</p></div>');
        }
    });
}

// function fetchProductsForSelect(callback) {
//     var q = "SELECT product_code,product_name FROM eabl_products WHERE deleted = ? AND published = ?";
//     db.transaction(function (t) {
//         t.executeSql(q, [0,1], function (t, data) {
//             var sl = '<option value="">Select Product</option>';
//             for (var i =0;i<data.rows.length;i++) {
//                 sl += '<option value="'+data.rows.item(i).product_code+'">'+data.rows.item(i).product_name+'</option>';
//             }
// 			//this callback will hold our options list
//             callback(sl);
//         });
//     });
// }

// function fetchObjectivesForSelect(callback) {
//     var q = "SELECT id,objective,category,target_score,response_type FROM eabl_objectives WHERE deleted = ? AND published = ?";
//     db.transaction(function (t) {
//         t.executeSql(q, [0,1], function (t, data) {
//             var optgroups = [];
//             var objectives = data.rows;
//             var options = [];
//             var total = objectives.length;
//             for (var i = 0;i < total; i++) {
//                 var obj = objectives.item(i);
//                 optgroups.push(obj.category);
//                 options.push(obj);
//             }
//             //console.log(optgroups);
//             var s_optgroups = jQuery.unique(optgroups);
//             //console.log(s_optgroups);
//             var html ='';
//             html += '<option value="">Select Objective</option>'
//             $.each(s_optgroups,function(i, optgroup){
//                 html += '<optgroup label="'+optgroup+'">';
//                 $.each(options,function(i,option){
//                     //console.log(option);
//                     if (option.category == optgroup){
//                         html +='<option data-responsetype="'+option.response_type+'" data-targetscore="'+option.target_score+'" value="'+option.id+'">'+option.objective+'</option>';
//                     }
//                 })
//                 html += '</optgroup>';
//                 //console.log(html);
//             })
//             //this optional callback will hold our options html, grouped by category
//             if (callback) callback(html);
//         });
//     },
//     function(err){
//         console.log(err.message);
//     },
//     function(){console.log('finished executing fetchObjectivesForSelect')});
// }

function checkUnsyncedData(){
    var query = "SELECT * FROM shop_checkin WHERE last_sync = ?";
    if (localStorage.getItem('calltosync') === null) {
        //... this function hasn't been called, so let's set it silently
        var thisdate = moment().format('YYYY-MM-DD');
        localStorage.setItem('calltosync', thisdate);
    }
    else {
        // calltosync is there
        var lastcalltosync = localStorage.getItem('calltosync');
        var thisdate = moment().format('YYYY-MM-DD');
        if (moment(thisdate).isAfter(lastcalltosync)){
            // we are a days ahead so let's check if there is some unsynced data,
                db.transaction(function (t) {
                t.executeSql(query, ['none'], function (t, data) {
                    if (data.rows.length == 0){

                    }
                    else {
                        //console.log('there is unsynced data session');
                        navigator.notification.alert(
                            'You have unsynced data from the previous day',  // message
                            onConfirmSync,                // callback to invoke with index of button pressed
                            'Sync Data',            // title
                            'Sync Now'          // buttonLabels
                        );
                    }

                },onSuccessExecuteSql,function(err){
                    // error occurred
                    console.log(err);
                });
            },function(t,err){
                console.log(err.message);
            },onReadyTransaction);
       // end if
       }
       else {
            // the day is not after last call to sync
       }

    }

}
function onConfirmSync() {
    var thisdate = moment().format('YYYY-MM-DD');
    localStorage.setItem('calltosync', thisdate);

    window.location.href='sync.html?prompt=syncdata';
}


// fetch all syncable items from server and save them locally, for the first time.
// we'll then be updating the local database periodically as changes occur on the server side
// One Way sync ~ Server to Client

//TODO: Check the last sync date and fetch the recent changed items only if our table is populated --- DONE!!
//TODO: Refactor the loadItemsFromServer() and getLastItemSync() functions to make them reusable --- DONE!!
//

function syncProductsTable(){
    console.log('fetching products from online...');
    getLastItemSync('eabl_products','modified_on',function(lastSync){
        loadItemsFromServer('eablproducts',lastSync,function(result){
            // save to database
             //console.log(result);
            if (result instanceof Object){
                //console.log('product result is an object...');
                console.log(result.eabl_products.length);
                if (result.eabl_products.length){
                    var products = result.eabl_products;
                    var productnum = products.length;
                    db.transaction(function(tx) {
                            console.log('trying to insert eabl products...');
                            var sql = "INSERT OR REPLACE INTO eabl_products (id,product_code,product_name,product_classification,product_type,product_uom,product_price,product_size,modified_on,published,deleted,must_have) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                            var e;
                            for (var i = 0; i < productnum; i++) {
                                // insert each product into local database
                                //console.log('inserting product '+i);
                                var e = products[i];
                                var params = [e.id, e.product_code, e.product_name, e.product_classification, e.product_type, e.product_uom, e.product_price, e.product_size, e.modified_on, e.published, e.deleted,e.must_have];
                                tx.executeSql(sql, params);
                            }
                        },
                        function(tx,error){
                        //console.log(tx);
                        //console.log(error);
                            console.log('A transaction error occurred: '+error.message);
                        },
                        function(tx) {
                            console.log('products added to local database');
                        }
                    );
                }
            }
        });
    })
}
function syncObjectivesTable(){
    console.log('fetching objectives from online...');
    getLastItemSync('eabl_objectives','modified_on',function(lastSync){
        loadItemsFromServer('eablobjectives',lastSync,function(result){
            if (result instanceof Object){
                //console.log('objectives result is an object...');
                //console.log(result.eabl_objectives.length);
                if (result.eabl_objectives.length){
                    var objs = result.eabl_objectives;
                    var objnum = objs.length;
                    db.transaction(function(tx) {
                            //console.log('trying to insert eabl_objectives...');
                            var sql = "INSERT OR REPLACE INTO eabl_objectives (id,objective,response_type,category,target_score,modified_on,published,deleted) VALUES (?,?,?,?,?,?,?,?)";
                            var e;
                            for (var i = 0; i < objnum; i++) {
                                // insert each item into local database
                                //console.log('inserting objective '+i);
                                var e = objs[i];
                                var params = [e.id, e.objective, e.response_type, e.category, e.target_score, e.modified_on, e.published, e.deleted];
                                tx.executeSql(sql, params);
                            }
                        },
                        function(error){
                            console.log('A transaction error occurred: '+error.message);
                        },
                        function(tx) {
                            console.log('objectives added to local database');
                        }
                    );
                }
            }
        });
    })
}
// This is a wrapper around an Ajax call to the server-side API that returns the items that have changed
// (created, updated, or deleted) since a specific moment in time defined in the lastSync/last_modified parameter.
// should receive a json response from server

function loadItemsFromServer(itemtype,lastSync,callback){
    console.log('lastSync is '+lastSync)
    // if lastSync is null, means our table is empty, load all products from server
    // api_uri can be --- ServerURI+'/api/fetchdata.php?data=eablproducts';

    var api_uri = ServerURI+'/api/fetchdata.php?data='+itemtype;
    if (lastSync === null || lastSync === undefined){
        lastSync = 'none';
    }
    $.ajax({
        url : api_uri,
        data: {last_modified: lastSync},
        type: 'GET',
        dataType : 'json',
        beforeSend : function(xhr){
            console.log('loading items from server...');
        },
        error : function(xhr, status, error){
            console.log(xhr.responseText+ ' | ' +status+ '|' +error);
        },
        complete : function(xhr, status){
            console.log('ajax complete...');
        },
        success : function(result, status, xhr){
            console.log(result);
            callback(result);
        }
    });
}

// get the most recent item sync date
// column containing the date to check against e.g modified_on
// table to check into
function getLastItemSync(table,column,callback){
    db.transaction(function(tx) {
            var sql = "SELECT MAX("+column+") as lastSync FROM "+table;
            tx.executeSql(sql, null, function(tx, results) {
                    var lastSync = results.rows.item(0).lastSync;
                    //console.log(lastSync);
                    callback(lastSync);
                }
            );
        }
    );

}
