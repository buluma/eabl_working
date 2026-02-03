document.addEventListener("deviceready",function(){
  fetchIssues();
},false);

// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

$(function() {
  //$('#date_expiry').datetimepicker({format:'YYYY-M-D'});
});
function fetchIssues() {  
  var q = "SELECT * FROM quality_issues WHERE store_id = ? ORDER BY created_on DESC LIMIT 10"; 
  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {     
      var pl ='';
      for (var i =0;i<data.rows.length;i++) {
        pl += '<a href="#" class="list-group-item">';
        pl += '<span class="badge">'+data.rows.item(i).issue_type+'</span>';
        pl += '<h4 class="list-group-item-heading">'+data.rows.item(i).brand+'</h4>';
        pl += '<p><strong>Created on:</strong> '+data.rows.item(i).created_on+'</p>';
        pl += '<p><strong>Rate of Sale:</strong> '+data.rows.item(i).rateofsale+'</p>';
        if (data.rows.item(i).issue_type == 'expiry'){
          pl += '<p><strong>Expiry Date:</strong> '+data.rows.item(i).expiry_date+'</p>'; 
        }
        pl += '<p><strong>Remarks:</strong> '+data.rows.item(i).remarks+'</p>';
        pl += '</a>';
      }
		  $('article#issuelist .dataList').html(pl);
    });
  },function(t,err){
     console.log(err);
  },
  function(){
      console.log('finished fetching issues...');
  });
}
function saveIssue() {
  var coords = userlocation;
  var brandcode = document.getElementById("brands").value;
  var brand = $("#brands option:selected").text();
  var expiry_date = document.getElementById("date_expiry").value;
  var issue_type = document.getElementById("issue_type").value;
  var rateofsale = document.getElementById("issue_rateofsale").value;
  var remarks = document.getElementById("issue_remarks").value;
  var submitter = username;
  var store = storename;

  db.transaction(function(st) { 
    //st.executeSql('DROP TABLE brandstocks');
    st.executeSql('CREATE TABLE IF NOT EXISTS quality_issues (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, coords VARCHAR,brand VARCHAR,brandcode VARCHAR,issue_type VARCHAR,rateofsale VARCHAR, expiry_date VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER, remarks VARCHAR, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO quality_issues(coords,brand,brandcode,expiry_date,issue_type,rateofsale,submitter,store,store_id,store_server_id,remarks) values (?,?,?,?,?,?,?,?,?,?,?)",[coords,brand,brandcode,expiry_date,issue_type,rateofsale,submitter,store,itemid,store_server_id,remarks], alertSuccess);
  },function(st,error){
    console.log(error.message)
  },onReadyTransaction);
}

var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> Quality Issues </h4>';
newsku += '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#form-modal">Add</button>';

var eabl_products = '<label>Product</label>';
eabl_products += '<select name="brands" class="form-control" id="brands">';
//eabl_products += main_products;
//eabl_products += fetchProductsForSelect();
eabl_products += '</select>';

$(document).ready(function() {
  $('#selectbrands').html(eabl_products);
  fetchProductsForSelect(function(options){
    $('#brands').append(options);
  })

	$('.navbar-header').append(backLink);
	$('#newsku').append(newsku);

  $('form#formqualityinput').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      saveIssue();
      $('#formqualityinput input').val('');      
    }           
  });
  $('#form-modal').on('hidden.bs.modal', function (e) {
    fetchIssues();
  })
  $('#issue_type').on('change',function(){
    var value = $(this).val();
    if (value == 'expiry' ) {
      $('.date').removeClass('hidden');
    }
    else {
      $('.date').addClass('hidden');
    }
  })
});