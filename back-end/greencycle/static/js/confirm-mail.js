// confirm mail
function isValidDigit(value) {
  return /^\d$/.test(value);
}
const inputs = document.getElementById("inputs");
if (inputs) {
  $(document).ready(function () {
    $("#inputs input:first").focus();
  });

  inputs.addEventListener("input", function (e) {
    const target = e.target;
    const val = target.value;

    if (isNaN(val)) {
      target.value = "";
      return;
    }

    if (val != "") {
      const next = target.nextElementSibling;
      if (next) {
        next.focus();
      }
    }
  });

  inputs.addEventListener("keyup", function (e) {
    const target = e.target;
    const key = e.key.toLowerCase();

    if (key == "backspace" || key == "delete") {
      target.value = "";
      const prev = target.previousElementSibling;
      if (prev) {
        prev.focus();
      }
      return;
    }
  });
  let confirmCodeBtn = $("#confirm-code-btn");
  confirmCodeBtn.on("click", () => {
    let otpCode;
    let otpInput1 = $("#otp-input-1").val();
    let otpInput2 = $("#otp-input-2").val();
    let otpInput3 = $("#otp-input-3").val();
    let otpInput4 = $("#otp-input-4").val();
    if (
      isValidDigit(otpInput1) &&
      isValidDigit(otpInput2) &&
      isValidDigit(otpInput3) &&
      isValidDigit(otpInput4)
    ) {
      otpCode = parseInt(otpInput1 + otpInput2 + otpInput3 + otpInput4);
    }
    let data = {
      'user_otp': otpCode,
      'userID': $("#userID").val()
    }
    $.ajax({
      url: "/api/verify_otp/",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: data,
      success: function (response) {
        window.location.href = '/change_password/';
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
  let otpInputs = $('[data-role="otp-input"]');
  let isFilled = [false, false, false, false];
  let allTrue = false;
  $.each(otpInputs, function (i) {
    $(this).on("keyup", () => {
      $.each(otpInputs, function (j) {
        if ($(this).val() != "" && !isNaN($(this).val())) {
          isFilled[j] = true;
        } else {
          isFilled[j] = false;
        }
      });
      if ($.inArray(false, isFilled) === -1) {
        allTrue = true;
      } else {
        allTrue = false;
      }
      if (allTrue) {
        confirmCodeBtn.attr("disabled", false);
      } else {
        confirmCodeBtn.attr("disabled", true);
      }
    });
  });
}
