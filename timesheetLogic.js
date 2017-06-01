/* global firebase moment */
// Steps to complete:
// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed
// 1. Initialize Firebase

var config = {
	apiKey: "AIzaSyD48InbBvrr4KkPdx4fqRn9gbktghHgRSE",
	authDomain: "train-time-43c2d.firebaseapp.com",
	databaseURL: "https://train-time-43c2d.firebaseio.com",
	projectId: "train-time-43c2d",
	storageBucket: "train-time-43c2d.appspot.com",
	messagingSenderId: "350883288334"
};

firebase.initializeApp(config);
var database = firebase.database();



// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var traindestination = $("#destination-input").val().trim();
  var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("hh:mm");
  var tFrequency = $("#frequency-input").val().trim();
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: traindestination,
    start: trainStart,
    frequency: tFrequency
  };
  // Uploads train data to the database
  database.ref().push(newTrain);
  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);
  // Alert
  alert("train successfully added");
  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});
// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());
  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var traindestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var tFrequency = childSnapshot.val().frequency;
  // train Info
  console.log(trainName);
  console.log(traindestination);
  console.log(trainStart);
  console.log(tFrequency);
  // ***********
  var tFrequency = childSnapshot.val().frequency;
	// Time is 3:30 AM
  var firstTime = childSnapshot.val().start;
	// First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
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
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + traindestination + "</td><td>" +
  tFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});
