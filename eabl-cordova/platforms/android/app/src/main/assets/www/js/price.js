document.addEventListener("deviceready",function(){
	fetchEABLPriceSurvey();
    fetchCompePriceSurvey()
    
},false);
$(window).load(function(){
    //fetchEABLPriceSurvey();
})

// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

//
var competitors = '<table class="table">';
competitors += '<tr>';
competitors += '<p><strong>Premium Beer</strong></p>';
competitors += '<td>Heineken <span class="badge pull-right">0</span></td>';
competitors += '</tr>';
competitors += '<tr>';
competitors += '<p><strong>Whiskey</strong></p>';
competitors += '<td>Jameson <span class="badge pull-right">0</span></td>';
competitors += '<td>William Lawson <span class="badge pull-right">0</span></td>';
competitors += '</tr>';
competitors += '<tr>';
competitors += '<p><strong>Vodka</strong></p>';
competitors += '<td>Sky Vodka <span class="badge pull-right">0</span></td>';
competitors += '<td>Absolute Vodka <span class="badge pull-right">0</span></td>';
competitors += '<td>Flat Vodka <span class="badge pull-right">0</span></td>';
competitors += '</tr>';
competitors += '<tr>';
competitors += '<p><strong>Gin</strong></p>';
competitors += '<td>Bombay Sapphire <span class="badge pull-right">0</span></td>';
competitors += '</tr>';
competitors += '<tr>';
competitors += '<p><strong>Rum</strong></p>';
competitors += '<td>Bacardi <span class="badge pull-right">0</span></td>';
competitors += '</tr>';
competitors += '<tr>';
competitors += '<p><strong>Liqueur</strong></p>';
competitors += '<td>Amarula <span class="badge pull-right">0</span></td>';
competitors += '</tr>';
competitors += '</table>';
 //
/*
# viewtype shows whether the form is for a new item or edit
# if edit, bind db data to form
# if new, show blank form 
*/
function fetchProductsforForm(dbid,callback){
    if (dbid == '0'){
        var q = "SELECT product_code,product_name FROM eabl_products WHERE deleted = ? AND published = ?";
    
        db.transaction(function (t) {
            t.executeSql(q, [0, 1], function (t, data) {
                var found = data.rows.length;
                var table = '';
                //table += '<tr><td class="col-xs-8">Brand</td><td class="col-xs-4">Retailing Price</td></tr>';
                table += '<div class="list-group-item list-group-item-info">';
                table += ' <label>Year: '+thisYear()+'</label>';
                table += ' <label>Week: '+moment().week()+'</label>';
                table += ' <label>This Month: '+thisMonth()+'</label>';
                table += ' <label>Date: '+getTodaysDate()+'</label>';
                table += '</div>';
                table += ' <div class="form-group list-group-item list-group-item-info" id="datepicker">';
                table += ' <label>Select Month for Price Survey:</label>';
                table += ' <select id="displaymonth" name="displaymonth" class="form-control">';
                table += '<option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option><option value="4">Apr</option>';
                table += '<option value="5">May</option><option value="6">Jun</option><option value="7">Jul</option><option value="8">Aug</option>';
                table += '<option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>';
                table += '</select>';
                table += ' </div>';
                for (var i = 0;i<found;i++) {
                    var p = data.rows.item(i);
                    // create a table row
                    table += ' <div class="form-group list-group-item">';
                    table += ' <label>'+p.product_name+'</label>';
                    table += ' <input type="number" data-productcode="'+p.product_code+'" data-productname="'+p.product_name+'" id="'+p.product_name+'" name="brand[]" value="0" class="form-control" >';
                    table += ' </div>';

                }
                table += ' <input type="hidden" id="displaytype" value="eabl" class="form-control" >';
                table += ' <input type="hidden" id="curryear" value="'+thisYear()+'" class="form-control" >';
                table += ' <input type="hidden" id="dbitemid" value="'+dbid+'" class="form-control" >';
                if (callback) callback(table)
                
            });
        });

    }
    // end new
    else{
        var q = "SELECT id,brands FROM price_survey WHERE id = '"+dbid+"' ";
        
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var dbitem = data.rows.item(0);
                var brands = JSON.parse(dbitem.brands);
                var brandnum = brands.items.length;
                var table = '';
                table += '<div class="list-group-item list-group-item-info">';
                table += ' <label>Year: '+thisYear()+'</label>';
                table += ' <label>Week: '+moment().week()+'</label>';
                table += ' <label>This Month: '+thisMonth()+'</label>';
                table += ' <label>Date: '+getTodaysDate()+'</label>';
                table += '</div>';
                table += ' <div class="form-group list-group-item list-group-item-info" id="datepicker">';
                table += ' <label>Editing Price Survey:</label>';          
                table += ' </div>';
                for (var i = 0;i<brandnum;i++) {
                    var p = brands.items[i]; // <--- array!!
                    // create a table row
                    table += ' <div class="form-group list-group-item">';
                    table += ' <label>'+p.name+'</label>';
                    table += ' <input type="number" data-productcode="'+p.code+'" data-productname="'+p.name+'" id="'+p.name+'" name="brand[]" value="'+p.price+'" class="form-control" >';
                    table += ' </div>';

                }
                table += ' <input type="hidden" id="displaytype" value="eabl" class="form-control" >';
                table += ' <input type="hidden" id="curryear" value="'+thisYear()+'" class="form-control" >';
                table += ' <input type="hidden" id="dbitemid" value="'+dbid+'" class="form-control" >';
                if (callback) callback(table)
            });
        });

    }
    
}

