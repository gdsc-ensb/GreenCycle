// call delivery
function getMaterials() {
  let materialsList;
  let subMaterialsList;
  $.ajax({
    url: "your_backend_endpoint",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    processData: false,
    contentType: false,
    success: function (response) {
      materialsList = response.data.materials; // list of materials { name: "Name", value: "name"}
      subMaterialsList = response.data.submaterials; // object of materials with array of submaterials
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
  return [materialsList, subMaterialsList];
}
function passToSelectCompany() {
  let fileInput = $("#picsForDelivery")[0];
  let formData = new FormData();
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append("files[]", fileInput.files[i]);
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
    materialType: $("#material-type").val(),
    materialSubType: $("#material-sub-type").val(),
    materialWeight: weight,
    location: location,
    notes: $("#note-for-delivery").val(),
  };
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }
  $.ajax({
    url: "your_backend_endpoint",
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      console.log(response.message);
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
passToSelectCompany();
$(document).ready(function () {
  //   let materialsList = getMaterials();
  let materialsList = [
    { name: "Paper", value: "paper" },
    { name: "Plastic", value: "plastic" },
    { name: "Glass", value: "glass" },
    { name: "Metal", value: "metal" },
    { name: "Textiles", value: "textiles" },
    { name: "Electronics", value: "electronics" },
  ]; // remove this after activating the API
  let MaterialSelect = $("#material-type");
  materialsList.forEach((material, i) => {
    MaterialSelect.append(
      `<option value="${material.value}">${material.name}</option>`
    );
  });
  let subMaterials;
  let subMaterialsList = {
    paper: [
      { name: "Carton", value: "carton" },
      { name: "White Office Paper", value: "white_office_paper" },
      { name: "Newspaper", value: "newspaper" },
      { name: "Magazines", value: "magazines" },
      { name: "Cardboard", value: "cardboard" },
    ],
    plastic: [
      { name: "PET (Polyethylene Terephthalate)", value: "PET" },
      { name: "HDPE (High-Density Polyethylene)", value: "HDPE" },
      { name: "PVC (Polyvinyl Chloride)", value: "PVC" },
      { name: "LDPE (Low-Density Polyethylene)", value: "LDPE" },
    ],
    glass: [
      { name: "Clear Glass", value: "clear_glass" },
      { name: "Green Glass", value: "green_glass" },
      { name: "Brown Glass", value: "brown_glass" },
    ],
    metal: [
      { name: "Aluminum", value: "aluminum" },
      { name: "Steel", value: "steel" },
      { name: "Copper", value: "copper" },
    ],
    textiles: [
      { name: "Clothing", value: "clothing" },
      { name: "Bedding", value: "bedding" },
      { name: "Shoes", value: "shoes" },
    ],
    electronics: [
      { name: "Computers", value: "computers" },
      { name: "Phones", value: "phones" },
      { name: "Appliances", value: "appliances" },
    ],
  };
  function getSubMaterials(material) {
    let subMaterialSelect = $("#material-sub-type");
    subMaterialSelect.html(
      "<option selected>Select the type of material first</option>"
    );
    if (
      materialsList.some(function (obj) {
        return obj.value === material;
      })
    ) {
      subMaterials = subMaterialsList[material];
      subMaterials.forEach((submaterial, i) => {
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
  }
  $("#material-type").change(function () {
    getSubMaterials($("#material-type")[0].value);
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
    let isFullRequiredData = true;
    let materialType = $("#material-type");
    if (materialType.val() == 0) {
      isFullRequiredData = false;
      errorRaise(
        "delivery-material-type-error",
        "danger",
        "Please Select material type"
      );
    } else {
      isFullRequiredData = true;
      errorRaise(
        "delivery-material-type-error",
        "danger",
        "Please Select material type",
        true
      );
    }
    let materialLocation = $("#location");
    if (materialLocation.val() == "") {
      isFullRequiredData = false;
      errorRaise(
        "delivery-location-error",
        "danger",
        "Please type your location"
      );
    } else {
      isFullRequiredData = true;
      errorRaise(
        "delivery-location-error",
        "danger",
        "Please type your location",
        true
      );
    }
    if (isFullRequiredData) {
      window.location.href = "./select-company.html";
    }
  }
  $("#passToSelectCompany").on("click", function () {
    passToSelectCompanyPage();
  });
});
