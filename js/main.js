// global functions

// navbar
let navbarList = document.getElementById("nav-list");
let sideNavbar = document.getElementById("side-navbar");
if (navbarList && sideNavbar) {
  let sideNavbarItems = [].slice.call(sideNavbar.children);
  sideNavbarItems.push(sideNavbarItems[0].firstElementChild);
  for (let index = 0; index < sideNavbarItems[1].children.length; index++) {
    sideNavbarItems.push(sideNavbarItems[1].children[index]);
    sideNavbarItems.push(sideNavbarItems[1].children[index].firstElementChild);
  }
  window.addEventListener("click", function (e) {
    if (
      e.target == navbarList ||
      e.target == navbarList.firstElementChild ||
      e.target == navbarList.firstElementChild.firstElementChild ||
      sideNavbarItems.includes(e.target) ||
      e.target == sideNavbar
    ) {
      openleftnav();
    } else {
      navbarList.setAttribute("data-leftnav", "close");
      sideNavbar.setAttribute("data-leftnav", "close");
    }
  });
  let startX = undefined;
  let endX = undefined;
  function phoneNav2(e) {
    endX = e.changedTouches[0].screenX;
    if (endX < startX - 100) {
      openleftnav();
    } else {
      navbarList.setAttribute("data-leftnav", "close");
      sideNavbar.setAttribute("data-leftnav", "close");
    }
  }
  function phoneNav(e) {
    startX = e.changedTouches[0].screenX;
    addEventListener("touchend", phoneNav2);
  }

  addEventListener("touchstart", phoneNav);

  function openleftnav() {
    navbarList.setAttribute("data-leftnav", "open");
    sideNavbar.setAttribute("data-leftnav", "open");
  }
}

// home
let posts = $('[data-role="post"');
if (posts) {
  let postsArr = $.map(posts, function (value, key) {
    return { key: key, value: value };
  });
  postsArr.forEach((element, i) => {
    let post = element.value;
    let index = i + 1;
    if (
      post.offsetHeight < post.scrollHeight ||
      post.offsetWidth < post.scrollWidth
    ) {
      $(`#showMoreLess-${index}`).removeClass("d-none");
      $(`#post-${index}`).data("truncated", "true");
      $(`#showMoreLess-${index}`).on("click", function () {
        if ($(`#post-${index}`).data("truncated") == "true") {
          $(`#post-${index}`).removeClass("post-caption");
          $(`#post-${index}`).data("truncated", "false");
          $(`#showMoreLess-${index}`).text("Show Less");
        } else {
          $(`#post-${index}`).addClass("post-caption");
          $(`#post-${index}`).data("truncated", "true");
          $(`#showMoreLess-${index}`).text("Show More");
        }
      });
    } else {
      $(`#showMoreLess-${index}`).addClass("d-none");
    }
  });
  let likeSVGs = $('[data-role="liked-post-svg"]');
  $.each(likeSVGs, (i, likeSVG) => {
    $(likeSVG).on("click", (e) => {
      let postID = $(likeSVG).attr("data-post-id");
      if ($(likeSVG).attr("data-is-liked") == "unliked") {
        $(`#liked-post-${postID}`).removeClass("d-none");
        $(`#unliked-post-${postID}`).addClass("d-none");
      } else {
        $(`#unliked-post-${postID}`).removeClass("d-none");
        $(`#liked-post-${postID}`).addClass("d-none");
      }
    });
  });
}

