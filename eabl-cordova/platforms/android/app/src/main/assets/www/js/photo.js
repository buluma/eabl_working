var pictureSource;   // picture source
var destinationType; // sets the format of returned value
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');
//
var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> Photos</h4>';
newsku += '<button type="button" class="btn btn-warning pull-right" id="addphoto">Add</button>';

var modelinput = '<label>Product</label>';
modelinput += '<input type="text" id="photomodel" class="form-control" required placeholder="Enter Brand">';
var eablmodels = '<label>Product</label>';
 eablmodels += '<select class="form-control" id="photomodel">';
 //eablmodels += main_products;
 eablmodels += '</select>';
// Wait for device API libraries to load
//
document.addEventListener("deviceready",function(){
  initCam();
  fetchPhotos();
},false);

// device APIs are available
//
function initCam() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

$(document).ready(function(){
    $('.navbar-header').append(backLink);
    //$('#newsku').append(newsku);
    //
    //$('#selectphotomodels').html(eablmodels);
    
    $('button#capturePhoto').on('click', function(){
       capturePhotoEdit();
    });
    $('button#addphoto').on('click', function(){
       //$('article#cameraform .list-group').show('fast');
       $(this).text(function(i, text){
          return text === "Add" ? "Cancel" : "Add";
      })

       $('article#cameraform .list-group').toggle("fast", function() {
        // Animation complete.
       });
    });
    // toggle select brand
    $('select#photomanuf').on('change', function() {
       var brand = $(this).val();
       if (brand == 'EABL') {
          $('#selectphotomodels').html(eablmodels);
          fetchProductsForSelect(function(options){
            $('#photomodel').append(options);
          })
       }
       else {
          $('#selectphotomodels').html(modelinput);
       }
    });

    $('input#photodate').attr('value',getTodaysDate());
    //on clicking save button
    $('button#savePhoto').on('click', function(){
      saveCapturedPhoto();
      //document.location.reload(true);
    });
});

function saveCapturedPhoto(){
  //get all the input elements
    var inforimg = '';
    var brandcode = '';
    var brand;
    $('.photo-area img').each(function(){
      inforimg += $(this).attr('src');
    });
    var date = $('input#photodate').val();
    var manufacturer = $('#photomanuf').val();
    
    if (manufacturer == 'EABL'){
      brandcode = $('#photomodel').val();
      brand = $("#photomodel option:selected").text();
    }  
    else {
      brand = $("#photomodel").val();
    }
    var remarks = $('textarea#photoremarks').val();
    var submitter = username;
    var store = storename;
    var coords = userlocation;

    db.transaction(function(st) { 
        //st.executeSql('DROP TABLE IF EXISTS images');
        //st.executeSql('CREATE TABLE IF NOT EXISTS images (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,imagepath VARCHAR, imagedate VARCHAR,brand VARCHAR,model VARCHAR,submitter VARCHAR,store VARCHAR,store_id INTEGER, remarks VARCHAR,created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
        st.executeSql("INSERT INTO images(coords,imagepath,imagedate,manufacturer,brand,brandcode,store,store_id,store_server_id, remarks,submitter)values('"+coords+"','"+inforimg+"','"+date+"','"+manufacturer+"','"+brand+"','"+brandcode+"','"+store+"','"+itemid+"','"+store_server_id+"','"+remarks+"','"+submitter+"')",null, alertSuccess);
    },onError,function(){
        document.location.reload(true);
    });

}
function fetchPhotos(){
  var q = "SELECT * FROM images WHERE store_id = ? ORDER BY created DESC LIMIT 10";
    
    db.transaction(function (t) {
        t.executeSql(q, [itemid], function (t, data) {
          var img = '';
          for(var i = 0; i < data.rows.length; i++){ 
             img += '<div class="list-group-item">';
             img += '<div class="col-xs-3">';
             img += '<img src="'+data.rows.item(i).imagepath+'" class="img img-responsive">'; 
             img += '</div>';
             img += '<div class="col-xs-9">'; 
             img += '<p>'+data.rows.item(i).brand+'</p>';
             img += '<p>Remarks: '+data.rows.item(i).remarks+'</p>';
             img += '</div>';
             img += '</div>';   
          }
          $('article#photolist .list-group').append(img);
            
        });
    });
}
// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64-encoded image data
  //console.log(imageData);

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
