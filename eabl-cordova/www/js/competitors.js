document.addEventListener("deviceready",function(){
  fetchCompetitorActivities();
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
	$('form#formcompes').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      insertCompetitorActivity();
      $(this).each(function() {
        this.reset();
      });
      // $('.photo-area').empty();
    }
  });
  $('#form-modal').on('hidden.bs.modal', function (e) {
    fetchCompetitorActivities();
  })
});

function insertCompetitorActivity() {
  var inforimg = '';
  var photos = inforimg;
  //var cstore = document.getElementById("promostore").value;
  var brand = document.getElementById("compe_brand").value;
  var category = document.getElementById("compe_category").value;
  var activity_mechanics = document.getElementById("compe_activity").value;
  var rateofsale = document.getElementById("compe_rateofsale").value;
  var myplan = document.getElementById("compe_plan").value;
  var myneed = document.getElementById("compe_need").value;
  //var timeline = document.getElementById("compe_timeline").value;
  var start_date = document.getElementById("compe_start_date").value;
  var end_date = document.getElementById("compe_end_date").value;
  var submitter = username;
  var coords = userlocation;
  var timestamp = Date.now();

  db.transaction(function(st) {
    //st.executeSql('DROP TABLE IF EXISTS competitor_activity');
    st.executeSql('CREATE TABLE IF NOT EXISTS competitor_activity (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coords VARCHAR, unique_id VARCHAR,brand VARCHAR,category VARCHAR,activity_mechanics VARCHAR,rateofsale VARCHAR,myplan VARCHAR,myneed VARCHAR,timeline VARCHAR, start_date VARCHAR, end_date VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync DEFAULT "none")');
    st.executeSql("INSERT INTO competitor_activity(unique_id,coords,brand,category,activity_mechanics,rateofsale,myplan,myneed,start_date,end_date,store,store_id,store_server_id,submitter)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[timestamp,coords,brand,category,activity_mechanics,rateofsale,myplan,myneed,start_date,end_date, storename,itemid,store_server_id,submitter], function(st,results){
      // insert our image
      st.executeSql('CREATE TABLE IF NOT EXISTS competitor_images (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,activity_id INTEGER,activity_unique_id,submitter VARCHAR,store_id INTEGER,store VARCHAR,store_server_id VARCHAR,image BLOB,created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
      $('.photo-area img').each(function(){
        inforimg = $(this).attr('src');
        st.executeSql('INSERT INTO competitor_images(activity_id,activity_unique_id,submitter,store_id,store,store_server_id,image)values("'+results.insertId+'","'+timestamp+'","'+submitter+'","'+itemid+'","'+storename+'","'+store_server_id+'","'+inforimg+'")',null,function(){
          $('.photo-area').empty();
        });
      });
      alertSuccess();
    });
  },function(error){
    console.log(error);
  },onReadyTransaction);
}

function fetchCompetitorActivities() {
  var qb = "SELECT p.id,p.brand,p.category,p.activity_mechanics,p.rateofsale,p.myplan,p.myneed,p.created_on,pi.id AS imageid,pi.image "+
            "FROM competitor_activity p, competitor_images pi WHERE p.id = pi.activity_id AND p.store_id = ? ORDER BY p.created_on DESC";

  var q = "SELECT * FROM competitor_activity WHERE store_id = ? ORDER BY created_on DESC";
  var qi = "SELECT * FROM competitor_images WHERE activity_id = ?";

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      //console.log(data.rows);
      var cl = '';
      for (var i =0;i<data.rows.length;i++) {
        cl += '<a href="#" id="'+data.rows.item(i).id+'" class="list-group-item">';
        t.executeSql(qi, [data.rows.item(i).id], function(t,images){
          for (var i =0;i<images.rows.length;i++){
            //console.log(images.rows.item(i));
            var image = '<img src ="'+images.rows.item(i).image+'" class="img img-responsive col-xs-6" width="150"/>';
            $('a#'+images.rows.item(i).promotion_id+' .promoimages').append(image);
          }
        });
        //console.log(data.rows.item(i));
        cl += '<h4 class="list-group-item-heading">'+data.rows.item(i).brand+'</h4>';
        cl += '<div class="col-xs-12 promoimages"></div>'
        //cl += '<p class="list-group-item-text bold">';
        //cl += '<span class="glyphicon glyphicon-map-marker"></span> '+data.rows.item(i).store;
        //cl += '</p>';
        //cl += image;
        cl += '<p><span class="bold">Activity Mechanics: </span>'+data.rows.item(i).activity_mechanics+'</p>';
        cl += '<p><span class="bold">My plan to fight this: </span>'+data.rows.item(i).myplan+'</p>';
        cl += '</a>';
      }
      $('article#compelist .dataList').html(cl);
    });
  },onError,onReadyTransaction);
}

/////////////////

////////////////
// photos

///////////////////////
///////////////////////

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready",function(){
  initCam();
},false);

// device APIs are available
//
function initCam() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

$(document).ready(function(){
    $('button#capturePhoto').on('click', function(){
       capturePhotoEdit();
    });
});


// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  var imgsrc = imageData;
  $(function(){
      var htmlformed = '<div class="photoarea">';
      // "data:image/jpeg;base64," + imgsrc;
      htmlformed = '<img src="data:image/jpeg;base64,' +imgsrc+ '" class="img-responsive"></div>';
      $('.photo-area').append(htmlformed);
  });
}

function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail,{
      quality: 70,
      allowEdit: true,
      targetWidth: 500,
      targetHeight: 500,
      destinationType: destinationType.DATA_URL
    });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}
