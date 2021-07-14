// Copyright (c) 2021 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * @brief Random Color
 */
function randColor() {
  return (
    "rgb(" +
    Math.random() * 255 +
    "," +
    Math.random() * 255 +
    "," +
    Math.random() * 255 +
    ")"
  );
}

/**
 * @brief Slide menu Down
 */
function meduDown() {
  $("nav ul li button i").removeClass("fa-bars").addClass("fa-times");
  $("header nav").css("box-shadow", "0px 0px 0px var(--color-shadow)");
  $("footer").css("box-shadow", "0px 0px 0px var(--color-shadow)");
  $("#menu").slideDown();
}

/**
 * @brief Slide menu Up
 */
function menuUp() {
  $("#menu").slideUp();
  $("nav ul li button i").removeClass("fa-times").addClass("fa-bars");
  $("header nav").css("box-shadow", "0px 0px 10px var(--color-shadow)");
  $("footer").css("box-shadow", "0px 0px 10px var(--color-shadow)");
}

/**
 * @brief Toggle Menu
 */
function openCloseMenu(evt) {
  if ($("nav ul li button i").hasClass("fa-bars")) {
    meduDown();
  } else {
    menuUp();
  }
}

function htmlEncode(str) {
  return $("<div></div>")
    .text(str)
    .html()
    .replace(/\r?\n/g, "<br>")
    .replace(/ /g, "&nbsp;")
    .replace(
      /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g,
      '<a href="$1" target="_blank">$1</a>'
    )
    .replace(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,
      '<a href="mailto:$1">$1</a>'
    );
}

/**
 * @brief set mime type
 */
function getBlobwithMIME(blob, filename) {
  if (filename.endsWith(".webp")) {
    return blob.slice(0, blob.size, "image/webp");
  } else if (filename.endsWith(".jpg")) {
    return blob.slice(0, blob.size, "image/jpeg");
  } else if (filename.endsWith(".jpeg")) {
    return blob.slice(0, blob.size, "image/jpeg");
  } else if (filename.endsWith(".mp3")) {
    return blob.slice(0, blob.size, "audio/mp3");
  } else if (filename.endsWith(".opus")) {
    return blob.slice(0, blob.size, "audio/ogg");
  } else if (filename.endsWith(".mp4")) {
    return blob.slice(0, blob.size, "video/mp4");
  } else if (filename.endsWith(".webm")) {
    return blob.slice(0, blob.size, "video/webm");
  } else if (filename.endsWith(".ogv")) {
    return blob.slice(0, blob.size, "video/ogg");
  } else {
    return blob.slice(0, blob.size, "unknown");
  }
}

/**
 * @brief Encodes Media
 */
function mediaEncode(blob) {
  // if empty the error message
  if (blob == undefined) {
    return "<img src'${filename}' alt='error'/>";
  }

  // adds image
  let addImage = () => {
    let url = URL.createObjectURL(blob);
    return `<img src="${url}" id="msg-img"/>`;
  }

  // adds audio
  let addAudio = () => {
    let url = URL.createObjectURL(blob);
    return `
      <audio controls id="msg-aud">
      <source src="${url}" type="audio/mp3">
      <a href="${url}" target="_blank">
      You Browser Did not support audio so,
      Use This Link to Play audio</a>
      </audio>
    `;
  }
  
  // adds video
  let addVideo = () => {
    let url = URL.createObjectURL(blob);
    return `
      <video controls id="msg-vid">
          <source src="${url}" type="video/mp4">
          <a href="${url}" target="_blank">
          You Browser Did not support video so,
          Use This Link to Play Video</a>
      </video>
    `;
  }
  
  // adds unknown file
  let addFile = () => {
    let url = URL.createObjectURL(blob);
    return `
      <a href="${url}" target="_blank">
        <Unkown File Type>
      </a>
    `;
  }


  if (blob.type == "image/webp") {
    return addImage();
  } else if (blob.type == "image/jpeg") {
    return addImage();
  } else if (blob.type == "image/jpeg") {
    return addImage();
  } else if (blob.type == "audio/mp3") {
    return addAudio();
  } else if (blob.type == "audio/ogg") {
    return addAudio(); 
  } else if (blob.type == "video/mp4") {
    return addVideo();
  } else if (blob.type == "vodeo/webm") {
    return addVideo();
  } else {
    return addFile();
  }
}

/**
 * @brief Add Chats to DOM
 */
function addChat(name, msg, time, col) {
  $("#chat > div").append(
    `<div>
          <div id="msg-container">
              <div class="msg-person" style="color:${col}">
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
    `
  );
}

/**
 * @brief loads chat from txt
 */
