document.addEventListener("deviceready",function(){
  fetchVOC();
},false);

// grab url params

// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

function fetchVOC() {
  var q = "SELECT * FROM voc WHERE store_id = ? ORDER BY created DESC LIMIT 10";

  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      var pl ='';
      for (var i =0;i<data.rows.length;i++) {
      	if (data.rows.item(i).isurgent == 'Yes') {var urgency = 'Urgent';} else {var urgency = 'Not Urgent';}
        pl += '<a href="#" class="list-group-item">';
        pl += '<h4 class="list-group-item-heading">'+data.rows.item(i).brand;
        pl += '<span class="badge pull-right">'+urgency+'</span></h4>';
        pl += '<div class="col-xs-3"> <img src="'+data.rows.item(i).photos+'" class="img-responsive">';
        pl += '</div>';
        pl += '<div class="col-xs-9">';
        pl += '<p><strong>Category:</strong> '+data.rows.item(i).category+'</p>';
        pl += '<p><strong>Items:</strong> '+data.rows.item(i).items+'</p>';
        pl += '<p><strong>Comment By:</strong> '+data.rows.item(i).commentby+'</p>';
        pl += '<p><strong>Remarks:</strong> '+data.rows.item(i).remarks+'</p>';
        pl += '</div>';
        pl += '</a>';
      }
      //pl += '</ul>';
      $('article#voclist .dataList').html(pl);
    });
  });
}
function insertVOC() {
  var inforimg = '';
  $('.photo-area img').each(function(){
    inforimg += $(this).attr('src');
  });
  var photos = inforimg;
  var store = storename;
  var brand = $("#brands option:selected").text();
  var brandcode = document.getElementById("brands").value;
  var category = document.getElementById("voccategory").value;
  var items = document.getElementById("vocitems").value;
  var commentby = document.getElementById("voccommentby").value;
  //var isurgent = document.getElementById("vocisurgent").value;
  var urgency = $('#vocisurgent').prop('checked');
  if (urgency === true) {
  	var isurgent = 'Yes';
  }
  else { var isurgent = 'No';}
  var remarks = document.getElementById("vocremarks").value;
  var submitter = username;
  var coords = userlocation;

  db.transaction(function(st) {
    //st.executeSql('DROP TABLE IF EXISTS data_tl_promotions');
    st.executeSql('CREATE TABLE IF NOT EXISTS voc (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,photos VARCHAR,brand VARCHAR,brandcode VARCHAR,category VARCHAR,items VARCHAR, commentby VARCHAR, isurgent VARCHAR, submitter VARCHAR,store VARCHAR, store_server_id VARCHAR, store_id INTEGER,remarks VARCHAR,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,coords TEXT,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO voc(coords,photos,brand,brandcode,category,items,commentby,isurgent,submitter,store,store_server_id,store_id,remarks) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",[coords,photos,brand,brandcode,category,items,commentby,isurgent,submitter,store,store_server_id,itemid,remarks], alertSuccess);
  },onError,onReadyTransaction);
}
/////
var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> Voice of Customer </h4>';
newsku += '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#form-modal">Add</button>';

var lenovomodels = '<label>Product</label>';
  lenovomodels += '<select class="form-control" id="brands">';
  //lenovomodels += main_products;
  lenovomodels += '</select>';

$(document).ready(function() {
	$('#vocisurgent').bootstrapToggle();

	$('.navbar-header').append(backLink);
	$('#newsku').append(newsku);

	$('#selectvocbrands').html(lenovomodels);
  fetchProductsForSelect(function(options){
    $('#brands').append(options);
  })

  $('form#formvocinput').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      insertVOC();
      $(this).each(function() {
          this.reset();
      });
      $('.photo-area').empty();
      //document.location.reload(true);
    }
  });
  $('#form-modal').on('hidden.bs.modal', function (e) {
    fetchVOC();
  })
});



///////////////////////
//////////////////////

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
  // Uncomment to view the base64-encoded image data
  // console.log(imageData);

  // Get image handle
  //
  //var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  //
  //smallImage.style.display = 'block';

  // Show the captured photo
  // The in-line CSS rules are used to resize the image
  //
  var imgsrc = imageData;
  $(function(){
    //get all the information about the photo
      var htmlformed = '<div class="photoarea">';
      // "data:image/jpeg;base64," + imgsrc;
      htmlformed = '<img src="data:image/jpeg;base64,' +imgsrc+ '" class="img-responsive"></div>';
      $('.photo-area').html(htmlformed);
  });
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  //var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  //largeImage.style.display = 'block';

  // Show the captured photo
  // The in-line CSS rules are used to resize the image
  //
  //largeImage.src = imageURI;
  //$(function(){
    //get all the information about the photo
    //var htmlformed = '<div class="photoarea"><img src="' +imageURI+ '" style=""></div>';
   // $('.photo-area').html(htmlformed);
  //})
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 70,
    destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
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

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}
