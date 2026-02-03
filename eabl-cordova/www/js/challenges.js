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
	$('form#form_challenge').on('submit', function(e){
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
  var challenge = document.getElementById("challenge").value;
  var action = document.getElementById("action").value;
  var by_who = document.getElementById("by_who").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();
	
  db.transaction(function(st) {
    //st.executeSql('DROP TABLE IF EXISTS action_items');
    st.executeSql('CREATE TABLE IF NOT EXISTS challenges (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, challenge VARCHAR, action VARCHAR, by_who VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO challenges(coords,challenge,action,by_who,store,store_id,store_server_id,submitter) VALUES (?,?,?,?,?,?,?,?)",[coords,challenge,action,by_who,storename,itemid,store_server_id,submitter], alertSuccess);
  },onError,onReadyTransaction);
}

function fetchItems() {  
  var q = "SELECT * FROM challenges WHERE store_id = ? ORDER BY created_on DESC LIMIT 0, 10";
   
  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      //console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" class="list-group-item">';      
        cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).created_on+'</h4>';
        cl += '<p><strong>Challenge: </strong>'+data.rows.item(i).challenge+'</p>';
        cl += '<p><strong>Action: </strong>'+data.rows.item(i).action+'</p>';
        cl += '<p><strong>By Who: </strong>'+data.rows.item(i).by_who+'</p>';
        cl += '</a>';
      }
      $('article#actionlist .dataList').html(cl);
    });
  },onError,onReadyTransaction);
}