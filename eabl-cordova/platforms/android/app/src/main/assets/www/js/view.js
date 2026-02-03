// grab url params
$.extend({
  getUrlVars: function(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
	  hash = hashes[i].split('=');
	  vars.push(hash[0]);
	  vars[hash[0]] = hash[1];
	}
	return vars;
  },
  getUrlVar: function(name){
	return $.getUrlVars()[name];
  }
});
//Second call with this:
// Get object of URL parameters
var allVars = $.getUrlVars();
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('id');
$(document).ready(function() {
	
});
fetchNote = function(id) {
      db.transaction(function(tx){
        tx.executeSql("SELECT FROM note WHERE id=?", [id],
        onSuccess,onError);
    });
	
}
function onError(err){console.error(err);}
function onSuccess(t,data){
	console.log('item successfully found');
    console.log(data);
}
function updateInlineEdited(table,row,column,value) {
	var update = "UPDATE "+table+" SET "+column+"=? WHERE id=?";
	db.transaction(function (tx) {
        tx.executeSql(update, [value,row]);
    });
}
function onTxComplete (){
	$.fn.editable.defaults.mode = 'inline';
	if($('a#note_title').length){
	   $('a#note_title').editable({
		   type: 'text',
           title: 'Enter New Title',
           success: function(response, newValue) {
			   // update database row
               //console.log('New Title: ' +newValue+ 'Row: '+itemid); 
			   updateInlineEdited('note',itemid,'title',newValue);
           }
		   
	   });
    }
	if($('a#note_notes').length){
	   $('a#note_notes').editable({
		   type: 'textarea',
           title: 'Update Notes',
           success: function(response, newValue) {
			   // update database row
               //console.log('New Notes: ' +newValue+ 'Row: '+itemid); 
			   updateInlineEdited('note',itemid,'notes',newValue);
           }
		   
	   });
    }
    // customer feedback
    if($('a#feed_title').length){
	   $('a#feed_title').editable({
		   type: 'text',
           title: 'Enter New Title',
           success: function(response, newValue) {
			   // update database row
               //console.log('New Title: ' +newValue+ 'Row: '+itemid); 
			   updateInlineEdited('customerfeedback',itemid,'title',newValue);
           }
		   
	   });
    }
	if($('a#feed_feedback').length){
	   $('a#feed_feedback').editable({
		   type: 'textarea',
           title: 'Update Feedback',
           success: function(response, newValue) {
			   // update database row
               //console.log('New Notes: ' +newValue+ 'Row: '+itemid); 
			   updateInlineEdited('customerfeedback',itemid,'feedback',newValue);
           }
		   
	   });
    }
	// store editing
	if($('a#store_name').length){
	   $('a#store_name').editable({
		   type: 'text',
           title: 'Update Store Name',
           success: function(response, newValue) {
			   updateInlineEdited('store',itemid,'name',newValue);
           }
		   
	   });
    }
	if($('a#store_location').length){
	   $('a#store_location').editable({
		   type: 'text',
           title: 'Update Store Location',
           success: function(response, newValue) {
			   updateInlineEdited('store',itemid,'location',newValue);
           }
		   
	   });
    }
	if($('a#store_address').length){
	   $('a#store_address').editable({
		   type: 'text',
           title: 'Update Store Address',
           success: function(response, newValue) {
			   updateInlineEdited('store',itemid,'address',newValue);
           }
		   
	   });
    }
	if($('a#store_phone').length){
	   $('a#store_phone').editable({
		   type: 'tel',
           title: 'Update Store Phone',
           success: function(response, newValue) {
			   updateInlineEdited('store',itemid,'phone',newValue);
           }
		   
	   });
    }
	if($('a#store_email').length){
	   $('a#store_email').editable({
		   type: 'email',
           title: 'Update Store Email',
           success: function(response, newValue) {
			   updateInlineEdited('store',itemid,'email',newValue);
           }
		   
	   });
    }
	if($('a#store_contactperson').length){
	   $('a#store_contactperson').editable({
		   type: 'text',
           title: 'Update Contact Person',
           success: function(response, newValue) {
			   updateInlineEdited('store',itemid,'contactperson',newValue);
           }
		   
	   });
    }
	if($('a#store_notes').length){
	   $('a#store_notes').editable({
		   type: 'textarea',
           title: 'Update Contact Person',
           success: function(response, newValue) {
			   updateInlineEdited('store',itemid,'notes',newValue);
           }
		   
	   });
    }
	// stock editing
	
	if($('a#lephone_stock').length){
	   $('a#lephone_stock').editable({
		   type: 'text',
           title: 'Update Phone Stock',
           success: function(response, newValue) {
			   updateInlineEdited('lenovostock',itemid,'stock',newValue);
           }
		   
	   });
    }
	if($('a#lephone_price').length){
	   $('a#lephone_price').editable({
		   type: 'text',
           title: 'Update Phone Price',
           success: function(response, newValue) {
			   updateInlineEdited('lenovostock',itemid,'price',newValue);
           }
		   
	   });
    }
	if($('a#lephone_notes').length){
	   $('a#lephone_notes').editable({
		   type: 'textarea',
           title: 'Update Phone Notes',
           success: function(response, newValue) {
			   updateInlineEdited('lenovostock',itemid,'notes',newValue);
           }
		   
	   });
    }
    // competitor stock
    if($('a#cophone_stock').length){
	   $('a#cophone_stock').editable({
		   type: 'text',
           title: 'Update Phone Stock',
           success: function(response, newValue) {
			   updateInlineEdited('competitorstock',itemid,'stock',newValue);
           }
		   
	   });
    }
	if($('a#cophone_price').length){
	   $('a#cophone_price').editable({
		   type: 'text',
           title: 'Update Phone Price',
           success: function(response, newValue) {
			   updateInlineEdited('competitorstock',itemid,'price',newValue);
           }
		   
	   });
    }
	if($('a#cophone_notes').length){
	   $('a#cophone_notes').editable({
		   type: 'textarea',
           title: 'Update Phone Notes',
           success: function(response, newValue) {
			   updateInlineEdited('competitorstock',itemid,'notes',newValue);
           }
		   
	   });
    }
	// competitor editing

	/*if($('a#comp_store').length){
	   $('a#comp_store').editable({
		   type: 'text',
           title: 'Update Store',
           success: function(response, newValue) {
			   updateInlineEdited('competitor',itemid,'store',newValue);
           }
		   
	   });
    }
    
	if($('a#comp_start').length){
	   $('a#comp_start').editable({
		   type: 'date',
           title: 'Update Start Date',
           success: function(response, newValue) {
			   updateInlineEdited('competitor',itemid,'date_start',newValue);
           }
		   
	   });
    }
	if($('a#comp_end').length){
	   $('a#comp_end').editable({
		   type: 'date',
           title: 'Update End Date',
           success: function(response, newValue) {
			   updateInlineEdited('competitor',itemid,'date_end',newValue);
           }
		   
	   });
    }
    */
	if($('a#promo_price').length){
	   $('a#promo_price').editable({
		   type: 'text',
           title: 'Update Price',
           success: function(response, newValue) {
			   updateInlineEdited('competitorpromo',itemid,'price',newValue);
           }
		   
	   });
    }
	if($('a#promo_notes').length){
	   $('a#promo_notes').editable({
		   type: 'textarea',
           title: 'Update Notes',
           success: function(response, newValue) {
			   updateInlineEdited('competitorpromo',itemid,'notes',newValue);
           }
		   
	   });
    }



	
}

