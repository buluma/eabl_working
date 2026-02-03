var stockeditems = [];

/*document.addEventListener("deviceready",function(){
  /*fetchStocks(function(array,expected_length){
    console.log('stockeditems length is '+array.length);
    console.log('expected length is '+expected_length);
    if(array.length >= expected_length){
      console.log('ready to load all brands now!');
      fetchAllBrands(array);
    }
  });

  fetchStocks();
  fetchAllBrands();
  fetchMustBrands();
},false);
*/
/*window.onload = function(e) {
    fetchStocks();
    fetchAllBrands();
    fetchMustBrands();
};
*/
$(document).ready(function(){
    fetchStocks();
    fetchAllBrands();
    fetchMustBrands();
})
// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

$(function() {
  //datepicker if user is a team leader
  if (assigned == 'team-leader'){
    $('input#brand_stockdate').removeAttr('disabled');
    $('#brand_stockdate').datetimepicker({format:'D-M-YYYY'});
  }
  else {
    $('input#brand_stockdate').val(getTodaysDate());
  }
});
function fetchAllBrands(){
    console.log('fetching all brands');
  var q = "SELECT product_code,product_name FROM eabl_products WHERE deleted = ? AND published = ? ORDER BY product_name ASC";
    //var q = "SELECT product_code,product_name FROM eabl_products WHERE deleted = ? AND published = ? AND product_code NOT IN (SELECT brandcode from eabl_products WHERE store_server_id = ? ) ORDER BY product_name ASC";
  db.transaction(function (t) {
      t.executeSql(q, [0,1], function (t, data) {
          var sl = '';
          //console.log(data);
          for (var i =0;i<data.rows.length;i++) {
            var brand = data.rows.item(i);
            //var instock = array_to_check.indexOf(brand.brandcode);
            sl += '<a href="#" class="list-group-item">';
            sl += '<h4 class="list-group-item-heading">'+brand.product_code+' - '+brand.product_name+'</h4>';
            /*if (instock >= 0){
              sl += '<button class="btn btn-success">Already in Stock</button>';
            }
            else{
              sl += '<button class="btn btn-warning btn-add-stock" data-product_code="'+brand.product_code+'" data-product_name="'+brand.product_name+'">Add to Stock list</button>';
            }
            */
            sl += '<button class="btn btn-warning btn-add-stock" data-product_code="'+brand.product_code+'" data-product_name="'+brand.product_name+'">Add to Stock list</button>';

            //sl += '<button id="btn-add-stock" class="btn btn-warning" data-product_code="'+brand.product_code+'" data-product_name="'+brand.product_name+'">Add to Stock list</button>';
            sl += '</a>';
          }
          $('#allbrands .list-group').html(sl);
      });
  });

}
//fetchMstHave
function fetchMustBrands(){
    console.log('fetching must have brands');
  //var q = "SELECT product_code,product_name FROM eabl_products WHERE deleted = ? AND must_have = ? AND published = ? AND product_code NOT IN (SELECT brandcode from brandstocks WHERE store_server_id = ? ) ORDER BY product_name ASC";
    var q = "SELECT product_code,product_name FROM eabl_products WHERE must_have = ? ORDER BY product_name ASC";
  db.transaction(function (t) {
      t.executeSql(q, ['1'], function (t, data) {
          var sl = '';
          console.log(data);
          for (var i =0;i<data.rows.length;i++) {
            var brand = data.rows.item(i);
            
            //var instock = array_to_check.indexOf(brand.brandcode);
            sl += '<a href="#" class="list-group-item">';
            sl += '<h4 class="list-group-item-heading">'+brand.product_code+' - '+brand.product_name+'</h4>';
            /*if (instock >= 0){
              sl += '<button class="btn btn-success">Already in Stock</button>';
            }
            else{
              sl += '<button class="btn btn-warning btn-add-stock" data-product_code="'+brand.product_code+'" data-product_name="'+brand.product_name+'">Add to Stock list</button>';
            }
            */
            sl += '<button class="btn btn-warning btn-add-stock" data-product_code="'+brand.product_code+'" data-product_name="'+brand.product_name+'">Add to Stock list</button>';

            //sl += '<button id="btn-add-stock" class="btn btn-warning" data-product_code="'+brand.product_code+'" data-product_name="'+brand.product_name+'">Add to Stock list</button>';
            sl += '</a>';
          }
          $('#musthave .list-group').html(sl);
      });
  });

}
function checkIfBrandInStock(code){
  var q = "SELECT id,brand,brandcode FROM brandstocks WHERE brandcode = ? AND store_server_id = ?";
  db.transaction(function (t) {
    var found;
    t.executeSql(q, [code,store_server_id], function (t, data) {
      //console.log(code+' --- '+data.rows.length);
      found = data.rows.length;
      callback(found);
    });
  });

}
function addBrandToStock(btn){

  var product_code = $(btn).data('product_code');
  var product_name = $(btn).data('product_name');
  //console.log(product_code+' --- '+product_name);
  // add to brandstocks table, with some default items

  var coords = userlocation;
  var brandcode = $(btn).data('product_code');
  var brand = $(btn).data('product_name');
  //var txt = $("#ddlViewBy option:selected").text();
  var stockdate = getTodaysDate();
  var currentstock = 0;
  var sale = 0;
  var orderplaced = 0;
  var expected_delivery = 0;
  var stockout = 'No'
  var submitter = username;
  var store = storename;
  //TODO: Check if product is in stock first before adding
  db.transaction(function(st) {
    //st.executeSql('DROP TABLE brandstocks');
    st.executeSql('CREATE TABLE IF NOT EXISTS brandstocks (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,stockdate VARCHAR, coords VARCHAR,brand VARCHAR,brandcode VARCHAR,currentstock VARCHAR,sale VARCHAR, orderplaced VARCHAR, expected_delivery VARCHAR, stockout VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER, remarks VARCHAR,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO brandstocks(coords,stockdate,brand,brandcode,currentstock,sale,orderplaced,expected_delivery,stockout,submitter,store,store_id,store_server_id) values ('"+coords+"','"+stockdate+"','"+brand+"','"+brandcode+"','"+currentstock+"','"+sale+"','"+orderplaced+"','"+expected_delivery+"','"+stockout+"','"+submitter+"','"+store+"','"+itemid+"','"+store_server_id+"')",null, function(){
      alert(brand+' Successfully added to this outlets Stock List');
      fetchAllBrands();
      fetchStocks();
      fetchMustBrands();
    });
  },function(error){
    console.log(error.message)
  },onReadyTransaction);

}
function fetchStocks(callback) {
  //var q = "SELECT * FROM brandstocks WHERE store_id = ? ORDER BY brand ASC";
  var q = "SELECT * FROM brandstocks WHERE store_id = ? ORDER BY brand ASC";
  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      //console.log(t.executeSql);
      var pl ='';
      for (var i =0;i<data.rows.length;i++) {
        var object = JSON.stringify(data.rows.item(i));
        stockeditems.push(data.rows.item(i).brandcode);
        //console.log(object);
        pl += '<a class="list-group-item toggle-task" id="dropdown-detail-'+i+'" data-toggle="detail-'+i+'" style="min-height:50px;overflow:auto;">';
        //pl += '<div class="toggle-task" id="dropdown-detail-'+i+'" data-toggle="detail-'+i+'">';
        pl += '<div>';
        pl += '    <h4 class="list-group-item-heading pull-left">'+data.rows.item(i).brand+'</h4>';
        pl += '    <span class="glyphicon glyphicon-chevron-down pull-right"></span>';
        pl += '</div>';
        //pl += '<hr></hr>';
        pl += '<div id="detail-'+i+'" class="col-xs-12" style="display:none;clear:both;">';
        pl += '<hr></hr>';
        pl += "<button id='btn-edit-stock-"+i+"' data-object='"+object+"' class='btn btn-primary btn-edit-stock pull-right'><span class='glyphicon glyphicon-edit'></span></button>";
        //pl += '<span class="badge">'+data.rows.item(i).stockdate+'</span>';
        pl += '<p><strong>Current Stock:</strong> '+data.rows.item(i).currentstock+'</p>';
        pl += '<p><strong>Sale:</strong> '+data.rows.item(i).sale+'</p>';
        pl += '<p><strong>Order Placed:</strong> '+data.rows.item(i).orderplaced+'</p>';
        pl += '<p><strong>Delivered:</strong> '+data.rows.item(i).expected_delivery+'</p>';
        pl += '<p><strong>Stock Out:</strong> '+data.rows.item(i).stockout+'</p>';
        pl += '<p><strong>Remarks:</strong> '+data.rows.item(i).remarks+'</p>';
        pl += '</div>';
        pl += '</a>';
      }
		  //$('article#skulist .dataList').html(pl);
      $('#stockedbrands .dataList').html(pl);
      if (callback) callback(stockeditems,data.rows.length);
    });
  });

}
function bindToForm(data){
  // accepts a valid JSON-rep object
  console.log(data);
  // Trigger open the modal and populate the form
  $('#selectbrands').hide();
  $('#myModalLabel').html('Editing '+data.brand);
  $('#formskuinput #brand_stock_id').val(data.id);
  $('#formskuinput #brandname').val(data.brand);
  $('#formskuinput #brandcode').val(data.brandcode);
  $('#formskuinput #brand_stock, #brand_newstock').val(data.currentstock);
  //$('#formskuinput #brand_newstock').val(data.currentstock);
  if (data.sale == '' || data.sale == null){
    data.sale = 0;
  }
  $('#formskuinput #brand_sale').val(data.sale);
  $('#formskuinput #brand_order').val(data.orderplaced);
  $('#formskuinput #brand_delivery').val(data.expected_delivery);
  $('#form-modal').modal('show');

}
function updateStock() {
  var coords = userlocation;
  var brandcode = document.getElementById("brandcode").value;
  var brand = document.getElementById("brandname").value;
  var id = document.getElementById("brand_stock_id").value;
  var stockdate = document.getElementById("brand_stockdate").value;
  var currentstock = document.getElementById("brand_stock").value;
  var newstock = document.getElementById("brand_newstock").value;
  var sale = document.getElementById("brand_sale").value;
  var orderplaced = document.getElementById("brand_order").value;
  var expected_delivery = document.getElementById("brand_delivery").value;
  var stockoutstate = $('#brand_stockout').prop('checked');
  if (stockoutstate === true) {
  	var stockout = 'Yes';
  }
  else { var stockout = 'No';}
  var remarks = document.getElementById("brand_remarks").value;
  var submitter = username;
  var store = storename;

  db.transaction(function(st) {
    var query = 'UPDATE brandstocks SET coords = ?,stockdate = ?,brand = ?,brandcode = ?,currentstock = ?, sale = ? ,orderplaced = ?,expected_delivery = ?,stockout = ?,submitter = ?,remarks = ?,last_sync = ? WHERE id = ? AND store_server_id = ?';
    var values = [coords,stockdate,brand,brandcode,newstock,sale,orderplaced,expected_delivery,stockout,submitter,remarks,"none",id,store_server_id];
    st.executeSql(query,values, alertSuccess);
  },function(error){
    console.log(error.message)
  },onReadyTransaction);
}

