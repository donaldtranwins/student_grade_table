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
    this.$course = $('#course');
    this.$studentGrade = $('#studentGrade');
    /**
     * addClicked - Event Handler when user clicks the add button
     */
    this.addClicked = function () {
        console.log("addClicked called");
        if (this.$studentName.val() !== "" &&
            this.$course.val() !== "" &&
            !isNaN(this.$studentGrade.val())){
            this.addStudent();
            this.updateData();
            this.cancelClicked();
        }
    };
    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function () {
        console.log("cancelClicked");
        this.clearAddStudentForm();
    };
    /**
     * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
     *
     * @return undefined
     */
    this.addStudent = function () {
        console.log("addStudent called");
        var studentToBeAdded = {};
        studentToBeAdded.name = this.$studentName.val();
        studentToBeAdded.course = this.$course.val();
        studentToBeAdded.grade = this.$studentGrade.val();
        this.student_array.push(studentToBeAdded);
        return;
    };
    /**
     * clearAddStudentForm - clears out the form values based on inputIds variable
     */
    this.clearAddStudentForm = function () {
        console.log("clearAddStudentForm called");
        this.$studentName.val("");
        this.$course.val("");
        this.$studentGrade.val("");
    };
    /**
     * calculateAverage - loop through the global student array and calculate average grade and return that value
     * @returns {number}
     */
    this.calculateAverage = function () {
        console.log("calculateAverage called");
        var $arrayOfAllItems = $('tbody').find('tr td:nth-child(3)');
        var arrayOfAllGrades = [];
        var highest = {
            value: -1,
            items: []
        };
        var lowest = {
            value: 101,
            items: []
        };
        for (var i=0; i < $arrayOfAllItems.length; i++){
            arrayOfAllGrades[i] = parseInt($arrayOfAllItems[i].innerHTML);
            if (arrayOfAllGrades[i] > highest.value) {
                highest.value = arrayOfAllGrades[i];
                highest.items.push($arrayOfAllItems[i]);
            } else if (arrayOfAllGrades[i] < lowest.value) {
                lowest.value = arrayOfAllGrades[i];
                lowest.items.push($arrayOfAllItems[i]);
            }
        }
        function find(target){
            return self.innerHTML == target;
        }
        for (var j=0; j < $arrayOfAllItems.length; j++){
            if
        }
        var $arrayOfHighest = $arrayOfAllItems.filter(find(highest.value));
        var $arrayOfLowest = $arrayOfAllItems.filter(find(lowest.value));
        $arrayOfHighest.addClass('bg-success');
        $arrayOfLowest.addClass('bg-danger');
        function sum(total,num){
            if (isNaN(num))
                return total;
            return total+num;
        }
        var total = arrayOfAllGrades.reduce(sum);
        return total/arrayOfAllGrades.length;
    };

    /**
     * updateData - centralized function to update the average and call student list update
     */
    this.updateData = function () {
        var average = this.calculateAverage();
        //modify average
        this.updateStudentList();
    };
    /**
     * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
     */
    this.updateStudentList = function () {
        console.log("updateStudentList called");
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
        console.log("addStudentToDom called");
        var newElement = $('' +
            '<tr>' +
            '<td>' + studentObj.name + '</td>' +
            '<td>' + studentObj.course + '</td>' +
            '<td>' + studentObj.studentGrade + '</td>' +
            '<td><button type="button" class="btn btn-danger btn-xs">Delete</button></td>' +
            '</tr>');
        $('.student-list tbody').append(newElement)
    };
    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    this.reset = function () {
        console.log("reset called");
        this.student_array = [];
    };

    /**
     * initialize - applies click handlers to the elements in the DOM
     */
    this.initialize = function() {
        console.log("initializing handlers");
        $('#add').on('click',this.addClicked.bind(this));
        $('#cancel').on('click',this.cancelClicked.bind(this));
        this.$studentGrade
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