// process our item view
$(document).ready(function() {
if (itemtype === 'feedback') {
	// back to notes list if you are viewing a note
	var backLink = '<h2><a href="feedback.html" class="button"><span class="glyphicon glyphicon-arrow-left"> Back To Customer Feedback</a></h2>';
	$('.navbar-header').append(backLink);
	
	// fetch single item from database
	var query = "SELECT * FROM customerfeedback WHERE id = ?";
    
    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var feed = data.rows.item(0);
			//console.log(note);
			var nl = '<ul class="list-group">';
			
			nl += '<li class="list-group-item">';
			nl += '<p>Title</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += '<a href="#" id="feed_title" class="editable editable-click" data-pk="'+itemid+'" style="display: inline;">'+feed.title+'</a></h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> <i>'+feed.date+'</i>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Notes</p>';
			nl += '<p class="list-group-item-text"><a href="#" id="feed_feedback" class="editable editable-click" data-pk="'+itemid+'">'+feed.feedback+'</a></p>';
			nl += '</li>';
			nl += '</ul>';
            $('article#dataview #ItemDataView').append(nl);
			
			
		},onSuccess,onError);
    },onError,onTxComplete);
	
} //end feedback type	
if (itemtype === 'note') {
	// back to notes list if you are viewing a note
	var backLink = '<h2><a href="notes.html" class="button"><span class="glyphicon glyphicon-arrow-left"> Back To Notes</a></h2>';
	$('.navbar-header').append(backLink);
	
	// fetch single item from database
	var query = "SELECT * FROM note WHERE id = ?";
    
    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var note = data.rows.item(0);
			//console.log(note);
			var nl = '<ul class="list-group">';
			
			nl += '<li class="list-group-item">';
			nl += '<p>Title</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += '<a href="#" id="note_title" class="editable editable-click" data-pk="'+itemid+'" style="display: inline;">'+note.title+'</a></h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> <i>'+note.date+'</i>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Notes</p>';
			nl += '<p class="list-group-item-text"><a href="#" id="note_notes" class="editable editable-click" data-pk="'+itemid+'">'+note.notes+'</a></p>';
			nl += '</li>';
			nl += '</ul>';
            $('article#dataview #ItemDataView').append(nl);
			
			
		},onSuccess,onError);
    },onError,onTxComplete);
	
} //end note type

