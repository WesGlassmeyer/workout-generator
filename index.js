"use strict";

const store = {
  randomExerciseNumber: [],
  userCreatedWorkout: [],
  responseLength: [],
  exercises: [],
  searchURL: "https://wger.de/api/v2/exercise/?format=json&language=2",
  category: [8, 9, 10, 11, 12, 13, 14],
};

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
      `<div class="result-item"><input type="radio" name="exercise" value= '${responseJson.results[i].name}' checked>
      <label>${responseJson.results[i].name}</label><br>
      <p>${responseJson.results[i].description}</p></div>`
    );
  }
  $("#add").removeClass("hidden");
}

function getExercise(searchCategory, searchEquipment) {
  const categoryFormat = "&category=" + searchCategory;
  const equipmentFormat = "&equipment=" + searchEquipment;
  const url = store.searchURL + categoryFormat + equipmentFormat;

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
  for (let i = 0; i < store.userCreatedWorkout.length; i++) {
    if (store.userCreatedWorkout[i] !== undefined) {
      $("#user-created-list").append(
        `<li class="created-list-li" id="${store.userCreatedWorkout[i]}">${store.userCreatedWorkout[i]}</li>`
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
  for (let i = 0; i < store.exercises.length; i++) {
    $("#random-results-list").append(
      `<div class="result-item"><h3><u>${exerciseCategory[i]}</u></h3><h4>${store.exercises[i].name}</h4>
      <p>${store.exercises[i].description}</p></div>`
    );
  }
  $("#random-results").removeClass("hidden");
}

// function getArmExercises() {
//   return fetch(
//     "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=8"
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then((response) => response);
// }

// function getLegExercises() {
//   return fetch(
//     "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=9"
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then((response) => response);
// }

// function getAbsExercises() {
//   return fetch(
//     "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=10"
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then((response) => response);
// }

// function getChestExercises() {
//   return fetch(
//     "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=11"
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then((response) => response);
// }

// function getBackExercises() {
//   return fetch(
//     "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=12"
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then((response) => response);
// }

// function getShoulderExercises() {
//   return fetch(
//     "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=13"
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then((response) => response);
// }

// function getCalvesExercises() {
//   return fetch(
//     "https://wger.de/api/v2/exercise/?format=json&language=2&limit100&category=14"
//   )
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(response.statusText);
//     })
//     .then((response) => response);
// }

function getExercisesByCategory(categoryNumber) {
  return fetch(
    "https://wger.de/api/v2/exercise/?format=json&language=2&limit=100&category=" +
      categoryNumber
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
  // Promise.all takes an array of Promises as an argument, so make one using .map() method
  let allExercises = store.category.map(categoryNumber => {
    return getExercisesByCategory(categoryNumber)
  })

  return Promise.all(allExercises)
  // return Promise.all(store.category.map(c => getExercisesByCategory(c)))  // <-- a less readable, more concise solution to replace lines 192-197
    .then((responses) => {
      for (let i = 0; i < responses.length; i++) {
        store.responseLength.push(responses[i].results.length);
      }
      return responses;
    })
    .then((responses) => {
      getRandomNumber();
      return responses;
    })
    .then((responses) => {
      for (let i = 0; i < responses.length; i++) {
        store.exercises.push(
          responses[i].results[store.randomExerciseNumber[i]]
        );
      }
    })

    .then(() => {
      displayRandomExercises(store.exercises);
    });
}

function getRandomNumber() {
  for (let i = 0; i < store.responseLength.length; i++) {
    store.randomExerciseNumber.push(
      Math.floor(Math.random() * (store.responseLength[i] - 1))
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
    store.userCreatedWorkout.push($("[name|='exercise']:checked").val());
    displayUserCreatedWorkout(store.userCreatedWorkout);
  });
}

function resetWorkout() {
  $("main").on("click", "#reset", (event) => {
    event.preventDefault();
    store.userCreatedWorkout.splice(0, store.userCreatedWorkout.length);
    $("#user-created-list").empty();
    $("#workout").addClass("hidden2");
  });
}

function createRandomWorkout() {
  $("main").on("click", "#random-workout", (event) => {
    event.preventDefault();
    getAllExercises();
    store.randomExerciseNumber = [];
    store.responseLength = [];
    store.exercises = [];
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

function initializePage() {
  createWorkout();
  addToWorkout();
  resetWorkout();
  createRandomWorkout();
}

$(initializePage);
