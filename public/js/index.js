//buttons
var signup = document.getElementById("signup");
var login = document.getElementById("login");

//regestration details
var email = document.getElementById("email");
var pass = document.getElementById("pass");
var username = document.getElementById("UserName");

//login details
var LoginEmail = document.getElementById("LoginEmail");
var LoginPass = document.getElementById("LoginPassword");
if (signup) {
  signup.addEventListener("click", () => {
    console.log("I am here");
    axios({
      method: "post",
      url: "http://localhost:5000/register",
      headers: {},
      data: {
        UserName: username.value,
        Email: email.value,
        Password: pass.value, // This is the body part
      },
    })
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  });
}
if (login) {
  login.addEventListener("click", (event) => {
    axios
      .get("http://localhost:5000/login")
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  });
}
