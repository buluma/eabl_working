window.onload = function(e) {
    console.log('window loaded');
    onDeviceReady();
};

$(window).load(function(){
  var udata = localStorage.getItem('userdata');
  //console.log(udata.length);
  if (udata === null || udata === undefined) {
    $(document).fadeIn();
  }
  else {
    showApp();
  }
});
$(document).ready(function(){
  $(".logo").delay(2000).animate({
   top: "-=100"
   }, 1000, function() {
       // Animation complete.
       $("#login-screen").fadeIn(500);
   });

  $("#loginUser").click(function(e){
      e.preventDefault();
      //window.location.href='app.html';
      var $btn = $(this);
      var loginusername = document.getElementById("loginUsername").value;
      var password = document.getElementById("loginPassword").value;
      if (loginusername == '' || password == '' ) {
          $btn.button('reset');
          //$('button#loginUser .icon').hide();
          navigator.notification.alert('You have not filled all your details', '', 'Error', 'OK');
          return false;
      }
      else {
          authenticateUser(loginusername,password);
      }
  });
});

function showApp(){
    window.location.href='app.html';
}

function insertDefaultShops(allshops){
  db.transaction(function(st) {
    st.executeSql('CREATE TABLE IF NOT EXISTS stores (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,server_id INTEGER, name VARCHAR, account VARCHAR, category VARCHAR, region VARCHAR,location VARCHAR,building VARCHAR,address VARCHAR,phone VARCHAR,email VARCHAR,contactperson VARCHAR,manager_name VARCHAR, manager_phone VARCHAR, manager_email VARCHAR, coordinates VARCHAR,remarks VARCHAR,submitter VARCHAR,date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    for (var i = 0; i < allshops.length; i++){
       console.log(allshops[i].shop_name);
       var serverid = allshops[i].id;
       var shopname = allshops[i].shop_name;
       var region = allshops[i].region;
       var location = allshops[i].location;
       var managername = allshops[i].manager_name;
       var managerphone = allshops[i].manager_phone;
       var manageremail = allshops[i].manager_email;
       var account = allshops[i].account;
       var category = allshops[i].category;

       var query = 'INSERT INTO stores (server_id,name,account,category,region,location,manager_name,manager_phone,manager_email) values (?,?,?,?,?,?,?,?,?)';
       //console.log(query);
       st.executeSql(query,[serverid,shopname,account,category,region,location,managername,managerphone,manageremail], function(){
         // execution completed
       });
    }
  },function(err){
    console.log(err.message);
  },function(){
    //localStorage.setItem('lastlogin', Date());
    console.log(allshops.length +' shops added successfully');
    localStorage.setItem('lastlogin', Date());
    showApp();
  });

}
function checkIFStoreExists(allshops){
    $('#messagelog').html('<div class="alert alert-info" role="alert">Checking New Store info. Please Wait...</div>');
    async.timesSeries(allshops.length, function (i, done) {
      db.transaction(function(st) {
          var q = 'SELECT * FROM stores WHERE server_id = ?';
          //console.log(allshops[i].shop_name);
          var serverid = allshops[i].id;
          var shopname = allshops[i].shop_name;
          var region = allshops[i].region;
          var location = allshops[i].location;
          var managername = allshops[i].manager_name;
          var managerphone = allshops[i].manager_phone;
          var manageremail = allshops[i].manager_email;
          var account = allshops[i].account;
          var category = allshops[i].category;

          st.executeSql(q, [serverid],function(st,data){
             if (data.rows.length > 0){
                // this store exists so we'll need to update some info from server
                //console.log(shopname+' store exists '+data.rows.item(0).server_id);
                var up = "UPDATE stores SET name = ?, account = ?, category = ?, region = ? WHERE server_id = ?";
                //var up = "UPDATE stores SET name = '"+shopname+"', region = '"+region+"' WHERE server_id = "+serverid;
                //[shopname,region,serverid]
                st.executeSql(up, [shopname,account,category,region,data.rows.item(0).server_id],function(st, data){
                  //console.log('shop updated '+ data.insertId);
                  return true;
                },function(st,error){
                  console.log(error.message);
                  return false;
                });
             }
             if(data.rows.length < 1) {
                //does not exist
                //console.log(shopname+' store does not exist ');
                var query = 'INSERT INTO stores (server_id,name,account,category,region,location,manager_name,manager_phone,manager_email) values (?,?,?,?,?,?,?,?,?)';
                st.executeSql(query,[serverid,shopname,account,category,region,location,managername,managerphone,manageremail], function(){
                  //execution completed
                  //console.log('new store '+shopname+' added');
                });
             }
          });

      },function(err){
        //console.log(err +' error');
        console.log(err.message);
      },done(loadApp()));
  });

}

