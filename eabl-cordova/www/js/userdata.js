/*
Defines global user variables that will be used by all the views

*/
// set some dummy data
//var demodata = '{"userid":"1","userpass":"27815146","username":"Nahason Maina","userlevel":0,"useremail":"nahashonmaish@gmail.com","shop":"Safaricom Moi Avenue","assigned":"safcom","is_promoter":true}';
//localStorage.setItem('userdata',demodata);

// retrieve user data in local storage --> saved as a json string
var userdata = localStorage.getItem('userdata');
if (userdata === null) {
	window.location.href='index.html';
	//window.history.forward();
}  
var userlastlogin = localStorage.getItem('lastlogin');
var userlocation = localStorage.getItem('gpslocation');
//console.log(userdata);
var udata = JSON.parse(userdata);
//console.log(udata);
var userobj = JSON.parse(udata);
var useremail = userobj.useremail;
var username = userobj.username;
var fullname = userobj.fullname;
var assigned = userobj.assigned;
//console.log(assigned);