// Function to display the preloader
function displayPreloader() {
  const preloader = document.getElementById("preloader");
  const overlay = document.createElement("div");
  overlay.className = "overlay"; // Add the overlay class
  document.body.appendChild(overlay);
  preloader.style.display = "block";
}
// console.log(localStorage.getItem("teamName"));
// Function to hide the preloader
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  const overlay = document.querySelector(".overlay");
  preloader.style.display = "none";
  if (overlay) {
    document.body.removeChild(overlay);
  }
}
// Function to display the success popup
function displaySuccessPopup() {
  const successPopup = document.getElementById("successPopup");
  successPopup.style.display = "block";

  // Add an event listener to the close button
  const closeButton = document.getElementById("closeButton");
  const overlay = document.createElement("div");
  overlay.className = "overlay"; // Add the overlay class
  document.body.appendChild(overlay);
  successPopup.style.display = "block";
  closeButton.addEventListener("click", function () {
    // Redirect to main.html or the desired page
    window.location.href = "./main.html"; // Change the URL as needed
  });
}
// const userId = localStorage.getItem("userId");
const joinTeamForm = document.getElementById("joinTeamForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("ipteam_codes");
  const searchResults = document.getElementById("search-results");

  const user_id = JSON.parse(localStorage.getItem("uid"));
  console.log(user_id);

  getTeamRecommendations(user_id);

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim();

    // Clear previous search results
    searchResults.innerHTML = "";

    // Check if the search term is at least 3 characters
    if (searchTerm.length >= 3) {
      // Call the FastAPI endpoint to get search results
      axios
        .get(`https://search-api-z3e0.onrender.com/search/${searchTerm}`)
        .then((response) => {
          const results = response.data;

          if (results.length > 0) {
            // Display search results only when there are results
            searchResults.style.display = "block";
            // Display search results
            results.forEach((result) => {
              const resultItem = document.createElement("div");
              resultItem.classList.add("result-item");
              resultItem.innerText = result;

              // Add a click event to handle selecting a result
              resultItem.addEventListener("click", function () {
                // Do something with the selected result (e.g., fill an input field)
                searchInput.value = result;
                // Clear search results
                searchResults.innerHTML = "";

                searchResults.style.display = "none";
              });

              searchResults.appendChild(resultItem);
            });
          } else {
            // Hide the search results container when there are no results
            searchResults.style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      // Hide the search results container when the search term is less than 3 characters
      searchResults.style.display = "none";
    }
  });
});

function getTeamRecommendations(userId) {
  axios
    .get(`http://localhost:1020/recommend/${userId}`)
    .then((response) => {
      const data = response.data;
      console.log(data);
      const teamContainer = document.getElementById('recommendedTeams');

      // Clear existing content in the container
      teamContainer.innerHTML = '';

      // Create a new div for each recommended team and append it to the container
      data.recommendations.forEach((team) => {
        const teamDiv = document.createElement('div');
        teamDiv.classList.add('team');
        const teamName = document.createElement('h3');
        teamName.textContent = team;
        teamDiv.appendChild(teamName);
        teamContainer.appendChild(teamDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching recommendations:", error);
      // Handle errors
    });
}
joinTeamForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const teamCode = document.getElementById("ipteam_code").value;
  const userEmail = document.getElementById("ipuser_email").value;

  const data = {
    user_email: userEmail,
    team_code: teamCode,
  };

  const apiUrl = "http://localhost:1112/joinTeam";

  // Display the preloader before making the request
  displayPreloader();

  // Make an axios POST request
  axios
    .post(apiUrl, data)
    .then(function (response) {
      // Hide the preloader when the response is received
      hidePreloader();

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 204
      ) {
        console.log("API response:", response.data);
        // Team joining was successful
        successMessage.textContent = "Successfully joined the team!";
        successMessage.style.display = "block";
        errorMessage.style.display = "none";

        // Display the success popup
        displaySuccessPopup();
      }
    })
    .catch(function (error) {
      // Hide the preloader on error
      hidePreloader();

      console.error(error);

      if (error.response && error.response.status === 400) {
        // User is already part of the team
        errorMessage.textContent = "User is already part of the team.";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
      } else {
        // Handle other errors
        errorMessage.textContent = "An error occurred.";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
      }
    });
});
