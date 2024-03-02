// new password
$(document).ready(function () {
  $("#confirm-password-change-done-btn").on("click", () => {
    window.location.href = "./home.html";
  });
  $("#update-password").on("click", () => {
    let data;
    let newPassword = $("#new-password").val();
    let newRepassword = $("#new-repassword").val();
    if (newPassword == newRepassword) {
      data = { newPassword: newPassword };
    }
    $.ajax({
      url: "your_backend_endpoint",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: data,
      success: function (response) {
        $("#passwordChangeConfirmed").modal("show");
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
});
