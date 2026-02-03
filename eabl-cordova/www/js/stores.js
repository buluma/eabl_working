function fetchMyStores() {
    var q = "SELECT * FROM stores ORDER BY name ASC";

    // Check if db is available before attempting transaction
    if (typeof window.db !== 'undefined' && window.db.transaction) {
        window.db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var sl ='';
                if (data.rows && data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        sl += '<a href="storemenu.html?store_id='+data.rows.item(i).id+'&store_server_id='+data.rows.item(i).server_id+'&store_name='+encodeURIComponent(data.rows.item(i).name)+'" class="list-group-item list-group-item-info">';
                        sl += '<span class="glyphicon glyphicon-home big-icon2 pull-left"></span><h4>'+data.rows.item(i).name+'</h4>';
                        sl += '<p><span class="glyphicon glyphicon-map-marker"> </span>  '+data.rows.item(i).region+ '</p>';
                        sl += '</a>';
                    }
                } else {
                    sl += '<div class="list-group-item"><p>No stores found</p></div>';
                }
                $('article#storelist .dataList').html(sl);
            });
        });
    } else {
        console.error('Database not available for fetchMyStores');
        $('article#storelist .dataList').html('<div class="list-group-item"><p>Database not available</p></div>');
    }
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
    var submitter = typeof username !== 'undefined' ? username : 'unknown';
    //var coords = myposition[0];
    var coords = typeof userlocation !== 'undefined' ? userlocation : '';
    //var coords = '32,50';
    var remarks = document.getElementById("storeremarks").value;
    //console.log("Store name is: "+stname);

    if (typeof window.db !== 'undefined' && window.db.transaction) {
        try {
            window.db.transaction(function(st) {
                // For IndexedDB, we don't need to create the table here as it's done during initialization
                var insertQuery = "INSERT INTO stores(name,region,location,address,phone,email,contactperson,coordinates,remarks,submitter) VALUES ('" +
                                 stname + "','" + region + "','" + location + "','" + addr + "','" +
                                 phone + "','" + email + "','" + cperson + "','" + coords + "','" +
                                 remarks + "','" + submitter + "')";
                st.executeSql(insertQuery, null, alertSuccess, onError);
            });
            onReadyTransaction();
        } catch (e) {
            onError(e);
        }
    } else {
        console.error('Database not available for insertStore');
    }
}

// process our stores view
$(document).ready(function() {
	fetchMyStores();
	$('button#btnlogout').on('click', function(){
        logOutUser();
    });
	if (typeof assigned !== 'undefined' && assigned == 'team-leader'){
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