<?php
error_reporting(1);
require_once '../ewcfg11.php';
	/*
	   	<pre>
	   	stdClass Object
		(
		    [objectives] => Array
		        (
		            [0] => stdClass Object
		                (
		                    [id] => 1
		                    [objectives] => {"objectives":["objective 1","objective 2","objective 3","objective 4","objective 5"]}
		                    [submitter] => j.kamau
		                    [week] => 14
		                    [month] => 3
		                    [year] => 2016
		                    [modified] =>
		                    [created_on] => 2016-03-30 11:43:06
		                    [last_sync] => none
		                )

		        )

		)
		</pre>
		*/
$mysqli = mysqli_connect(EW_CONN_HOST,EW_CONN_USER,EW_CONN_PASS,EW_CONN_DB) or die("Error " . mysqli_error($mysqli));
$syncDate = strtotime("now")*1000;
$jsonData = file_get_contents('php://input');
file_put_contents('postdata/'.$syncDate.'_syncdata.json', $jsonData);

if (isset($_GET['info'])){
   	$json = array();
   	$param = $_GET['info'];
   	$submitter = $_GET['username'];

	if ($param == 'weekly_objectives'){
		//print_r($jsonData);
	   	$clientData = json_decode($jsonData);

	   	$syncTime =  $syncDate/1000; // convert from milliseconds to seconds
	   	$itemids = array();
		// start processing the data
		foreach ($clientData->objectives as $key => $item) {

			// save the item to database
		    $sqlData = array(
	            'client_id' => $item->id,
	            'objectives' => addslashes($item->objectives),
	            'submitter' => $item->submitter,
	            'week' => $item->week,
	            'month' => $item->month,
	            'year' => $item->year,
	            'modified' => $item->modified,
	            'created_on' => $item->created_on,
	            'last_sync_date' => $syncTime
	            );
		    $columns = array_keys($sqlData);
			$values = array_values($sqlData);
			//$query = 'INSERT INTO data_tl_weekly_objectives(' .implode(',', $columns). ') VALUES ("' .implode('","', $values). '")';
			$query = "INSERT INTO data_tl_weekly_objectives(" .implode(",", $columns). ") VALUES ('" .implode("','", $values). "')";
			$insert = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
			if ($insert){
			    array_push($itemids,$item->id);
			}
	    }
	    $message = array(
	    	'message' => 'weekly objective successfully uploaded to server',
	    	'status' => 'OK',
	    	'synctime' => $syncTime,
	    	'items_synced' => $itemids);
	    header("Content-Type: application/json");
	    echo json_encode($message);

	} // end if $param = weekly_objectives

	if ($param == 'weekly_planner'){
		//print_r($jsonData);
	   	$clientData = json_decode($jsonData);

	   	$syncTime =  $syncDate/1000; // convert from milliseconds to seconds
	   	$itemids = array();
		// start processing the data
		foreach ($clientData->routeplan as $key => $item) {

		    $sqlData = array(
	            'client_id' => $item->id,
	            'routeplan' => addslashes($item->routeplan),
	            'submitter' => $item->submitter,
	            'inputdate' => $item->inputdate,
	            'week' => $item->week,
	            'month' => $item->month,
	            'year' => $item->year,
	            'modified' => $item->modified,
	            'created_on' => $item->created,
	            'last_sync_date' => $syncTime
	            );
		    $columns = array_keys($sqlData);
			$values = array_values($sqlData);
			//$query = 'INSERT INTO data_tl_weekly_planner(' .implode(',', $columns). ') VALUES ("' .implode('","', $values). '")';
			$query = "INSERT INTO data_tl_weekly_planner(" .implode(",", $columns). ") VALUES ('" .implode("','", $values). "')";
			$insert = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
			if ($insert){
			    array_push($itemids,$item->id);
			}
	    }
	    $message = array(
	    	'message' => 'weekly plan successfully uploaded to server',
	    	'status' => 'OK',
	    	'synctime' => $syncTime,
	    	'items_synced' => $itemids);
	    header("Content-Type: application/json");
	    echo json_encode($message);

	} // end if $param = weekly_planner

	if ($param == 'daily_planner'){
		//print_r($jsonData);
	   	$clientData = json_decode($jsonData);

	   	$syncTime =  $syncDate/1000; // convert from milliseconds to seconds
	   	$itemids = array();
		// start processing the data
		foreach ($clientData->routeplan as $key => $item) {

		    $sqlData = array(
	            'client_id' => $item->id,
	            'routeplan' => addslashes($item->routeplan),
							'time' => $item->time,
							'achieved' => $item->achieved,
							'challenges' => $item->challenges,
							'notes' => $item->notes,
	            'submitter' => $item->submitter,
	            'inputdate' => $item->inputdate,
	            'week' => $item->week,
	            'month' => $item->month,
	            'year' => $item->year,
	            'modified' => $item->modified,
	            'created_on' => $item->created,
	            'last_sync_date' => $syncTime
	            );
		    $columns = array_keys($sqlData);
			$values = array_values($sqlData);
			//$query = 'INSERT INTO data_tl_weekly_planner(' .implode(',', $columns). ') VALUES ("' .implode('","', $values). '")';
			$query = "INSERT INTO data_tl_daily_planner(" .implode(",", $columns). ") VALUES ('" .implode("','", $values). "')";
			$insert = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
			if ($insert){
			    array_push($itemids,$item->id);
			}
	    }
	    $message = array(
	    	'message' => 'daily plan successfully uploaded to server',
	    	'status' => 'OK',
	    	'synctime' => $syncTime,
	    	'items_synced' => $itemids);
	    header("Content-Type: application/json");
	    echo json_encode($message);

	} // end if $param = daily_planner

} //end if isset

// end get data


?>
