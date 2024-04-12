// Profile
function getHistory() {
  $.ajax({
    url: "/api/get_history/",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    success: function (response) {
      console.log(response);
      setHistory(response)
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function setHistory(services) {
  let statusBadge = 'wanring';
  let statusText = 'No Company Yet';
  let points = 0;

  services.forEach((order) => {
    let datetime = new Date(order.modified)
    const year = datetime.getFullYear();
    // Add 1 to getMonth() because it returns zero-based month index
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');

    let order_date = `${year}-${month}-${day}`;
    let order_time = `${hours}:${minutes}`;
    if (order.company_companyorder) {
      if (order.status == 'c') {
        statusBadge = 'info';
        statusText = "Created";
        points = points + 10;
      } else if (order.status == 's') {
        statusBadge = 'info';
        statusText = "Started";
        points = points + 20;
      } else if (order.status == 'a') {
        statusBadge = 'success';
        statusText = 'Accepted';
        points = points + 50;
      } else if (order.status == 'r') {
        statusBadge = 'danger';
        statusText = 'Rejected';
        points = points + 30;
      } else if (order.status == 'd') {
        statusBadge = 'success';
        statusText = 'Delivered';
        points = points + 100;
      }
    }
    let serviceChild = `
    <div
        class="history-card rounded-3 w-100 p-2 d-flex flex-column gap-3"
    >
        <div class="d-flex gap-1">
        <span>Transmition with</span>
        <span class="fw-bold">${order.company_companyorder ? order.company_companyorder.company.name : 'Not Selected Yet'}</span>
        </div>
        <div class="d-flex justify-content-between">
        <div class="w-75">Material type:</div>
        <div
            class="badge text-bg-primary fw-bold w-50 d-flex align-items-center justify-content-center"
        >
            <span>${order.sub_material.name} - ${order.material.name}</span>
        </div>
        </div>
        <div class="d-flex justify-content-between">
        <div class="w-75">Quantity:</div>
        <div
            class="badge text-bg-primary fw-bold w-50 d-flex align-items-center justify-content-center gap-1"
        >
            <span>${order.weight}</span><span>Kg</span>
        </div>
        </div>
        <div class="d-flex justify-content-between">
        <div class="w-75">Status:</div>
        <div
            class="badge text-bg-${statusBadge} fw-bold w-50 d-flex align-items-center justify-content-center gap-1"
        >
            <span>${statusText}</span>
        </div>
        </div>
        <div class="d-flex justify-content-end gap-1">
        <span>${order_date}</span> / <span>${order_time}</span>
        </div>
    </div>
    <hr />`;
    $("#history-container").append(serviceChild);
  });
  $("#points").html(points)
}
$(document).ready(function () {
  getHistory();
  $("#passToEditProfile").on("click", () => {
    window.location.href = "/edit_profile/";
  });
});
