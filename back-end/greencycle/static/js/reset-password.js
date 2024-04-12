$(document).ready(function () {
  $("#sendOTP").on("click", () => {
    $.ajax({
      url: "/api/send_otp/",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: {email: $("#reset-password-email").val()},
      success: function (response) {
        $("#user_id").val(response.user_id);
        $("#otpForm").submit();
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
});
