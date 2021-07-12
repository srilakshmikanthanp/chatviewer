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
    $("header nav").css('box-shadow', '0px 0px 0px var(--color-shadow)');
    $("footer").css('box-shadow', '0px 0px 0px var(--color-shadow)');
    $("#menu").slideDown();
  } else {
    btnicon.removeClass("fa-times").addClass("fa-bars");
    $("#menu").slideUp();
    $("header nav").css("box-shadow", "0px 0px 10px var(--color-shadow)");
    $("footer").css("box-shadow", "0px 0px 10px var(--color-shadow)");
  }
}

/**
 * @brief Add Chats
 */
function addChat(name, msg, time, loc) {
    var pos = loc == 'from' ? 'start' : 'end';
    var chat_box = $("#chat > div");
    var chat_msg = `
        <div class="col d-flex justify-content-${pos} my-2">
            <div class="${loc}">
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
    chat_box.append(chat_msg);
}

/**
 * @brief Load Chats
 */
function loadChatsFromFile(file) {
  addChat('John', 'Hello, May I view my chats now ?', 'now', 'from');
  addChat('Viewer', 'I am in under developing, Soon I will get ready.', 'now', 'to');
  addChat('John', "I can't Wait", 'now', 'from');
  addChat('Viewer', 'Thanks for intrest 😊', 'now', 'to');

  return true;
}

/**
 * @brief form file inpit
 */
function formfileInput(evt) {
  var filename = $("#file-input").val();

  if (loadChatsFromFile(filename)) {
    $("#menu").slideUp();
    $("header nav").css("box-shadow", "0px 0px 10px var(--color-shadow)");
    $("footer").css("box-shadow", "0px 0px 10px var(--color-shadow)");
    $("nav ul li button i").removeClass("fa-times").addClass("fa-bars");
  } else {
    alert("Unable to read file");
  }

  return false;
}

/**
 * @brief goto top
 */
function gotoTop(evt) {
  $("html, body").animate({scrollTop: 0}, 'fast');
}

/**
 * @brief goto down
 */
function gotoDown(evt) {
  $("html, body").animate({scrollTop: $(document).height()}, 'fast');
}

/**
 * @brief Scroll Event
 */
function scrollEvt(evt) {
  var docheight = $(document).height();
  var winheight = $(window).height();
  var scroll    = $(window).scrollTop();
  var delta     = 500;

  if(scroll < delta) {
    $('#upbtn').hide();
    $('#dnbtn').show();
  } else if((scroll + winheight + delta) > docheight) {
    $('#upbtn').show();
    $('#dnbtn').hide();
  } else {
    $('#upbtn').show();
    $('#dnbtn').show();
  }
}

/**
 * @brief main
 */
function main() {
  // Add Event Listeners
  $("nav ul li button").on("click", openCloseMenu);
  $("#filesubmit").on("click", formfileInput);
  $('#upbtn').on('click', gotoTop);
  $("#dnbtn").on('click', gotoDown);
  $(window).on('scroll', scrollEvt);

  // Initilize the page
  $("#upbtn").hide();
  $("#dnbtn").hide();
}

/**
 * @brief Initialize
 */
$(function () {
  main();
});
