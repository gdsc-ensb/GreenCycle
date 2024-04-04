function signin(usernameOrEmail = null, password = null, redirect = "home") {
  if (usernameOrEmail == null) {
    usernameOrEmail = $("#signin-mail-username").val();
  }
  if (password == null) {
    password = $("#signin-password").val();
  }
  let user_position = null;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      user_position = latitude + ":" + longitude;
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  console.log(user_position);
  console.log(navigator.userAgent);
  // $.ajax({
  //   url: "/accounts/login/",
  //   method: "POST",
  //   headers: {
  //     "X-CSRFToken": getCSRFToken(),
  //   },
  //   data: { username: usernameOrEmail, password: password, user_position: user_position, agent: navigator.userAgent },
  //   success: function (response) {
  //     console.log(response);
  //     if (response.status == 200) {
  //       if (redirect == "home") { 
  //         window.location.href = "/profile/"; // change this to  the home page after home is completed
  //       } else {
  //         window.location.href = "/"+redirect;
  //       }
  //     }
  //   },
  //   error: function (xhr, status, error) {
  //     // Handle errors
  //     console.error("Error:", status, error);
  //   },
  // });
}
function signup() {
  let firstName = $("#signup-first-name").val();
  let lastName = $("#signup-last-name").val();
  let email = $("#signup-email").val();
  let password = $("#signup-password").val();
  let repassword = $("#signup-repassword").val();
  if (password == repassword) {
    $.ajax({
      url: "/accounts/create_user/",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      },
      success: function (response) {
        // if (response.id){window.location.href = "/signup_details/"} else {console.log(response)}
        signin(response.user.username, password, "signup_details/");
        console.log(response);
      },
      error: function (xhr, status, error) {
        console.error(xhr);
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  } else {
    console.error("password error");
  }
}
function signupDetails() {
  let phone = $("#signup-phone").val();
  let birthdate = $("#signup-birthdate").val();
  let address = $("#signup-address").val();
  // let userID = $("#userID").val();
  $.ajax({
    url: "/accounts/create_profile/",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {
      phone_number: phone,
      birth_date: birthdate,
      address: address,
      // user: userID
    },
    success: function (response, status) {
      console.log(response);
      if (status == "success") {
        window.location.href = "/profile/";
      }
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function signupCompany() {
  let name = $("#signup-name").val();
  let email = $("#signup-email").val();
  let password = $("#signup-password").val();
  let repassword = $("#signup-repassword").val();
  let phone = $("#signup-phone").val();
  let address = $("#signup-address").val();
  $.ajax({
    url: "your_backend_endpoint",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {
      name: name,
      email: email,
      password: password,
      repassword: repassword,
      phone: phone,
      address: address,
    },
    success: function (response) {
      window.location.href = "./home.html";
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function signupDetailsCompany() {
  let phone = $("#signup-phone").val();
  let birthdate = $("#signup-birthdate").val();
  let address = $("#signup-address").val();
  $.ajax({
    url: "your_backend_endpoint",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {
      phone: phone,
      birthdate: birthdate,
      address: address,
    },
    success: function (response) {
      window.location.href = "./home.html";
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
$(document).ready(function () {
  $("#signin-signup-btn").on("click", () => {
    window.location.href = "./signup.html";
  });

  $("#signup-signup-btn").on("click", () => {
    signup();
  });

  $("#signup-create-account-btn").on("click", () => {
    signupDetails();
  });

  $("#signcompany-signup-btn").on("click", () => {
    window.location.href = "./signup-details-company.html";
    signupCompany();
  });

  $("#signcompany-create-account-btn").on("click", () => {
    // window.location.href = "./confirm-mail.html";
    signupDetailsCompany();
  });
});