function loadStockListFromServer(){
  $.ajax({
        url : ServerURI+'/api/getstocks.php',
        type : 'GET',
        data : {"store_server_id" : store_server_id},

        beforeSend : function(xhr){
            console.log('Start');
            $('.ajax_request').removeClass('hide');
        },
        error : function(xhr, status, error){
          $('.message').html('oops! an error occurred');
            console.log(xhr.responseText+ ' | ' +status+ '|' +error);
        },
        complete : function(xhr, status){
            console.log('End');
            $('.ajax_request').addClass('hide');
        },
        success : function(result, status, xhr){
          $('.ajax_request').addClass('hide');
          if (result instanceof Object){
            db.transaction(function(st) {
              for(var i= 0; i < result.brandstocks.length; i++){
                console.log(result.brandstocks.length);
                var b = result.brandstocks[i];

                var q = "INSERT INTO brandstocks(brand,brandcode,currentstock,sale,orderplaced,expected_delivery,stockout,submitter,store,store_id,store_server_id) values (?,?,?,?,?,?,?,?,?,?,?)";
                var values = [b.brand,b.brandcode,b.currentstock,b.sale,b.orderplaced,b.delivered,b.stockout,b.submitter,b.store,itemid,b.store_server_id];
                st.executeSql(q,values, function(){
                  //alert(brand+' Successfully added to this outlets Stock List');
                  console.log('brandstock from server successfully added');
                });
              }

            },function(error){
              console.log(error.message)
            },function(){
              $('.message').html('<div class="alert alert-success alert-dismissible" role="alert"><p><span class="glyphicon glyphicon-ok"></span> Successfully loaded brand stocks from server.</p></div>');
              setTimeout(function() {
                $('.message').hide();
              }, 3000);
              fetchStocks();
            });
          }
          else {
             $('.message').html('the response was not understood!');
          }

        }
  });
}
function cleanTable(){
  // remove all brandstocks from this outlet then start a fresh
  db.transaction(function(st) {
    var query = 'DELETE FROM brandstocks WHERE store_server_id = ?';
    st.executeSql(query,[store_server_id], function(){
      alert('Outlet Cleaned of Brand Stocks');
      fetchStocks();
    });
  },function(error){
    console.log(error.message)
  },onReadyTransaction);
}
var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> Brand Stocks </h4>';
newsku += '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#form-modal">Add</button>';

