<?php

//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
$id = $_POST['id'];

$updateFields = [
    'student'=>'name',
    'class'=>'course',
    'score'=>'grade'
];

//if not, add an appropriate error to errors
if(empty($id)) {
    $output['errors'][] = 'Missing ID';
} else {
//write a query that updates the data at the given student ID.
    $query = "UPDATE `student_data` SET ";
    foreach ($updateFields as $externalField => $internalField) {
        if (!empty($_POST[$externalField])) {
            $query .= "`$internalField`='{$_POST[$externalField]}', ";
        }
    }
    $query = substr($query, 0, -2);
    $query .= " WHERE id=$id";
    //send the query to the database, store the result of the query into $result
    $result = mysqli_query($conn,$query);


    //check if $result is empty.
    if(empty($result)){
        //if it is, add 'database error' to errors
        $output['errors'][] = 'database error';
    //else:
    } else {
        //check if the number of affected rows is 1
        if (mysqli_affected_rows($conn) === 1) {
            //if it did, change output success to true
            $output['success'] = true;
        } else {
            //if not, add to the errors: 'update error'
            $output['errors'][] = 'no updates applied';
        }
    }
}



?>