<?php
//header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept");
error_reporting(1);
require_once '../ewcfg11.php';

$mysqli = mysqli_connect(EW_CONN_HOST,EW_CONN_USER,EW_CONN_PASS,EW_CONN_DB) or die("Error " . mysqli_error($mysqli));

if (isset($_GET['user_auth'])){
   //$email = $_GET['user_auth'];
   $param = $_GET['user_auth'];
   
   $query = "SELECT * FROM users WHERE username = '".$param."' AND user_level != 1";
   $result = mysqli_query($mysqli,$query) or die(mysqli_error($mysqli));
   $total = mysqli_num_rows($result);
   
   //echo $total;
   if ($total == 0) {
        //echo "UserNotFound";
		// let's chack if the user is in the promoters table
		$pquery = "SELECT * FROM promoters WHERE username ='".$param."'";
		$presult = mysqli_query($mysqli,$pquery) or die(mysqli_error($mysqli));
		$ptotal = mysqli_num_rows($presult);
		if ($ptotal == 0) {
			//this person is neither an admin/user nor promoter
			echo "UserNotFound";
		}
		else {
			// we found it is a promoter
			// echo "Promoter found";
			$json = array();
			while($promoter = mysqli_fetch_object($presult)){
			   //echo 'shop id is '.$promoter->shop_id;  			   
			   $promoterinfo = array(
				   'userid'       => $promoter->id,
				   'userpass'     => $promoter->password,
				   'username'     => $promoter->username,
				   'fullname'     => $promoter->name,
				   'userlevel'    => 0,
				   'useremail'    => $promoter->email,
				   'shop'         => $promoter->shop,
				   'shopid'       => $promoter->shop_id,
				   'assigned'     => $promoter->assigned,
				   'is_promoter'  => true
			   );
			   if ($promoter->shop_id != 0 || $promoter->shop_id != '')  {
				   //$squery = "SELECT * FROM default_shops WHERE id = ".$promoter->shop_id;
				   $squery = "SELECT * FROM outlets WHERE id IN (".$promoter->shop_id.")";
		                //echo $squery;
		                $sresult = mysqli_query($mysqli,$squery) or die(mysqli_error($mysqli));
		                //$json = array();
		                //$json['userdata'][] = $promoterinfo;
		                while($shopdata = mysqli_fetch_object($sresult)){  			   
						      $shopregion = array(
							   'shopregion'     => $shopdata->region
						      );
					          $promoterinfo = array_merge($promoterinfo, $shopregion);
						      $json['allshops'][] = $shopdata;
          
		                };
		                $json['userdata'][] = $promoterinfo; 
		                //$myinfo = array_merge($promoterinfo,$shopinfo);
		                //$json['userdata'][] = $myinfo;
		                $promoterandshopinfo = $json;
		                  
	            } // endif
                // this guy has no shop assigned ---
                // we assume he is open market
                else {
                    //$promoterandshopinfo = $promoterinfo;  
                    $q = "SELECT * FROM outlets";
                    //echo $squery;
                    //echo $q;
                    $res = mysqli_query($mysqli,$q) or die(mysqli_error($mysqli));
                    //$json = array();
                    $json['userdata'][] = $promoterinfo;
                   
			        while($row = mysqli_fetch_object($res)){
			        //  cast results to specific data types		
			           $json['allshops'][] = $row;
			        }
		    
                    //echo json_encode($json); 
                    //print_r($json);
                    $promoterandshopinfo = $json;
                 
                }
	        };  // end while
	        // log the number of times promoter has logged in
	        $logquery = "INSERT INTO promoter_logins (username,day) VALUES ('".$param."','".Date('Y-m-d')."')";
	        $q = mysqli_query($mysqli,$logquery) or die(mysqli_error($mysqli));      
	       //$promoterandshopinfo = array_merge($promoterinfo,$shopinfo);
		   header("Content-Type: application/json");
	       echo json_encode($promoterandshopinfo);
			
		}// end else $ptotal > 0 || $ptotal == 1
   } // end if $total = 0
   else {
	   while($user = mysqli_fetch_object($result)){
	       $userid = $user->id;
	       $userpass = $user->password;
	       $fullname = $user->names;
	       $username = $user->username;  
	       $userlevel = $user->user_level;  
	       $useremail = $user->user_email;   
	   };
	   $userdata = array(
	       'userid' => $userid,
	       'userpass' => $userpass,
	       'fullname' => $fullname,
	       'username' => $username,
	       'userlevel' => $userlevel,
	       'useremail' => $useremail
	   );
	   header("Content-Type: application/json");
	   echo json_encode($userdata);
   }
}

if (isset($_GET['user_sendpass'])){
   $email = $_GET['user_sendpass'];
   
   $query = "SELECT * FROM users WHERE user_email = '".$email."'";
   $result = mysqli_query($mysqli,$query) or die(mysqli_error($link));
   $total = mysqli_num_rows($result);
   
   //echo $total;
   if ($total == 0) {
        echo "UserNotFound";
   }
   else {
	   while($user = mysqli_fetch_object($result)){
	       $userid = $user->id;
	       $userpass = $user->password;
	       $username = $user->names;  
	       $userlevel = $user->user_level;   
	       $useremail = $user->user_email; 
	   };
	   $headers = '';
	   $parameters = '';
	   $message = 'Dear '.$username.', Your password is '.$userpass.'';
	   // send email to user with password
	   //mail(to,subject,message,headers,parameters);
	   mail($useremail,'Password Reminder',$message,$headers,$parameters);
	   
	   echo 'PasswordSent';
   }
}

?>