if (itemtype === 'store') {
	// back to notes list if you are viewing a note
	var backLink = '<h2><a href="stores.html" class="button"><span class="glyphicon glyphicon-arrow-left"> Back To Stores</a></h2>';
	$('.navbar-header').append(backLink);
    var smap = '<div class="gmap"></div>';
	
	// fetch single item from database
	var query = "SELECT * FROM store WHERE id = ?";
    
    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var store = data.rows.item(0);
            console.log(store);
			//console.log(data.rows.item(0).name);
			var nl = '<ul class="list-group">';
			
			nl += '<li class="list-group-item">';
			nl += '<p>Title</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += '<a href="#" id="store_name" class="editable editable-click" data-pk="'+itemid+'" style="display: inline;">'+store.name+'</a></h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> '+store.date;
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-map-marker"></span> <a href="#" id="store_location" class="editable editable-click" data-pk="'+itemid+'">'+store.location+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-globe"></span> '+store.coordinates+'';
			nl += '</p>';
			nl += '</li>';
            nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-briefcase"></span> <a href="#" id="store_address" class="editable editable-click" data-pk="'+itemid+'">'+store.address+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-phone"></span> <a href="#" id="store_phone" class="editable editable-click" data-pk="'+itemid+'">'+store.phone+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-mail"></span> <a href="#" id="store_email" class="editable editable-click" data-pk="'+itemid+'">'+store.email+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-user-tie"></span> <a href="#" id="store_contactperson" class="editable editable-click" data-pk="'+itemid+'">'+store.contactperson+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Notes</p>';
			nl += '<p class="list-group-item-text"><a href="#" id="store_notes" class="editable editable-click" data-pk="'+itemid+'">'+store.notes+'</a></p>';
			nl += '</li>';
			nl += '</ul>';
            $('article#dataview div#ItemDataView').append(nl);
			
			
		},onSuccess,onError);
    },onError,onTxComplete);
	
} //end store type

