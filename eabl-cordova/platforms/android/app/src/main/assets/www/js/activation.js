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
  var activation_status = document.getElementById("activation_status").value;
  var storming_status = document.getElementById("storming_status").value;
  // var action = document.getElementById("action_input").value;
  // var focus_start_date = document.getElementById("act_start_date").value;
  // var focus_end_date = document.getElementById("act_end_date").value;

  //new
  // var activation_status = document.getElementById("activation_status").value;
  // var storming_status = document.getElementById("storming_status").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();

  db.transaction(function(st) {
    // st.executeSql('DROP TABLE IF EXISTS activation');
    st.executeSql('CREATE TABLE IF NOT EXISTS activation (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, activation_status VARCHAR,storming_status VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO activation(coords,activation_status,storming_status,store,store_id,store_server_id,submitter) VALUES (?,?,?,?,?,?,?)",[coords,activation_status,storming_status,storename,itemid,store_server_id,submitter], function(st,results){
      // callback
      alertSuccess();
    });
  },function(st,err){
    // console.log(st);
    // console.log(err);
  },onReadyTransaction);
}

function fetchItems() {
  var q = "SELECT * FROM activation WHERE store_id = ? ORDER BY created_on DESC LIMIT 0, 10";

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      // console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" class="list-group-item">';
        //cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).created_on+'</h4>';
        cl += '<p>Is the outlet open for activation?: '+data.rows.item(i).activation_status+'</p>';
        cl += '<p>Is the outlet open for bar storming?: '+data.rows.item(i).storming_status+'</p>';
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