function GradeTable() {
    /**
     * Define all global variables here
     */
    /**
     * student_array - global array to hold student objects
     * @type {Array}
     */
    this.student_array = [];
    /**
     * inputIds - id's of the elements that are used to add students
     * @type {string[]}
     */
    this.$studentName = $('#studentName');
    this.$course = $('#course');
    this.$studentGrade = parseInt($('#studentGrade'));

    /**
     * addClicked - Event Handler when user clicks the add button
     */
    this.addClicked = function() {
        addStudent();
        this.updateStudentList();
        this.cancelClicked();
    };

    /**
     * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
     */
    this.cancelClicked = function() {
        this.clearAddStudentForm();
    };
    /**
     * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
     *
     * @return undefined
     */
    this.addStudent = function() {
        this.student_array.push(
            {
                name: this.$studentName.val(),
                course: this.$course.val(),
                grade: this.$studentGrade.val()
            }
        );
        return;
    };
    /**
     * clearAddStudentForm - clears out the form values based on inputIds variable
     */
    this.clearAddStudentForm = function() {
        this.$studentName.val("");
        this.$course.val("");
        this.$studentGrade.val("");
    };

    /**
     * calculateAverage - loop through the global student array and calculate average grade and return that value
     * @returns {number}
     */
    this.calculateAverage = function() {

        return average;
    };

    /**
     * updateData - centralized function to update the average and call student list update
     */
    this.updateData = function() {
        this.calculateAverage();
        this.updateStudentList();
    };

    /**
     * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
     */
    this.updateStudentList = function() {
        this.addStudentToDom();
    };
    /**
     * addStudentToDom - take in a student object, create html elements from the values and then append the elements
     * into the .student_list tbody
     * @param studentObj
     */
    this.addStudentToDom = function(studentObj) {
        var newElement = $('' +
            '<tr>' +
            '<td>'+studentObj.name+'</td>' +
            '<td>'+studentObj.course+'</td>' +
            '<td>'+studentObj.studentGrade+'</td>' +
            '<td><button type="button" class="btn btn-danger btn-xs">Delete</button></td>' +
            '</tr>');
        $('.student-list tbody').append(newElement)
    };
    /**
     * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
     */
    this.reset = function() {

    };
    /**
     * Listen for the document to load and reset the data to the initial state
     */
}
$(document).ready(function(){
    var app = new GradeTable();
    app.reset();
});