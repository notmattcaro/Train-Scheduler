$(document).ready(function() { 
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDip3Uj9ImavO1ymJ27oNHkrv6oyzyD7vE",
        authDomain: "train-scheduler-86c4c.firebaseapp.com",
        databaseURL: "https://train-scheduler-86c4c.firebaseio.com",
        projectId: "train-scheduler-86c4c",
        storageBucket: "train-scheduler-86c4c.appspot.com",
        messagingSenderId: "10426805878"
      };
      firebase.initializeApp(config);

    var database = firebase.database();

    // Create event handler for 'Submit' click
    $("#train-button").on("click", function(event) {

        event.preventDefault();

        // Create object with properties
        var trainName = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrainTime = $("#first-train-time").val().trim();//, "hh:mm").format("X");
        var frequency = $("#frequency").val().trim();
        var train = {
            name: trainName,
            place: destination,
            first: firstTrainTime,
            freq: frequency
        }
        //pushing all items to this the firebase database
        database.ref().push(train);
        // Clears all of the text-boxes
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train-time").val("");
        $("#frequency").val("");
    });

    database.ref().on("child_added", function(snapshot) {

        var train = snapshot.val();
        console.log("child:", train); 
         //*MATTS FREQUENCY VAR */
        var trainFrequency = train.freq;
        //MATTS FIRST TRAIN TIME
        var chosenTrainTime = train.first;
        console.log("This is my chosen time: " + chosenTrainTime);
        //*MATTS PUSHED BACK ONE YEAR */
        var setTrainTime = moment(chosenTrainTime, "hh:mm").subtract(1, "years");
        //*MATTS CURRENT TIME
        var currentTime = moment();
        //*MATTS DIFF BETWEEN TIMES
        var compareTimes = currentTime.diff(moment(setTrainTime), "minutes");
        //MATTS TIME REMAINDER
        var timeRemainder = compareTimes % trainFrequency;
        //MATTS MINUTES AWAY
        var minutesAway = trainFrequency - timeRemainder;
        //MATTS NEXT TRAIN
        var nextTrain = moment().add(minutesAway, "minutes");
        //MATTS NEXT TRAIN MILLITARY TIME
        var millitaryTime = moment(nextTrain).format("hh:mm");

        var newRow = $("<tr>").append(
            $("<td>").text(train.name),
            $("<td>").text(train.place),
            $("<td>").text(train.freq),

            //below will be where next arrival and minutes away will be 
            $("<td>").text(millitaryTime),
            $("<td>").text(minutesAway)
        );
        $("#mattsTable > tbody").append(newRow);
    });
});