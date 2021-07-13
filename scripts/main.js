// Copyright (c) 2021 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * @brief Toggle Menu
 */
function openCloseMenu(evt) {
  var btnicon = $("nav ul li button i");

  if (btnicon.hasClass("fa-bars")) {
    btnicon.removeClass("fa-bars").addClass("fa-times");
    $("header nav").css("box-shadow", "0px 0px 0px var(--color-shadow)");
    $("footer").css("box-shadow", "0px 0px 0px var(--color-shadow)");
    $("#menu").slideDown();
  } else {
    btnicon.removeClass("fa-times").addClass("fa-bars");
    $("#menu").slideUp();
    $("header nav").css("box-shadow", "0px 0px 10px var(--color-shadow)");
    $("footer").css("box-shadow", "0px 0px 10px var(--color-shadow)");
  }
}

/**
 * @brief Read File Promise
 */
function readFile(file) {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader();

    fileReader.onload = function (evt) {
      resolve(evt.target.result);
    };

    fileReader.onerror = reject;

    fileReader.readAsText(file);
  });
}

/**
 * @brief Add Chats
 */
function addChat(name, msg, time) {
  var chat_box = $("#chat > div");
  var chat_msg = `
      <div class="d-flex my-2">
          <div id="msg-container">
              <div class="msg-person">
                  ${name}
              </div>
              <div class="msg-content">
                  ${msg}
              </div>
              <div class="msg-time">
                  ${time}
              </div>
          </div>
      </div>
  `;
  console.log(msg);
  chat_box.append(chat_msg).hide();
}

/**
 * @brief loads chat from txt
 */
function loadTxtFile(data) {
  return whatsappChatParser.parseString(data);
}

/**
 * @brief loads chat from zip
 */
function loadZipFile(data) {}

/**
 * @brief form file inpit
 */
async function formfileInput(evt) {
  $("#authors").prop("disabled", true);
  $("#formsubmit").prop("disabled", true);
  $("#chat > div").empty();
  $("#authors").empty();
  evt.preventDefault();

  try {
    let file = $("#file-input").get(0).files[0];

    if (!(file instanceof File)) {
      alert("Please select a file");
      return false;
    }

    let data = await readFile(file);

    if (file.name.endsWith(".txt")) {
      let messages = await loadTxtFile(data);
      let authors = [];

      for (msg of messages) {
        authors.push(msg.author);
      }

      authors = [...new Set(authors)].filter((item) => item != "System").sort();

      $("#authors").append(
        `<option value="select" selected>Select Primary Author</option>`
      );

      for (author of authors) {
        $("#authors").append(`<option value="${author}">${author}</option>`);
      }

      let HTMLencode = function (str) {
        return $("<div></div>").text(str).html()
                .replace(
                  /\r?\n/g,
                  "<br>"
                )
                .replace(
                  / /g,
                  "&nbsp;"
                )
                .replace(
                  /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g,
                  '<a href="$1" target="_blank">$1</a>'
                );
      };

      for (msg of messages) {
        if (authors.includes(msg.author)) {
          addChat(
            msg.author,
            HTMLencode(msg.message),
            msg.date.toLocaleString()
          );
        }
      }

      $("#authors").prop("disabled", false);
      $("#formsubmit").prop("disabled", false);
    } else if (file.name.endsWith(".zip")) {
      loadZipFile(data);
    } else {
      alert("File Type Not Supported");
      return;
    }
  } catch (error) {
    alert(error);
    return;
  }

  return;
}

/**
 * @brief Action for form submit
 */
function formSubmit(evt) {
  let primaryauthor = $("#authors").val();

  if (primaryauthor == "select") {
    alert("Select a valid Author");
    return false;
  }

  let chats = $("#chat > div > div");

  for (chat of chats) {
    let author = $(chat).find(".msg-person").text().trim();

    if (author != primaryauthor) {
      $(chat).addClass("justify-content-start");
      $(chat).find("#msg-container").addClass("from");
    } else {
      $(chat).addClass("justify-content-end");
      $(chat).find("#msg-container").addClass("to");
    }
  }

  twemoji.parse($("#chat").get(0));
  $("nav ul li button i").removeClass("fa-times").addClass("fa-bars");
  $("#menu").slideUp();
  $("header nav").css("box-shadow", "0px 0px 10px var(--color-shadow)");
  $("footer").css("box-shadow", "0px 0px 10px var(--color-shadow)");
  $("#chat > div").slideDown();

  return false;
}

/**
 * @brief goto top
 */
function gotoTop(evt) {
  $("html, body").animate({ scrollTop: 0 }, "fast");
}

/**
 * @brief goto down
 */
function gotoDown(evt) {
  $("html, body").animate({ scrollTop: $(document).height() }, "fast");
}

/**
 * @brief Scroll Event
 */
function scrollEvt(evt) {
  var docheight = $(document).height();
  var winheight = $(window).height();
  var scroll = $(window).scrollTop();
  var delta = 500;

  if (scroll < delta) {
    $("#upbtn").hide();
    $("#dnbtn").show();
  } else if (scroll + winheight + delta > docheight) {
    $("#upbtn").show();
    $("#dnbtn").hide();
  } else {
    $("#upbtn").show();
    $("#dnbtn").show();
  }
}

/**
 * @brief main
 */
function main() {
  // Add Event Listeners
  $("nav ul li button").on("click", openCloseMenu);
  $("#file-input").on("change", formfileInput);
  $("#formsubmit").on("click", formSubmit);
  $("#upbtn").on("click", gotoTop);
  $("#dnbtn").on("click", gotoDown);
  $(window).on("scroll", scrollEvt);

  // Initilize the page
  $("#upbtn").hide();
  $("#dnbtn").hide();
  $("#authors").prop("disabled", true);
  $("#formsubmit").prop("disabled", true);
}

/**
 * @brief Initialize
 */
$(function () {
  main();
  twemoji.parse($("body").get(0), {
    folder: 'svg',
    ext: '.svg',
    size: 16
  });
});