function bindCompePricestoForm(dbid,callback){
    if (dbid == 0){
        var table = null;
        if (callback) callback(table);
    }
    else {
        var q = "SELECT id,brands FROM price_survey WHERE id = '"+dbid+"' ";
        
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var dbitem = data.rows.item(0);
                var brands = JSON.parse(dbitem.brands);
                var brandnum = brands.items.length;
                var table = '';
                table += '<div class="list-group-item list-group-item-info">';
                table += ' <label>Year: '+thisYear()+'</label>';
                table += ' <label>Week: '+moment().week()+'</label>';
                table += ' <label>This Month: '+thisMonth()+'</label>';
                table += ' <label>Date: '+getTodaysDate()+'</label>';
                table += '</div>';
                table += ' <div class="form-group list-group-item list-group-item-info" id="datepicker">';
                table += ' <label>Editing Price Survey:</label>';          
                table += ' </div>';
                for (var i = 0;i<brandnum;i++) {
                    var p = brands.items[i]; // <--- array!!
                    // create a table row
                    table += ' <div class="form-group list-group-item">';
                    table += ' <label>'+p.name+'</label>';
                    table += ' <input type="number" data-productcode="'+p.code+'" data-productname="'+p.name+'" id="'+p.name+'" name="brand[]" value="'+p.price+'" class="form-control" >';
                    table += ' </div>';

                }
                table += ' <input type="hidden" id="displaytype" value="competitor" class="form-control" >';
                table += ' <input type="hidden" id="curryear" value="'+thisYear()+'" class="form-control" >';
                table += ' <input type="hidden" id="dbitemid" value="'+dbid+'" class="form-control" >';
                if (callback) callback(table)
            });
        });
    }
    
}
 //
