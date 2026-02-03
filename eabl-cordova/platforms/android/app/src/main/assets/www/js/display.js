document.addEventListener("deviceready",function(){
	fetchDisplaydisplays();
    fetchDisplaySales();
    fetchDisplayInventory();
    
},false);

// grab url params

// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var dateparam = getTodaysDate();
//
var defaultdisplay = '<table class="table">';
defaultdisplay += '<tr>';
defaultdisplay += '<td>LENOVO <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>SAMSUNG <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>TECNO <span class="badge pull-right">0</span></td>';
defaultdisplay += '</tr>';
defaultdisplay += '<tr>';
defaultdisplay += '<td>LG <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>APPLE <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>NOKIA <span class="badge pull-right">0</span></td>';
defaultdisplay += '</tr>';
defaultdisplay += '<tr>';
defaultdisplay += '<td>SONY <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>INFINIX <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>BLACKBERRY <span class="badge pull-right">0</span></td>';
defaultdisplay += '</tr>';
defaultdisplay += '<tr>';
defaultdisplay += '<td>MOTOROLA <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>HUAWEI <span class="badge pull-right">0</span></td>';
defaultdisplay += '<td>ZTE <span class="badge pull-right">0</span></td>';
defaultdisplay += '</tr>';
defaultdisplay += '<tr>';
defaultdisplay += ' <td>ALCATEL <span class="badge pull-right">0</span></td>';
defaultdisplay += ' <td>ITEL <span class="badge pull-right">0</span></td>';
defaultdisplay += ' <td>OTHERS <span class="badge pull-right">0</span></td>';
defaultdisplay += '</tr>';
defaultdisplay += '</table>';
 //
function fetchDisplayforForm(view){
    //var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND month=?";
    var q;
    //var dateparam;
    /*
    if (view == 'display'){
       q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND month=?";
       dateparam = String(thisMonth());
    }
    else {
       q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND inputdate=?";
       dateparam = getTodaysDate();
    }
    */
    q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND inputdate=?";
    //dateparam = getTodaysDate();
    
    db.transaction(function (t) {
        t.executeSql(q, [itemid, view, dateparam], function (t, data) {
            
            var found = data.rows.length;
	        if (found > 0){
	            for (var i =0;i<data.rows.length;i++) {
	                var total = data.rows.item(i).total;
	                var brands = JSON.parse(data.rows.item(i).brands);
	                $.each(brands, function(index, element) {
					    
					     //$('#form-modal').on('show.bs.modal', function (event) {
						     $('form#formdisplayinput').find('.form-group input#'+index).each(function(i, input) {
							     $('input#'+index).val(element);
							     //console.log('<input type="number" id="'+index+'" value="'+element+'"name="phone[]" class="form-control">');
		                         //$(this).val(element);
							 });
						 //});
					});
					$('.form-group input#displaytotal').val(total);
				}
			} // end if found
		    else {
                // nothing found to feed to form
		    }
        });
    });
}
 //
