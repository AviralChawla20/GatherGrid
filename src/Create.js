// import Cookies from "js-cookie";

document.getElementById("teamForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const teamCode = document.getElementById("ipteam_id").value;
  const teamName = document.getElementById("iptname").value;
  const projectDescription =
    document.getElementById("ipteam_description").value;
  const teamAdminEmail = document.getElementById("ipteam_admin_email").value;
  const teamAdminName = document.getElementById("ipteam_admin_name").value;

  const selectedSkills = document.getElementById("team_skill").value;
  // Cookies.set("teamCode", teamCode);
  // Cookies.set("userNamee", localStorage.getItem("name"));
  const data = {
    TeamCode: teamCode,
    TeamName: teamName,
    ProjectDescription: projectDescription,
    TeamAdminEmail: teamAdminEmail,
    TeamAdminName: teamAdminName,
    SkillsRequired: selectedSkills,
  };

  displayPreloader();

  fetch("http://localhost:1112/createTeam", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("API response:", responseData);
      hidePreloader();
      displaySuccessPopup();
      // we will Handle the API response here (e.g., display a success message)
    })
    .catch((error) => {
      console.error("Error:", error);
      hidePreloader();
      // we will Handle errors (e.g., display an error message)
    });
});

function displayPreloader() {
  const preloader = document.getElementById("preloader");
  const overlay = document.createElement("div");
  overlay.className = "overlay"; // Add the overlay class
  document.body.appendChild(overlay);
  preloader.style.display = "block";
}

// Function to hide the preloader and overlay
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  const overlay = document.querySelector(".overlay");
  preloader.style.display = "none";
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

// Function to display the success popup and overlay
function displaySuccessPopup() {
  const successPopup = document.getElementById("successPopup");
  const closeButton = document.getElementById("closeButton");
  const overlay = document.createElement("div");
  overlay.className = "overlay"; // Add the overlay class
  document.body.appendChild(overlay);
  successPopup.style.display = "block";
  closeButton.addEventListener("click", function () {
    window.location.href = "./main.html"; // Redirect to main.html
  });

  // Rest of your code...
}
// Function to hide the success popup and overlay
function hideSuccessPopup() {
  const successPopup = document.getElementById("successPopup");
  const overlay = document.querySelector(".overlay");
  successPopup.style.display = "none";
  if (overlay) {
    document.body.removeChild(overlay);
  }
}
