// service
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
  if (data.service.pictures.length == 1) {
    $("#service-images").html(
      `<img src="${data.service.pictures[0].src}" alt="${data.service.pictures[0]}" />`
    );
  } else if (data.service.pictures.length > 1) {
    $("#service-images").html(
      `<div id="serviceCarousel" class="carousel slide">
            <div class="carousel-inner">
            </div>
            <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#serviceCarousel"
            data-bs-slide="prev"
            >
            <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
            ></span>
            <span class="visually-hidden">Previous</span>
            </button>
            <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#serviceCarousel"
            data-bs-slide="next"
            >
            <span
                class="carousel-control-next-icon"
                aria-hidden="true"
            ></span>
            <span class="visually-hidden">Next</span>
            </button>
        </div>`
    );
    for (let index = 0; index < data.service.pictures.length; index++) {
      let picture = data.service.pictures[index];
      if (index == 0) {
        $("#serviceCarousel .carousel-inner")
          .append(`<div class="carousel-item active">
        <img
          src="${picture.src}"
          class="d-block w-100"
          alt="${picture}"
        />
      </div>`);
      } else {
        $("#serviceCarousel .carousel-inner")
          .append(`<div class="carousel-item">
        <img
          src="${picture.src}"
          class="d-block w-100"
          alt="${picture}"
        />
      </div>`);
      }
    }
  }
  $("#material-type").text(data.service.type);
  $("#material-sous-type").text(data.service.subtype);
  $("#material-weight").text(data.service.weight);
  $("#material-address").text(data.service.address);
  $("#material-note").text(data.service.note);
}
$(document).ready(function () {
  // setAlldata(getAllData());
  $("#confirm-refuse-btn").on("click", () => {
    window.location.href = "./home.html";
    let problem = $("#service-problem").val();
    let problemDescription = $("#refuseNote").val();
    $.ajax({
      url: "your_backend_endpoint",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: { problem: problem, description: problemDescription },
      success: function (response) {
        window.location.href = "./home.html";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });

  $("#confirm-accept-btn").on("click", () => {
    window.location.href = "./home.html";
    let serviceDateTime = $("#service-final-datetime").val();
    let acceptDescription = $("#acceptNote").val();
    $.ajax({
      url: "your_backend_endpoint",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: { datetime: serviceDateTime, description: acceptDescription },
      success: function (response) {
        window.location.href = "./home.html";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
});
