//Receive input from the entry fields
//Validate the information in each field, to make sure it's in the right format
//store information into firebase
//use moment to figure out current time and perform calculations
//append the results to the timetable


$(document).ready(function() {

		// Initialize Firebase 
  var config = {
    apiKey: "AIzaSyCIVILtaptvxWjbk5-hVBHQHYigrKUkEoc",
    authDomain: "trainschedulehwdb.firebaseapp.com",
    databaseURL: "https://trainschedulehwdb.firebaseio.com",
    storageBucket: "trainschedulehwdb.appspot.com",
    messagingSenderId: "659274722955"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


	var letters = /^[A-Za-z]+$/;
	var trainname;
	var destination;
	var traintime;
	var frequency;

			//Start Click Event
	$('#submitButton').on('click', function(event) {
		//don't submit the info
	event.preventDefault();
	
	trainname = $('#TrainName').val().trim();
	destination = $('#Destination').val().trim();
	traintime = $('#TrainTime').val().trim();
	frequency = $('#Frequency').val().trim();

	console.log(trainname,destination,traintime,frequency);

	var NewSchedule = {
		trainname: trainname,
		destination: destination,
		traintime: traintime,
		frequency: frequency,
	}
	database.ref().push(NewSchedule);

	}); // end Click Submit Button Event

		//Firebase event to pull values from Firebase
	database.ref().on("child_added", function(childSnapshot, prevChildKey) {

		var tName = childSnapshot.val().trainname;
		var tDestination = childSnapshot.val().destination;
		var tTime = childSnapshot.val().traintime;
		var tFrequency = childSnapshot.val().frequency;

		console.log(tName);
		console.log(tDestination);
		console.log(tTime);
		console.log(tFrequency);


//Moment.js code 

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(tTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));		

	  $("#schedule-table tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
  tFrequency + "</td><td>" + moment(nextTrain).format("hh:mm")	 + "</td><td>" + tMinutesTillTrain + "</td></tr>");

	  console.log("done");


	}); //End Firebase event




})