if (itemtype === 'lestock') {
	// back to notes list if you are viewing a note
	var backLink = '<h2><a href="lenovostocks.html" class="button"><span class="glyphicon glyphicon-arrow-left"> Back To Lenovo Stock</a></h2>';
	$('.navbar-header').append(backLink);
	// fetch single item from database
	var query = "SELECT * FROM lenovostock WHERE id = ?";
    
    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var phone = data.rows.item(0);
			//console.log(store);
			var nl = '<ul class="list-group">';
			
			nl += '<li class="list-group-item">';
			nl += '<p>Model</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += ''+phone.model+'</h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Store</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-command"></span> '+phone.store+'';
			nl += '</p>';
			nl += '</li>';		
			nl += '<li class="list-group-item">';
			nl += '<p>In Stock</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-pie-chart"></span> <a href="#" id="lephone_stock" class="editable editable-click" data-pk="'+itemid+'">'+phone.stock+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Price</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-coin-dollar"></span> <a href="#" id="lephone_price" class="editable editable-click" data-pk="'+itemid+'">'+phone.price+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Date Added</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> '+phone.date+'';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Notes</p>';
			nl += '<p class="list-group-item-text"><a href="#" id="lephone_notes" class="editable editable-click" data-pk="'+itemid+'">'+phone.notes+'</a></p>';
			nl += '</li>';
			nl += '</ul>';
            $('article#dataview #ItemDataView').append(nl);
			
			
		},onSuccess,onError);
    },onError,onTxComplete);
	
}
// end lenovo phone stock

if (itemtype === 'costock') {
	// back to notes list if you are viewing a note
	var backLink = '<h2><a href="competitorstocks.html" class="button"><span class="glyphicon glyphicon-arrow-left"> Back To Competitor Stock</a></h2>';
	$('.navbar-header').append(backLink);
	// fetch single item from database
	var query = "SELECT * FROM competitorstock WHERE id = ?";
    
    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var phone = data.rows.item(0);
			//console.log(store);
			var nl = '<ul class="list-group">';
			
			nl += '<li class="list-group-item">';
			nl += '<p>Model</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += phone.make+' '+phone.model+'</h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Store</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-command"></span> '+phone.store+'';
			nl += '</p>';
			nl += '</li>';		
			nl += '<li class="list-group-item">';
			nl += '<p>In Stock</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-pie-chart"></span> <a href="#" id="cophone_stock" class="editable editable-click" data-pk="'+itemid+'">'+phone.stock+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Price</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-coin-dollar"></span> <a href="#" id="cophone_price" class="editable editable-click" data-pk="'+itemid+'">'+phone.price+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Date Added</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> '+phone.date+'';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Notes</p>';
			nl += '<p class="list-group-item-text"><a href="#" id="cophone_notes" class="editable editable-click" data-pk="'+itemid+'">'+phone.notes+'</a></p>';
			nl += '</li>';
			nl += '</ul>';
            $('article#dataview #ItemDataView').append(nl);
			
			
		},onSuccess,onError);
    },onError,onTxComplete);
	
}
// end competitor stock
if (itemtype === 'phone') {
	// back to notes list if you are viewing a note
	var backLink = '<h2><a href="phones.html" class="button"><span class="glyphicon glyphicon-arrow-left"> Back To Phones</a></h2>';
	$('.navbar-header').append(backLink);
    var pictures = '<ul><li><img src="img/phones/phone1.jpg" style="height:80px;"></img></li></ul';
    var picselect = '<button type="button" id="addPictures">Add Pictures</button>';
	$('.media').append(picselect);
    $('#addPictures').on('click', function(){
        navigator.camera.getPicture(onPicSuccess, onPicFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });
    });
    function onPicSuccess(imageURI) {
        var image = document.getElementById('phoneImage');
        image.src = imageURI;
        db.transaction(function (t){
            t.executeSql("CREATE TABLE IF NOT EXISTS images (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,phone_id INTEGER,image_uri VARCHAR,date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)");
            t.executeSql("INSERT INTO images(phone_id,image_uri)values(" + itemid + ",'"+imageURI+"')",onError, updateImageView);
        
        },onError,onTxComplete);
    }
    function updateImageView(){
        var query = "SELECT * FROM images WHERE phone_id = ?";
        db.transaction(function(t){
            t.executeSal(query,[itemid], function(t,data){
                var im ='';
                for (var i =0;i<data.rows.length;i++) {            
                    im += '<div class="thumbnail"><img src="'+data.rows.item(i).image_uri+'"class="img img-responsive"></div>';

                }
                $('.imagelist').append(im);
            
            },function(){console.log('image successfully listed')},onError);
        
        },onError,onTxComplete);
    }
    function onPicFail(message) {
            console.log('Failed selecting image because: ' + message);
    }
    // picture extended functions
    
    // end picture codes
	// fetch single item from database
	var query = "SELECT * FROM phone WHERE id = ?";
    
    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var phone = data.rows.item(0);
			//console.log(store);
			var nl = '<ul class="list-group">';
			
			nl += '<li class="list-group-item">';
			nl += '<p>Model</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += '<a href="#" id="phone_model" class="editable editable-click" data-pk="'+itemid+'" style="display: inline;">'+phone.model+'</a></h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Store</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-command"></span> <a href="#" id="phone_store" class="editable editable-click" data-pk="'+itemid+'">'+phone.store+'</a>';
			nl += '</p>';
			nl += '</li>';		
			nl += '<li class="list-group-item">';
			nl += '<p>In Stock</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-pie-chart"></span> <a href="#" id="phone_stock" class="editable editable-click" data-pk="'+itemid+'">'+phone.stock+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Price</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-coin-dollar"></span> <a href="#" id="phone_price" class="editable editable-click" data-pk="'+itemid+'">'+phone.price+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Date Added</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> '+phone.date+'';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Notes</p>';
			nl += '<p class="list-group-item-text"><a href="#" id="phone_notes" class="editable editable-click" data-pk="'+itemid+'">'+phone.notes+'</a></p>';
			nl += '</li>';
			nl += '</ul>';
            $('article#dataview #ItemDataView').append(nl);
			
			
		},onSuccess,onError);
    },onError,onTxComplete);
	
} //end phone type

