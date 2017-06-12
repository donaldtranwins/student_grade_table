<?php

$action = $_GET['action'];

if(empty($action)){
	exit('no action specified');
}
require('mysql_connect.php');

$output = [
	'success'=> false, //we assume we will fail
	'errors'=>[]
];

switch($action){
    case 'post':
        include 'api/create.php';
        break;
    case 'get':
        include 'api/read.php';
        break;
    case 'put':
        include 'api/update.php';
        break;
    case 'delete':
        include 'api/delete.php';
        break;
}
mysqli_close($conn);

//custom added line to not output an errors property if there are no errors and our success is true
if(empty($output['errors']) && $output['success'] === true) {
    unset($output['errors']);
}
//convert the $output variable to json, store the result in $outputJSON
$outputJSON = json_encode($output);
//print $outputJSON
print($outputJSON);
//end

?>