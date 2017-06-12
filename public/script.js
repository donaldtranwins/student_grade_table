var sgt;
function GradeTable() {
    /**
     * Define all global variables here
     */
    /**
     * student_array - global array to hold student objects
     * @type {Array}
     */
    this.student_array = [];
    var self = this;
    this.url = "../server/sgt.php?action=";
    // this.url = "https://s-apis.learningfuze.com/sgt/";
    /**
     * inputIds - id's of the elements that are used to add students
     * @type {string[]}
     */
    this.$studentName = $('#studentName');
    this.$studentCourse = $('#course');
    this.$studentGrade = $('#studentGrade');
    /**
     * addClicked - Event Handler when user clicks the add button
     */
    this.addClicked = function () {
        if (this.$studentName.val() !== "" && this.$studentCourse.val() !== "" && !isNaN(parseFloat( this.$studentGrade.val() )) ){
            this.addStudent();
            this.cancelClicked();
            this.updateData();
        }
    };
    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function () {
        this.clearAddStudentForm();
    };
    /**
     * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
     *
     * @return undefined
     */
    this.addStudent = function () {
        var studentName = this.$studentName.val();
        var studentCourse = this.$studentCourse.val();
        var studentGrade = this.$studentGrade.val();
        var studentToBeAdded = {
            name: studentName,
            course: studentCourse,
            grade: studentGrade
        };
        this.student_array.push(studentToBeAdded);
        this.createStudentOnServer(studentToBeAdded);
    };
    /**
     * clearAddStudentForm - clears out the form values based on inputIds variable
     */
    this.clearAddStudentForm = function () {
        this.$studentName.val("");
        this.$studentCourse.val("");
        this.$studentGrade.val("");
    };
    /**
     * calculateAverage - loop through the global student array and calculate average grade and return that value
     * @returns {number}
     */
    this.calculateAverage = function () {
        var $arrayOfAllElements = $('tbody').find('tr td:nth-child(3)');
        var arrayOfAllGrades = [0]; //number
        var highestValue = -1;
        var lowestValue = 201;
        for (var i=0; i < $arrayOfAllElements.length; i++){
            arrayOfAllGrades[i] = Math.round($arrayOfAllElements[i].innerHTML);
            if (arrayOfAllGrades[i] > highestValue) {
                highestValue = arrayOfAllGrades[i]; //number
            }
            if (arrayOfAllGrades[i] < lowestValue) {
                lowestValue = arrayOfAllGrades[i]; //number
            }
        }
        var $arrayOfLowest = $arrayOfAllElements.filter(function(param){
            return this.innerHTML == lowestValue;
        });//string
        var $arrayOfHighest = $arrayOfAllElements.filter(function(param){
            return this.innerHTML == highestValue;
        });//string
        if ($arrayOfLowest[0] !== $arrayOfHighest[0]) {
            $arrayOfLowest.addClass('bg-danger');
        }
        $arrayOfHighest.addClass('bg-success');
        function sum(total,num){
            if (isNaN(num))
                return total;
            return total+num;
        }
        var total = arrayOfAllGrades.reduce(sum); //number
        return Math.round(total/arrayOfAllGrades.length);
    };
    /**
     * updateData - centralized function to update the average and call student list update
     */
    this.updateData = function () {
        if (this.student_array === undefined){
            return;
        }
        this.updateStudentList();
        var average = this.calculateAverage();
        $('.avgGrade').text(average);
    };
    /**
     * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
     */
    this.updateStudentList = function () {
        $('tbody').empty();
        for (var i = 0; i < this.student_array.length; i++) {
            this.addStudentToDom(this.student_array[i]);
        }
    };
    /**
     * addStudentToDom - take in a student object, create html elements from the values and then append the elements
     * into the .student_list tbody
     * @param studentObj
     */
    this.addStudentToDom = function (studentObject) {
        var $newElement = $('' +
            '<tr>' +
            '<td>' + studentObject.name + '</td>' +
            '<td>' + studentObject.course + '</td>' +
            '<td>' + studentObject.grade + '</td>' +
            '<td><button type="button" class="btn btn-danger btn-xs">Delete</button></td>' +
            '</tr>');
        (function(self){
            $newElement.appendTo('.student-list tbody');
            $newElement.find('button').click(function(){
                var location = $newElement.index();
                $newElement.remove();
                self.deleteStudentFromServer(self.student_array[location]);
                self.student_array.splice(location,1);
                self.updateData();
            });
        })(this);

    };
    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    this.reset = function () {
        this.student_array = [];
    };
    this.createStudentOnServer = function(object){
        $.ajax({
            dataType: 'json',
            url: this.url+"create",
            method: 'post',
            data: {
                api_key: 'yPaZqUuy8L',
                "name": object.name,
                "course": object.course,
                "grade": object.grade
            },
            error: function (response) {
                logAndCreateErrorAlert(response.errors);
            },
            success: function (response) {
                if (response.success){
                    object.id = response.new_id;
                    var message = 'Student ID #'+object.id+' "'+object.name+'" was successfully created on the server.';
                    createSuccessAlert(message);
                } else  {
                    logAndCreateErrorAlert(response.errors);
                }
            }
        })
    };
    this.deleteStudentFromServer = function(object){
        $.ajax({
            dataType: 'json',
            url: this.url+'delete',
            method: 'post',
            data: {
                api_key: 'yPaZqUuy8L',
                "student_id": object.id,
                "id": object.id
            },
            error: function (response) {
                logAndCreateErrorAlert(response.errors);
            },
            success: function (response) {
                if (response.success){
                    var message = 'Student ID #'+object.id+' "'+object.name+'" has been from removed from the server.';
                    createSuccessAlert(message);
                } else  {
                    logAndCreateErrorAlert(response.errors);
                }
            }
        })
    };
    this.getDataFromServer = function(){
        $.ajax({
            dataType: 'json',
            url: this.url+'get',
            method: 'post',
            data: {
                api_key: 'yPaZqUuy8L'
            },
            error: function(response){
                logAndCreateErrorAlert(response.error);
            },
            success: function(response){
                if(response.success === false){
                    logAndCreateErrorAlert(response.error);
                } else {
                    self.student_array = self.student_array.concat(response.data);
                    self.updateData();
                }
            }
        })
    };
    function createSuccessAlert(successMsg){
        var alert = $('<div class="alert alert-success alert-dismissable">' +
            '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
            '<strong>Success!</strong> <span id="successMsg">'+successMsg+'</span>');
        $('#alerts').append(alert);
    }
    function logAndCreateErrorAlert(message){
        if(!message)    message = ["Please contact an administrator."];
        var errorMsg = message.join(" | ");
        var alert = $('<div class="alert alert-danger alert-dismissable">' +
            '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
            '<strong>Error:</strong> <span id="errorMsg">'+errorMsg+'</span>');
        $('#alerts').append(alert);
    }
    /**
     * initialize - applies click handlers to the elements in the DOM
     */
    this.initialize = function() {
        $('#add').on('click',this.addClicked.bind(this));
        $('#cancel').on('click',this.cancelClicked.bind(this));
        $('#get').on('click',this.getDataFromServer.bind(this));
    }
}
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function(){
    sgt = new GradeTable();
    sgt.initialize();
    sgt.reset();
    sgt.getDataFromServer();
});