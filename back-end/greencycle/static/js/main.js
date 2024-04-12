// global functions
function getCSRFTokenCookie() {
  var csrfToken = null;
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("csrftoken=")) {
      csrfToken = cookie.substring("csrftoken=".length, cookie.length);
      break;
    }
  }
  return csrfToken;
}
function getCSRFToken() {
  return $("input[name='csrfmiddlewaretoken']").val()
}
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
// pictures preview
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
        $(`#picsFor${type}Container`).children().length > 10
      ) {
        picturesToAdd = selectedPicturesArr.slice(
          0,
          10
        );
      } else {
        picturesToAdd = selectedPicturesArr;
      }
      $(`#picsFor${type}Container`).html("");
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
// index
$("#joinourcommunity").on("click", () => {
  window.location.href = "/signup/";
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
