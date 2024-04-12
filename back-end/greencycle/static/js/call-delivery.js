// call delivery
function getMaterials() {
  $.ajax({
    url: "/api/get_materials/",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    processData: false,
    contentType: false,
    success: function (response) {
      console.log(response);
      setMaterials(response)
      setSubMaterials(response[0].value)
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function setSubMaterials(selected_material) {
  let subMaterialSelect = $("#material-sub-type");
  $.ajax({
    url: "/api/get_materials/",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    processData: false,
    contentType: false,
    success: function (response) {
      response.forEach(material => {
        if (material.value == selected_material) {
          material.sub_materials.forEach((submaterial, i) => {
            if (i == 0) {
              subMaterialSelect.html(
                `<option value="${submaterial.value}" selected>${submaterial.name}</option>`
              );
            } else {
              subMaterialSelect.append(
                `<option value="${submaterial.value}">${submaterial.name}</option>`
              );
            }
          });
        }
      });
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function setMaterials(materialsList) {
  let MaterialSelect = $("#material-type");
  materialsList.forEach((material, i) => {
    if (i == 0) {
      MaterialSelect.html(
        `<option selected value="${material.value}">${material.name}</option>`
      )
    } else {
      MaterialSelect.append(
        `<option value="${material.value}">${material.name}</option>`
      );
    }
  });
}
function passToSelectCompany() {
  let fileInput = $("#picsForDelivery")[0];
  let formData = new FormData();
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append("pictures", fileInput.files[i]);
  }
  let weight;
  if (!isNaN(parseFloat($("#material-weight").val()))) {
    weight = parseFloat($("#material-weight").val());
  }
  if ($("#weight-unit").val() == "Ton") {
    weight = weight * 1000;
  }
  let location = {
    type: "Point",
    coordinates: $("#location").val().split(" - "),
  };
  let data = {
    material: $("#material-type").val(),
    sub_material: $("#material-sub-type").val(),
    weight: weight,
    latitude: location.coordinates[0],
    longitude: location.coordinates[1],
    notes: $("#note-for-delivery").val(),
  };
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }
  $.ajax({
    url: "/api/create_delivery_order/",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      // console.log(response);
      window.location.href = "/select_company/" + response.id;
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
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
  getMaterials();
  $("#material-type").change(function () {
    setSubMaterials($("#material-type")[0].value);
  });
  selectPics("Delivery");
  $("#picsForDeliveryContainer").on("DOMSubtreeModified", function () {
    refreshRemovepicfordelivery();
  });
  function refreshRemovepicfordelivery() {
    $('[data-role="remove-picfordelivery"]').each(function () {
      $(this).on("click", function () {
        $(`#picfordelivery-${$(this).attr("data-idnbr")}`).remove();
      });
    });
  }
  function passToSelectCompanyPage() {
    let istypeset = true;
    let issubtypeset = true;
    let isweightset = true;
    let islocationset = true;
    let materialType = $("#material-type");
    if (materialType.val() == 0) {
      istypeset = false;
      errorRaise(
        "delivery-material-type-error",
        "danger",
        "Please Select material type"
      );
    } else {
      istypeset = true;
      errorRaise(
        "delivery-material-type-error",
        "danger",
        "Please Select material type",
        true
      );
    }
    let submaterialType = $("#material-sub-type");
    if (submaterialType.val() == 0) {
      issubtypeset = false;
      errorRaise(
        "delivery-submaterial-type-error",
        "danger",
        "Please Select material sub type"
      );
    } else {
      issubtypeset = true;
      errorRaise(
        "delivery-submaterial-type-error",
        "danger",
        "Please Select material sub type",
        true
      );
    }
    let materialLocation = $("#location");
    if (materialLocation.val() == "") {
      islocationset = false;
      errorRaise(
        "delivery-location-error",
        "danger",
        "Please type your location"
      );
    } else {
      islocationset = true;
      errorRaise(
        "delivery-location-error",
        "danger",
        "Please type your location",
        true
      );
    }
    let materialWeight = $("#material-weight");
    if (materialWeight.val() == "") {
      isweightset = false;
      errorRaise(
        "delivery-weight-error",
        "danger",
        "Please type material's weight"
      );
    } else {
      isweightset = true;
      errorRaise(
        "delivery-weight-error",
        "danger",
        "Please type material's weight",
        true
      );
    }
    if (istypeset && issubtypeset && isweightset && islocationset) {
      passToSelectCompany()
    }
  }
  $("#passToSelectCompany").on("click", function () {
    passToSelectCompanyPage();
  });
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      initMap(latlng)
      // Use these coordinates to create the marker and center the map
    },
    (error) => {
      // Handle error (e.g., user denied permission)
      latlng = {
        lat: 24.774265,
        lng: 46.738586,
      };
      console.error("Error getting user location:", error);
      initMap(latlng)
    }
  );
  
});
