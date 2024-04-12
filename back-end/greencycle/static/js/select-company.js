// select company
function getAllData() {
  $.ajax({
    url: "/api/get_all_companies/",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    success: function (response) {
      console.log(response);
      let companiesSelect = $("#delivery-company");
      response.forEach((company, i) => {
        if (i == 0) {
          companiesSelect.html(`<option value="${company.id}" selected>${company.name} - ${company.address}</option>`);
          $("#company-name").text(company.name);
          $("#company-address").text(company.address);
          $("#company-phone").text(company.phone_number);
          $("#company-email").text(company.user.email);
        } else {
          companiesSelect.append(`<option value="${company.id}">${company.name} - ${company.address}</option>`)
        }
      });
      $("#delivery-company").change(function () {
        response.forEach((company) => {
          if (company.id == $("#delivery-company").val()) {
            $("#company-name").text(company.name);
            $("#company-address").text(company.address);
            $("#company-phone").text(company.phone_number);
            $("#company-email").text(company.user.email);
            // $("#company-time").text(company.time);
            // let companyDays = $('[data-role="company-day"');
            // $.each(companyDays, function (index, companyday) {
            //   $(companyday).addClass("text-bg-secondary");
            //   $(companyday).removeClass("text-bg-success");
            // });
            // company.days.split("-").forEach((day) => {
            //   $.each(companyDays, function (index, companyday) {
            //     if (companyday.id.slice(-3) == day) {
            //       $(companyday).addClass("text-bg-success");
            //       $(companyday).removeClass("text-bg-secondary");
            //     }
            //   });
            // });
          }
        });
      });
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
$(document).ready(function () {
  getAllData();
  $("#confirm-delivery-btn").on("click", () => {
    let isFullRequiredData = true;
    if (isFullRequiredData) {
      $.ajax({
        url: "/api/call_company/",
        method: "POST",
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
        data: { company: $("#delivery-company").val(), order_id: $("#order_id").val() },
        success: function (response) {
          $("#callDeliveryConfirmed").modal("show");
        },
        error: function (xhr, status, error) {
          // Handle errors
          console.error("Error:", status, error);
        },
      });
    }
  });
  $("#confirm-delivery-done-btn").on("click", () => {
    window.location.href = '/profile/'
  });
});
