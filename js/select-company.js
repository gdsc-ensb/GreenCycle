// select company
function getAllData() {
  let AllData;
  $.ajax({
    url: "your_backend_endpoint",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    success: function (response) {
      AllData = response.data;
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
  return AllData;
}
$(document).readyState(function () {
  let tempCompaniesData = [
    {
      id: 1,
      name: "GreenCycle Solutions",
      wilaya: "Algiers",
      address: "Algiers - El-Casbah",
      phone: "+213666666666",
      email: "GreenCycle.Solution.contact@gmail.com",
      days: "Sun-Mon-Wed-Sat",
      time: "08:00 to 18:00",
    },
    {
      id: 2,
      name: "Eco Renewal Services",
      wilaya: "Algiers",
      address: "Algiers - Downtown",
      phone: "+213555555555",
      email: "Eco.Renewal.Services@gmail.com",
      days: "Mon-Tue-Thu-Sat",
      time: "08:00 to 18:00",
    },
    {
      id: 3,
      name: "Pure Earth Recycling",
      wilaya: "Algiers",
      address: "Algiers - Belouizdad",
      phone: "+213777777777",
      email: "Pure.Earth.Recycling@gmail.com",
      days: "Tue-Thu-Sat-Sun",
      time: "08:00 to 18:00",
    },
    {
      id: 4,
      name: "EcoHarbor Recyclers",
      wilaya: "Oran",
      address: "Oran - City Center",
      phone: "+213666666777",
      email: "EcoHarbor@gmail.com",
      days: "Mon-Wed-Fri-Sun",
      time: "09:00 to 20:00",
    },
    {
      id: 5,
      name: "OranGreen Waste Solutions",
      wilaya: "Oran",
      address: "Oran - Hai El Yasmine",
      phone: "+213555555888",
      email: "OranGreen.Waste.Solutions@gmail.com",
      days: "Tue-Thu-Sat-Sun",
      time: "08:00 to 18:00",
    },
    {
      id: 6,
      name: "RenewCycle Industries",
      wilaya: "Oran",
      address: "Oran - El Hamri",
      phone: "+213777777999",
      email: "RenewCycle.Industries@gmail.com",
      days: "Wed-Fri-Sat-Mon",
      time: "10:00 to 22:30",
    },
    {
      id: 7,
      name: "GreenInfinite Recycling Co.",
      wilaya: "Constantine",
      address: "Constantine - City Center",
      phone: "+213666666555",
      email: "GreenInfinite.Recycling.Co@gmail.com",
      days: "Thu-Sat-Mon-Wed",
      time: "08:00 to 18:00",
    },
    {
      id: 8,
      name: "Constant Renewables",
      wilaya: "Constantine",
      address: "Constantine - El-Khroub",
      phone: "+213555555444",
      email: "Constant.Renewables@gmail.com",
      days: "Sat-Mon-Wed-Fri",
      time: "08:00 to 18:00",
    },
    {
      id: 9,
      name: "EcoCatalyst Services",
      wilaya: "Constantine",
      address: "Constantine - Aïn Smara",
      phone: "+213777777333",
      email: "EcoCatalyst.Services@gmail.com",
      days: "Sun-Wed-Fri-Sat",
      time: "08:00 to 18:00",
    },
    {
      id: 10,
      name: "AquaReclaim Annaba",
      wilaya: "Annaba",
      address: "Annaba - El Bouni",
      phone: "+213666666333",
      email: "AquaReclaim.Annaba@gmail.com",
      days: "Mon-Wed-Fri-Sun",
      time: "08:00 to 18:00",
    },
    {
      id: 11,
      name: "OceanGreen Eco Solutions",
      wilaya: "Annaba",
      address: "Annaba - Sidi Amar",
      phone: "+213555555222",
      email: "OceanGreen.Eco.Solutions@gmail.com",
      days: "Tue-Thu-Sun-Mon",
      time: "08:00 to 18:00",
    },
    {
      id: 12,
      name: "RenewEarth Annaba",
      wilaya: "Annaba",
      address: "Annaba - Annaba Center",
      phone: "+213777777111",
      email: "RenewEarth.Annaba@gmail.com",
      days: "Wed-Fri-Sun-Tue",
      time: "08:00 to 18:00",
    },
    {
      id: 13,
      name: "Tlemcen Renewal Services",
      wilaya: "Tlemcen",
      address: "Tlemcen - City Center",
      phone: "+213666666222",
      email: "Tlemcen.Renewal.Services@gmail.com",
      days: "Thu-Sat-Sun-Tue",
      time: "08:00 to 18:00",
    },
    {
      id: 14,
      name: "EcoHarmony Recyclables",
      wilaya: "Tlemcen",
      address: "Tlemcen - El Fehoul",
      phone: "+213555555111",
      email: "EcoHarmony.Recyclables@gmail.com",
      days: "Fri-Sun-Tue-Thu",
      time: "08:00 to 18:00",
    },
    {
      id: 15,
      name: "GreenWave Tlemcen",
      wilaya: "Tlemcen",
      address: "Tlemcen - Mansourah",
      phone: "+213777777000",
      email: "GreenWave.Tlemcen@gmail.com",
      days: "Sat-Mon-Thu-Sun",
      time: "08:00 to 18:00",
    },
    {
      id: 16,
      name: "Setif Eco Renewables",
      wilaya: "Setif",
      address: "Setif - El-Eulma",
      phone: "+213666666999",
      email: "Setif.Eco.Renewables@gmail.com",
      days: "Sun-Tue-Thu-Sat",
      time: "08:00 to 18:00",
    },
    {
      id: 17,
      name: "RenewSetif Recycling Co.",
      wilaya: "Setif",
      address: "Setif - Ain Oulmene",
      phone: "+213555555666",
      email: "RenewSetif.Recycling.Co@gmail.com",
      days: "Mon-Wed-Fri",
      time: "08:00 to 18:00",
    },
    {
      id: 18,
      name: "GreenHorizon Solutions",
      wilaya: "Setif",
      address: "Setif - Ain Oulmene",
      phone: "+213555557666",
      email: "GreenHorizon.Recycling@gmail.com",
      days: "Mon-Wed-Fri",
      time: "08:00 to 18:00",
    },
  ]; // delete after activating API
  //   let tempCompaniesData = getAllData(); activate after API
  $("#delivery-company").change(function () {
    tempCompaniesData.forEach((company) => {
      if (company.id == $("#delivery-company").val()) {
        $("#company-name").text(company.name);
        $("#company-address").text(company.address);
        $("#company-phone").text(company.phone);
        $("#company-email").text(company.email);
        $("#company-time").text(company.time);
        let companyDays = $('[data-role="company-day"');
        $.each(companyDays, function (index, companyday) {
          $(companyday).addClass("text-bg-secondary");
          $(companyday).removeClass("text-bg-success");
        });
        company.days.split("-").forEach((day) => {
          $.each(companyDays, function (index, companyday) {
            if (companyday.id.slice(-3) == day) {
              $(companyday).addClass("text-bg-success");
              $(companyday).removeClass("text-bg-secondary");
            }
          });
        });
      }
    });
  });
  $("#confirm-delivery-done-btn").on("click", () => {
    let isFullRequiredData = true;
    if (isFullRequiredData) {
      window.location.href = "./home.html";
      $.ajax({
        url: "your_backend_endpoint",
        method: "POST",
        headers: {
          "X-CSRFToken": getCSRFToken(),
        },
        data: { company: $("#delivery-company").val() },
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
});