// call delivery
if ($("#call-delivery-title")) {
  let materialsList = [
    "paper",
    "plastic",
    "glass",
    "metal",
    "textiles",
    "electronics",
  ];
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
    if (materialsList.includes(material)) {
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
  function selectPics(type) {
    let typemin = type.toLowerCase();
    let picfordeliveryID = 0;
    $(`#picsFor${type}`).change(function () {
      let selectedPictures = this.files;
      let selectedPicturesArr = $.map(selectedPictures, function (value, key) {
        return { key: key, value: value };
      });
      let picturesToAdd;
      if (selectedPictures.length > 0) {
        if (
          $(`#picsFor${type}Container`).children().length +
            selectedPictures.length >
          10
        ) {
          picturesToAdd = selectedPicturesArr.slice(
            0,
            10 - $(`#picsFor${type}Container`).children().length
          );
        } else {
          picturesToAdd = selectedPicturesArr;
        }
        picturesToAdd.forEach((picture) => {
          let file = picture.value;
          if (file.type && file.type.indexOf("image") !== -1) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              picfordeliveryID++;
              let image = `<div id="picfor${typemin}-${picfordeliveryID}" class="col-4 square-container position-relative"
          >
          <img
            src="${e.target.result}"
            alt="${file.name}"
            class="square-image"
          />
          <svg
            class="remove-pic-svg position-absolute bg-light overflow-hidden rounded-circle"
            id="remove-picfor${typemin}-${picfordeliveryID}"
            data-idnbr="${picfordeliveryID}"
            data-role="remove-picfor${typemin}"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
            />
          </svg>
        </div>`;
              $(`#picsFor${type}Container`).append(image);
            };
          }
        });
      }
    });
  }
  selectPics("Delivery");
  selectPics("Post");
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
  $("#picsForPostContainer").on("DOMSubtreeModified", function () {
    refreshRemovepicforpost();
  });
  function refreshRemovepicforpost() {
    $('[data-role="remove-picforpost"]').each(function () {
      $(this).on("click", function () {
        $(`#picforpost-${$(this).attr("data-idnbr")}`).remove();
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
  function passToSelectCompany() {
    let formData = {
      materialType: "",
      materialSubType: "",
      materialWeight: "",
      location: "",
      notes: "",
    };
    // add the append of images here
    $.ajax({
      url: "your_backend_endpoint", // Replace with your backend endpoint
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        // change to selectCompany
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  }
  $("#passToSelectCompany").on("click", function () {
    passToSelectCompanyPage();
  });
}
// select company
if ($("#select-company-title")) {
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
  ];
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
    }
  });
}
// confirm mail
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
  let confirmDoneBtn = $("#confirm-mail-done-btn");
  confirmCodeBtn.on("click", () => {
    // backend
  });
  confirmDoneBtn.on("click", () => {
    window.location.href = "./home.html";
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
// edit profile
if ($("#edit-profile-picture-input")) {
  function enableSaveBtn() {
    $("#save-changes-btn").attr("disabled", false);
  }
  $("#edit-profile-picture-input").change(function () {
    let selectedPictures = this.files;
    let selectedPicturesArr = $.map(selectedPictures, function (value, key) {
      return { key: key, value: value };
    });
    if (selectedPictures.length == 1) {
      selectedPicturesArr.forEach((picture) => {
        let file = picture.value;
        if (file.type && file.type.indexOf("image") !== -1) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (e) {
            $("#profile-picture").attr("src", e.target.result);
            $("#profile-picture").attr("alt", file.name);
            enableSaveBtn();
          };
        }
      });
    }
  });
  $("#update-fullname-btn").on("click", () => {
    let newName =
      $("#update-firstname").val() + " " + $("#update-lastname").val();
    $("#current-fullname1").html(newName);
    $("#current-fullname2").html(newName);
    enableSaveBtn();
  });
  $("#update-phone-btn").on("click", () => {
    let newPhone = $("#update-phone").val();
    $("#current-phone").html(newPhone);
    enableSaveBtn();
  });
  $("#update-birthdate-btn").on("click", () => {
    let newBirthdate = $("#update-birthdate").val();
    $("#current-birthdate").html(newBirthdate);
    enableSaveBtn();
  });
  $("#update-address-btn").on("click", () => {
    let newAddress = $("#update-address").val();
    $("#current-address").html(newAddress);
    enableSaveBtn();
  });
  $("#bioEdit").on("change", () => {
    enableSaveBtn();
  });
  $("#confirm-changes-btn").on("click", () => {
    window.location.href = "./profile.html";
  });
  $("#confirm-desactivate-btn").on("click", () => {
    window.location.href = "./index.html";
  });
  $("#confirm-remove-btn").on("click", () => {
    window.location.href = "./index.html";
  });
}
// Profile
$("#passToEditProfile").on("click", () => {
  window.location.href = "./edit-profile.html";
});

// index
$("#joinourcommunity").on("click", () => {
  window.location.href = "./signup.html";
});

// new password
$("#confirm-password-change-done-btn").on("click", () => {
  window.location.href = "./home.html";
});

// service
$("#confirm-refuse-btn").on("click", () => {
  window.location.href = "./home.html";
});

$("#confirm-accept-btn").on("click", () => {
  window.location.href = "./home.html";
});

// sign
$("#signin-signin-btn").on("click", () => {
  window.location.href = "./home.html";
});

$("#signin-signup-btn").on("click", () => {
  window.location.href = "./signup.html";
});

$("#signup-signup-btn").on("click", () => {
  window.location.href = "./signup-details.html";
});

$("#signup-create-account-btn").on("click", () => {
  window.location.href = "./confirm-mail.html";
});

$("#signcompany-signup-btn").on("click", () => {
  window.location.href = "./signup-details-company.html";
});

$("#signcompany-create-account-btn").on("click", () => {
  window.location.href = "./confirm-mail.html";
});

// js errors
function errorCheck(
  condition,
  id,
  type,
  message,
  preventID = undefined,
  preventEvent = "click"
) {
  let isFullRequiredData;
  $(`#${preventID}`).on(preventEvent, () => {
    if (condition) {
      isFullRequiredData = false;
      errorRaise(id, type, message, (preventID = false));
    } else {
      isFullRequiredData = true;
      errorRaise(id, type, message, (preventID = true));
    }
  });
  return isFullRequiredData;
}
function errorRaise(
  id = undefined,
  type = undefined,
  message = undefined,
  prevent = false
) {
  let element = $(`#${id}`);
  if (prevent) {
    element.addClass("d-none");
    $(element.children()[1]).html();
  } else {
    element.removeClass("d-none");
    element.addClass(`text-${type}`);
    $(element.children()[1]).html(message);
  }
}
// errorRaise("signin-username-error", "danger", "test");

// map
if ($('#map')) {
let map;

async function initMap() {
  let marker;
  // The location of Uluru
  let latlng;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latlng = {lat: position.coords.latitude, lng: position.coords.longitude}
      // Use these coordinates to create the marker and center the map
    },
    (error) => {
      // Handle error (e.g., user denied permission)
      console.error("Error getting user location:", error);
    }
  );
  if ($('#select-location').length > 0 || $('#serviceAcceptConfirmed').length > 0) {
    latlng = {lat: 35.5446077, lng: 6.1596945}
  } else {
    latlng = {lat: 35.5484116, lng: 6.1698271}
  }
  
  
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
    $('#select-location').modal('hide');
    $('#location').val(`${newLat} - ${newLng}`)
  });

}
initMap()
}