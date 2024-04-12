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
      sendLoginRequest(usernameOrEmail, password, user_position, redirect);
    }, function(error) {
      sendLoginRequest(usernameOrEmail, password, null, redirect);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
    sendLoginRequest(usernameOrEmail, password, user_position);
  }
}
function sendLoginRequest(usernameOrEmail, password, user_position, redirect) {
  $.ajax({
    url: "/accounts/login/",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: { username: usernameOrEmail, password: password, user_position: user_position, agent: navigator.userAgent },
    success: function (response) {
      if (response.status == 200) {
        if (redirect == "home") { 
          window.location.href = "/home/";
        } else {
          window.location.href = "/"+redirect;
        }
      }
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error(xhr);
      console.error(xhr.responseJSON.error);
      if (xhr.responseJSON.error == "Invalid user") {
        errorRaise(
          id = "signin-username-error",
          type = "danger",
          message = "Username or password are not match",
          prevent = false
        )
      } else {
        errorRaise(
          id = "signin-username-error",
          type = "danger",
          message = "Username or password are not match",
          prevent = true
        )
      }
    },
  });
}
function signup() {
  isFnameValid = false;
  isLnameValid = false;
  isEmailValid = false;
  isPasswordValid = false;
  let firstName = $("#signup-first-name").val();
  let lastName = $("#signup-last-name").val();
  let email = $("#signup-email").val();
  let password = $("#signup-password").val();
  let repassword = $("#signup-repassword").val();
  if (firstName == "") {
    isFnameValid = false
    errorRaise(
      id = "signup-fname-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isFnameValid = true
    errorRaise(
      id = "signup-fname-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (lastName == "") {
    isLnameValid = false
    errorRaise(
      id = "signup-lname-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isLnameValid = true
    errorRaise(
      id = "signup-lname-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (email == "") {
    isEmailValid = false
    errorRaise(
      id = "signup-email-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isEmailValid = true
    errorRaise(
      id = "signup-email-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (password == "" || password != repassword) {
    isPasswordValid = false
    errorRaise(
      id = "signup-repassword-error",
      type = "danger",
      message = "error in password",
      prevent = false
    )
  } else {
    isPasswordValid = true
    errorRaise(
      id = "signup-repassword-error",
      type = "danger",
      message = "error in password",
      prevent = true
    )
  }
  if (isFnameValid && isLnameValid && isEmailValid && isPasswordValid) {
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
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseJSON);
        for (const key in xhr.responseJSON) {
          console.log(key);
          let errorAlert = `<div class="alert alert-danger" role="alert"><span class="fw-bold">${key}:</span> ${xhr.responseJSON[key]}</div>`;
          $("#errors").append(errorAlert);
        }
      },
    });
  }
  
}
function signupDetails() {
  isPhoneValid = false;
  isBirthValid = false;
  let phone = $("#signup-phone").val();
  let birthdate = $("#signup-birthdate").val();
  let address = $("#signup-address").val();
  if (phone == "") {
    isPhoneValid = false
    errorRaise(
      id = "signup-phone-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isPhoneValid = true
    errorRaise(
      id = "signup-phone-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (birthdate == "") {
    isBirthValid = false
    errorRaise(
      id = "signup-birth-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isBirthValid = true
    errorRaise(
      id = "signup-birth-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (isPhoneValid && isBirthValid) {
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
      },
      success: function (response, status) {
        if (status == "success") {
          window.location.href = "/profile/";
        }
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseJSON);
        for (const key in xhr.responseJSON) {
          console.log(key);
          let errorAlert = `<div class="alert alert-danger" role="alert"><span class="fw-bold">${key}:</span> ${xhr.responseJSON[key]}</div>`;
          $("#errors").append(errorAlert);
        }
      },
    });
  }
  
}
function signupCompany() {
  isnameValid = false;
  isemailValid = false;
  isphoneValid = false;
  isaddressValid = false;
  isPasswordValid = false;
  let name = $("#signup-name").val();
  let email = $("#signup-email").val();
  let password = $("#signup-password").val();
  let repassword = $("#signup-repassword").val();
  let phone = $("#signup-phone").val();
  let address = $("#signup-address").val();
  if (name == "") {
    isnameValid = false
    errorRaise(
      id = "signcompany-name-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isnameValid = true
    errorRaise(
      id = "signcompany-name-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (email == "") {
    isemailValid = false
    errorRaise(
      id = "signcompany-email-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isemailValid = true
    errorRaise(
      id = "signcompany-email-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (phone == "") {
    isphoneValid = false
    errorRaise(
      id = "signcompany-phone-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isphoneValid = true
    errorRaise(
      id = "signcompany-phone-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (address == "") {
    isaddressValid = false
    errorRaise(
      id = "signcompany-address-error",
      type = "danger",
      message = "This Field is required",
      prevent = false
    )
  } else {
    isaddressValid = true
    errorRaise(
      id = "signcompany-address-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (password == "" || password != repassword) {
    isPasswordValid = false
    errorRaise(
      id = "signcompany-repassword-error",
      type = "danger",
      message = "Error in password",
      prevent = false
    )
  } else {
    isPasswordValid = true
    errorRaise(
      id = "signcompany-repassword-error",
      type = "danger",
      message = "This Field is required",
      prevent = true
    )
  }
  if (isnameValid && isemailValid && isphoneValid && isPasswordValid) {
    $.ajax({
      url: "/accounts/create_company/",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: {
        name: name,
        email: email,
        password: password,
        phone_number: phone,
        address: address,
      },
      success: function (response) {
        signin(response.user.username, password, "home/");
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseJSON);
        for (const key in xhr.responseJSON) {
          console.log(key);
          let errorAlert = `<div class="alert alert-danger" role="alert"><span class="fw-bold">${key}:</span> ${xhr.responseJSON[key]}</div>`;
          $("#errors").append(errorAlert);
        }
      },
    });
  }
}
$(document).ready(function () {
  $("#signin-signup-btn").on("click", () => {
    window.location.href = "/signup/";
  });

  $("#signup-signup-btn").on("click", () => {
    signup();
  });

  $("#signup-create-account-btn").on("click", () => {
    signupDetails();
  });

  $("#signcompany-signup-btn").on("click", () => {
    signupCompany();
  });
});
