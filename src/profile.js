document.addEventListener("DOMContentLoaded", function () {
  const username = JSON.parse(localStorage.getItem("email"));
  console.log(username);
  const fullNameInput = document.querySelector(".fn input");
  // const lastNameInput = document.querySelector(".ln input");
  const emailinput = document.querySelector(".email input");
  const contactNumberElement = document.querySelector(".cn input");
  const organizationElement = document.querySelector(".orga input");
  const genderElements = document.querySelectorAll(".genra");
  const courseElements = document.querySelectorAll(".coursebox input");
  const specializationElement = document.querySelector(".sp input");

  const skillsSelect = document.getElementById("showskil");
  const linkedinlink = document.getElementById("Linkedin");
  const behancelink = document.getElementById("Behance");
  const githublink = document.getElementById("Github");
  const otherslink = document.getElementById("other1");
  // Select the skills data from the API response

  const napi = "https://profile-api-2wkq.onrender.com/profile";
  const urlWithParameters = `${napi}?email=${username}`;

  axios
    .get(urlWithParameters)
    .then((response) => {
      const userData = response.data;

      // Populate the input fields and other elements with user data
      fullNameInput.value = userData.name;
      emailinput.value = userData.email;
      contactNumberElement.value = userData.phone_number;
      organizationElement.value = userData.college_name;

      // Set the selected gender if available
      if (userData.gender) {
        genderElements.forEach((genderRadio) => {
          if (genderRadio.value === userData.gender) {
            genderRadio.checked = true;
          }
        });
      }

      if (userData.course) {
        courseElements.forEach((courseRadio) => {
          if (courseRadio.value === userData.course) {
            courseRadio.checked = true;
          }
        });
      }

      specializationElement.value = userData.specialization;
      const userSkills = userData.skills;
      console.log(userSkills);
      skillsSelect.textContent = userSkills;

      // Create an array of selected skill values
      // const selectedSkills = userSkills ? userSkills.split(",") : [];

      // // Iterate through each option in the select field
      // for (let i = 0; i < skillsSelect.options.length; i++) {
      //   const option = skillsSelect.options[i];

      //   // Check if the option's value is in the selectedSkills array
      //   if (selectedSkills.includes(option.value)) {
      //     option.selected = true;
      //   }
      // }
      linkedinlink.value = userData.linkedin;
      githublink.value = userData.github;
      behancelink.value = userData.behance;
      // otherslink.value=userData.other;
    })
    .catch((error) => {
      console.error("Error fetching user profile data:", error);
    });

  const basicInfo = document.querySelector(".basicinfoop");
  const other = document.querySelector(".otherop");
  const skill = document.querySelector(".skillsop");

  const Bsinfo = document.querySelector(".basicinfo");
  const Otinfo = document.querySelector(".other");
  const Skinfo = document.querySelector(".skills");

  basicInfo.addEventListener("click", function () {
    Bsinfo.classList.remove("active");
    Otinfo.classList.add("active");
    Skinfo.classList.add("active");
  });

  other.addEventListener("click", function () {
    Bsinfo.classList.add("active");
    Otinfo.classList.remove("active");
    Skinfo.classList.add("active");
  });

  skill.addEventListener("click", function () {
    Bsinfo.classList.add("active");
    Otinfo.classList.add("active");
    Skinfo.classList.remove("active");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve user data from localStorage
  // $("#skillchoose").chosen();
  const email = JSON.parse(localStorage.getItem("email"));
  const fname = JSON.parse(localStorage.getItem("name"));
  const udata = JSON.parse(localStorage.getItem("udata"));
  console.log(email, fname, udata);
  //console.log(udata.phone_number);

  // Function to send user data to the API using Axios
  function sendUserDataToAPI(data, apiUrl) {
    axios
      .post(apiUrl, data)
      .then(function (response) {
        console.log(response.data);
        // Handle the API response data as needed
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }

  // Basic Information Form
  const basicInfoForm = document.querySelector(".basicinfo form");
  if (basicInfoForm) {
    basicInfoForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission

      // Extract data from the Basic Information section
      const name = document.querySelector(".fn input").value;
      //const email = document.querySelector(".email input").value;
      const phone_number = document.querySelector(".cn input").value;
      const college_name = document.querySelector(".orga input").value;
      const gender = document.querySelector(
        "input[name='gender']:checked"
      ).value;
      const course = document.querySelector(
        "input[name='course']:checked"
      ).value;
      const specialization = document.querySelector(".sp input").value;
      const linkedin = udata.linkedin;

      const github = udata.github;
      const behance = udata.behance;
      const other = udata.other;
      const skills = udata.skills;

      // Define an object with the collected data
      const data = {
        name,
        email,
        phone_number,
        college_name,
        skills,
        course,
        specialization,
        gender,
        linkedin,
        github,
        behance,
        other,
      };

      const apiUrl = basicInfoForm.querySelector("#apiUrl").value;
      sendUserDataToAPI(data, apiUrl);
    });
  }

  // Others Form
  const othersForm = document.querySelector(".other form");
  if (othersForm) {
    othersForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission
      const name = udata.name;
      const phone_number = udata.phone_number;
      const college_name = udata.college_name;
      const gender = document.querySelector(
        "input[name='gender']:checked"
      ).value;
      const course = udata.course;
      const specialization = udata.specialization;
      const skills = udata.skills;
      // Extract data from the Others section
      const linkedin = document.querySelector(
        ".linkcontainer:nth-child(1) input"
      ).value;
      const github = document.querySelector(
        ".linkcontainer:nth-child(2) input"
      ).value;
      const behance = document.querySelector(
        ".linkcontainer:nth-child(3) input"
      ).value;
      const other = document.querySelector(
        ".linkcontainer:nth-child(4) input"
      ).value;

      // Define an object with the collected data
      const data = {
        name,
        email,
        course,
        gender,
        specialization,
        phone_number,
        college_name,
        skills,
        linkedin,
        github,
        behance,
        other,
      };

      const apiUrl = othersForm.querySelector("#apiUrl").value;
      sendUserDataToAPI(data, apiUrl);
    });
  }

  // Skills Form
  const skillsForm = document.querySelector(".skills form");
  if (skillsForm) {
    skillsForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission

      // Extract data from the Skills section
      const name = udata.name;
      const phone_number = udata.phone_number;
      const college_name = udata.college_name;
      const gender = document.querySelector(
        "input[name='gender']:checked"
      ).value;
      const course = udata.course;
      const specialization = udata.specialization;
      const linkedin = udata.linkedin;

      const github = udata.github;
      const behance = udata.behance;
      const other = udata.other;
      const skills = udata.skills; 
      //   const selectedSkills = document.querySelector('#skillchoose').selectedOptions;
      //   const selectedSkills = Array.from(document.querySelectorAll('#skillchoose option:checked')).map(option => option.value);
      //   const skills = Array.from(selectedSkills).map((option) => option.value);
      const selectedSkills = document.getElementById("skillchoose").value + ","+skills;
      console.log("Selected Skills:", selectedSkills);  

      // Define an object with the collected data
      const data = {
        name,
        email,
        course,
        gender,
        specialization,
        phone_number,
        college_name,
        skills: selectedSkills,
        linkedin,
        github,
        behance,
        other,
      };

      const apiUrl = skillsForm.querySelector("#apiUrl").value;

      function sendUserDataToAPI(data, apiUrl) {
        axios
          .post(apiUrl, data)
          .then(function (response) {
            console.log(response.data);
            // Handle the API response data as needed
            // Refresh the page after successful submission
            window.location.reload();
          })
          .catch(function (error) {
            console.error("Error:", error);
          });
      }
  
      sendUserDataToAPI(data, apiUrl);
      
    });
  }

  // const skillsForm = document.querySelector('.skills form');
  //   if (skillsForm) {
  //       //const saveSkillsButton = document.getElementById('saveSkills');

  //       skillsForm.addEventListener('submit', function () {
  //           // Extract data from the Skills section
  //           const selectedSkills = $("#skillchoose").chosen().val();

  //           // Define an object with the collected data
  //           const data = {
  //               skills: selectedSkills,
  //               email
  //           };

  //           const apiUrl = skillsForm.querySelector('#apiUrl').value;
  //           sendUserDataToAPI(data, apiUrl);
  //       });
  //     }
});