function fetchDisplaySales(){
    //var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND month= ? AND year = ?";
    var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND inputdate = ?";
    
    db.transaction(function (t) {
        t.executeSql(q, [itemid, 'sales', dateparam], function (t, data) {
            
            var pl ='';
            var found = data.rows.length;
            //console.log(found);
	        if (found > 0){
	            for (var i =0;i<data.rows.length;i++) {
	            
	                pl += '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="sales" id="salesview">';
	                pl += '<h4>Sales<span class="badge pull-right">Total '+data.rows.item(i).total+'</span></h4>';
	                pl += '<table class="table">';
	                //pl += '<tr>';               
	                var columns = [];
	                var rowSize = 3;
                    //console.log(data.rows.item(i).brands);
	                var brands = JSON.parse(data.rows.item(i).brands);
                    //var brands = data.rows.item(i).brands;
                    //console.log(brands);
	                $.each(brands, function(index, element) {
					     var column = '<td>'+index.toUpperCase()+'<span class="badge pull-right">'+element+'</span></td>';
					     columns.push(column);
					});
					var rows = columns.map( function(e,i){ 
					    return i%rowSize===0 ? columns.slice(i,i+rowSize) : null; 
					}).filter(function(e){ return e; });

					for (var k =0;k<rows.length;k++) {
						var tr = rows[k];
						//console.log(tr);
						pl += '<tr>';
					    for(var j = 0; j < tr.length; j++) {
					    	var td = tr[j];
					        pl += td;
					    }
	                    pl += '</tr>';
					}
	                
	                //pl += '<tr>';
				    pl += '</table>';
					pl += '</a>';
	            }
				$('article#displaylist #displaylistgroup div.salesholder').html(pl);
		    } // end if found
		    else {
                var defaultsales = '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="sales" id="salesview">';
                defaultsales += '<h4>Sales<span class="badge pull-right">Total: 0</span></h4>';
                defaultsales += defaultdisplay;
                defaultsales += '</a>';

                $('article#displaylist #displaylistgroup div.salesholder').html(defaultsales);
		    }
        });
    });
}
// 
function fetchDisplaydisplays(){
    //var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND month = ? AND year = ?";
    var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND inputdate = ?";
    
    db.transaction(function (t) {
        t.executeSql(q, [itemid, 'display', dateparam], function (t, data) {
            //console.log(q);
            var pl ='';
            var found = data.rows.length;
            //console.log('last month is '+lastMonth());
            //console.log('this year is '+thisYear());
            //console.log(data.rows);
            //console.log(found);
	        if (found > 0){
            for (var i =0;i<data.rows.length;i++) {
                
                pl += '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="display" id="displayview">';
                pl += '<h4>Display<span class="badge pull-right">Total '+data.rows.item(i).total+'</span></h4>';
                pl += '<table class="table">';
                //pl += '<tr>';               
                var columns = [];
                var rowSize = 3;
                var brands = JSON.parse(data.rows.item(i).brands);
                $.each(brands, function(index, element) {
				     var column = '<td>'+index.toUpperCase()+'<span class="badge pull-right" data-id="'+index+'">'+element+'</span></td>';
				     columns.push(column);
				});
				var rows = columns.map( function(e,i){ 
				    return i%rowSize===0 ? columns.slice(i,i+rowSize) : null; 
				}).filter(function(e){ return e; });

				for (var k =0;k<rows.length;k++) {
					var tr = rows[k];
					//console.log(tr);
					pl += '<tr>';
				    for(var j = 0; j < tr.length; j++) {
				    	var td = tr[j];
				        pl += td;
				    }
                    pl += '</tr>';
				}
                
                //pl += '<tr>';
			    pl += '</table>';
				pl += '</a>';
            }
            //if (pl) {console.log('has data');} else {console.log('no data');}
            
            //console.log(columns);
			$('article#displaylist #displaylistgroup div.displayholder').html(pl);
			} // end if found
		    else {
                var defaultdisp = '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="display" id="displayview">';
                defaultdisp += '<h4>Display<span class="badge pull-right">Total: 0</span></h4>';
                defaultdisp += defaultdisplay;
                defaultdisp += '</a>';

                $('article#displaylist #displaylistgroup div.displayholder').html(defaultdisp);
		    }
        });
    },onError,onReadyTransaction);
}
//
function fetchDisplayInventory(){
    //var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND month = ? AND year = ?";
    var q = "SELECT * FROM display WHERE store_id = ? AND type = ? AND inputdate = ?";
    
    db.transaction(function (t) {
        t.executeSql(q, [itemid, 'inventory', dateparam], function (t, data) {
            
            var pl ='';
            var found = data.rows.length;
	        if (found > 0){
            for (var i =0;i<data.rows.length;i++) {
            
                pl += '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="inventory" id="inventoryview">';
                pl += '<h4>Inventory<span class="badge pull-right">Total '+data.rows.item(i).total+'</span></h4>';
                pl += '<table class="table">';
                //pl += '<tr>';               
                var columns = [];
                var rowSize = 3;
                var brands = JSON.parse(data.rows.item(i).brands);
                $.each(brands, function(index, element) {
				     var column = '<td>'+index.toUpperCase()+'<span class="badge pull-right">'+element+'</span></td>';
				     columns.push(column);
				});
				var rows = columns.map( function(e,i){ 
				    return i%rowSize===0 ? columns.slice(i,i+rowSize) : null; 
				}).filter(function(e){ return e; });

				for (var k =0;k<rows.length;k++) {
					var tr = rows[k];
					//console.log(tr);
					pl += '<tr>';
				    for(var j = 0; j < tr.length; j++) {
				    	var td = tr[j];
				        pl += td;
				    }
                    pl += '</tr>';
				}
                
                //pl += '<tr>';
			    pl += '</table>';
				pl += '</a>';
            }
			$('article#displaylist #displaylistgroup div.inventoryholder').html(pl);
			} // end if found
		    else {
                var defaultinventory = '<a href="#" class="list-group-item" data-toggle="modal" data-target="#form-modal" data-form="inventory" id="inventoryview">';
                defaultinventory += '<h4>Inventory<span class="badge pull-right">Total: 0</span></h4>';
                defaultinventory += defaultdisplay;
                defaultinventory += '</a>';

                $('article#displaylist #displaylistgroup div.inventoryholder').html(defaultinventory);
		    }
        });
    });
}
//
function insertDisplay(){
	var store = storename;
 
	var brands = {};
	$('form#formdisplayinput').find("input[name='phone[]']").each(function(i, field) {
	    brands[field.id] = field.value;
	});
	//console.log(brands);
    var brandsdata = JSON.stringify(brands);
    //console.log(brandsdata);
	//var samsung = document.getElementById('Samsung').value;
	var disptype = document.getElementById("displaytype").value;
	var disptotal = document.getElementById("displaytotal").value;
    //var month = document.getElementById("displaymonth").value;
    var month =thisMonth();
    var submitter = username;
    var year = moment().get('year');
    var week = moment().week();
    var inputdate = getTodaysDate();
    var coords = userlocation;

    db.transaction(function(st) { 
    	//st.executeSql('DROP TABLE IF EXISTS display');
        //st.executeSql('CREATE TABLE IF NOT EXISTS display (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,type VARCHAR, brands VARCHAR, total VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, week VARCHAR, month VARCHAR, year VARCHAR,inputdate VARCHAR, modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT)');
        st.executeSql("INSERT INTO display(coords,type,brands,total,submitter,store,store_id,inputdate,week,month,year) values ('"+coords+"','"+disptype+"','"+brandsdata+"','"+disptotal+"','"+submitter+"','"+store+"','"+itemid+"','"+inputdate+"','"+week+"','"+month+"','"+year+"')",null, alertSuccess);       
    },onError,onReadyTransaction);

}