async function loadTxtFile(file) {
  $("#authors").prop("disabled", true);
  $("#formsubmit").prop("disabled", true);
  $("#formstatus").text("Processing...");

  let data = await new Promise((resolve, reject) => {
    var fileReader = new FileReader();

    fileReader.onload = function (evt) {
      resolve(evt.target.result);
    };

    fileReader.onerror = reject;

    fileReader.readAsText(file);
  });

  let messages = await whatsappChatParser.parseString(data);
  let authors = [];

  for (let msg of messages) {
    msg.author = msg.author.trim();
    msg.message = msg.message.trim();
    msg.date = msg.date.toLocaleString();

    if (msg.author != "System") {
      authors.push({
        name: msg.author,
      });
    }
  }

  authors = authors
    .filter((author, index) => {
      return (
        authors.findIndex(function (a) {
          return a.name === author.name;
        }) === index
      );
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  for (let author of authors) {
    author.color = randColor();
  }

  for (let author of authors) {
    $("#authors").append(
      `<option value="${author.name}">${author.name}</option>`
    );
  }

  $("#chat").hide();

  for (let i = 0; i < messages.length; i++) {
    if (
      authors.find((author) => {
        return author.name == messages[i].author;
      })
    ) {
      addChat(
        messages[i].author,
        htmlEncode(messages[i].message),
        messages[i].date,
        authors.find((author) => author.name == messages[i].author).color
      );
    }
  }

  $("#authors").prop("disabled", false);
  $("#formsubmit").prop("disabled", false);
  $("#formstatus").text("Done");
}

/**
 * @brief loads chat from zip
 */
async function loadZipFile(file) {
  $("#authors").prop("disabled", true);
  $("#formsubmit").prop("disabled", true);
  $("#formstatus").text("Processing...");

  let zipfile = await JSZip().loadAsync(file);
  let maintxt = null;
  let promisemedia = {
    name: [],
    promisedata: [],
  };

  zipfile.forEach((relativepath, zipentry) => {
    if (zipentry.name.endsWith(".txt")) {
      if (maintxt == null) {
        maintxt = zipentry.async("string");
      } else {
        alert(`More than one .txt file in zip file!`);
        return false;
      }
    } else {
      promisemedia.name.push(zipentry.name);
      let blob = zipentry.async("blob");
      promisemedia.promisedata.push(blob);
    }
  });

  if (maintxt == null) {
    alert(`No .txt file in zip file!`);
  }

  maintxt.then((data) => {
      Promise.all(promisemedia.promisedata)
        .then(async (medias) => {
          let messages = await whatsappChatParser.parseString(data, {
            parseAttachments: true,
          });
          
          let medianames = promisemedia.name;
          let authors = [];

          for(let i = 0; i < medianames.length; i++) {
            medias[i] = getBlobwithMIME(medias[i], medianames[i]);
          }

          for (let msg of messages) {
            msg.author = msg.author.trim();
            msg.message = msg.message.trim();
            msg.date = msg.date.toLocaleString();

            if (msg.author != "System") {
              authors.push({
                name: msg.author,
              });
            }
          }

          authors = authors
            .filter((author, index) => {
              return (
                authors.findIndex(function (a) {
                  return a.name === author.name;
                }) === index
              );
            })
            .sort((a, b) => {
              return a.name.localeCompare(b.name);
            });

          for (let author of authors) {
            author.color = randColor();
          }

          for (let author of authors) {
            $("#authors").append(
              `<option value="${author.name}">${author.name}</option>`
            );
          }

          $("#chat").hide();

          for (let i = 0; i < messages.length; i++) {
            if (
              authors.find((author) => {
                return author.name == messages[i].author;
              })
            ) {
              if ("attachment" in messages[i]) {
                addChat(
                  messages[i].author,
                  mediaEncode(
                    medias[
                      medianames.findIndex((name) => {
                        return name.includes(messages[i].attachment.fileName);
                      })
                    ]
                  ),
                  messages[i].date,
                  authors.find((author) => author.name == messages[i].author)
                    .color
                );
              } else {
                addChat(
                  messages[i].author,
                  htmlEncode(messages[i].message),
                  messages[i].date,
                  authors.find((author) => author.name == messages[i].author)
                    .color
                );
              }
            }
          }
        })
        .catch((err) => {
          alert(`Error reading media files: ${err}`);
        });
    })
    .catch((error) => {
      alert(`Error reading .txt file: ${error}`);
    }).finally(() => {
      $("#authors").prop("disabled", false);
      $("#formsubmit").prop("disabled", false);
      $("#formstatus").text("Done");
    });
}

/**
 * @brief form file inpit
 */
async function formfileInput(evt) {
  $("#authors > option").not(":first").remove();
  $("#chat > div").empty();
  evt.preventDefault();

  try {
    let file = $("#file-input").get(0).files[0];

    if (!(file instanceof File)) {
      alert("Please select a file");
      return false;
    }

    if (file.name.endsWith(".txt")) {
      loadTxtFile(file);
    } else if (file.name.endsWith(".zip")) {
      loadZipFile(file);
    } else {
      alert("File Type Not Supported");
    }
  } catch (error) {
    alert(error);
  }

  return;
}

/**
 * @brief Action for form submit
 */
function formSubmit(evt) {
  evt.preventDefault();
  $("#formstatus").text("Processing...");
  let primaryauthor = $("#authors").val().trim();

  if (primaryauthor == "select") {
    alert("Select a valid Author");
    return false;
  }

  let chats = $("#chat > div > div");

  for (let chat of chats) {
    let author = $(chat).find(".msg-person").text().trim();

    if (author != primaryauthor) {
      $(chat).removeClass().addClass("d-flex my-2 justify-content-start");
      $(chat).find("#msg-container").removeClass().addClass("from");
    } else {
      $(chat).removeClass().addClass("d-flex my-2 justify-content-end");
      $(chat).find("#msg-container").removeClass().addClass("to");
    }
  }

  twemoji.parse($("#chat").get(0));

  $("#formstatus").text("Done");

  menuUp();

  $("#chat").show(1000);
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
    folder: "svg",
    ext: ".svg",
    size: 16,
  });
});
