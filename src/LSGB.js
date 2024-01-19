// Parse the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const formType = urlParams.get("form"); // Get the value of the "form" parameter

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

const otpOverlay = document.getElementById("otpOverlay");
const submitOTPButton = document.getElementById("submitOTP");

let generatedOTP; // Variable to store the generated OTP

// Function to handle OTP submission
async function submitOTP() {
  const enteredOTP = document.getElementById("otpInput").value;

  // Check the entered OTP, and perform necessary actions
  if (enteredOTP.length === 6) {

    // Hide the OTP overlay
    otpOverlay.style.display = "none";
    console.log(enteredOTP)
    console.log(generatedOTP)

    // Check if the entered OTP is equal to the generated OTP
    if (String(enteredOTP) === String(generatedOTP)) {
      alert("OTP VERIFIED!!!")
      // Continue with the registration process or any other action
      try {

        window.location.href = "./LSGB.html";
        // Redirect to the login page after successful signup
        
      } catch (error) {
        document.getElementById("preLoader").style.display = "none";
        document.getElementById("pageOverlay").style.display = "none";
        console.error(error);

        // Handle login errors
        // ...
      }
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  } else {
    alert("Please enter a valid 6-digit OTP.");
  }
}

// Add event listener for the OTP submit button
submitOTPButton.addEventListener("click", submitOTP);

// Check the query parameter and display the appropriate form
if (formType === "signup") {
  wrapper.classList.add("active");
} else if (formType === "login") {
  wrapper.classList.remove("active");
}

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

document.getElementById("signup").addEventListener("submit", async function (e) {
  e.preventDefault();

  document.getElementById("preLoader").style.display = "block";
  document.getElementById("pageOverlay").style.display = "block";

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const terms = document.getElementById("terms").checked;
  const apiUrl = document.getElementById("apiUrl").value;

  // Generate a random 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000);

  const phonenumber = null;
  const collegename = null;
  const gender = null;
  const course = null;
  const specialization = null;
  const skills = null;
  const githubprofile = null;
  const linkedinprofile = null;
  const behancelink = null;
  const other = null;

  // Include OTP in the user data
  const userData = {
    name,
    email,
    phonenumber,
    password,
    collegename,
    terms,
    gender,
    course,
    specialization,
    skills,
    githubprofile,
    linkedinprofile,
    behancelink,
    other,
  };

  // Append OTP as a query parameter to the URL
  const apiUrlWithOTP = `${apiUrl}?otp=${generatedOTP}`;

  try {
    // Call the signup API with user data
    const response = await axios.post(apiUrlWithOTP, userData);
    document.getElementById("preLoader").style.display = "none";
    document.getElementById("pageOverlay").style.display = "none";

    console.log(response.data);
    // Handle successful signup, if needed

    // Show the OTP overlay
    otpOverlay.style.display = "flex";
  } catch (error) {
    document.getElementById("preLoader").style.display = "none";
    document.getElementById("pageOverlay").style.display = "none";
    console.error(error);

    // Handle signup errors
    if (error.response && error.response.status == 409) {
      // The email is already registered
      document.getElementById("Signupmsg").style.display = "block";
      // Handle this case as needed, for example, display a message to the user
    } else {
      // Other errors
      // Handle other error cases as needed
      // For example, display a generic error message to the user
    }
  }
});

document.getElementById("login").addEventListener("submit", async function (e) {
  e.preventDefault();

  document.getElementById("preLoader").style.display = "block";
  document.getElementById("pageOverlay").style.display = "block";

  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;
  const rememberPassword = document.getElementById("rememberPassword").checked;
  const loginApiUrl = document.getElementById("loginApiUrl").value;

  const loginData = {
    email: loginEmail,
    password: loginPassword,
    remember: rememberPassword,
  };

  try {
    const response = await axios.post(loginApiUrl, loginData);
    document.getElementById("preLoader").style.display = "none";
    document.getElementById("pageOverlay").style.display = "none";
    console.log(response.data);
    document.getElementById("loginmsg").style.display = "block";
    const username = loginData.email;

    const apiUrl = "https://profile-api-2wkq.onrender.com/profile"; // Replace with the base API URL
    const urlWithParameters = `${apiUrl}?email=${username}`;

    const profileResponse = await axios.get(urlWithParameters);
    const email1 = username;
    const name = profileResponse.data.name;
    const mobile = profileResponse.data.phone_number;
    localStorage.setItem("email", JSON.stringify(email1));
    localStorage.setItem("name", JSON.stringify(name));

    console.log(email1, name);
    console.log(profileResponse.data); // Now you can access profileResponse.data
    window.location.href = "./main.html";
  } catch (error) {
    document.getElementById("preLoader").style.display = "none";
    document.getElementById("pageOverlay").style.display = "none";
    console.error(error);
  }
});
