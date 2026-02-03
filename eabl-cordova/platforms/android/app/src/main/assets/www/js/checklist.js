document.addEventListener("deviceready",function(){
  fetchChecklist();
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
	$('form#formchecklist').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      saveItem();
      $(this).each(function() {
        this.reset();
      });
    }
  });
  $('#form-modal').on('hidden.bs.modal', function (e) {
    fetchChecklist();
  })
});

function saveItem() {
  //var desc = document.getElementById("comments").value;
  var beer_bottles = document.getElementById("beer_bottles").value;
  var beer = document.getElementById("beer").value;
  var rtds = document.getElementById("rtds").value;
  var vodka = document.getElementById("vodka").value;
  var liqeur = document.getElementById("liqeur").value;
  var brandy = document.getElementById("brandy").value;
  var whisky = document.getElementById("whisky").value;
  var tequila = document.getElementById("tequila").value;
  var rums = document.getElementById("rums").value;
  var anads = document.getElementById("anads").value;
  var gins = document.getElementById("gins").value;
  var canes = document.getElementById("canes").value;
  var cold_space = document.getElementById("cold_space").value;
  var comments = document.getElementById("comments").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();

  db.transaction(function(st) {
    //st.executeSql('DROP TABLE IF EXISTS data_tl_checklist');
    st.executeSql('CREATE TABLE IF NOT EXISTS data_tl_checklist (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, beer_bottles INTEGER,beer INTEGER,rtds INTEGER,vodka INTEGER,liqeur INTEGER,brandy INTEGER,whisky INTEGER,tequila INTEGER,rums INTEGER,anads INTEGER,gins INTEGER,canes INTEGER,cold_space INTEGER,comments VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');

    st.executeSql("INSERT INTO data_tl_checklist(coords,beer_bottles,beer,rtds,vodka,liqeur,brandy,whisky,tequila,rums,anads,gins,canes,cold_space,comments,store,store_id,store_server_id,submitter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[coords,beer_bottles,beer,rtds,vodka,liqeur,brandy,whisky,tequila,rums,anads,gins,canes,cold_space,comments,storename,itemid,store_server_id,submitter], alertSuccess);
  },function(st,err){
    console.log(st);
    console.log(err);
  },onReadyTransaction);
}

function fetchChecklist() {
  var q = "SELECT * FROM data_tl_checklist WHERE store_id = ? ORDER BY created_on DESC LIMIT 0, 10";

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" class="list-group-item">';
        cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).created_on+'</h4>';
        cl += '<p>Beer Bottles: '+data.rows.item(i).beer_bottles+'%</p>';
        cl += '<p>Beer: '+data.rows.item(i).beer+'%</p>';
        cl += '<p>RTDs: '+data.rows.item(i).rtds+'%</p>';
        cl += '<p>Vodka: '+data.rows.item(i).vodka+'%</p>';
        cl += '<p>Liqeur: '+data.rows.item(i).liqeur+'%</p>';
        cl += '<p>Brandy: '+data.rows.item(i).brandy+'%</p>';
        cl += '<p>Whisky: '+data.rows.item(i).whisky+'%</p>';
        cl += '<p>Tequila: '+data.rows.item(i).tequila+'%</p>';
        cl += '<p>Rums: '+data.rows.item(i).rums+'%</p>';
        cl += '<p>Anads: '+data.rows.item(i).anads+'%</p>';
        cl += '<p>Gins: '+data.rows.item(i).gins+'%</p>';
        cl += '<p>Canes: '+data.rows.item(i).canes+'%</p>';
        cl += '<p>Cold Space: '+data.rows.item(i).cold_space+'%</p>';
        cl += '<p>Store: '+data.rows.item(i).store+'</p>';
        cl += '<p>Comments: '+data.rows.item(i).comments+'</p>';
        cl += '</a>';
      }
      $('article#actionlist .dataList').html(cl);
    });
  },function(st,err){
    console.log(err);
  },onReadyTransaction);
}
