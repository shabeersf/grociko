<?php
require_once "includes/includepath.php";
$objval	= new validate();
$api    = new api();
$rest   = new rest();
$objgen = new general();

$api->valide_method('GET');


if($authkey == true)
{
	$user_id = $rest->_request['user_id'];
	
	if($user_id != '')
	{		
		$user_cnt = $objgen->get_AllRowscnt("user", " and id=" . $user_id . " and del_user='no'");
		if($user_cnt > 0)
		{		
			$data = array();						
			$user_arr = $objgen->get_Onerow("user", " and id=" . $user_id . " and del_user='no'"); 
			
			$data['id'] 	      = $user_arr['id'];
			$data['username']     = $objgen->check_tag($user_arr['username']);
			$data['email']        = $objgen->check_tag($user_arr['email']);
			$data['name']         = $objgen->check_tag($user_arr['name']);
			$data['phone']        = $objgen->check_tag($user_arr['phone']);
			$data['status']       = $user_arr['status'];
			$data['create_date']  = $user_arr['create_date'];
			$data['photo']        = ($user_arr['photo'] != null) ? WEBLINK . "photos/orginal/" . $user_arr['photo'] : "";
			
			$response_arr["data"] 			= $data;
			$response_arr["response_code"]  = 200;
			$response_arr["status"]  		= "Success";
			$rest->response($api->json($response_arr), 200);			
		}
		else
		{
			$data['response_code']  = 220;
			$data['status']         = "Error";
			$data['message']        = "User Not Found";
			$rest->response($api->json($data), 220);					
		}	
	}		
	else
	{
		$data['response_code']  = 220;
		$data['status']         = "Error";
		$data['message']        = "Enter value for user_id";
		$rest->response($api->json($data), 220);
	}
}
else
{
	$data['response_code']  = 401;
	$data['status']         = 'Error';
	$data['message']        = "Unauthorized";
	$rest->response($api->json($data), 401);
}

$api->processApi();
?>