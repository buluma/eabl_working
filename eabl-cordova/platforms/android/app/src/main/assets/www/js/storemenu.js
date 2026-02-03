$(document).ready(function(){
	ifIsCheckedIn();
});

// grab url params
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
// decodeUri method replaces %20 with space
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

//
function onError(err){console.error(err);}
function onSuccess(t,data){
	console.log('item successfully found');
    //console.log(data);
}
function updateInlineEdited(table,row,column,value) {
	var update = "UPDATE "+table+" SET "+column+"=? WHERE id=?";
	db.transaction(function (tx) {
        tx.executeSql(update, [value,row]);
    });
}
function onTxComplete (){
	$.fn.editable.defaults.mode = 'popup';
	// store editing
	if($('a#store_name').length){
	   $('a#store_name').editable({
		   type: 'text',
           title: 'Update Store Name',
           success: function(response, newValue) {
			   updateInlineEdited('stores',itemid,'name',newValue);
           }

	   });
    }
	if($('a#store_location').length){
	   $('a#store_location').editable({
		   type: 'text',
           title: 'Update Store Location',
           success: function(response, newValue) {
			   updateInlineEdited('stores',itemid,'location',newValue);
           }

	   });
    }
	if($('a#store_address').length){
	   $('a#store_address').editable({
		   type: 'text',
           title: 'Update Store Address',
           success: function(response, newValue) {
			   updateInlineEdited('stores',itemid,'address',newValue);
           }

	   });
    }
	if($('a#store_phone').length){
	   $('a#store_phone').editable({
		   type: 'tel',
           title: 'Update Store Phone',
           success: function(response, newValue) {
			   updateInlineEdited('stores',itemid,'phone',newValue);
           }

	   });
    }
	if($('a#store_email').length){
	   $('a#store_email').editable({
		   type: 'email',
           title: 'Update Store Email',
           success: function(response, newValue) {
			   updateInlineEdited('stores',itemid,'email',newValue);
           }

	   });
    }
	if($('a#store_contactperson').length){
	   $('a#store_contactperson').editable({
		   type: 'text',
           title: 'Update Contact Person',
           success: function(response, newValue) {
			   updateInlineEdited('stores',itemid,'contactperson',newValue);
           }
	   });
    }
	if($('a#store_remarks').length){
	   $('a#store_remarks').editable({
		   type: 'textarea',
           title: 'Update Contact Person',
           success: function(response, newValue) {
			   updateInlineEdited('stores',itemid,'remarks',newValue);
           }
	   });
    }
}
// process our item view
$(document).ready(function() {
	console.log(Date.now());
    var storenav = '<div class="col-xs-3 storenav-item"><a href="map.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'"><span class="glyphicon glyphicon-map-marker big-icon"></span><p>Visit Location</p></a></div>';
    //storenav += '<div class="col-xs-3 storenav-item chkin"><button class="btn btn-clear" id="checkin"><span class="glyphicon glyphicon-hand-right big-icon"></span><p>Check In</p></button></div>';
    //storenav += '<div class="col-xs-3 storenav-item chkout"><button class="btn btn-clear" id="checkout"><span class="glyphicon glyphicon-hand-left big-icon"></span><p>Check Out</p></button></div>';

	$('.storenav .container').append(storenav);
	var backLink = '<h5><a href="stores.html" class="button"><span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';
	// get store info from database
	var query = "SELECT * FROM stores WHERE id = ?";

    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var store = data.rows.item(0);
           // console.log(data.rows);
			//console.log(data.rows.item(0).name);

			var nl = '<h4>About This Outlet</h4>';
			nl += '<ul class="list-group">';
			nl += '<li class="list-group-item">';
			nl += '<p>Name</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += '<a href="#" id="store_name" class="editable editable-click" data-pk="'+itemid+'" style="display: inline;">'+store.name+'</a></h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Date Created</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> '+store.date;
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Region</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-globe"></span>  '+store.region;
			nl += '</p>';
			nl += '</li>';
			if (assigned == 'team-leader'){
                nl += '<li class="list-group-item">';
				nl += '<p>Location</p>';
				nl += '<p class="list-group-item-text bold">';
				nl += '<span class="glyphicon glyphicon-globe"></span>   <a href="#" id="store_location" class="editable editable-click" data-pk="'+itemid+'">'+store.location+'</a>';
				nl += '</p>';
				nl += '</li>';
				nl += '<li class="list-group-item">';
				nl += '<p>GPS Coordinates</p>';
				nl += '<p class="list-group-item-text bold">';
				nl += '<span class="glyphicon glyphicon-map-marker"></span>  '+store.coordinates;
				nl += '</p>';
				nl += '</li>';
	            nl += '<li class="list-group-item">';
	            nl += '<p>Address</p>';
				nl += '<p class="list-group-item-text bold">';
				nl += '<span class="glyphicon glyphicon-briefcase"></span>  <a href="#" id="store_address" class="editable editable-click" data-pk="'+itemid+'">'+store.address+'</a>';
				nl += '</p>';
				nl += '</li>';
				nl += '<li class="list-group-item">';
				nl += '<p>Phone</p>';
				nl += '<p class="list-group-item-text bold">';
				nl += '<span class="icon icon-phone"></span>  <a href="#" id="store_phone" class="editable editable-click" data-pk="'+itemid+'">'+store.phone+'</a>';
				nl += '</p>';
				nl += '</li>';
				nl += '<li class="list-group-item">';
				nl += '<p>Email Address</p>';
				nl += '<p class="list-group-item-text bold">';
				nl += '<span class="icon icon-mail"></span>  <a href="#" id="store_email" class="editable editable-click" data-pk="'+itemid+'">'+store.email+'</a>';
				nl += '</p>';
				nl += '</li>';
				nl += '<li class="list-group-item">';
				nl += '<p>Contact Person</p>';
				nl += '<p class="list-group-item-text bold">';
				nl += '<span class="icon icon-user-tie"></span>  <a href="#" id="store_contactperson" class="editable editable-click" data-pk="'+itemid+'">'+store.contactperson+'</a>';
				nl += '</p>';
				nl += '</li>';
				nl += '<li class="list-group-item">';
				nl += '<p>Remarks</p>';
				nl += '<p class="list-group-item-text"><a href="#" id="store_remarks" class="editable editable-click" data-pk="'+itemid+'">'+store.remarks+'</a></p>';
				nl += '</li>';
			}
			nl += '</ul>';
            $('article#storeinfo').html(nl);

		},onSuccess,onError);
    },onError,onTxComplete);
	$('.navbar-header').html(backLink);

    var storemenu = '<div class="store-menu">';
    if (assigned == 'field'){
    	/*storemenu += '<a href="brands2.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-folder-open big-icon"></span><h4> Brands</h4> </button>';
	    storemenu += '</a>';*/
	    //availability
        storemenu += '<a href="availability.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-6 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-th-list big-icon"></span><h4>Availability</h4> </button>';
	    storemenu += '</a>';
        
        //placement
        storemenu += '<a href="placement.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-6 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-folder big-icon"></span><h4>Placement</h4> </button>';
	    storemenu += '</a>';
        
        //visibility
        storemenu += '<a href="visibility.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-6 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-eye big-icon"></span><h4>Visibility</h4> </button>';
	    storemenu += '</a>';
        
        //activation
        storemenu += '<a href="activation.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-6 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-stats-bars big-icon"></span><h4>Activation</h4> </button>';
	    storemenu += '</a>';
        
        /*storemenu += '<a href="objectives.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-stats-bars big-icon"></span><h4> Objectives</h4> </button>';
	    storemenu += '</a>';
	    /*storemenu += '<a href="other_objectives.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-stats-bars big-icon"></span><h4>Other Objectives</h4> </button>';
	    storemenu += '</a>';
	    storemenu += '<a href="photos.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_id='+itemid+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-camera big-icon"></span><h4><h4> Photos</h4> </button>';
	    storemenu += '</a>  ';
	    /*storemenu += '<a href="voc.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-happy big-icon"></span><h4> VOC</h4> </button>';
	    storemenu += '</a>';
	    storemenu += '<a href="competitors.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-bullhorn big-icon"></span><h4>Competitor Activities</h4></button>';
	    storemenu += '</a>';*/
	    /*storemenu += '<a href="eabl_activity.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-gift big-icon"></span><h4> Promotions</h4> </button>';
	    storemenu += '</a>';
	    storemenu += '<a href="quality.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-warning big-icon"></span> <h4>Quality Issues </h4></button>';
	    storemenu += '</a>';
	    storemenu += '<a href="focus.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-clipboard big-icon"></span> <h4>Focus Areas </h4></button>';
	    storemenu += '</a>';
	    /*storemenu += '<a href="action.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-list-alt big-icon"></span><h4> Next Action Items</h4></button>';
	    storemenu += '</a> ';
	    storemenu += '<a href="challenges.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-tower big-icon"></span><h4> Challenges</h4></button>';
	    storemenu += '</a> ';
	    storemenu += '<a href="price.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-usd big-icon"></span><h4> Price Index Survey</h4></button>';
	    storemenu += '</a> ';*/
			//addedd
			/*storemenu += '<a href="empties.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-inbox big-icon"></span><h4> Empties</h4></button>';
	    storemenu += '</a> ';
			storemenu += '<a href="listings.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-th-list big-icon"></span><h4>Listings</h4></button>';
	    storemenu += '</a> ';
		/*storemenu += '<a href="promotions_2.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-credit-card big-icon"></span><h4> Promotions</h4></button>';
	    storemenu += '</a> ';
		storemenu += '<a href="checklist.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-list big-icon"></span><h4> Checklist</h4></button>';
	    storemenu += '</a> ';
			storemenu += '<a href="assets.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-modal-window big-icon"></span><h4> Asset Management</h4></button>';
	    storemenu += '</a> ';*/
			/*storemenu += '<a href="performance.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-4 store-menu-item">';
	    storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-stats	 big-icon"></span><h4> Deliveries</h4></button>';
	    storemenu += '</a> ';*/
	    //storemenu += '   <button class="btn btn-default btn-block" type="button"><span class="glyphicon glyphicon-usd big-icon"></span><h4> Outlet Empties</h4></button>';
	    //storemenu += '</a> ';
    }
    if (assigned == 'team-leader'){
    	storemenu += '<a href="tl_objectives.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-6 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-stats-bars big-icon"></span><h4>My Objectives</h4> </button>';
	    storemenu += '</a>';
			storemenu += '<a href="tl_focus.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="col-xs-6 store-menu-item">';
	    storemenu += '  <button class="btn btn-default btn-block" type="button"><span class="icon icon-stats-bars big-icon"></span><h4>Outlet Focus Areas</h4> </button>';
	    storemenu += '</a>';
    }

    storemenu += '</div>';

    $('article#storemenu').append(storemenu);
});
$(document).on('click', '#checkin', function(){
	console.log('checking in');
	checkinUser();
});
$(document).on('click', '#checkout', function(){
	console.log('checking out');
	checkOutUser();
});