function fetchEABLPriceSurvey(){
    var month = thisMonth();
    var year = thisYear();
    var type = 'eabl';
    var q = "SELECT * FROM price_survey WHERE store_id = '"+itemid+"' AND type = '"+type+"' AND month = '"+month+"' AND year = '"+year+"'";
    //var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND inputdate = ?";
    
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            //console.log(q);
            
            var found = data.rows.length;

	        if (found >= 1){
                var dbitem = data.rows.item(0);
                //console.log(item.brands);
                var brands = JSON.parse(dbitem.brands);
                //console.log(brands.items);
                var brandnum = brands.items.length;
                //console.log(brandnum);
                var pl;
                pl = '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="eabl" data-dbid="'+dbitem.id+'" id="edit">';
                pl += '<h4>EABL Prices Index </h4>';
                pl += '<table class="table">';                
                
	            for (var i = 0;i<brandnum;i++) {
                    var brand = brands.items[i]; // <--- array!!
                    //console.log(brand);
                    pl += '<tr>';
                    pl += '<td>'+brand.name+'<span class="badge pull-right">'+brand.price+'</span></td>';
                    pl += '</tr>';    
	            }
                pl += '</table>';
                pl += '</a>';
				$('article#displaylist #displaylistgroup div.eabldisplayholder').html(pl);
		    } // end if found
		    else {
                var defaultview = '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="eabl" data-dbid="0" id="new">';
                defaultview += '<h4>EABL Prices Index</h4>';
                defaultview += '<p>No Price Index for this month found</p>';
                defaultview += '<button class="btn btn-success">Tap here to add one</button>';
                defaultview += '</a>';

                $('article#displaylist #displaylistgroup div.eabldisplayholder').html(defaultview);
		    }
        });
    });
}
function fetchCompePriceSurvey(){
    var month = thisMonth();
    var year = thisYear();
    var type = 'competitor';
    var q = "SELECT * FROM price_survey WHERE store_id = '"+itemid+"' AND type = '"+type+"' AND month = '"+month+"' AND year = '"+year+"'";
    
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            //console.log(q);  
            var found = data.rows.length;
            
            if (found >= 1){
                var dbitem = data.rows.item(0);
                //console.log(item.brands);
                var brands = JSON.parse(dbitem.brands);
                //console.log(brands.items);
                var brandnum = brands.items.length;
                //console.log(brandnum);
                var pl;
                pl = '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="competitor" data-dbid="'+dbitem.id+'" id="edit">';
                pl += '<h4>Competitor Prices Index </h4>';
                pl += '<table class="table">';                
                
                for (var i = 0;i<brandnum;i++) {
                    var brand = brands.items[i]; // <--- array!!
                    //console.log(brand);
                    pl += '<tr>';
                    pl += '<td>'+brand.name+'<span class="badge pull-right">'+brand.price+'</span></td>';
                    pl += '</tr>';    
                }
                pl += '</table>';
                pl += '</a>';
                $('article#displaylist #displaylistgroup div.compedisplayholder').html(pl);
            } // end if found
            else {
                var defaultview = '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="competitor" data-dbid="0" id="new">';
                defaultview += '<h4>Competitor Prices Index</h4>';
                defaultview += '<p>No Price Index for this month found</p>';
                defaultview += '<button class="btn btn-success"> Tap here to add one</button>';
                defaultview += '</a>';

                $('article#displaylist #displaylistgroup div.compedisplayholder').html(defaultview);
            }
        });
    });
}