if (itemtype === 'competitorpromo') {
	// back to notes list if you are viewing a note
	var backLink = '<h2><a href="competitorpromos.html" class="button"><span class="glyphicon glyphicon-arrow-left"> Back To Competitor Promotions</a></h2>';
	$('.navbar-header').append(backLink);
	
	// fetch single item from database
	var query = "SELECT * FROM competitorpromo WHERE id = ?";
    
    db.transaction(function (t) {
        t.executeSql(query, [itemid], function (t, data) {
			var comp = data.rows.item(0);
			//console.log(comp);
			var nl = '<ul class="list-group">';
			
			nl += '<li class="list-group-item">';
			nl += '<p>Model</p>';
			nl += '<h4 class="list-group-item-heading">';
			nl += ''+comp.make+' '+comp.model+'</h4>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Store</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-command">'+comp.store+'';
			nl += '</p>';
			nl += '</li>';		
			nl += '<li class="list-group-item">';
			nl += '<p>Price</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="icon icon-coin-dollar"></span> <a href="#" id="promo_price" class="editable editable-click" data-pk="'+itemid+'">'+comp.price+'</a>';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Starting Date</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> '+comp.date_start+'';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Ending Date</p>';
			nl += '<p class="list-group-item-text bold">';
			nl += '<span class="glyphicon glyphicon-calendar"></span> '+comp.date_end+'';
			nl += '</p>';
			nl += '</li>';
			nl += '<li class="list-group-item">';
			nl += '<p>Notes</p>';
			nl += '<p class="list-group-item-text"><a href="#" id="promo_notes" class="editable editable-click" data-pk="'+itemid+'">'+comp.notes+'</a></p>';
			nl += '</li>';
			nl += '</ul>';
            $('article#dataview #ItemDataView').append(nl);
			
			
		},onSuccess,onError);
    },onError,onTxComplete);
	
} //end competitor type
});