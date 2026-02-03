function fetchMyStores() {  
    var q = "SELECT * FROM stores ORDER BY name ASC";
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {            
            var sl ='';
            for (var i =0;i<data.rows.length;i++) {
                sl += '<a href="storemenu.html?store_id='+data.rows.item(i).id+'&store_server_id='+data.rows.item(i).server_id+'&store_name='+data.rows.item(i).name+'" class="list-group-item list-group-item-info">';
                sl += '<span class="glyphicon glyphicon-home big-icon2 pull-left"></span><h4>'+data.rows.item(i).name+'</h4>';
                sl += '<p><span class="glyphicon glyphicon-map-marker"> </span>  '+data.rows.item(i).region+ '</p>';
				sl += '</a>';
            }
            //sl += '</ul>';
			$('article#storelist .dataList').html(sl);
        });
    });
}
// insert store into database
function insertStore() {
    var stname = document.getElementById("storename").value;
    var region = document.getElementById("region").value;
    var location = document.getElementById("location").value;
    var addr = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var cperson = document.getElementById("contactperson").value;
    var submitter = username;
    //var coords = myposition[0];
    var coords = userlocation;
    //var coords = '32,50';
    var remarks = document.getElementById("storeremarks").value;
    //console.log("Store name is: "+stname);
    
    db.transaction(function(st) { 
        st.executeSql('CREATE TABLE IF NOT EXISTS stores (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,name VARCHAR,region VARCHAR,location VARCHAR,building VARCHAR,address VARCHAR,phone VARCHAR,email VARCHAR,contactperson VARCHAR,coordinates VARCHAR,remarks VARCHAR,submitter VARCHAR,date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
        st.executeSql("INSERT INTO stores(name,region,location,address,phone,email,contactperson,coordinates,remarks,submitter)values('" + stname + "','"+region+"','"+location+"','"+addr+"','"+phone+"','"+email+"','"+cperson+"','"+coords+"','"+remarks+"','"+submitter+"')",null, alertSuccess);
    },onError,onReadyTransaction);
}
// process our stores view
$(document).ready(function() {
	fetchMyStores();
	$('button#btnlogout').on('click', function(){
        logOutUser();
    });
	if (assigned == 'team-leader'){
		$('#newstore').removeClass('hidden');
	}

	$('#form-modal').on('hidden.bs.modal', function (e) {
	  	fetchMyStores();
	})

	$('form#formstore').on('submit', function(e){
	    e.preventDefault();
        //addLocation();
		if (formValidated(this)){
			insertStore();
			$(this).each(function() {
				this.reset();
			});
		}				
	});
});