function updateDisplay(){
	var brands = {};
	$('form#formdisplayinput').find("input[name='phone[]']").each(function(i, field) {
	    brands[field.id] = field.value;
	});
	
    var brandsdata = JSON.stringify(brands);
    var disptype = document.getElementById("displaytype").value;
    var disptotal = document.getElementById("displaytotal").value;
    var modifieddate = moment().format('YYYY-MM-DD hh:mm:ss'); 
    //console.log(modifieddate);
    //var q = "UPDATE display SET brands = ?, total = ?, modified = ? WHERE store_id = ? AND type =? AND month =?";
    //var q;
    //var dateparam;
    var q = "UPDATE display SET brands = ?, total = ?, modified = ? WHERE store_id = ? AND type =? AND inputdate =?";
        
    db.transaction(function (t) {
        t.executeSql(q, [brandsdata,disptotal,modifieddate,itemid,disptype,dateparam], function (t, data) {       
            //console.log('successfully updated');
            var msg = '<div class="alert alert-success alert-dismissible" role="alert">';
            msg += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            msg += ' '+disptype+' successfully updated.';
            msg += '</div>';

            $('.modal-body div.list-group').append(msg);
            setTimeout(function() {
              $('.modal-body div.list-group .alert').remove();
            }, 2000);
        });
    });
    

}
function checkDisplay(){
	// check if exists for this store today and update, else add new   
    var disptype = document.getElementById("displaytype").value;
    var q = "SELECT * FROM display WHERE store_id = ? AND type= ? AND inputdate = ?";

    db.transaction(function (t) {
        t.executeSql(q, [itemid, disptype, dateparam], function (t, data) {
            if (data.rows.length > 0){
                    //console.log('found one');
                    updateDisplay();
            }
            else {
                    //console.log('nothing found');
                    insertDisplay();
            }           
        });
    });

}

//
var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> Display Share </h4><h4 class="pull-right">'+getTodaysDate()+'</h4>';
//newsku += '<div class="col-xs-12"><p>Showing Data For Last Month</p></div>';
var dispheader = 'Showing display data for today'; //$('.displayinfoheader').text(dispheader);
var salesheader = 'Showing sales data for today'; //$('.salesinfoheader').text(salesheader);
var invheader = 'Showing inventory data for today'; //$('.invinfoheader').text(invheader);

var monthpicker = ' <label>Select Month for Data:</label>';
 monthpicker += ' <select id="displaymonth" name="displaymonth" class="form-control">';
 monthpicker += '<option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option><option value="4">Apr</option>';
 monthpicker += '<option value="5">May</option><option value="6">Jun</option><option value="7">Jul</option><option value="8">Aug</option>';
 monthpicker += '<option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>';
 monthpicker += '</select>';

 var displayform = '<div class="list-group-item list-group-item-info">';
 displayform += ' <label>Year: '+moment().get('year')+'</label>';
 displayform += ' <label>Week: '+moment().week()+'</label>';
 displayform += ' <label>This Month: '+(moment().month()+1)+'</label>'; // momemnt months are zero indexed, counted from 0 to 11
 displayform += ' <label>Date: '+getTodaysDate()+'</label>';
 displayform += '</div>';
 //displayform += ' <div class="form-group list-group-item list-group-item-info" id="datepicker">';
 //displayform += ' <label>Select Month for Data:</label>';
 //displayform += ' <select id="displaymonth" name="displaymonth" class="form-control">';
 //displayform += '<option value="1">Jan</option><option value="2">Feb</option><option value="3">Mar</option><option value="4">Apr</option>';
 //displayform += '<option value="5">May</option><option value="6">Jun</option><option value="7">Jul</option><option value="8">Aug</option>';
 //displayform += '<option value="9">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>';
 //displayform += '</select>';
// displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Lenovo</label>';
 displayform += ' <input type="number" id="Lenovo" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Samsung</label>';
 displayform += ' <input type="number" id="Samsung" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Tecno</label>';
 displayform += ' <input type="number" id="Tecno" name="phone[]"class="form-control" >';    
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Itel</label>';
 displayform += ' <input type="number" id="Itel" name="phone[]"class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>LG</label>';
 displayform += ' <input type="number" id="LG" name="phone[]"class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Apple</label>';
 displayform += ' <input type="number" id="Apple" name="phone[]"class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Nokia</label>';
 displayform += ' <input type="number" id="Nokia" name="phone[]"class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Sony</label>';
 displayform += ' <input type="number" id="Sony" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Infinix</label>';
 displayform += ' <input type="number" id="Infinix" name="phone[]" class="form-control" >';           
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Blackberry</label>';
 displayform += ' <input type="number" id="Blackberry" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Motorola</label>';
 displayform += ' <input type="number" id="Motorola" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Huawei</label>';
 displayform += ' <input type="number" id="Huawei" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>ZTE</label>';
 displayform += ' <input type="number" id="ZTE" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Alcatel</label>';
 displayform += ' <input type="number" id="Alcatel" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Others</label>';
 displayform += ' <input type="number" id="Others" name="phone[]" class="form-control" >';
 displayform += ' </div>';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <label>Total</label>';
 displayform += ' <input type="text" id="displaytotal" class="form-control" jAutoCalc="SUM({phone[]})">';
 displayform += ' </div>';
 displayform += ' <input type="hidden" id="displaytype" class="form-control" >';
 displayform += ' <div class="form-group list-group-item">';
 displayform += ' <button class="btn btn-primary btn-block" type="button" id="displaySubmit" data-loading-text="Loading..." autocomplete="off">Save</button>';
 displayform += ' </div>';
 //displayform+= ' </form> ';          
 //displayform+= ' </div>';

$(document).ready(function() {
    var displaydate = '';
    //displaydate += ' <label>Year: '+moment().get('year')+'</label>';
    displaydate += ' <label>Week: '+moment().week()+'</label>';
    displaydate += ' <label>Date: '+getTodaysDate()+'</label>';
    displaydate += '';

	$('.navbar-header').append(backLink);
	$('#newsku').append(newsku);
    $('.displayinfoheader').text(dispheader);
    $('.salesinfoheader').text(salesheader);
    $('.invinfoheader').text(invheader);

    //$('.dateholder').append(displaydate);

	$('input#skusalesdate').val(getTodaysDate);
    
    $('#form-modal').on('show.bs.modal', function (event) {
		  var button = $(event.relatedTarget); // Button that triggered the modal
		  var form = button.data('form'); // Extract info from data-* attributes
		  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		  var modal = $(this);
		  modal.find('.modal-body .list-group form').html(displayform);
		  $('input[type=number], input#displaytotal').val('0');
		  
		  if (form == 'display') {
		  	modal.find('.modal-title').text('Display Share : display');	
            //modal.find('.modal-body .list-group form #datepicker').append(monthpicker);  	
		  	$('input#displaytype').val('display');
		  	fetchDisplayforForm('display');

		  }
		  if (form == 'sales') {
		  	modal.find('.modal-title').text('Display Share : sales');
            //modal.find('.modal-body .list-group form #datepicker').append(displaydate);
		  	$('input#displaytype').val('sales');
		  	fetchDisplayforForm('sales');
		  	
		  }
		  if (form == 'inventory') {
		  	modal.find('.modal-title').text('Display Share : inventory');
            //modal.find('.modal-body .list-group form #datepicker').append(displaydate);
		  	$('input#displaytype').val('inventory');
		  	fetchDisplayforForm('inventory');
		  	
		  }
		  // initialise the autocalc
		  $('form[name=formdisplayinput]').jAutoCalc();
		  // form submit 
	      $('#displaySubmit').on('click', function () {
				checkDisplay();
	       })	  
	})

   $('#form-modal').on('hidden.bs.modal', function (e) {
       fetchDisplaydisplays();
       fetchDisplaySales();
       fetchDisplayInventory();
   })	
});