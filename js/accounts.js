function signin() {
  let usernameOrEmail = $("#signin-mail-username").val();
  let password = $("#signin-password").val();
  $.ajax({
    url: "your_backend_endpoint",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: { usernameOrEmail: usernameOrEmail, password: password },
    success: function (response) {
      window.location.href = "./home.html";
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function signup() {
  let firstName = $("#signup-first-name").val();
  let lastName = $("#signup-last-name").val();
  let email = $("#signup-email").val();
  let password = $("#signup-password").val();
  let repassword = $("#signup-repassword").val();
  $.ajax({
    url: "your_backend_endpoint",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      repassword: repassword,
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
function signupDetails() {
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
  $("#signin-signin-btn").on("click", () => {
    window.location.href = "./home.html";
    // signin();
  });

  $("#signin-signup-btn").on("click", () => {
    window.location.href = "./signup.html";
  });

  $("#signup-signup-btn").on("click", () => {
    window.location.href = "./signup-details.html";
    // signup();
  });

  $("#signup-create-account-btn").on("click", () => {
    window.location.href = "./confirm-mail.html";
    signupDetails();
  });

  $("#signcompany-signup-btn").on("click", () => {
    window.location.href = "./signup-details-company.html";
    signupCompany();
  });

  $("#signcompany-create-account-btn").on("click", () => {
    window.location.href = "./confirm-mail.html";
    signupDetailsCompany();
  });
});
