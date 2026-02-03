
var week = moment().week();
var month = thisMonth();
var year = thisYear();
var submitter = username;
var iNum = 0;
function addObj() { 
  iNum ++;
  // compacted to prevent string errors caused by white spaces
  var imei = '<div class="form-group list-group-item" id="iNum'+iNum+'">';
  imei += '  <div class="col-xs-9">';
  imei += '     <label>IMEI</label><input name="imeinumber[]" id="'+iNum+'" class="form-control" type="text">';
  imei += '  </div>';
  imei += '  <div class="col-xs-3">';
  imei += '     <button type="button" class="btn btn-success scanbtn" id="scanIMEI'+iNum+'" data-scan="'+iNum+'"><span class="glyphicon glyphicon-screenshot"></span></button>';
  imei += '     <button type="button" class="btn btn-danger deletebtn" id="deleteIMEI'+iNum+'" data-delete="'+iNum+'"><span class="glyphicon glyphicon-remove-sign"></span></button>';
  imei += '  </div>';
  imei += '</div>';
  $('article#inputform .imeiList').append(imei);
  $('#saveholder').removeClass('hidden');
 
}

function removeObj(num) {
  $('#scanedlist #'+num).remove();
}
function fetchObj() {  
  var q = "SELECT * FROM weekly_objectives WHERE week = '"+week+"' AND month = '"+month+"' AND year = '"+year+"'";
  
  db.transaction(function (t) {
    t.executeSql(q, null, function (t, data) { 
      var found = data.rows.length; 
      var pl ='';
      if (found >= 1) {
          pl +='<ul class="list-group">';
          for (var i =0;i<data.rows.length;i++) {        
            var objs = JSON.parse(data.rows.item(i).objectives);
            //console.log(objs);
            //for (var x = 0; x < )
            $.each(objs.objectives, function(index, element) {
              //console.log(element);
              pl += '<li class="list-group-item">';
              pl += element;
              pl += '</li>';
            }); 
            
          }
          pl += '</ul>';
      }
      else{
         pl += '<p>No objectives for this week found</p>';
      }
      
	    $('article#imeilistAll .imeiListdata').html(pl);
    });
  });
}
function insertObj() {
  
  var items = {};
  var objectives = [];

  $('#scanedlist .list-group-item').each(function() {
    var obj = $(this).children('input').val();
    objectives.push(obj);
  });
  items['objectives'] = objectives;
  var itemsdata = JSON.stringify(items);
  //console.log(objectives);
  //console.log(items);
  //console.log(itemsdata);

  db.transaction(function(st) { 
      //st.executeSql('DROP TABLE imei');
      st.executeSql('CREATE TABLE IF NOT EXISTS weekly_objectives (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,objectives VARCHAR, submitter VARCHAR, week VARCHAR, month VARCHAR, year VARCHAR, modified TEXT, created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
      st.executeSql("INSERT INTO weekly_objectives(objectives,submitter,week,month,year) values ('"+itemsdata+"','"+submitter+"','"+week+"','"+month+"','"+year+"')",null, alertSuccess);
  },onError,function(){
    document.location.reload('true');
  });
}

$(document).ready(function() {
  fetchObj();
  $('button#btnaddObj').on('click', function(){
     //addIMEI();
    showInput();
  });

  $('#objSubmit').on('click',function(){
    insertObj();
  })
  $('#btnsyncObj').on('click',function(){
    syncTasks();
  })
  $(document).on('click','.deletebtn', function(event){
    //console.log(this.id);
    var todelete = $(this).attr('data-delete');
    removeObj(todelete);
  }); 
  if ($('#scanedlist div.list-group-item').length > 0){
    $('#saveholder').show();
  }
  else {
    $('#saveholder').hide();
  }
  
});

var i = 0;
function showInput(){ 
  i ++;
  var html = '<div class="list-group-item" id="'+i+'">';
  html +='<button type="button" class="btn btn-danger pull-right deletebtn" id="deleteObj'+i+'" data-delete="'+i+'">';
  html +='<span class="glyphicon glyphicon-remove-sign"></span>';
  html +='</button>';
  html +='<input type="text" id="objective'+i+'" class="form-control" placeholder="objective '+i+'"/>';
  html +='<div>';
  $('#scanedlist').append(html);
  $('#saveholder').show();
}
function syncTasks(){
  // fetch the items from database and sync to server
  var q = "SELECT * FROM weekly_objectives WHERE last_sync = 'none'";
  
  db.transaction(function (t) {
    t.executeSql(q, null, function (t, data) { 
      var found = data.rows.length; 
      var msg ='';
      var items = [];
      var jsonitems = {};
      var jsondata;
      if (found >= 1) {
          for (var i =0;i<found;i++) {        
            var obj = data.rows.item(i);
            //console.log(obj);
            items.push(obj);
          }
          jsonitems['objectives'] = items;
          jsondata = JSON.stringify(jsonitems);
          //console.log(items);
          //console.log(jsondata);
          // ajax send this
          ajaxUpload(jsondata);

      }
      else{
         msg += '<p>You do not have any unsynced weekly objectives</p>';
      }
      
      $('.syncmessage').html(msg);
    });
  });
}
function ajaxUpload(jsondata){
   $.ajax({
        url : ServerURI+'/api/postdata.php?info=weekly_objectives&username='+username,
        type : 'POST',
        data : jsondata,
        beforeSend : function(xhr){
            console.log('Start');
            $('.ajax_request').removeClass('hide');
        },
        error : function(xhr, status, error){
            console.log(xhr.responseText+ ' | ' +status+ '|' +error);
            $('.syncmessage').html('There was an error uploading objectives');
        },
        complete : function(xhr, status){
            console.log('End');
            $('.ajax_request').addClass('hide');
        },
        success : function(result, status, xhr){
            $('.syncmessage').html('success');
            //console.log(result);
            if (result instanceof Object){
              //console.log(result);
              $('.syncmessage').html(result.message);
              if(result.status == 'OK'){
                // update the syncdate of synced items
                updateSyncDates(result.synctime,result.items_synced)
              }
            }
            // we did not get a json response
            else {
              $('.syncmessage').html('The response message could not be understood');
            }           
            
        }
    
    });

}
function updateSyncDates(lastsync,itemids){
  // check the length of itemids
  if (itemids.length){
      db.transaction(function(st) { 
          for (var i = itemids.length - 1; i >= 0; i--) {
            console.log(itemids[i]);
            console.log(lastsync);
            st.executeSql("UPDATE weekly_objectives SET last_sync = '"+lastsync+"' WHERE id = '"+itemids[i]+"'",null, alertSuccess);
          };
      },onError,function(){
        //document.location.reload('true');
      });
  }
  
}