var eabl_products = '<label>Product</label>';
eabl_products += '<select name="brands" class="form-control" id="brands">';
//eabl_products += main_products;
//eabl_products += fetchProductsForSelect();
eabl_products += '</select>';

$(document).ready(function() {
  /*fetchProductsForSelect(function(options){
    $('#brands').append(options);
  })
  */
	$('#brand_stockout').bootstrapToggle();
	// listen if toggle is on or off : true --- false
	$('#brand_stockout').change(function() {
    $('#console-event').html('Toggle: ' + $(this).prop('checked'))
    //console.log('Toggle: ' + $(this).prop('checked'));
  })
	$('.navbar-header').append(backLink);
	//$('#newsku').append(newsku);
  $('#selectbrands').html(eabl_products);

  $('form#formskuinput').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      updateStock();
      //$('#formskuinput input:not("#brand_stockdate")').val('');
    }
  });
  $('#form-modal').on('hidden.bs.modal', function (e) {
    fetchStocks();
    //document.location.reload(true);
  })
  $(document).on('click', '.btn-add-stock',function(){
    var button = $(this);
    addBrandToStock(button);
  })
  $('#refresh-stock-list').on('click',function(){
    fetchStocks();
  })
  $('#refresh-brands-list').on('click',function(){
    fetchAllBrands();
  })
  $('#refresh-must-list').on('click',function(){
    fetchMustBrands();
  })
  $(document).on('click','.toggle-task',function(){
      //console.log('clicked');
      $input = $(this);
      $target = $('#'+$input.attr('data-toggle'));
      //console.log($target);
      $target.slideToggle();
      //$target.removeClass('hide');
  });
  $(document).on('click','.btn-edit-stock',function(){
      $input = $(this);
      bindToForm($input.data('object'));
  });

  $('#brand_sale').on('keyup',function(){
    var currentstock = parseInt($('#brand_stock').val());
    var delivered = parseInt($('#brand_delivery').val());
    var newstock = (currentstock - parseInt($(this).val())) + delivered;

    $('#brand_newstock').val(parseInt(newstock));
  })
  $('#brand_delivery').on('keyup',function(){
    var currentstock = parseInt($('#brand_stock').val());
    var sale = parseInt($('#brand_sale').val());
    var newstock = (currentstock + parseInt($(this).val())) - sale;

    $('#brand_newstock').val(newstock);
  })
  $('#clean-stock-list').on('click',function(){
    cleanTable();
  })
  $('#load-server-stock-list').on('click',function(){
    loadStockListFromServer();
  })
  $('.open-migration-tools').on('click',function(){
    $("#migration-tools").toggleClass('hidden');
  })
  /*$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
    console.log(e.target);
    var tab = e.target // newly activated tab
    var tabid = $(tab).attr('id');
    //e.relatedTarget // previous active tab

    if (tabid == 'all-tab'){
      fetchAllBrands();
    }

  })
*/
});
