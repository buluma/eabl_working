// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newimei = '<h4 class="pull-left"> Map </h4>';

//google.maps.event.addDomListener(window, 'load', initialize);
$(document).ready(function() {
    $('#newsku div.pull-right').html('<p>Coordinates: <span id="currentlocation">'+userlocation+'</span></p>');
    $('.navbar-header').append(backLink);
    //$('#newsku').append(newimei);
    $('#saveLocation').on('click', function(){
        saveMyLocation();
    });

    $('#RefreshPage').on('click',function(){
        document.location.reload(false);
    })
    createMap();
});

function createMap(){
    var gpscords = userlocation.split(",");
    var storename = decodeURI($.getUrlVar('store_name'));
    var myLat = gpscords[0];
    var myLong = gpscords[1];
    
    //navigator.geolocation.clearWatch(mywatchId);
    var map_canvas = document.getElementById('map');
    var map_options = {
        center: new google.maps.LatLng(myLat,myLong),
        zoom:14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(map_canvas, map_options);
    var marker = new google.maps.Marker({position: new google.maps.LatLng(myLat, myLong),map: map,title:storename});

    $('button#saveLocation').show();
    $('div#map-loading').hide();
    
}
function mapError(){
    alert('Error getting current GPS Location');
    console.log('Error getting current GPS Location');
}
function saveMyLocation(){
    var mycoords = document.getElementById('currentlocation').innerText;
    //console.log(mycoords);
    var submitter = username;
    
    db.transaction(function(st) { 
        //st.executeSql('DROP TABLE IF EXISTS mylocations');
        st.executeSql('CREATE TABLE IF NOT EXISTS locations (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,coordinates VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id VARCHAR, modified TEXT, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
        //st.executeSql('UPDATE stores SET coordinates = "'+mycoords+'" WHERE id = "'+itemid+'" ');
        st.executeSql("INSERT INTO locations(coordinates,submitter,store,store_id,store_server_id) values ('"+mycoords+"','"+submitter+"','"+storename+"','"+itemid+"','"+store_server_id+"')",null, alertSuccess);
    },onError,onReadyTransaction);

}

function initializeMap() {
    var map_canvas = document.getElementById('map');
    var map_options = {
        center: new google.maps.LatLng(mynewposition[0]),
        zoom:8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(map_canvas, map_options)
}

