$(document).ready(function () {
  $("#sendOTP").on("click", () => {
    $.ajax({
      url: "your_backend_endpoint",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      success: function (response) {
        window.location.href = "./confirm-mail.html";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
});
