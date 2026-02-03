
/*
Defines all global functions to be used by all views

*/

/*
This function gets all url variables and params
*/

// grab url params
$.extend({
  getUrlVars: function(){
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
	  hash = hashes[i].split('=');
	  vars.push(hash[0]);
	  vars[hash[0]] = hash[1];
	}
	return vars;
  },
  getUrlVar: function(name){
	return $.getUrlVars()[name];
  }
});
//Second call with this:
// Get object of URL parameters
var allVars = $.getUrlVars();

/*
some global date processing
*/
function getTodaysDate(){
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	var curr_year = d.getFullYear();
	var today = curr_date + "-" + curr_month + "-" + curr_year;
	return today;

}
function thisWeek(){
	var d = new Date();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	var curr_year = d.getFullYear();
	//var today = curr_date + "-" + curr_month + "-" + curr_year;
	var today = curr_year + "-" + curr_date + "-" + curr_month
	return today;

}
function thisYear(){
	var d = new Date();
	//var curr_date = d.getDate();
	//var curr_month = d.getMonth();
	//curr_month++;
	var curr_year = d.getFullYear();
	return curr_year;

}
function thisMonth(){
	var d = new Date();
	//var curr_date = d.getDate();
	var curr_month = d.getMonth();
	curr_month++;
	return curr_month;

}
function lastMonth(){
	var d = new Date();
	//var curr_date = d.getDate();
	var curr_month = d.getMonth();
	return curr_month;

}

/*
# A fucntion to get the promoters data from localstorage
# stored as:
# {"userid":"1","userpass":"27815146","username":"Nahason Maina","userlevel":0,
# "useremail":"nahashonmaish@gmail.com","shop":"Safaricom Moi Avenue","assigned":"safcom","is_promoter":true}'
# we'll get the values by their keys e.g username will return Nahason Maina
*/
function getUserData(key){
	//
	var userdata = localStorage.getItem('userdata');
	//console.log(userdata);
	var udata = JSON.parse(userdata);
	//console.log(udata);
	// why are we parsing twice???
	var userobj = JSON.parse(udata);
	var useremail = userobj.useremail;
	var username = userobj.username;
	var fullname = userobj.fullname;
	var assigned = userobj.assigned;
	//console.log(assigned);
	return userobj.key;
}
/*
function to count the number of stores and feeds the amount to the home thumbnail
called when device is ready ---> deviceready event

*/

function countStores(){
    var q = "SELECT * FROM stores";
    var storecount = '0';
    //console.log(db);
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
             //console.log(data.rows.length);
            storecount = data.rows.length;
          //  console.log(storecount);
            $('span#openStoreCount').text(storecount);
        },function(transaction,err){
        	console.log(err.message);
        });
    });
}

/*
 Add a global eventlistener to the backbutton. The callback function is onConfirmLogout
 Prompts the user with a confirm dialog
*/
function UserActions(){
	document.addEventListener("backbutton", function(e){
	    // do stuff here
	    e.preventDefault();
	    //navigator.app.exitApp();
	    navigator.notification.confirm(
	        'Are You Sure You want to exit?',  // message
	        onConfirmExit,                // callback to invoke with index of button pressed
	        'Confirm Exit',            // title
	        'No,Exit'          // buttonLabels
	    );

	},false);

	document.addEventListener("online", function(){
	    // do stuff here
	    console.log('online');
	    $('.navbar-header').html('<h5>EABL Stock Monitoring 1.0 (Online)</h5>');
	},false);
	document.addEventListener("offline", function(){
	    // do stuff here
	    console.log('offline');
	    $('.navbar-header').html('<h5>EABL Stock Monitoring 1.0 (Offline)</h5>');

	},false);
}


/*
callback function for the backbutton event
*/
function onConfirmExit(index) {
    //console.log('You selected button ' + index);
    if (localStorage.getItem('userdata') === null) {
        navigator.app.exitApp();
    }
    else {
    	if (index == 2) {
    		navigator.app.exitApp();
    	}
    	//else { return false;}
    }
}

/*
Checks if form is validated ---> the form object is passed as a param
*/
function formValidated($form){
    var empty = 0;
    $(':input[required=""],:input[required]',$form).each(function(){
    	if(!$(this).val())
    		empty++;
    });
    return ((empty==0) ? true : false);
}

/*
logout function --> removes data from localstorage and redirects to index page
*/
 function logOutUser(){
    localStorage.removeItem('userdata');
    console.log('logout called');
    window.location.href ='index.html';
}
/*
Global events
*/
/*
logout user after 2hrs if is already logged in
*/

$(document).ready(function(){
	var userdata = localStorage.getItem('userdata');
	if (userdata !== null) {
		setInterval(logOutUser, 2*1000*60*60);
	}

});
