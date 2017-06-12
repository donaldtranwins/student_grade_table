<?php

//check if you have all the data you need from the client-side call.
$name = $_POST['name'];
$grade = $_POST['grade'];
$course = $_POST['course'];
//if not, add an appropriate error to errors
if(empty($name))        $output['errors'][] = 'Missing Name';
if(empty($grade))       $output['errors'][] = 'Missing Grade';
if(empty($course))      $output['errors'][] = 'Missing Course Name';
//write a query that inserts the data into the database.  remember that ID doesn't need to be set as it is auto incrementing
$query = "INSERT INTO `student_data`(`name`, `grade`, `course`) VALUES ('$name','$grade','$course')";
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn,$query);
//check if $result is empty.
if(empty($result)){
    //if it is, add 'database error' to errors
    $output['errors'][] = 'database error';
} else {
//else: 
    //check if the number of affected rows is 1
    if (mysqli_affected_rows($conn) === 1) {
        //if it did, change output success to true
        $output['success'] = true;
        //get the insert ID of the row that was added
        $new_id = mysqli_insert_id($conn);
        //add 'insertID' to $outut and set the value to the row's insert ID
        $output['new_id'] = $new_id;
    } else {
        //if not, add to the errors: 'insert error'
        $output['errors'][] = 'insert error';
    }
}
    ?>