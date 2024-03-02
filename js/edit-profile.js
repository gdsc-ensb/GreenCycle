// edit profile
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
  $("#current-fullname1").text(
    data.profile.firstName + " " + data.profile.lastName
  );
  $("#current-fullname2").text(
    data.profile.firstName + " " + data.profile.lastName
  );
  $("#main-username1").text(data.profile.username);
  $("#bioEdit").text(data.profile.bio);
  $("#info-email").text(data.profile.email);
  $("#current-phone").text(data.profile.phone);
  $("#current-birthdate").text(data.profile.birthdate);
  $("#current-address").text(data.profile.address);
  let loggedIns = data.loggedIns;
  loggedIns.forEach((element) => {
    let loggedInChild = `
    <div class="d-flex flex-column">
      <div class="d-flex justify-content-between">
        <span>${element.name}</span>
        <span>${element.place}</span>
      </div>
      <div class="align-self-end small">${element.date}</div>
    </div>
    <hr class="m-0 p-0" />`;
    $("#logged-in").append(loggedInChild);
  });
}
$(document).ready(function () {
  // setAlldata(getAllData()); reactivate this when API done
  let newFirstName, newLastName, newPhone, newBirthdate, newAddress;
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
    newFirstName = $("#update-firstname").val();
    newLastName = $("#update-lastname").val();
    let newName = newFirstName + " " + newLastName;
    $("#current-fullname1").html(newName);
    $("#current-fullname2").html(newName);
    enableSaveBtn();
  });
  $("#update-phone-btn").on("click", () => {
    newPhone = $("#update-phone").val();
    $("#current-phone").html(newPhone);
    enableSaveBtn();
  });
  $("#update-birthdate-btn").on("click", () => {
    newBirthdate = $("#update-birthdate").val();
    $("#current-birthdate").html(newBirthdate);
    enableSaveBtn();
  });
  $("#update-address-btn").on("click", () => {
    newAddress = $("#update-address").val();
    $("#current-address").html(newAddress);
    enableSaveBtn();
  });
  $("#bioEdit").on("change", () => {
    enableSaveBtn();
  });
  $("#logout-all").on("click", () => {
    $.ajax({
      url: "your_backend_endpoint",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      success: function (response) {
        $("#logoutAll").modal("show");
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
  $("#confirm-changes-btn").on("click", () => {
    window.location.href = "./profile.html";
  });
  $("#save-changes-btn").on("click", () => {
    let fileInput = $("#edit-profile-picture-input")[0];
    let formData = new FormData();
    if (fileInput.files.length == 1) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("files[]", fileInput.files[i]);
      }
    }
    let data = {
      bio: $("#bioEdit").val(),
      firstName: newFirstName,
      lastName: newLastName,
      phone: newPhone,
      birthdate: newBirthdate,
      address: newAddress,
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
        $("#saveChanges").modal("show");
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
  $("#confirm-desactivate-btn").on("click", () => {
    window.location.href = "./index.html";
    $.ajax({
      url: "your_backend_endpoint",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      success: function (response) {
        window.location.href = "./index.html";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
  $("#confirm-remove-btn").on("click", () => {
    window.location.href = "./index.html";
    $.ajax({
      url: "your_backend_endpoint",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      success: function (response) {
        window.location.href = "./index.html";
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
});
