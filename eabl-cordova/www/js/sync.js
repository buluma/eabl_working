var prompt = $.getUrlVar('prompt');
var mylocation = localStorage.getItem('gpslocation')
//console.log(geoSuccess());
$(document).ready(function(){
	if (assigned == 'team-leader'){
		$('.hide-tl').hide();
	}
	if (prompt == 'syncdata'){
       	$('.tabnavs').addClass('hidden');
	}

	$('button#btnlogout').on('click', function(){
        logOutUser();
    });
	//var TABLES_TO_SYNC = [{tableName : 'note'}];

	//And sync_info can be everything you want.
    //It's useful to identify the client, because it will be sent to the server
    //(it can be a user email or login, a device UUID, etc..)
	//var sync_info = [{user_email :useremail},{user_name :username}];
	var sync_info = [{user_email :useremail,user_name :username,synced_at :mylocation,app_version : appversion}];
	//DBSYNC.initSync(TABLES_TO_SYNC, db, sync_info, 'sync/webSqlSyncAdapter.php', callBackEndInit);
	var tables = [];

	$('#chkstores').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'stores'});
            //console.log(tables);
	    }
	});
	$('#chkactions').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'action_items'});
	    }
	});
	$('#chkempties').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_empties'});
	    }
	});
	$('#chklistings').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_listings'});
	    }
	});
	$('#chkpromos').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_promotions'});
	    }
	});
	$('#chkcallage').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_callagex'});
			//console.log(tables);
	    }
	});
	$('#chkoutlets').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'my_outlets'});
			//console.log(tables);
	    }
	});
	$('#chkdaily').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_daily_plannerxx'});
			console.log(tables);
	    }
	});
	$('#chkactivities').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'eabl_activity'},{tableName : 'eabl_activity_images'});
	    }
	});
	$('#chkpromotions').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_eabl_promotions'},{tableName : 'data_eabl_promotions_images'});
			//console.log(tables);
	    }
	});
	$('#chkchklist').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_checklist'});
	    }
	});
	$('#chkperform').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_performance'});
			//console.log(tables);
	    }
	});
	$('#chkperform').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_performance'});
			//console.log(tables);
	    }
	});
	$('#chkassets').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'data_tl_assets'});
			//console.log(tables);
	    }
	});
	$('#chkbrands').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'brandstocks'});
            //console.log(tables);
	    }
	});
	$('#chkcompes').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'competitor_activity'},{tableName : 'competitor_images'});
            //console.log(tables);
	    }
	});
	$('#chkchall').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'challenges'});
	    }
	});
	$('#chkfocus').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'focus_areas'});
	    }
	});
	$('#chkactivation').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'activation'});
			// console.log(tables);
	    }
	});
	$('#chkvisibility').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'visibility'});
			// console.log(tables);
	    }
	});
	
	$('#chkplacement').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'placement'});
			// console.log(tables);chkavailability
	    }
	});

	$('#chkavailability').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'availability'});
			// console.log(tables);chkavailability
	    }
	});

	$('#chktl_focus').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'tl_focus_areas'});
	    }
	});
	$('#chkactivities').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'eabl_activity'},{tableName : 'eabl_activity_images'});
	    }
	});
	$('#chkphotos').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'images'});
            //console.log(tables);
	    }
	});
	$('#chklocations').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'locations'});
            //console.log(tables);
	    }
	});

	$('#chkobjs').change(function(){
		if ($(this).is(':checked')){
			if (assigned == 'team-leader'){
				tables.push({tableName : 'tl_objectives'});
			}
			else {
				tables.push({tableName : 'objectives'},{tableName : 'other_objectives'});
			}
            //console.log(tables);
	    }
	});
	$('#chkprice').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'price_survey'});
	    }
	});
	$('#chkissues').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'quality_issues'});
            //console.log(tables);
	    }
	});
	$('#chkrecom').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'recommendations'});
            //console.log(tables);
	    }
	});
	$('#chkcheckin').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'shop_checkin'});
            //console.log(tables);
	    }
	});
	$('#chkvoc').change(function(){
		if ($(this).is(':checked')){
			tables.push({tableName : 'voc'});
            //console.log(tables);
	    }
	});

	 console.log(tables);
	// initialise the sync
	// initSync: function(theTablesToSync, dbObject, theSyncInfo, theServerUrl, callBack, username, password, timeout) {
	// added a long timeout to prevent timeouts in case of communication errors
	DBSYNC.initSync(tables, db, sync_info, ServerURI+'/sync/webSqlSyncAdapter.php', callBackEndInit,'','',100000);
	$('button#syncData').on('click', function(){
	    console.log(tables);
        if (tables.length == 0) {
            navigator.notification.alert('Please check at least one item', '', 'Error', 'OK');
            return false;
        }
        else {
        	$('.tabnavs').removeClass('hidden');
        	$('.big-checkbox').each(function(){
        		$(this).removeAttr('checked');
        	});
            //To start the synchronization, you need to call the syncNow function.
            //You can call it every X seconds, or after some changes for example :
            DBSYNC.syncNow(callBackSyncProgress, function(result) {
                if (result.syncOK === true) {
				//Synchronized successfully
				console.log('Synchronized successfully');
				var okmesg = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p><span class="glyphicon glyphicon-ok"></span> Sync Was Successfully Completed</p></div>';
                $('.syncmessage').append(okmesg);
                $('.progress').hide('fast');
			 }
			 else {
                console.log(result);
			 	var nomesg = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p><span class="glyphicon glyphicon-cancel"></span> An error occurred while trying to Sync. Please try later</p></div>';
                $('.syncmessage').append(nomesg);
                $('.progress').hide('fast');
			 }
            });
        }
	 });

});


function callBackEndInit(){console.log('Sync Initialization done');}
//Where callBackSyncProgress is a function called at every step of the synchronization
//(useful to show a progress bar with status if there is a lot of data to synchronize) :

function callBackSyncProgress(message, percent, msgKey) {
    //$('#uiProgress').html(message+' ('+percent+'%)');
    var progressbar = '<div class="progress-bar" role="progressbar" aria-valuenow="'+percent+'%" aria-valuemin="0" aria-valuemax="100" style="width: '+percent+'%;">'+percent+'%</div>'
    $('.progress').append(progressbar);

	console.log(msgKey+message+' ('+percent+'%');
}
