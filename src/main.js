document.addEventListener("DOMContentLoaded", function () {
  const API_ENDPOINT = "https://web-scraping-api-0wcp.onrender.com/api/data";
  const ONE_HOUR = 7200000; // 2 hour in milliseconds

  function updateCompetitionData() {
    // Check if data is available in localStorage and if it's not older than 1 hour
    const storedData = localStorage.getItem("competitionData");
    const storedTimestamp = localStorage.getItem("timestamp");

    if (storedData && storedTimestamp) {
      const currentTime = new Date().getTime();
      if (currentTime - parseInt(storedTimestamp) < ONE_HOUR) {
        // Use stored data if it's not older than 1 hour
        const data = JSON.parse(storedData);
        renderCompetitionData(data);
        return;
      }
    }

    // Fetch data from the API if stored data is not available or older than 1 hour
    fetch(API_ENDPOINT)
      .then((response) => response.json())
      .then((data) => {
        // Store data and current timestamp in localStorage
        localStorage.setItem("competitionData", JSON.stringify(data));
        localStorage.setItem("timestamp", new Date().getTime().toString());

        // Render competition data
        renderCompetitionData(data);
      })
      .catch((error) => {
        console.error("Error fetching competition data:", error);
      });
  }

  function renderCompetitionData(data) {
    const compimg = document.querySelector(".compimg");
    compimg.innerHTML = "";

    data.forEach((competition) => {
      const box = document.createElement("div");
      box.className = "comp";

      const link = document.createElement("a");
      link.href = competition.link;

      const img = document.createElement("img");
      img.src = competition.logo_url;
      img.alt = competition.name;
      img.style.maxWidth = "100%";

      const name = document.createElement("p");
      name.textContent = competition.name;

      link.appendChild(img);
      box.appendChild(link);
      box.appendChild(name);
      compimg.appendChild(box);

      // Add a hover event listener to show/hide the competition name on hover
      box.addEventListener("mouseenter", () => {
        name.style.display = "block";
      });
      box.addEventListener("mouseleave", () => {
        name.style.display = "none";
      });
    });
  }

  // Call the function initially to load the data
  updateCompetitionData();

  // Schedule periodic data update every 1 hour
  setInterval(updateCompetitionData, ONE_HOUR);

  // Retrieve user data from localStorage
  //Do Not Touch this ever!!!!
  const email = JSON.parse(localStorage.getItem("email"));
  const name = JSON.parse(localStorage.getItem("name"));
  console.log(email, name);
  const napi = "https://profile-api-2wkq.onrender.com/profile";
  const urlWithParameters = `${napi}?email=${email}`;

  axios
    .get(urlWithParameters)
    .then((response) => {
      const userData = response.data;
      localStorage.setItem("udata", JSON.stringify(userData));
      localStorage.setItem("uid", JSON.stringify(userData.id));
      console.log(userData);
    })
    .catch((error) => {
      console.error("Error fetching user profile data:", error);
    });
  // Select the first name and last name input elements
  // const firstNameInput = document.querySelector(".fn input");
  //const lastNameInput = document.querySelector(".ln input");
  //const emailinput=document.querySelector(".email input");

  // Populate the input fields with user data
  //firstNameInput.value = userData.name;
  //emailinput.value=userData.username;

  // Function to fetch user's teams and populate the "My Teams" section
  // function fetchUserTeams() {
  //     const userTeamsUrl = `https://team-xj4n.onrender.com/user_teams?user_email=${email}`;
  //     axios.get(userTeamsUrl)
  //         .then((response) => {
  //             const userTeams = response.data;
  //             const myTeamsSection = document.querySelector(".myteams");

  //             // Loop through the user's teams and create teamshow divs
  //             userTeams.forEach((team) => {
  //                 const teamshowDiv = document.createElement("div");
  //                 teamshowDiv.classList.add("teamshow");

  //                 // Populate the teamshow div with team information
  //                 const teamName = document.createElement("h6");
  //                 teamName.textContent = team.team_name;

  //                 const teamDescription = document.createElement("p");
  //                 teamDescription.textContent = team.project_description;

  //                 teamshowDiv.appendChild(teamName);
  //                 teamshowDiv.appendChild(teamDescription);
  //                 myTeamsSection.appendChild(teamshowDiv);
  //             });
  //         })
  //         .catch((error) => {
  //             console.error("Error fetching user's teams:", error);
  //         });
  // }

  // // Call the function to fetch and populate user's teams
  // fetchUserTeams();
  function fetchAndShowUserTeams() {
    const userTeamsUrl = `https://team-xj4n.onrender.com/user_teams?user_email=${email}`;
    axios
      .get(userTeamsUrl)
      .then((response) => {
        console.log(response.data);
        const userTeams = response.data;
        const myTeamsSection = document.querySelector(".myteamsdetail");

        // Loop through the user's teams and create teamshow divs
        userTeams.forEach((team) => {
          const teamshowDiv = document.createElement("div");
          teamshowDiv.classList.add("teamshow");

          // Populate the teamshow div with team information
          const teamName = document.createElement("h6");
          teamName.textContent = team.team_name;

          const teamDescription = document.createElement("p");
          teamDescription.textContent = team.project_description;

          const teamLink = document.createElement("a");
          teamLink.href = `addmem.html?teamId=${team.team_code}`;

          // teamshowDiv.appendChild(teamLink);
          teamshowDiv.appendChild(teamName);
          teamshowDiv.appendChild(teamDescription);
          myTeamsSection.appendChild(teamshowDiv);
          teamshowDiv.addEventListener("click", function () {
            // Redirect to addmem.html with the team ID in the URL
            localStorage.setItem("teamId", team.team_code);
            localStorage.setItem("teamName", team.team_name);
            localStorage.setItem("teamDesc", team.project_description);
            window.location.href = `addmem.html?teamId=${team.team_code}`;
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching user's teams:", error);
      });
  }

  // Call the function to fetch and showcase user's teams
  fetchAndShowUserTeams();
});

const profileIcon = document.querySelector(".profile");
const profileBox = document.querySelector(".profilebox");

// Function to show the profile box
let profileBoxTimeout;

// Function to show the profile box
function showProfileBox() {
  clearTimeout(profileBoxTimeout);
  profileBox.style.display = "block";
}

// Function to hide the profile box after a delay
function hideProfileBox() {
  profileBoxTimeout = setTimeout(() => {
    profileBox.style.display = "none";
  }, 500); // Adjust the delay time (in milliseconds) as needed
}

// Function to clear the timeout when the mouse re-enters the profile box
function clearProfileBoxTimeout() {
  clearTimeout(profileBoxTimeout);
}

// Add an event listener for mouseenter (hover) on the profile box
profileBox.addEventListener("mouseenter", clearProfileBoxTimeout);

// profileBox.style.display = 'none';

// const profileBoxTimeout = null; // Declare a timeout variable

// // Function to show the profile box
// function showProfileBox() {
//   clearTimeout(profileBoxTimeout); // Clear any existing timeout
//   profileBox.style.display = "block";
// }

// // Function to hide the profile box with a delay
// function hideProfileBox() {
//   profileBoxTimeout = setTimeout(() => {
//     profileBox.style.display = "none";
//   }, 500); // Adjust the delay time (in milliseconds) as needed
// }

// Add an event listener for mouseenter (hover) on the profile icon
profileIcon.addEventListener("mouseenter", showProfileBox);

// Add an event listener for mouseleave on the profile icon
profileIcon.addEventListener("mouseleave", hideProfileBox);

// Add an event listener for mouseenter on the profile box
profileBox.addEventListener("mouseenter", showProfileBox);

// Add an event listener for mouseleave on the profile box
profileBox.addEventListener("mouseleave", hideProfileBox);

const basicInfoOption = document.querySelector(".basicinfoop");
const skillsOption = document.querySelector(".skillsop");
const otherOption = document.querySelector(".otherop");

// Function to navigate to the corresponding page
function navigateToPage(pageId) {
  // Build the URL of the page based on the pageId
  const pageUrl = `${pageId}.html`; // Change the file extension if needed

  // Navigate to the page
  window.location.href = pageUrl;
}

// Add click event listeners to the profile box options
basicInfoOption.addEventListener("click", () => navigateToPage("basicinfo"));
skillsOption.addEventListener("click", () => navigateToPage("skills"));
otherOption.addEventListener("click", () => navigateToPage("other"));
