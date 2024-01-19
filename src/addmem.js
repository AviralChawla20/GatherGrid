document.addEventListener("DOMContentLoaded", function () {
  // Get the teamId parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get("teamId");
  const teamName = localStorage.getItem("teamName");
  const teamDesc = localStorage.getItem("teamDesc");
  const teamNameInput = document.querySelector(".team_names");
  const teamCodeInput = document.querySelector(".Team_Code");
  const teamDescTextarea = document.querySelector(".team_disc");
  teamNameInput.value = teamName || ""; // Replace with the actual property names
  teamCodeInput.value = teamId || ""; // Replace with the actual property names
  teamDescTextarea.value = teamDesc || ""; // Replace with the actual property names

  // Check if the teamId is available
  if (teamId) {
    // Use the teamId as needed, for example, fetch team members
    fetchTeamMembers(teamId);
  } else {
    console.error("TeamId parameter is missing.");
  }

  // Function to fetch and display team members
  function fetchTeamMembers(teamId) {
    // Assuming there is an API endpoint for fetching team members
    const teamMembersUrl = `https://team-xj4n.onrender.com/team_members?team_code=${teamId}`;

    // Make a request to fetch team members
    axios
      .get(teamMembersUrl)
      .then((response) => {
        const teamInfo = response.data;
        console.log(teamInfo);
        renderTeamInfo(teamInfo);
      })
      .catch((error) => {
        console.error("Error fetching team information:", error);
      });
  }

  // Function to render team information
  function renderTeamInfo(teamInfo) {
    // Assuming there is an array of team members in teamInfo.members
    const memberContainer = document.querySelector(".innermain2");

    teamInfo.forEach((memberName) => {
      const memberDiv = document.createElement("div");
      memberDiv.classList.add("member");

      // Display the member name
      const memberDetails = document.createElement("p");
      memberDetails.textContent = `${memberName}`;

      memberDiv.appendChild(memberDetails);
      memberContainer.appendChild(memberDiv);
    });
  }
});
