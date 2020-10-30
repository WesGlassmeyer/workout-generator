"use strict";

const searchURL = "https://wger.de/api/v2/exercise/?format=json&language=2";

let randomExerciseNumber = [];
let userCreatedWorkout = [];
let responseLength = [];
let exercises = [];

//---These functions are for the user created workout---

function displayResults(responseJson) {
  $("#results-list").empty();
  $("#results").removeClass("hidden");
  if (responseJson.results.length === 0) {
    $("#results-list").append(
      `<li><h3>No results based on this combination</h3></li>`
    );
    $("#add").addClass("hidden");
    return;
  }
  for (let i = 0; i < responseJson.results.length; i++) {
    $("#results-list").append(
      `<input type="radio" id="exercise" name="exercise" value= '${responseJson.results[i].name}' checked multiple>
      <label>${responseJson.results[i].name}</label><br>
      <p>${responseJson.results[i].description}</p>`
    );
  }
  $("#add").removeClass("hidden");
}

function getExercise(searchCategory, searchEquipment) {
  const categoryFormat = "&category=" + searchCategory;
  const equipmentFormat = "&equipment=" + searchEquipment;
  const url = searchURL + categoryFormat + equipmentFormat;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function displayUserCreatedWorkout(userCreatedWorkout) {
  $("#user-created-list").empty();
  for (let i = 0; i < userCreatedWorkout.length; i++) {
    if (userCreatedWorkout[i] !== undefined) {
      $("#user-created-list").append(
        `<li id="${userCreatedWorkout[i]}">${userCreatedWorkout[i]}</li>`
      );
    }
  }
  $("#workout").removeClass("hidden2");
}

//---These functions are for the random workout creator---

function displayRandomExercises(exercises) {
  $("#random-results-list").empty();
  let exerciseCategory = [
    "Arms",
    "Legs",
    "Abs",
    "Chest",
    "Back",
    "Shoulders",
    "Calves",
  ];
  for (let i = 0; i < exercises.length; i++) {
    $("#random-results-list").append(
      `<h3><u>${exerciseCategory[i]}</u></h3><li> ${exercises[i].name}</li>
      <p>${exercises[i].description}</p>`
    );
  }
  $("#random-results").removeClass("hidden");
}

function getArmExercises() {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=8"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response);
}

function getLegExercises() {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=9"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response);
}

function getAbsExercises() {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=10"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response);
}

function getChestExercises() {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=11"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response);
}

function getBackExercises() {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=12"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response);
}

function getShoulderExercises() {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=13"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response);
}

function getCalvesExercises() {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit100&category=14"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((response) => response);
}

function getAllExercises() {
  return Promise.all([
    getArmExercises(),
    getLegExercises(),
    getAbsExercises(),
    getChestExercises(),
    getBackExercises(),
    getShoulderExercises(),
    getCalvesExercises(),
  ])
    .then((responses) => {
      for (let i = 0; i < responses.length; i++) {
        responseLength.push(responses[i].results.length);
      }
      return responses;
    })
    .then((responses) => {
      getRandomNumber();
      return responses;
    })
    .then((responses) => {
      for (let i = 0; i < responses.length; i++) {
        exercises.push(responses[i].results[randomExerciseNumber[i]]);
      }
    })

    .then(() => {
      displayRandomExercises(exercises);
    });
}

function getRandomNumber() {
  for (let i = 0; i < responseLength.length; i++) {
    randomExerciseNumber.push(
      Math.floor(Math.random() * (responseLength[i] - 1))
    );
  }
}

//----These functions are the event handlers---

function createWorkout() {
  $("main").on("click", "#submit", (event) => {
    event.preventDefault();
    const searchCategory = $("#js-search-category").val();
    const searchEquipment = $("#js-search-equipment").val();
    getExercise(searchCategory, searchEquipment);
  });
}

function addToWorkout() {
  $("main").on("click", "#add", (event) => {
    event.preventDefault();
    userCreatedWorkout.push($("#exercise:checked").val());
    displayUserCreatedWorkout(userCreatedWorkout);
  });
}

function resetWorkout() {
  $("main").on("click", "#reset", (event) => {
    event.preventDefault();
    userCreatedWorkout.splice(0, userCreatedWorkout.length);
    $("#user-created-list").empty();
    $("#workout").addClass("hidden2");
  });
}

function createRandomWorkout() {
  $("main").on("click", "#random-workout", (event) => {
    event.preventDefault();
    getAllExercises();
    randomExerciseNumber.splice(0, randomExerciseNumber.length);
    responseLength.splice(0, responseLength.length);
    exercises.splice(0, exercises.length);
  });
}

function toggleMenu() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

$(createWorkout);
$(addToWorkout);
$(resetWorkout);
$(createRandomWorkout);
