<?php
require_once "includes/includepath.php";
$objval	= new validate();
$api    = new api();
$rest   = new rest();
$objgen = new general();

$api->valide_method('GET');
//$keyparam = $rest->_request['key']; 
//$authkey  = $api->valide_key($keyparam); // Auth key Validation

if($authkey == true)
{	
	//print_r($_POST);exit;
		
	$where = " and page='about-us'";
		
	$res_cnt = $objgen->get_AllRowscnt("pages", $where);
		
	if($res_cnt > 0)
	{		
		$res_arr = $objgen->get_Onerow("pages",$where);		
		$data	 = array();
				
		$data[$key]['id'] 	        = $res_arr['id'];
		$data[$key]['title']        = $objgen->check_tag($res_arr['title']);
		$data[$key]['description']  = $objgen->basedecode($res_arr['description']);
		$data[$key]['page']         = $objgen->check_tag($res_arr['page']);
		$data[$key]['created_date'] = date("d-m-Y",strtotime($objgen->check_tag($res_arr['created_date'])));							
		$data[$key]['image']        = $res_arr['image']!='' ? IMAGE_PATH . "/medium/" . $objgen->check_tag($res_arr['image']) : '';
		 	
		$response_arr["data"] 			= $data;
		$response_arr["response_code"]  = 200;
		$response_arr["status"]  		= "Success";
		$rest->response($api->json($response_arr), 200);
	}	
	else
	{
		$data['response_code']      = 220;
		$data['status']             = "Error";
		$data['message']            = "No Result Found";
		$rest->response($api->json($data), 220);
	}
}
else
{
	$data['response_code']      = 401;
	$data['status']             = 'Error';
	$data['message']            = "Unauthorized";
	$rest->response($api->json($data), 401); //'Unauthorized'
}

$api->processApi(); //Process API