function checkinUser(){
    var place = userlocation;
    var submitter = username;
    var day = moment().format('YYYY-MM-DD');
    var checkintime = moment().format('YYYY-MM-DD hh:mm:ss');
    var session_id = Date.now(); // time in milliseconds, we'll use this to get the session

    db.transaction(function(t) {
      //t.executeSql('DROP TABLE IF EXISTS shop_checkin');
      t.executeSql('CREATE TABLE IF NOT EXISTS shop_checkin (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, session_id VARCHAR, checkin_time VARCHAR, checkin_place VARCHAR,checkout_time VARCHAR DEFAULT "none", checkout_place VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR, day VARCHAR, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
      t.executeSql("INSERT INTO shop_checkin(session_id,checkin_time,checkin_place,submitter,store,store_id,store_server_id,day) values ('"+session_id+"','"+checkintime+"','"+place+"','"+submitter+"','"+storename+"','"+itemid+"','"+store_server_id+"','"+day+"')",null, alertSuccess);
    },
    function(err){
      	alert('Error Checking in with error '+err.message);
    },
    function(){
      	// successfull save
      	document.location.reload(true);
    });
}
function checkOutUser(){
    var place = userlocation;
    var submitter = username;
    var day = moment().format('YYYY-MM-DD');
    var submitter = username;
    var day = moment().format('YYYY-MM-DD');
    var checkouttime = moment().format('YYYY-MM-DD hh:mm:ss');
    var session_id = $('.session-store').text();

    //var update = "UPDATE shop_checkin SET checkout_time= ?,checkout_place = ? WHERE store_id=? AND submitter = ? AND day =? AND checkout_time = ?";
    var update = "UPDATE shop_checkin SET checkout_time= ?,checkout_place = ? WHERE store_id=? AND session_id =? AND checkout_time = ?";

    db.transaction(function(t) {
        //t.executeSql(update, [checkouttime,place,itemid,submitter,session_id,'none']);
        t.executeSql(update, [checkouttime,place,itemid,session_id,'none']);
    },
    function(err){
      	alert('Error Checking Out with error '+err.message);
    },
    function(){
      	// successful update
      	//window.location.href='stores.html';
      	document.location.reload(true);
    });
}

function ifIsCheckedIn(){
	// check if user is checked in to this store, return true / false
	var checkinbtn = '<div class="col-xs-3 storenav-item chkin"><button class="btn btn-clear" id="checkin"><span class="glyphicon glyphicon-hand-right big-icon"></span><p>Check In</p></button></div>';
    var checkoutbtn = '<div class="col-xs-3 storenav-item chkout"><button class="btn btn-clear" id="checkout"><span class="glyphicon glyphicon-hand-left big-icon"></span><p>Check Out</p></button></div>';

	var query = "SELECT id,session_id,checkin_time FROM shop_checkin WHERE store_id = ? AND checkout_time = ?";

	db.transaction(function (t) {
        t.executeSql(query, [itemid,'none'], function (t, data) {
        	if (data.rows.length){
        		// a checkin session is in progress
        		$('.storenav .container').append(checkoutbtn);
				$('.store-menu').show();
        		for (var i = 0;i<1;i++) {
        			console.log(data.rows.item(i));
        			$('.session-store').html(data.rows.item(i).session_id);
            	}
        	}
        	else {
        		console.log('not yet checked in');
        		// we found 0, means the user hasn't checked in into this shop yet
				// let's prompt him to check in... he shouldn't do anything unless he's checked in

                $('.storenav .container').append(checkinbtn);
				$('.store-menu').hide();
				$('.quick-input-header').html('<div class="alert alert-danger" role="alert"> Please Check In to start adding data.</div>');
        	}

		},onSuccess,onError);
	},onError,onTxComplete);

}
