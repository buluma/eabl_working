document.addEventListener("deviceready",function(){
  fetchItems();
},false);
// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

$(document).ready(function(){
	var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
  backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';
  $('.navbar-header').html(backLink);
	$('form#form_recom').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      saveItem();
      // console.log
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
  var sell_wl_1l = document.getElementById("sell_wl_1l").value;
  var sell_wl_35cl = document.getElementById("sell_wl_35cl").value;
  var sell_wl_75cl = document.getElementById("sell_wl_75cl").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();

  db.transaction(function(st) {
    // st.executeSql('DROP TABLE IF EXISTS activation');
    st.executeSql('CREATE TABLE IF NOT EXISTS placement (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, sell_wl_1l VARCHAR,sell_wl_35cl VARCHAR,sell_wl_75cl VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO placement(coords,sell_wl_1l,sell_wl_35cl,sell_wl_75cl,store,store_id,store_server_id,submitter) VALUES (?,?,?,?,?,?,?,?)",[coords,sell_wl_1l,sell_wl_35cl,sell_wl_75cl,storename,itemid,store_server_id,submitter], function(st,results){
      // callback
      alertSuccess();
    });
  },function(st,err){
    console.log(st);
    console.log(err);
  },onReadyTransaction);
}

function fetchItems() {
  var q = "SELECT * FROM placement WHERE store_id = ? ORDER BY created_on DESC LIMIT 0, 10";

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" class="list-group-item">';
        cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).created_on+'</h4>';
        cl += '<p>Sold in William Lawson 1L?: '+data.rows.item(i).sell_wl_1l+'</p>';
        cl += '<p>Sold in William Lawson 35cl?: '+data.rows.item(i).sell_wl_35cl+'</p>';
        cl += '<p>Sold in William Lawson 75cl?: '+data.rows.item(i).sell_wl_75cl+'</p>';
        cl += '</a>';
      }
      $('article#recomlist .dataList').html(cl);
    });
  },onError,onReadyTransaction);
}
// $(document).ready(function() {
//   $('#focus_type').on('change',function(){
//     var value = $(this).val();
//     if (value == 'custom' ) {
//       $('.focusx').removeClass('hidden');
//     }
//     else {
//       $('.focusx').addClass('hidden');
//     }
//   })
// });