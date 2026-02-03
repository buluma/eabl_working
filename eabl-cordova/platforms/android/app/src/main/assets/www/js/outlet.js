document.addEventListener("deviceready", function(){
  waitForDbAndExecute(fetchItems);
}, false);
// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

$(document).ready(function(){
	var backLink = '<h5><a href="app.html" class="button">';
  backLink += '<span class="glyphicon glyphicon-arrow-left"> Home</a></h5>';
  $('.navbar-header').html(backLink);
	$('form#form_action').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      saveItem();
      $(this).each(function() {
        this.reset();
      });
    }
  });
  $('#form-modal').on('hidden.bs.modal', function (e) {
    fetchItems();
  })
});

function saveItem() {
  var account = document.getElementById("account").value;
  var shop_name = document.getElementById("shop_name").value;
  var category = document.getElementById("category").value;
  var region = document.getElementById("region").value;
  var location = document.getElementById("location").value;
  var manager_name = document.getElementById("manager_name").value;
  var manager_phone = document.getElementById("manager_phone").value;
  var manager_email = document.getElementById("manager_email").value;
  var submitter = (typeof username !== 'undefined' && username) ? username : '';
  var coords = (typeof userlocation !== 'undefined' && userlocation) ? userlocation : '';
  var timestamp = Date.now();

  waitForDbAndExecute(function() {
    db.transaction(function(st) {
      st.executeSql("INSERT INTO my_outlets(coords,account,shop_name,category,region,location,manager_name,manager_phone,manager_email,store,store_id,store_server_id,submitter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",[coords,account,shop_name,category,region,location,manager_name,manager_phone,manager_email,storename,itemid,store_server_id,submitter], alertSuccess);
    },function(st,err){
      console.log(st);
      console.log(err);
    },onReadyTransaction);
  });
}

function fetchItems() {
  if (!itemid || itemid === 'undefined') {
    $('#outlet-missing-params').removeClass('hidden');
    $('article#outletlist .dataList').html('');
    return;
  }
  var q = "SELECT * FROM my_outlets WHERE store_id = ? ORDER BY created_on DESC LIMIT 0, 10";

  waitForDbAndExecute(function() {
    db.transaction(function (t) {
      t.executeSql(q, [itemid], function (t, data) {
        console.log(data.rows);
        var cl = '';
        for (var i =0;i<data.rows.length;i++) {
          cl += '<a href="#" class="list-group-item">';
          cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).account+'</h4>';
          //cl += '<p>Store: '+data.rows.item(i).store+'</p>';
          cl += '<p>Shop Name: '+data.rows.item(i).shop_name+'</p>';
          cl += '<p>Category: '+data.rows.item(i).category+'</p>';
          cl += '<p>Region: '+data.rows.item(i).region+'</p>';
          cl += '<p>Location : '+data.rows.item(i).location+'</p>';
          cl += '<p>Manager Name: '+data.rows.item(i).manager_name+'</p>';
          cl += '<p>Manager Email: '+data.rows.item(i).manager_email+'</p>';
          cl += '<p>Manager Phone: '+data.rows.item(i).manager_phone+'</p>';
          cl += '</a>';
        }
        $('article#outletlist .dataList').html(cl);
      });
    },function(st,err){
      console.log(err);
    },onReadyTransaction);
  });
}
