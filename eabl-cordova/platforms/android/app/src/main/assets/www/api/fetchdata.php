<?php
error_reporting(1);
require_once '../ewcfg11.php';

$mysqli = mysqli_connect(EW_CONN_HOST,EW_CONN_USER,EW_CONN_PASS,EW_CONN_DB) or die("Error " . mysqli_error($mysqli));

if (isset($_GET['data'])){
   //echo $_GET['data'];
   $json = array();
   $param = $_GET['data'];

   if ($param == 'focusmodels'){
       $query = "SELECT * FROM focus_models";
	   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
	   $total = mysqli_num_rows($result);

	   if ($total == 0) {
	        echo "No Focus Models Found";
	   }
	   else {
			// we found some models
	   	   while($row = mysqli_fetch_object($result)){
	           //cast results to specific data types
	           $json['focusmodels'][] = $row;
	       }
	       $focusmodels = $json;
	       header("Content-Type: application/json");
	       echo json_encode($focusmodels);
	   }

	} // end if $param = focusmodels

	if ($param == 'tasks'){
       $query = "SELECT * FROM tasks WHERE published = 1 AND expiry_date > CURDATE()";
	   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
	   $total = mysqli_num_rows($result);

	   if ($total == 0) {
	        echo "No Tasks Found";

	   }
	   else {
			// we found some tasks
	   	   while($row = mysqli_fetch_object($result)){
	           //cast results to specific data types
	           $json['tasks'][] = $row;
	       }
	       $tasks = $json;
	       header("Content-Type: application/json");
	       echo json_encode($tasks);
	   }

	} // end if $param = tasks

	if ($param == 'routeplan'){
	   $promoter = $_GET['username'];
       $query = "SELECT * FROM routeplan WHERE promoter = '".$promoter."' ";
	   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
	   $total = mysqli_num_rows($result);

	   if ($total == 0) {
	        echo "No Route Plan Found";
	   }
	   else {
			// we found a routeplan
	   	   while($row = mysqli_fetch_object($result)){
	           $mon = explode(',', $row->monday);
	           $tue = explode(',', $row->tuesday);
	           $wed = explode(',', $row->wednesday);
	           $thu = explode(',', $row->thursday);
	           $fri = explode(',', $row->friday);
	           $sat = explode(',', $row->saturday);
	           $mshops = $tshops = $wshops = $thshops = $fshops = $sashops = array();
	           foreach ($mon as $mdata) {
	           	   $query = "SELECT shop_name FROM default_shops WHERE id = '".$mdata."' ";
				   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
				   $shop = mysqli_fetch_object($result);
                   $mshops[] = $shop->shop_name;

	           }
	           foreach ($tue as $tdata) {
	           	   $query = "SELECT shop_name FROM default_shops WHERE id = '".$tdata."' ";
				   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));;
				   $shop = mysqli_fetch_object($result);
                   $tshops[] = $shop->shop_name;

	           }
	           foreach ($wed as $tdata) {
	           	   $query = "SELECT shop_name FROM default_shops WHERE id = '".$tdata."' ";
				   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));;
				   $shop = mysqli_fetch_object($result);
                   $wshops[] = $shop->shop_name;

	           }
	           foreach ($thu as $tdata) {
	           	   $query = "SELECT shop_name FROM default_shops WHERE id = '".$tdata."' ";
				   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));;
				   $shop = mysqli_fetch_object($result);
                   $thshops[] = $shop->shop_name;

	           }
	           foreach ($fri as $tdata) {
	           	   $query = "SELECT shop_name FROM default_shops WHERE id = '".$tdata."' ";
				   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));;
				   $shop = mysqli_fetch_object($result);
                   $fshops[] = $shop->shop_name;

	           }
	           foreach ($sat as $tdata) {
	           	   $query = "SELECT shop_name FROM default_shops WHERE id = '".$tdata."' ";
				   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));;
				   $shop = mysqli_fetch_object($result);
                   $sashops[] = $shop->shop_name;

	           }
	           $json['routeplan']['monday'] = $mshops;
	           $json['routeplan']['tuesday'] = $tshops;
	           $json['routeplan']['wednesday'] = $wshops;
	           $json['routeplan']['thursday'] = $thshops;
	           $json['routeplan']['friday'] = $fshops;
	           $json['routeplan']['saturday'] = $sashops;
	       } // end while
	       $route = $json;
	       header("Content-Type: application/json");
	       echo json_encode($route);
	       //print_r($route);
	   }

	} // end if $param = routeplan

	if ($param == 'eablproducts'){
		// Client expects json response here!
		//$lastmodified = $_GET['last_modified'];
    $lastmodified = '2016-05-19';
		if ($lastmodified == 'none'){
			$query = "SELECT * FROM eabl_products";
		}
		else {
			$query = "SELECT * FROM eabl_products WHERE modified_on > '$lastmodified'";
		}

	    $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
	    $total = mysqli_num_rows($result);

		if ($total == 0) {
		   		header("Content-Type: application/json");
		        $json['eabl_products'] = array(); // create an empty array
		}
		else {
			while($row = mysqli_fetch_object($result)){
	           //cast results to specific data types
	            $json['eabl_products'][] = $row;
	        }
		}

        $response = $json;
        header("Content-Type: application/json");
        echo json_encode($response);

	} // end if $param = eablproducts
	if ($param == 'eablobjectives'){
		// Client expects json response here!
		$lastmodified = $_GET['last_modified'];
    //$lastmodified = '2016-05-19';
		if ($lastmodified == 'none'){
			$query = "SELECT * FROM eabl_objectives";
		}
		else {
			$query = "SELECT * FROM eabl_objectives WHERE modified_on > '$lastmodified'";
		}

	    $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
	    $total = mysqli_num_rows($result);

		if ($total == 0) {
	   		header("Content-Type: application/json");
	        $json['eabl_objectives'] = array(); // create an empty array
		}
		else {
			while($row = mysqli_fetch_object($result)){
	           //cast results to specific data types
	            $json['eabl_objectives'][] = $row;
	        }
		}

        $response = $json;
        header("Content-Type: application/json");
        echo json_encode($response);

	} // end if $param = eablobjectives

} //end if isset

// end get data


?>
