var config = {
  apiKey: "AIzaSyDpI5_zpts3ekKC3LfntZ1ILcbBqR21BdQ",
  authDomain: "trainhomework-b1f22.firebaseapp.com",
  databaseURL: "https://trainhomework-b1f22.firebaseio.com",
  projectId: "trainhomework-b1f22",
  storageBucket: "trainhomework-b1f22.appspot.com",
  messagingSenderId: "277922159249"
};
firebase.initializeApp(config);

const database = firebase.database();
const ref = database.ref();


ref.on("child_added", function(snapshot) {
  let newChild = snapshot.val();
  let trainNameDisplay = newChild.trainName;
  let destinationDisplay = newChild.destination;
  let frequencyDisplay = newChild.frequency;
  let nextArrivalDisplay = calculateArrival(newChild.firstTrain, newChild.frequency);
  let minutesAwayDisplay = calculateMinutes(newChild.firstTrain, newChild.frequency);

  $("#train-table").append(`
    <tr>
      <td>${trainNameDisplay}</td>
      <td>${destinationDisplay}</td>
      <td>${frequencyDisplay}</td>
      <td>${nextArrivalDisplay}</td>
      <td>${minutesAwayDisplay}</td>
    </tr>
  `);
});


function calculateArrival(start, freq) {
  let nextArrival = moment(start, "HH:mm").add(freq, 'm');
  do {
    nextArrival.add(freq, 'm');
  } while (nextArrival < moment())
  return nextArrival.format("DD MMM YYYY [at] h:mm A");
}

function calculateMinutes(start, freq) {
  let nextArrival = moment(start, "HH:mm").add(freq, 'm');
  do {
    nextArrival.add(freq, 'm');
  } while (nextArrival < moment())

  return nextArrival.diff(moment(), 'minutes');
}

$(document).on("click", "#submit-button", function(event) {
  event.preventDefault();

  let trainName = $("#train-name").val().trim();
  let destination = $("#destination").val().trim();
  let frequency = $("#frequency").val().trim();
  let firstTrain = $("#first-train-time").val().trim();

  if (trainName.length > 0 &&
      destination.length > 0 &&
      parseInt(frequency) > 0 &&
      moment(firstTrain, 'HH:mm').isValid())
  {
    ref.push().set({
      "trainName": trainName,
      "destination": destination,
      "frequency": frequency,
      "firstTrain": firstTrain
    });
  }
  else {
    console.log(`
      trainName: ${trainName.length},
      destination: ${destination.length},
      frequency: ${parseInt(frequency)},
      firstTrain: ${moment(firstTrain, 'HH:mm').isValid()}
    `);
  }
});