function insertPriceIndex(){
	var store = storename;
    var type = document.getElementById("displaytype").value;
 
	var brands = {};
    var items = [];

	$('form#formdisplayinput').find("input[name='brand[]']").each(function(i, field) {
        var brand = {};
        if (type == 'eabl') {    
            brand.code = $(field).data('productcode');
            brand.name = $(field).data('productname');
            brand.price = field.value;
            
        }
        if (type == 'competitor'){
            brand.code = 'none';
            brand.name = $(field).attr('id');
            brand.price = field.value;
        }
        items.push(brand);
        
	});
    brands['items'] = items;
    var brandsdata = JSON.stringify(brands);

    
    var month = document.getElementById("displaymonth").value;
    var submitter = username;
    var year = document.getElementById("curryear").value;;
    var week = moment().week();
    var inputdate = getTodaysDate();
    var coords = userlocation;

    db.transaction(function(st) { 
    	//st.executeSql('DROP TABLE IF EXISTS price_survey');
        st.executeSql('CREATE TABLE IF NOT EXISTS price_survey (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, coords VARCHAR, type VARCHAR, brands LONGTEXT, submitter VARCHAR, store VARCHAR, store_id INTEGER, store_server_id VARCHAR, inputdate VARCHAR, week VARCHAR, month VARCHAR, year VARCHAR, modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
        st.executeSql("INSERT INTO price_survey(coords,type,brands,submitter,store,store_id,store_server_id,inputdate,week,month,year) values (?,?,?,?,?,?,?,?,?,?,?)",
            [coords,type,brandsdata,submitter,store,itemid,store_server_id,inputdate,week,month,year], alertSuccess);
        
    },onError,onReadyTransaction);

}

function updatePriceIndex(){
    var type = document.getElementById("displaytype").value;
    var dbitemid = $('#dbitemid').val();
    var month = thisMonth();
    var year = thisYear();

    var brands = {};
    var items = [];
	$('form#formdisplayinput').find("input[name='brand[]']").each(function(i, field) {
        var brand = {};
        if (type == 'eabl') {    
            brand.code = $(field).data('productcode');
            brand.name = $(field).data('productname');
            brand.price = field.value;
            
        }
        if (type == 'competitor'){
            brand.code = 'none';
            brand.name = $(field).attr('id');
            brand.price = field.value;
        }
        items.push(brand);
        
    });
	
    brands['items'] = items;
    var brandsdata = JSON.stringify(brands); 
    var modifieddate = moment().format('YYYY-MM-DD hh:mm:ss'); 
    //var q = "UPDATE price_survey SET brands = '"+brandsdata+"', modified = '"+modifieddate+"' WHERE store_id = '"+itemid+"' AND type = '"+type+"' AND month = '"+month+"' AND year = '"+year+"'";
    var q = "UPDATE price_survey SET brands = '"+brandsdata+"', modified = '"+modifieddate+"' WHERE id = '"+dbitemid+"'";
   
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {       
            //console.log('successfully updated');
            var msg = '<div class="alert alert-success alert-dismissible" role="alert">';
            msg += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            msg += ' '+type+' successfully updated.';
            msg += '</div>';

            $('.modal-body div.list-group').append(msg);
            setTimeout(function() {
              $('.modal-body div.list-group .alert').remove();
            }, 2000);
        });
    });
    

}
function checkPriceIndex(){
	// check if exists for this store and update, else add new   
    var month = thisMonth();
    var year = thisYear();   
    var type = document.getElementById("displaytype").value;
    var q = "SELECT id FROM price_survey WHERE store_id = '"+itemid+"' AND type= '"+type+"' AND month = '"+month+"' AND year = '"+year+"'";
 
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            if (data.rows.length > 0){
                //console.log('found one');
                updatePriceIndex();
            }
            else {
                //console.log('nothing found');
                insertPriceIndex();
            }           
        });
    });

}

//
//
var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku;
newsku = '<div class="col-xs-12"><p>Showing Data For this Month</p></div>';

