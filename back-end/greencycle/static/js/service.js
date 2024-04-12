// service
function getAllData() {
  $.ajax({
    url: `/api/get_company_order/${$("#current_order").val()}/`,
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    success: function (response) {
      console.log(response);
      setAlldata(response)
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function setAlldata(service) {
  if (service.order.pictures.length == 1) {
    $("#service-images").html(
      `<img src="${service.order.pictures[0].picture}" alt="${service.order.pictures[0].picture}" class="w-100" />`
    );
  } else if (service.order.pictures.length > 1) {
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
    for (let index = 0; index < service.order.pictures.length; index++) {
      let picture = service.order.pictures[index].picture;
      if (index == 0) {
        $("#serviceCarousel .carousel-inner")
          .append(`<div class="carousel-item active">
        <img
          src="${picture}"
          class="d-block w-100"
          alt="${picture}"
        />
      </div>`);
      } else {
        $("#serviceCarousel .carousel-inner")
          .append(`<div class="carousel-item">
        <img
          src="${picture}"
          class="d-block w-100"
          alt="${picture}"
        />
      </div>`);
      }
    }
  }
  $("#material-type").text(service.order.material.name);
  $("#material-sous-type").text(service.order.sub_material.name);
  $("#material-weight").text(service.order.weight);
  // $("#material-address").text(service.address);
  $("#material-note").text(service.order.notes);
  initMap({lat: +service.order.latitude, lng: +service.order.longitude}, markerChangeable = false)
}
let map;
async function initMap(latlng, markerChangeable = true) {
  let marker;
  // if (
  //   $("#select-location").length > 0 ||
  //   $("#serviceAcceptConfirmed").length > 0
  // ) {
  //   latlng = { lat: 35.5446077, lng: 6.1596945 };
  // } else {
  //   latlng = { lat: 35.5484116, lng: 6.1698271 };
  // }


  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: latlng,
    mapId: "DEMO_MAP_ID",
  });

  // The marker, positioned at Uluru
  if (latlng) {
    marker = new AdvancedMarkerElement({
      map: map,
      position: latlng,
      title: "Your Location",
    });
  }
  if (markerChangeable) {
    map.addListener("click", (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    // Move the existing marker to the clicked point
    if (marker) {
      // marker.setPosition(newLat, newLng);
      marker.setMap(null);
    }
    marker = new AdvancedMarkerElement({
      map: map,
      position: { lat: newLat, lng: newLng },
      title: "",
    });
    $("#select-location").modal("hide");
    $("#location").val(`${newLat} - ${newLng}`);
  });
  }
}
$(document).ready(function () {
  getAllData();
  $("#confirm-refuse-btn").on("click", () => {
    let problem = $("#service-problem").val();
    let problemDescription = $("#refuseNote").val();
    $.ajax({
      url: "/api/accept_refuse_order/",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: { order: $("#current_order").val(), problem: problem, description: problemDescription },
      success: function (response) {
        window.location.href = "/profile/";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });

  $("#confirm-accept-btn").on("click", () => {
    let serviceDateTime = $("#service-final-datetime").val();
    let acceptDescription = $("#acceptNote").val();
    $.ajax({
      url: "/api/accept_refuse_order/",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: { order: $("#current_order").val(), datetime: serviceDateTime, description: acceptDescription },
      success: function (response) {
        window.location.href = "/profile/";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
});
