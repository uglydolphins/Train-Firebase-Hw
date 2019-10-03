// Steps to complete: 

// 1. Initialize firebase
// 2. Create button for adding new trains then update the HTML + update the database
// 3. Create a way to retrieve train times from the train database
// 4. Create a way to calculate the train times using difference between the current times and train frequencies

// 1. Initialize firebase
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAJ95bGVI-wIW7959KeuwDQO1VAriZ8wL8",
    authDomain: "my-project-5eab9.firebaseapp.com",
    databaseURL: "https://my-project-5eab9.firebaseio.com",
    projectId: "my-project-5eab9",
    storageBucket: "my-project-5eab9.appspot.com",
    messagingSenderId: "363588505158",
    appId: "1:363588505158:web:987211fb99b5d9fa"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var trainHw = firebase.database();


$("#add-train-btn").on("click", function(event) {

    event.preventDefault();

    var trainName = $("#train-name-input")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTrain = $("#first-train-input")
      .val()
      .trim();
    var frequency = $("#frequency-input")
      .val()
      .trim();
  
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };

    trainHw.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    alert("Train successfully added");
  
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  trainHw.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
  
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment()
      .hours(timeArr[0])
      .minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
  
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
      
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    $("#train-table > tbody").append(
      $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });