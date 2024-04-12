function getAllData(refresh = true) {
  $.ajax({
    url: "/api/get_posts/",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    success: function (response) {
      if (refresh) {
        $("#picsForPost").val("");
        $("#newPostCaption").val("");
        $("#newPost").modal("hide");
        $("#commentsContainer").html("");
        $("#repostsContainer").html("");
        $('#picsForPostContainer').html("");
        $("#postsContainer").html("")
      }
      setAlldata(response)
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function getTimeDifference(postDateTime) {
  // Convert postDateTime to a Date object
  const postDate = new Date(postDateTime);

  // Get the current time
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate - postDate;

  // Convert milliseconds to seconds, minutes, and hours
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Format the result based on different time intervals
  if (seconds < 60) {
    return seconds + "s ago";
  } else if (minutes < 60) {
    return minutes + "m ago";
  } else if (hours < 24) {
    return hours + "h ago";
  } else {
    return days + "d ago";
  }
}
function setComments(comments, index) {
  $(`#comment${index}`).html("");
  comments.forEach((comment) => {
    let commentMessage = `
      <div class="mb-2 d-flex gap-2">
          <div class="comment-profile-picture">
              <img
              src="${comment.user.userprofile ? comment.user.userprofile.picture ? comment.user.userprofile.picture : '/static/pictures/character.jpg' : '/static/pictures/character.jpg'}"
              alt="${comment.user.userprofile ? comment.user.userprofile.picture ? comment.user.userprofile.picture : '/static/pictures/character.jpg' : '/static/pictures/character.jpg'}"
              class="rounded-circle"
              />
          </div>
          <div class="d-flex flex-column">
              <span class="fw-bold small">${comment.user.first_name} ${comment.user.last_name}</span>
              <div class="small">
              ${comment.content}
              </div>
          </div>
      </div>
      `;
    $(`#comment${index}`).append(commentMessage);
  });
}
function setAlldata(posts) {
  posts.forEach((post, index) => {
    let timedifference = getTimeDifference(post.created_at);
    let isLiked = false;
    if (post.likes.includes(+$("#current_user").val())) {
      isLiked = true;
    }
    let postChild = `
    <div class="post d-flex flex-column gap-1 w-100">
        <div class="d-flex align-items-center gap-2">
            <div class="post-profile-picture">
                <img
                    src="${post.user.userprofile ? post.user.userprofile.picture ? post.user.userprofile.picture : '/static/pictures/character.jpg' : '/static/pictures/character.jpg'}"
                    alt="${post.user.userprofile ? post.user.userprofile.picture ? post.user.userprofile.picture : '/static/pictures/character.jpg' : '/static/pictures/character.jpg'}"
                    class="w-100 h-100 rounded-circle"
                />
            </div>
            <div class="d-flex flex-column">
                <span class="fw-bold">${post.user.first_name} ${post.user.last_name}</span
                ><span class="small">@${post.user.username}</span>
            </div>
            <div class="text-muted align-self-end text-end flex-grow-1">${timedifference}</div>
        </div>
        <div id="post-image${index}" class="post-image w-100 square-container-w100">
            
        </div>
        <p
        id="post-${index}"
        data-role="post"
        class="post-caption m-0 p-0 small"
        data-truncated
        >
            ${post.caption}
        </p>
        <div class="reactions w-100 d-flex gap-3">
            <div class="like" onclick="likePost(${post.id}, ${index})">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-100 ${isLiked ? 'd-none' : ''}"
                fill="currentColor"
                data-role="liked-post-svg"
                data-is-liked="unliked"
                id="unliked-post-${index}"
                data-post-id="${index}"
                viewBox="0 0 512 512"
                >
                    <path
                        d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
                    />
                </svg>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-100 text-danger ${isLiked ? '' : 'd-none'}"
                fill="currentColor"
                data-role="liked-post-svg"
                data-is-liked="liked"
                data-post-id="${index}"
                id="liked-post-${index}"
                viewBox="0 0 512 512"
                >
                    <path
                        d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
                    />
                </svg>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                id="comment-${index}"
                data-role="comment"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#comments${index}"
                data-role="open"
                viewBox="0 0 512 512"
            >
                <path
                d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"
                />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#repost${index}"
                data-role="open"
                viewBox="0 0 512 512"
            >
                <path
                d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"
                />
            </svg>
        </div>
        <span
        id="showMoreLess-${index}"
        class="small text-primary text-nowrap d-none"
        role="button"
        >Show More</span
        >
    </div>
    <hr />`;
    $("#postsContainer").append(postChild);
    let commentModal = `
    <div
      class="modal fade comments"
      id="comments${index}"
      tabindex="-1"
      aria-labelledby="commentsLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-scrollable d-flex align-items-end m-0 h-100"
      >
        <div class="modal-content">
          <div class="modal-header">
           <h1 class="modal-title fs-5 fw-bold" id="serviceType2Label">
             Comments
           </h1>
          </div>
          <div class="modal-body d-flex flex-column gap-2">
            <div id="comment${index}" class="comment-content d-flex flex-column gap-2 overflow-auto">
           
            </div>

            <hr class="mt-3 mb-0" />
            <div class="mb-2 d-flex align-items-center gap-2">
              <div class="comment-profile-picture">
                <img
                  src="${$("#profilePicture").val()}"
                  alt="${$("#profilePicture").val()}"
                  class="rounded-circle"
                />
              </div>
              <div class="flex-grow-1">
                <input
                  id="newComment${index}" 
                  type="text"
                  class="add-comment w-100"
                  placeholder="Add a comment"
                />
              </div>
              <div
               class="btn btn-primary d-flex justify-content-center align-items-center rounded-pill"
               id="sendComment${index}"
               onclick="sendComment(${post.id}, ${index})"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="send-comment"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    $('#commentsContainer').append(commentModal);
    if (post.images.length == 1) {
      let postPicture = `
      <img
          src="${post.images[0].image}"
          alt="${post.images[0].image}"
          class="square-image-w100"
      />
      `;
      $(`#post-image${index}`).append(postPicture);
    } else if (post.images.length > 1) {
      let postPicturesCarousel = `
      <div id="post-carousel${index}" class="carousel slide square-image-w100">
        <div id="post-carousel-inner${index}" class="carousel-inner square-image-w100">
          
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#post-carousel${index}"
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
          data-bs-target="#post-carousel${index}"
          data-bs-slide="next"
        >
          <span
            class="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
        `;
      $(`#post-image${index}`).append(postPicturesCarousel);
      post.images.forEach((picture, i) => {
        let postPicture = `
        <div class="carousel-item square-image-w100 ${i == 0 ? "active" : ""}">
          <img
            src="${picture.image}"
            class="d-block w-100 square-image-w100"
            alt="${picture.image}"
          />
        </div>
        `;
        $(`#post-carousel-inner${index}`).append(postPicture);
      });
    } else {
      $(`#post-image${index}`).addClass("d-none");
    }
    let comments = post.comments;
    setComments(comments, index);
    let repostModal = `
    <div
      class="modal fade"
      id="repost${index}"
      tabindex="-1"
      aria-labelledby="repostLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-body d-flex flex-column gap-4">
            <div>
              Do you want to repost this post? It will be shown on your profile
              for everyone
            </div>
            <div class="d-flex justify-content-end gap-2">
              <div
                class="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </div>
              <div id="repost${index}btn" onclick="rePost(${post.id}, ${index})" class="btn btn-primary px-4">Repost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    $('#repostsContainer').append(repostModal);
  });
}
function setServices() {
  $.ajax({
    url: "/api/get_services/",
    method: "GET",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    data: {},
    success: function (response) {
      response.forEach(service => {
        $("#notifications").append(`
        <li>
          <a
            href="/company_order/${service.id}"
            class="dropdown-item text-wrap"
            data-notification-status="${service.is_accepted == null ? 'not-read' : 'read'}"
          >
            <span class="fw-bold">${service.order.user.first_name} ${service.order.user.last_name} </span>ask for delivery
            of: ${service.order.weight}Kg of ${service.order.sub_material.name} - ${service.order.material.name}
          </a>
        </li>`);
      });
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function likePost(pk, index) {
  $.ajax({
    url: `/api/toggle_like/${pk}/`,
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    success: function (response) {
      console.log(response);
      $(`#liked-post-${index}`).toggleClass("d-none");
      $(`#unliked-post-${index}`).toggleClass("d-none");
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function sendComment(pk, index) {
  let commentMessage = $(`#newComment${index}`).val();
  if (commentMessage != '') {
    $.ajax({
      url: `/api/send_comment/${pk}/`,
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: { content: commentMessage },
      success: function (response) {
        console.log(response);
        $(`#newComment${index}`).val("");
        setComments(response, index);
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  }
}
function rePost(pk, index) {
  $.ajax({
    url: `/api/repost/${pk}/`,
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
    success: function (response) {
      console.log(response);
      $(`#repost${index}`).modal("hide");
      getAllData();
    },
    error: function (xhr, status, error) {
      // Handle errors
      console.error("Error:", status, error);
    },
  });
}
function hideCommentModal(index) {
  window.addEventListener('popstate', function(event) {
    event.preventDefault();
    alert("test");
    if (document.getElementById(`comments${index}`).style.display === 'block') {
      // Close the modal
      $(`#comments${index}`).modal("hide");
      // Prevent the default behavior (returning to the previous page)
      event.preventDefault();
    }
  });
}

$(document).ready(function () {
  getAllData();
  setServices();
  hideCommentModal(0);
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
    selectPics("Post");
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
  }
  // new post
  $("#shareNewPostBtn").on("click", () => {
    let fileInput = $("#picsForPost")[0];
    let formData = new FormData();
    if (fileInput.files.length >= 1) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("pictures", fileInput.files[i]);
      }
    }
    let caption = $("#newPostCaption").val();
    let data = {
      caption: caption,
    };
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    $.ajax({
      url: "/share_post/",
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        getAllData();
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error("Error:", status, error);
      },
    });
  });
  let scrollableDiv = document.getElementById("postsContainer");
  window.addEventListener('scroll', function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // getAllData(refresh=false);
      // uncomment it when after updating api 
    }
  });
});
