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
        if (this.$studentName.val() !== "" &&
            this.$studentCourse.val() !== "" &&
            !isNaN(parseFloat( this.$studentGrade.val() )) ){
            this.addStudent();
            this.cancelClicked();
            this.updateData();
            console.log("student added to student_array");
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
        var studentToBeAdded = {};
        studentToBeAdded.name = this.$studentName.val();
        studentToBeAdded.course = this.$studentCourse.val();
        studentToBeAdded.grade = this.$studentGrade.val();
        this.student_array.push(studentToBeAdded);
        return;
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
    this.addStudentToDom = function (studentObj) {
        var $newElement = $('' +
            '<tr>' +
            '<td>' + studentObj.name + '</td>' +
            '<td>' + studentObj.course + '</td>' +
            '<td>' + studentObj.grade + '</td>' +
            '<td><button type="button" class="btn btn-danger btn-xs">Delete</button></td>' +
            '</tr>');
        (function(self){
            $newElement.appendTo('.student-list tbody');
            $newElement.find('button').click(function(){
                var location = $newElement.index();
                $newElement.remove();
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
        // this.updateData(); //to show off event delegation handler, comment this line out
    };
    /**
     * here begins the section where I deviate from the SGT skeleton to create my own functions
     */

    /**
     * deleteRow - deletes a row using the Event Delegation method as opposed to
     *              the anonymous closure inside the addStudentToDom function
     */
    this.deleteRow = function() {
        $(this).parent().parent().remove();
    };
    this.hints = {
        totalCalls: 0,
        totalHits: 0,
        count: [],
        message: []
    };
    this.lastObject = {};
    this.currentObject = {};
    this.fullHintCallObject = [];
    this.pullDataFromAPI = function(){
        $.ajax({
            dataType: 'json',
            url: 'https://s-apis.learningfuze.com/sgt/get',
            method: 'post',
            data: {
                api_key: 'yPaZqUuy8L'
            },
            success: function(response){
                self.student_array = response.data;
                self.updateData();
                logHints();
                function logHints() {
                    self.hints.totalCalls++;
                    if (response.hint !== undefined) {
                        self.hints.totalHits++;
                        console.log(response.hint, this);
                        var existing = self.hints.message.indexOf(response.hint);
                        if (existing > -1) {
                            self.hints.count[existing]++;
                        } else {
                            self.hints.message.push(response.hint);
                            self.hints.count.push(1);
                        }
                        self.fullHintCallObject.push({
                            message: response.hint,
                            hintObject: this,
                            success: response
                        });
                    }
                }
            }
        })
    };
    /**
     * initialize - applies click handlers to the elements in the DOM
     */
    this.initialize = function() {
        $('#add').on('click',this.addClicked.bind(this));
        $('#cancel').on('click',this.cancelClicked.bind(this));
        $('#get').on('click',this.pullDataFromAPI);
        $('td').on('click','button',this.deleteRow); //row removal using event delegation
    }
}
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function(){
    sgt = new GradeTable;
    sgt.initialize();
    sgt.reset();
});