<?php
error_reporting(1);
require_once '../ewcfg11.php';

// sql to UPDATE `stores_data` SET `stamped_coordinates` = `coordinates` ;
//
// generating reports from submitted data

function mysqliConnect(){
	$db = mysqli_connect(EW_CONN_HOST,EW_CONN_USER,EW_CONN_PASS,EW_CONN_DB) or die("Error " . mysqli_error($db));
	return $db;
}
/*
* function to show objective score by accounts
*
*
*/
function getObjectivesbyAccount(){
    // fetch all accounts
    $db = mysqliConnect();
    $query = 'SELECT DISTINCT (account) FROM outlets WHERE account IS NOT NULL';
    $result = mysqli_query($db,$query) or die(mysqli_error($db));
    $accounts = array();
    $outlets = array();
    $stockdata = array();
    while ($account = mysqli_fetch_object($result)) {
        array_push($accounts, $account->account);
    }
    // fetch all outlets by account
    foreach ($accounts as $key => $acc) {
        //echo $acc;
        $query = 'SELECT id,account,shop_name FROM outlets WHERE account = "'.$acc.'"';
        $result = mysqli_query($db,$query) or die(mysqli_error($db));       
        while ($outlet = mysqli_fetch_object($result)) {
            $outlets[] = $outlet;           
        }  
    }
    // fetch objective scores data by outlet
    foreach ($outlets as $key => $outlet) {
        //$query = 'SELECT store, SUM(currentstock) as currentstock, SUM(orderplaced) as orderplaced, SUM(delivered) as delivered, SUM(sale) as sale FROM data_brandstocks WHERE store_server_id = "'.$outlet->id.'"';
        $query = 'SELECT store,objective_desc,objective_code, SUM(targetscore) as targetscore, SUM(categorytotal) as categorytotal, SUM(targetfacings) as targetfacings, SUM(current_facings) as current_facings, SUM(current_percent) as current_percent ';
        $query .= ' FROM data_objectives WHERE store_server_id = "'.$outlet->id.'" AND response_type = "score"';
        $result = mysqli_query($db,$query) or die(mysqli_error($db));
        while ($stock = mysqli_fetch_object($result)) {
            $b = array(
                'id' => $outlet->id,
                'account' => $outlet->account,
                'store' => $outlet->shop_name,
                'targetscore' => $stock->targetscore,
                'categorytotal' => $stock->categorytotal,
                'targetfacings' => $stock->targetfacings,
                'current_percent' => $stock->current_percent,
                'current_facings' => $stock->current_facings
                );
            $objsdata[$outlet->account][] = $b;
        }
    }
    return $objsdata;
}


function reportHeader(){
	$title = 'EABL Objectives Report';
	$style = '<style></style>';
	$css = '<link rel="stylesheet" type="text/css" href="../bootstrap3/css/bootstrap.css">';
	$head = '<!DOCTYPE html><html>';
	$head .= '<head>';
	$head .= '<title>'.$title.'</title>';
	$head .= $css;
    $head .= $style;
	$head .= '</head>';
	$head .= '<body>';
	echo $head;

}
function reportFooter(){
	$foot = '</body>';
	$foot .= '</html>';

	echo $foot;

}
function generateReport(){
    $stock = getObjectivesbyAccount();
	reportHeader();
	echo '<div class="container">';
    //echo '<pre>';
    //print_r(getStockbyAccount());
    //echo '</pre>';
    foreach ($stock as $key => $acc) {
        $stocksum = array();
        $ordersum = array();
        $salesum = array();
        $deliveredsum = array();

        $table = '<div class="panel panel-primary">';
        $table .= '<div class="panel-heading">'.$key.' <div class="pull-right"><span class="label label-danger"></span></div></div>';
        $table .= '<div class="panel-body">';
        $table .= '<table class="table table-striped table-bordered">';
        $table .= '<tr>';
        //$table .= '<td><b>Outlet</b></td>';
        //$table .= '<td><b>Account</b></td>';
        $table .= '<td><b>Stock</b></td>';
        $table .= '<td><b>Order Placed</b></td>';
        $table .= '<td><b>Delivered</b></td>';
        $table .= '<td><b>Sale</b></td>';
        $table .= '</tr>';

        
        for ($i=0; $i < count($acc); $i++) { 
            // check for negative stock and ignore <<added in sql >>

            $stocksum[] = $acc[$i]['currentstock'];
            $ordersum[] = $acc[$i]['orderplaced'];
            $salesum[] = $acc[$i]['sale'];
            $deliveredsum[] = $acc[$i]['delivered'];

            /*
            $table .= '<tr>';
            $table .= '<td>'.$acc[$i]['store'].'</td>';
            $table .= '<td>'.$acc[$i]['account'].'</td>';
            $table .= '<td>'.$acc[$i]['currentstock'].'</td>';
            $table .= '<td>'.$acc[$i]['orderplaced'].'</td>';
            $table .= '<td>'.$acc[$i]['delivered'].'</td>';
            $table .= '<td>'.$acc[$i]['sale'].'</td>';
            $table .= '</tr>';
            */
            
        }
        $table .= '<tr>';
        //$table .= '<td></td>';
        //$table .= '<td></td>';
        $table .= '<td>'.array_sum($stocksum).'</td>';
        $table .= '<td>'.array_sum($ordersum).'</td>';
        $table .= '<td>'.array_sum($deliveredsum).'</td>';
        $table .= '<td>'.array_sum($salesum).'</td>';
        $table .= '</tr>';

        $table .= '</table>';
        $table .= '</div>';
        $table .= '</div>';
        echo $table;       
    }

	echo '</div>';
	reportFooter();
}

generateReport();