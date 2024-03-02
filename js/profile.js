// Profile
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
function setAlldata(data) {
  $("#profile-picture").attr("src", data.profile.profilePicture.src);
  $("#main-fullname").text(
    data.profile.firstName + " " + data.profile.lastName
  );
  $("#main-username").text(data.profile.username);
  $("#points").text(data.profile.points);
  $("#bio").text(data.profile.bio);
  let services = data.services;
  services.forEach((element) => {
    let serviceChild = `
    <div
        class="history-card rounded-3 w-100 p-2 d-flex flex-column gap-3"
    >
        <div class="d-flex gap-1">
        <span>Transmition with</span>
        <span class="fw-bold">${element.company.name}</span>
        </div>
        <div class="d-flex justify-content-between">
        <div class="w-75">Material type:</div>
        <div
            class="badge text-bg-primary fw-bold w-50 d-flex align-items-center justify-content-center"
        >
            <span>${element.service.materialType}</span>
        </div>
        </div>
        <div class="d-flex justify-content-between">
        <div class="w-75">Quantity:</div>
        <div
            class="badge text-bg-primary fw-bold w-50 d-flex align-items-center justify-content-center gap-1"
        >
            <span>${element.service.materialQty}</span><span>Kg</span>
        </div>
        </div>
        <div class="d-flex justify-content-between">
        <div class="w-75">Status:</div>
        <div
            class="badge text-bg-${element.service.statusBadge} fw-bold w-50 d-flex align-items-center justify-content-center gap-1"
        >
            <span>${element.service.status}</span>
        </div>
        </div>
        <div class="d-flex justify-content-end gap-1">
        <span>${element.service.date}</span> / <span>${element.service.time}</span>
        </div>
    </div>
    <hr />`;
    $("#logged-in").append(serviceChild);
  });
}
$(document).ready(function () {
  $("#passToEditProfile").on("click", () => {
    window.location.href = "./edit-profile.html";
  });
});