var monthpicker = ' <label>Select Month for Data:</label>';
 monthpicker += ' <select id="displaymonth" name="displaymonth" class="form-control">';
 monthpicker += '<option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option><option value="4">Apr</option>';
 monthpicker += '<option value="5">May</option><option value="6">Jun</option><option value="7">Jul</option><option value="8">Aug</option>';
 monthpicker += '<option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>';
 monthpicker += '</select>';

 var compeform = '<div class="list-group-item list-group-item-info">';
 compeform += ' <label>Year: '+moment().get('year')+'</label>';
 compeform += ' <label>Week: '+moment().week()+'</label>';
 compeform += ' <label>This Month: '+moment().month()+'</label>';
 compeform += ' <label>Date: '+getTodaysDate()+'</label>';
 compeform += '</div>';
 compeform += ' <div class="form-group list-group-item list-group-item-info" id="datepicker">';
 compeform += ' <label>Select Month for Data:</label>';
 compeform += ' <select id="displaymonth" name="displaymonth" class="form-control">';
 compeform += '<option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option><option value="4">Apr</option>';
 compeform += '<option value="5">May</option><option value="6">Jun</option><option value="7">Jul</option><option value="8">Aug</option>';
 compeform += '<option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>';
 compeform += '</select>';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Heineken 500ml</label>';
 compeform += ' <input type="number" id="Heineken 500ml" name="brand[]" class="form-control" value="0">';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Jameson 750ml</label>';
 compeform += ' <input type="number" id="Jameson 750ml" name="brand[]" class="form-control" value="0">';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>William Lawson 750ml</label>';
 compeform += ' <input type="number" id="William Lawson 750ml" name="brand[]"class="form-control" value="0">';    
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Sky Vodka 750ml</label>';
 compeform += ' <input type="number" id="Sky Vodka 750ml" name="brand[]"class="form-control" value="0">';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Flat Vodka 750ml</label>';
 compeform += ' <input type="number" id="Flat Vodka 750ml" name="brand[]"class="form-control" value="0">';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Bombay Sapphire 750ml</label>';
 compeform += ' <input type="number" id="Bombay Sapphire 750ml" name="brand[]"class="form-control"value="0" >';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Viceroy 750ml</label>';
 compeform += ' <input type="number" id="Viceroy 750ml" name="brand[]"class="form-control" value="0">';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Bacardi 750ml</label>';
 compeform += ' <input type="number" id="Bacardi 750ml" name="brand[]"class="form-control" value="0">';
 compeform += ' </div>';
 compeform += ' <div class="form-group list-group-item">';
 compeform += ' <label>Amarula 750ml</label>';
 compeform += ' <input type="number" id="Amarula 750ml" name="brand[]" class="form-control" value="0">';
 compeform += ' </div>';
 compeform += ' <input type="hidden" id="displaytype" class="form-control" value="competitor">';
 compeform += ' <input type="hidden" id="curryear" value="'+thisYear()+'" class="form-control" >';
 compeform += ' <input type="hidden" id="dbitemid" value="0" class="form-control" >';
 //compeform += ' <div class="form-group list-group-item">';
 //compeform += ' <button class="btn btn-primary btn-block" type="submit" id="displaySubmit" data-loading-text="Loading..." autocomplete="off">Save</button>';
 //compeform += ' </div>';
 //compeform+= ' </form> ';          
 //compeform+= ' </div>';

$(document).ready(function() {
    //fetchEABLPriceSurvey();

	$('.navbar-header').append(backLink);
	$('#newsku').append(newsku);
    
    $('#form-modal').on('show.bs.modal', function (event) {
        var modal = $(this);
        // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
          
        var button = $(event.relatedTarget); // Button that triggered the modal
        var form = button.data('form'); 
        var viewtype = button.attr('id');
        var dbid = button.data('dbid');
        console.log('our modal opened');
        
        $('#displaySubmit').on('click', function () {
            console.log('trying to save price index');
            var dbitemid = $('#dbitemid').val();
            if (dbitemid == 0){
                insertPriceIndex();
            }
            else {
                updatePriceIndex();
            }
        })
        
    	if (form == 'eabl') {
    	  	modal.find('.modal-title').text('EABL Products Price Survey');	
            //modal.find('.modal-body .list-group form #datepicker').append(monthpicker);  	
            fetchProductsforForm(dbid,function(table){
                console.log('fetching products for form in modal');
                modal.find('.modal-body .list-group #form-holder').html(table);
            });

    	}
    	if (form == 'competitor') {
    	  	modal.find('.modal-title').text('Key Competitor Products Price Survey');
            bindCompePricestoForm(dbid,function(table){
                if (table === null){
                   modal.find('.modal-body .list-group #form-holder').html(compeform); 
                }
                else {
                   modal.find('.modal-body .list-group #form-holder').html(table);
                }
                
            })
    	  	
    	}
	  
	})    

   $('#form-modal').on('hidden.bs.modal', function (e) {
       fetchEABLPriceSurvey();
       fetchCompePriceSurvey()
   })
    	
});