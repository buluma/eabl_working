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
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = $.getUrlVar('store_name');



// process our item view
$(document).ready(function() {

var backLink = '<h5><a href="stores.html" class="button"><span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';
$('.navbar-header').append(backLink);
	
});