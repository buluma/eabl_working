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

  /*bindPlantoForm(dbid,function(table){
      console.log('binding data to form');
      console.log('table is '+table);
      if (table === null){
          modal.find('.modal-body .list-group #form-holder').html(form);
          fetchOutletsForSelect(function(options){
              $("select.multi_select").html(options).multiselect();
              //$("select.multi_select").multiselect();
          })
      }
      else {
          modal.find('.modal-body .list-group #form-holder').html(table);
      }
  });*/

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
  var daily_date = document.getElementById("daily_date").value;
  var routeplan = document.getElementById("routeplan").value;
  var inputdate = getTodaysDate();
  var year = thisYear();
  var week = moment().week();
  var month = thisMonth();
  var status = '0';
  var start_time_input = document.getElementById("start_time_input").value;
  var end_time_input = document.getElementById("end_time_input").value;
  var daily_challenges = document.getElementById("daily_challenges").value;
  var notes = document.getElementById("daily_notes").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();

  db.transaction(function(st) {
    //st.executeSql('DROP TABLE IF EXISTS data_tl_daily_plannerxx');
    st.executeSql('CREATE TABLE IF NOT EXISTS data_tl_daily_plannerxx (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, coords VARCHAR, daily_date LONGTEXT, start_time_input VARCHAR, end_time_input VARCHAR, daily_challenges VARCHAR, status VARCHAR, store_id INTEGER,daily_notes VARCHAR, routeplan LONGTEXT, submitter VARCHAR, inputdate VARCHAR, week VARCHAR, month VARCHAR, year VARCHAR, modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    st.executeSql("INSERT INTO data_tl_daily_plannerxx(coords,daily_date,start_time_input,end_time_input,daily_challenges,daily_notes,routeplan,status,store_id,submitter,inputdate,week,month,year) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[coords,daily_date,start_time_input,end_time_input,daily_challenges,notes,routeplan,status,itemid,submitter,inputdate,week,month,year], alertSuccess);
  },function(st,err){
    console.log(st.executeSql);
    console.log(st);
    console.log(err);
  },onReadyTransaction);
}

function fetchItems() {
//var q = "SELECT * FROM data_tl_daily_plannerxx WHERE status = ? ORDER BY created DESC LIMIT 0, 10";
var q = "SELECT * FROM data_tl_daily_plannerxx WHERE store_id = ? ORDER BY created DESC LIMIT 0, 10";
//var q = "SELECT * FROM data_tl_daily_plannerxx WHERE week = '"+week+"' AND month = '"+month+"' AND year = '"+year+"'";
//var q = "SELECT * FROM data_tl_daily_plannerxx WHERE week = ? ORDER BY created DESC LIMIT 0, 10"

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" class="list-group-item">';
        cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).daily_date+'</h4>';
        cl += '<p>Stores: '+data.rows.item(i).routeplan+'</p>';
        cl += '<p>Start Time: '+data.rows.item(i).start_time_input+'</p>';
        cl += '<p>End Time: '+data.rows.item(i).end_time_input+'</p>';
        cl += '<p>Daily Challenges: '+data.rows.item(i).daily_challenges+'</p>';
        cl += '<p>Notes: '+data.rows.item(i).daily_notes+'</p>';
        cl += '</a>';
      }
      $('article#actionlist .dataList').html(cl);
    });
  },function(st,err){
    console.log(err);
    console.log(st);
  },onReadyTransaction);
}
