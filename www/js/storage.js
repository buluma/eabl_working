var localURI = 'http://localhost/eabl_web';
//var stagingURI = 'http://gbc.me.ke/gbc-data-app-staging';
var stagingURI = 'http://gbc.me.ke/barcadi-web';
var liveURI = 'http://gbc.me.ke/barcadi-web';
// var ServerURI = stagingURI;
var ServerURI = liveURI;
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

db = window.openDatabase("eabl_app_db", '1.0', "EABL Database",50*1024*1024);
//db = sqlitePlugin.openDatabase({name: "eabl_app_db.db"}, sqliteSuccess,sqliteError);
//var db;
function onDeviceReady() {
    // open sqlite db

    /*if(window.cordova) {
       db = sqlitePlugin.openDatabase({name: "eabl_app_db.db",androidLockWorkaround: 1}, sqliteSuccess,sqliteError);
    }
    else {
       db = window.openDatabase("eabl_app_db", '1.0', "EABL Database",50*1024*1024);
    }
    */
    //CreateTables();
    db.transaction(CreateTables, errorCB, successTableCreation);
}
function sqliteSuccess(db){
    console.log("success! SQLite DB was created/opened successfully");
    alertSuccess("success! SQLite DB was created/opened successfully");
}
function sqliteError(err){
    console.log('Open database ERROR: ' + JSON.stringify(err));
    alert('Open database ERROR: ' + JSON.stringify(err));
}
// Populate the database with the tables
function CreateTables(tx) {
    console.log(db);
    console.log('creating tables ...');
    //tx.executeSql('DROP TABLE stores');
    //tx.executeSql('DROP TABLE brandstocks');
    //tx.executeSql('DROP TABLE quality_issues');
    //tx.executeSql('DROP TABLE eabl_products');
    
    // tx.executeSql('DROP TABLE eabl_products');
    // tx.executeSql('DROP TABLE brandstocks');
    // tx.executeSql('DROP TABLE objectives');
    // tx.executeSql('DROP TABLE other_objectives');
    // tx.executeSql('DROP TABLE competitor_activity');
    // tx.executeSql('DROP TABLE competitor_images');
    // tx.executeSql('DROP TABLE quality_issues');
    // tx.executeSql('DROP TABLE data_eabl_promotions');
    // tx.executeSql('DROP TABLE data_tl_empties');
    // tx.executeSql('DROP TABLE data_tl_callagex');
    // tx.executeSql('DROP TABLE action_items');
    // tx.executeSql('DROP TABLE eabl_activity');
    // tx.executeSql('DROP TABLE eabl_activity_images');
    // tx.executeSql('DROP TABLE images');
    // tx.executeSql('DROP TABLE challenges');
    // tx.executeSql('DROP TABLE voc');


    tx.executeSql('CREATE TABLE IF NOT EXISTS stores (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,server_id INTEGER, name VARCHAR, account VARCHAR, category VARCHAR, region VARCHAR,location VARCHAR,building VARCHAR,address VARCHAR,phone VARCHAR,email VARCHAR,contactperson VARCHAR,manager_name VARCHAR, manager_phone VARCHAR, manager_email VARCHAR, coordinates VARCHAR,remarks VARCHAR,submitter VARCHAR,date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS eabl_products (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, product_code VARCHAR, product_name VARCHAR, product_classification VARCHAR, product_type VARCHAR, product_uom VARCHAR, product_price VARCHAR, product_size VARCHAR, must_have VARCHAR, published TINYINT, deleted TINYINT, modified_on TEXT NULL, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)');
    /*tx.executeSql('CREATE TABLE IF NOT EXISTS eabl_products (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, product_code VARCHAR, product_name VARCHAR, product_classification VARCHAR, product_type VARCHAR, product_uom VARCHAR, product_price VARCHAR, product_size VARCHAR, published TINYINT, deleted TINYINT, modified_on TEXT NULL, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)');*/

    // tx.executeSql('CREATE TABLE IF NOT EXISTS eabl_objectives (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, objective VARCHAR, category VARCHAR, response_type VARCHAR, target_score VARCHAR, modified_on TEXT NULL, published TINYINT, deleted TINYINT)');

    tx.executeSql('CREATE TABLE IF NOT EXISTS locations (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coordinates VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR, modified TEXT, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    tx.executeSql('CREATE TABLE IF NOT EXISTS shop_checkin (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, session_id VARCHAR, checkin_time VARCHAR, checkin_place VARCHAR,checkout_time VARCHAR DEFAULT "none", checkout_place VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR, day VARCHAR, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS brandstocks (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,stockdate VARCHAR, coords VARCHAR,brand VARCHAR,brandcode VARCHAR,currentstock VARCHAR,sale VARCHAR, orderplaced VARCHAR, expected_delivery VARCHAR, stockout VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER, remarks VARCHAR,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS objectives (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,inputdate VARCHAR, coords VARCHAR,objective_code VARCHAR,objective_desc VARCHAR,targetscore VARCHAR,targetfacings VARCHAR, current_percent VARCHAR,current_facings VARCHAR, categorytotal VARCHAR, response_type VARCHAR, objective_achieved VARCHAR, reason_not_achieved VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER, action_point VARCHAR,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS other_objectives (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,inputdate VARCHAR, coords VARCHAR,objective VARCHAR, objective_achieved VARCHAR, challenge VARCHAR, next_plan VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS images (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,imagepath VARCHAR, imagedate VARCHAR,manufacturer VARCHAR,brand VARCHAR, brandcode VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR, remarks VARCHAR,coords TEXT,created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS voc (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,photos VARCHAR,brand VARCHAR,brandcode VARCHAR,category VARCHAR,items VARCHAR, commentby VARCHAR, isurgent VARCHAR, submitter VARCHAR,store VARCHAR, store_server_id VARCHAR, store_id INTEGER,remarks VARCHAR,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,coords TEXT,last_sync TEXT DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS competitor_activity (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, unique_id VARCHAR,brand VARCHAR,category VARCHAR,activity_mechanics VARCHAR,rateofsale VARCHAR,myplan VARCHAR,myneed VARCHAR,timeline VARCHAR,  start_date VARCHAR, end_date VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS competitor_images (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,activity_id INTEGER,activity_unique_id,submitter VARCHAR,store_id INTEGER,store VARCHAR,store_server_id VARCHAR,image BLOB,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS eabl_activity (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, unique_id VARCHAR,brand VARCHAR,brandcode VARCHAR,category VARCHAR,activity_mechanics VARCHAR,rateofsale VARCHAR,myplan VARCHAR,myneed VARCHAR,timeline VARCHAR, start_date VARCHAR, end_date VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS eabl_activity_images (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,activity_id INTEGER,activity_unique_id,submitter VARCHAR,store_id INTEGER,store VARCHAR,store_server_id VARCHAR,image BLOB,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS quality_issues (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, coords VARCHAR,brand VARCHAR,brandcode VARCHAR,issue_type VARCHAR,rateofsale VARCHAR, expiry_date VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER, remarks VARCHAR, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    
    //activation table
    // tx.executeSql('DROP TABLE activation');
    tx.executeSql('CREATE TABLE IF NOT EXISTS activation (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, activation_status,storming_status VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    //visibility table
    // tx.executeSql('DROP TABLE visibility');
    tx.executeSql('CREATE TABLE IF NOT EXISTS visibility (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, wall_branding VARCHAR,sign_board VARCHAR,eye_level VARCHAR,poster_available VARCHAR,poster_placement VARCHAR,visibility_potential VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    //placement table
    // tx.executeSql('DROP TABLE placement');
    tx.executeSql('CREATE TABLE IF NOT EXISTS placement (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, sell_wl_1l VARCHAR,sell_wl_35cl VARCHAR,sell_wl_75cl VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    //availability table
    // tx.executeSql('DROP TABLE availability');
    tx.executeSql('CREATE TABLE IF NOT EXISTS availability (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, available_wl_1l VARCHAR,available_wl_35cl VARCHAR,available_wl_75cl VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    //outlets table
    tx.executeSql('CREATE TABLE IF NOT EXISTS my_outlets (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, account VARCHAR, shop_name VARCHAR, category INTEGER,region VARCHAR,location VARCHAR,manager_name VARCHAR,manager_phone INTEGER,manager_email INTEGER,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS focus_areas (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, focus_type VARCHAR, description VARCHAR,action_input VARCHAR,start_date VARCHAR,end_date VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS action_items (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, description VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    //added tables
    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_tl_listings (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, listing VARCHAR, listed INTEGER, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_tl_empties (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, description VARCHAR, empties_case INTEGER, empties_shell INTEGER, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_tl_callagex (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, segment VARCHAR, cdivision VARCHAR, planned_calls INTEGER,jp_planned_calls VARCHAR,jp_achieved_calls VARCHAR,adhd_calls VARCHAR,net_otr INTEGER,achieved_outlets INTEGER,actual_acc INTEGER,coachingas INTEGER,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');


    // tx.executeSql('DROP TABLE data_tl_checklist');
    // tx.executeSql('DROP TABLE data_tl_performance');
    // tx.executeSql('DROP TABLE data_tl_assets');
    // tx.executeSql('DROP TABLE data_tl_daily_planner');
    // tx.executeSql('DROP TABLE price_survey');
    // tx.executeSql('DROP TABLE data_tl_listings');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_eabl_promotions (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, unique_id VARCHAR,brand VARCHAR,promos INTEGER,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_tl_checklist (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, beer_bottles INTEGER,beer INTEGER,rtds INTEGER,vodka INTEGER,liqeur INTEGER,brandy INTEGER,whisky INTEGER,tequila INTEGER,rums INTEGER,anads INTEGER,gins INTEGER,canes INTEGER,cold_space INTEGER, comments VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_tl_performance (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, rtd_actual INTEGER, udv_actual INTEGER, kbl_actual INTEGER, comments VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_tl_assets (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, asset_type VARCHAR, serial_number VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS data_tl_daily_planner (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, coords VARCHAR, daily_date LONGTEXT, start_time_input VARCHAR, end_time_input VARCHAR, daily_challenges VARCHAR, status VARCHAR, daily_notes VARCHAR, routeplan LONGTEXT, submitter VARCHAR, inputdate VARCHAR, week VARCHAR, month VARCHAR, year VARCHAR, modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    // tx.executeSql('CREATE TABLE IF NOT EXISTS tl_focus_areas (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, focus_type VARCHAR, description VARCHAR,action_input VARCHAR, start_date VARCHAR, end_date VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    //end added tables
    // tx.executeSql('CREATE TABLE IF NOT EXISTS price_survey (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, coords VARCHAR, type VARCHAR, brands LONGTEXT, submitter VARCHAR, store VARCHAR, store_id INTEGER, store_server_id VARCHAR, inputdate VARCHAR, week VARCHAR, month VARCHAR, year VARCHAR, modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    // tx.executeSql('CREATE TABLE IF NOT EXISTS challenges (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, challenge VARCHAR, action VARCHAR, by_who VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

}
// Transaction error callback
function errorCB(err) {
    console.log("Tables not created. Error processing SQL: "+err.message);
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
    var q = "SELECT * FROM stores";
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            var sl ='';
            for (var i =0;i<data.rows.length;i++) {
                sl += '<a href="storemenu.html?store_id='+data.rows.item(i).id+'&store_name='+data.rows.item(i).name+'" class="list-group-item list-group-item-info">';
                sl += '<span class="glyphicon glyphicon-home big-icon2 pull-left"></span><h4>'+data.rows.item(i).name+'</h4>';
                sl += '<p><span class="glyphicon glyphicon-map-marker"> </span>  '+data.rows.item(i).location+ '</p>';
				sl += '</a>';
            }
			$('article#storelist .dataList').html(sl);
        });
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
