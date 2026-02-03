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
  var wall_branding = document.getElementById("wall_branding").value;
  var sign_board = document.getElementById("sign_board").value;
  var eye_level = document.getElementById("eye_level").value;
  var poster_available = document.getElementById("poster_available").value;
  var poster_placement = document.getElementById("poster_placement").value;
  var visibility_potential = document.getElementById("visibility_potential").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();

  db.transaction(function(st) {
    // st.executeSql('DROP TABLE IF EXISTS activation');
    st.executeSql('CREATE TABLE IF NOT EXISTS visibility (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, wall_branding VARCHAR,sign_board VARCHAR,eye_level VARCHAR,poster_available VARCHAR,poster_placement VARCHAR,visibility_potential VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO visibility(coords,wall_branding,sign_board,eye_level,poster_available,poster_placement,visibility_potential,store,store_id,store_server_id,submitter) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[coords,wall_branding,sign_board,eye_level,poster_available,poster_placement,visibility_potential,storename,itemid,store_server_id,submitter], function(st,results){
      // callback
      alertSuccess();
    });
  },function(st,err){
    console.log(st);
    console.log(err);
  },onReadyTransaction);
}

function fetchItems() {
  var q = "SELECT * FROM visibility WHERE store_id = ? ORDER BY created_on DESC LIMIT 0, 10";

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" class="list-group-item">';
        //cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).created_on+'</h4>';
        cl += '<p>Has wall branding?: '+data.rows.item(i).wall_branding+'</p>';
        cl += '<p>Has a sign board?: '+data.rows.item(i).sign_board+'</p>';
        cl += '<p>Has 3+ facings eye level?: '+data.rows.item(i).eye_level+'</p>';
        cl += '<p>Has ABS posters available?: '+data.rows.item(i).poster_available+'</p>';
        cl += '<p>Did you place any ABS poster?: '+data.rows.item(i).poster_placement+'</p>';
        cl += '<p>Potential for sign board visiblity?: '+data.rows.item(i).visibility_potential+'</p>';
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