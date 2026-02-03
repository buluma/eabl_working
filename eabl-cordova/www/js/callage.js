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
  var segment = document.getElementById("segment").value;
  var division = document.getElementById("cdivision").value;
  var pcalls = document.getElementById("planned_calls").value;
  var adhdcalls = document.getElementById("adhd_calls").value;
  var netotr = document.getElementById("net_otr").value;
  var ach_outlets = document.getElementById("achieved_outlets").value;
  var act_acc = document.getElementById("actual_acc").value;
  var coaching = document.getElementById("coachingas").value;
  var jpaplannedcalls = document.getElementById("jp_planned_calls").value;
  var jpachvdcalls = document.getElementById("jp_achieved_calls").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();

  db.transaction(function(st) {
    //st.executeSql('DROP TABLE IF EXISTS data_tl_callagex');
    st.executeSql('CREATE TABLE IF NOT EXISTS data_tl_callagex (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, segment VARCHAR, cdivision VARCHAR, planned_calls INTEGER,jp_planned_calls VARCHAR,jp_achieved_calls VARCHAR,adhd_calls VARCHAR,net_otr INTEGER,achieved_outlets INTEGER,actual_acc INTEGER,coachingas INTEGER,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    st.executeSql("INSERT INTO data_tl_callagex(coords,segment,cdivision,jp_achieved_calls,jp_planned_calls,planned_calls,adhd_calls,net_otr,achieved_outlets,actual_acc,coachingas,store,store_id,store_server_id,submitter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[coords,segment,division,jpaplannedcalls,jpachvdcalls,pcalls,adhdcalls,netotr,ach_outlets,act_acc,coaching,storename,itemid,store_server_id,submitter], alertSuccess);
  },function(st,err){
    console.log(st);
    console.log(err);
  },onReadyTransaction);
}

function fetchItems() {
  var q = "SELECT * FROM data_tl_callagex WHERE store_id = ? ORDER BY created_on DESC LIMIT 0, 10";

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" class="list-group-item">';
        cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).segment+'</h4>';
        //cl += '<p>Store: '+data.rows.item(i).store+'</p>';
        cl += '<p>Division: '+data.rows.item(i).cdivision+'</p>';
        cl += '<p>Achieved Outlets: '+data.rows.item(i).achieved_outlets+'</p>';
        cl += '<p>Actual Acc: '+data.rows.item(i).actual_acc+'</p>';
        cl += '<p>Adhered Calls: '+data.rows.item(i).adhd_calls+'</p>';
        cl += '<p>Net OTR: '+data.rows.item(i).net_otr+'</p>';
        cl += '<p>Planned Calls: '+data.rows.item(i).planned_calls+'</p>';
        cl += '<p>Coaching as of: '+data.rows.item(i).coachingas+'</p>';
        cl += '</a>';
      }
      $('article#actionlist .dataList').html(cl);
    });
  },function(st,err){
    console.log(err);
  },onReadyTransaction);
}