function loadApp(){
  $('#messagelog').html('<div class="alert alert-info" role="alert">Finished checking new store info... please wait for redirection </div>');
  //showApp();
  localStorage.setItem('lastlogin', Date());
  setTimeout(showApp, 6000);

}

//
function authenticateUser(e,p){
    $.ajax({
        url : ServerURI+"/api/webservice.php?user_auth="+e,
        type : 'GET',
        statusCode: {
            404: function() {
               //alert("page not found");
               $('#messagelog').html('<div class="alert alert-danger" role="alert">Page Not Found</div>');
            },
            500: function(){
                //alert("The Remote server encountered a problem");
               $('#messagelog').html('<div class="alert alert-danger" role="alert">The server encountered a problem</div>');
            }
        },
        beforeSend : function(xhr){
            //console.log('Start');
            $('.ajaxspinner').removeClass('hide');
            $('#messagelog').html('<div class="alert alert-info" role="alert">Connecting to Server. Please Wait...</div>');
        },
        error : function(xhr, status, error){
            console.log(xhr.responseText+ ' | ' +status+ '|' +error);
            $('#messagelog').html('<div class="alert alert-danger" role="alert">An error occurred: The server could not be reached</div>');
        },
        complete : function(xhr, status){
            //console.log('End');
            $('.ajaxspinner').addClass('hide');
            if (status == 'error') {
              $('#messagelog').html('<div class="alert alert-danger" role="alert">Could not complete login: '+status+' : possible causes: No internet connection</div>');
            }
            else {
              $('#messagelog').html('<div class="alert alert-info" role="alert">Login Process completed: '+status+'</div>');
            }

        },
        success : function(data, status, xhr){
            //console.log(data);
            if (data == "UserNotFound") {
               //alert('No user has been registered with the email provided');
               $('#messagelog').empty();
               navigator.notification.alert('No user has been registered with the Username provided', '', 'User Not Found', 'OK');

            }
            else {
                $('#messagelog').html('<div class="alert alert-success" role="alert">Finishing. Just a moment...</div>');
                var p = document.getElementById("loginPassword").value;
                //var result = JSON.parse(data);
                var result = data;
                var allshops = result.allshops;
                var userdata = JSON.stringify(result.userdata[0]);
                console.log(userdata);
                //console.log(allshops);
                var authpass = result.userdata[0].userpass;
                var assigned = result.userdata[0].assigned;
                //var authpass = result.userpass;
                //console.log("user password is: " + authpass);
                if (p !== authpass){
                    alert('Wrong Password or email, Please try again');
                    navigator.notification.alert('Wrong Password or Username, Please try again', '', 'Error', 'OK');
                }
                if (p == authpass) {
                    //var userdata = data;
                    //localStorage.removeItem('userdata');
                    // Put the object into storage
                    localStorage.setItem('userdata', JSON.stringify(userdata));
                    if (localStorage.getItem('lastlogin') === null) {
                      //... this person has never logged in before
                        console.log('this person has never logged in before');
                        insertDefaultShops(allshops);
                    }
                    else {
                        // last login is there, update and redirect to app.html
                        console.log('this person has logged in before');
                        //showApp();
                        checkIFStoreExists(allshops);
                    }

                }
            }


            // end success
        }
        //success : authSuccess();
    });
}

function authError(data){
  console.log("error: " + data);
  navigator.notification.alert('There was an error while trying to fetch user data '+data, '', 'Error', 'OK');

}
