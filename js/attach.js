// Copyright (c) 2021 Sri Lakshmi Kanthan P
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// import modules
import Utility from "./utility.js";

/**
 * attach messages to DOM
 */
class WhatsappAttacher {
  /**
   * attach txt message to DOM
   */
  #atachtext(container, message) {
    container.append(`
      <div class="row">
        <div class="col-12">
          <div class="msg-box-left">
            <div class="msg-item-header">
              <span class="msg-person">${Utility.htmlEncode(message.author)}</span>
            </div>
            <div class="msg-item-body">
              <pre>${Utility.htmlEncode(message.message).trim()}</pre>
            </div>
            <div class="msg-footer">
              <span class="msg-time">${Utility.htmlEncode(message.date.toLocaleString())}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /**
   * attachs images
   */
  #attachimage(container, message) {
    var url = Utility.getBlobURL(
      message.attachment.blob,
      Utility.getMimeType(message.attachment.fileName.split(".").pop())
    );

    container.append(`
      <div class="row">
        <div class="col-12">
          <div class="msg-box-left">
            <div class="msg-item-header">
              <span class="msg-person">${Utility.htmlEncode(message.author)}</span>
            </div>
            <div class="msg-item-body">
              <img src="${url}" />
            </div>
            <div class="msg-footer">
              <span class="msg-time">${Utility.htmlEncode(message.date.toLocaleString())}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /**
   * attachs audio
   */
  #attachaudio(container, message) {
    var url = Utility.getBlobURL(
      message.attachment.blob,
      Utility.getMimeType(message.attachment.fileName.split(".").pop())
    );

    container.append(`
      <div class="row">
        <div class="col-12">
          <div class="msg-box-left">
            <div class="msg-item-header">
              <span class="msg-person">${Utility.htmlEncode(message.author)}</span>
            </div>
            <div class="msg-item-body">
              <audio controls="controls" src="${url}">
                <a href="${url}">${Utility.htmlEncode(message.attachment.fileName)}</a>
              </audio>
            </div>
            <div class="msg-footer">
              <span class="msg-time">${Utility.htmlEncode(message.date.toLocaleString())}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /**
   * attachs video
   */
  #attachvideo(container, message) {
    var url = Utility.getBlobURL(
      message.attachment.blob,
      Utility.getMimeType(message.attachment.fileName.split(".").pop())
    );

    container.append(`
      <div class="row">
        <div class="col-12">
          <div class="msg-box-left">
            <div class="msg-item-header">
                <span class="msg-person">${Utility.htmlEncode(message.author)}</span>
            </div>
            <div class="msg-item-body">
              <video controls="controls" src="${url}">
                <a href="${url}">${Utility.htmlEncode(message.attachment.fileName)}</a>
              </video>
            </div>
            <div class="msg-footer">
              <span class="msg-time">${Utility.htmlEncode(message.date.toLocaleString())}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /**
   * attach file
   */
  #attachfile(container, message) {
    var url = Utility.getBlobURL(
      message.attachment.blob,
      Utility.getMimeType(message.attachment.fileName.split(".").pop())
    );

    container.append(`
      <div class="row">
        <div class="col-12">
          <div class="msg-box-left">
            <div class="msg-item-header">
                <span class="msg-person">${Utility.htmlEncode(message.author)}</span>
            </div>
            <div class="msg-item-body">
              <a href="${url}">${Utility.htmlEncode(message.attachment.fileName)}</a>
            </div>
            <div class="msg-footer">
              <span class="msg-time">${Utility.htmlEncode(message.date.toLocaleString())}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  /**
   * attach media
   */
  #atachmedia(container, message) {
    var mediatype = Utility.getmediatype(message.attachment.fileName);

    switch (mediatype) {
      case "image":
        this.#attachimage(container, message);
        break;
      case "video":
        this.#attachvideo(container, message);
        break;
      case "audio":
        this.#attachaudio(container, message);
        break;
      default:
        this.#attachfile(container, message);
        break;
    }
  }

  /**
   * constructor
   * @param messages messages to be loaded
   */
  constructor(messages) {
    this.messages = messages;
  }

  /**
   * start attaching
   */
  async startattach() {
    var authorid = $("#authors");
    var authors = []

    for (var msg of this.messages) {
      if (!authors.includes(msg.author) && msg.author != "System") {
        authors.push(msg.author);
      }
    }

    $("#authors > option").not(":first").remove();

    for (var author of authors) {
      authorid.append(
        `<option value="${author}">${author}</option>`
      );
    }

    var container = $("#msg-container");

    container.empty();

    var onepersent = Math.floor(this.messages.length / 100);

    for (var i = 0; i < this.messages.length; i++) {
      var message = this.messages[i];

      if (message.author == "System") {
        continue;
      } else if (!("attachment" in message)) {
        this.#atachtext(container, message);
      } else {
        this.#atachmedia(container, message);
      }

      if( i % onepersent == 0) {
        
        console.log(i + ":" + this.messages.length);

        await Utility.delay(0);

        $("html, body").animate({
          scrollTop: $(document).height()
        }, 0);
      }
    }

    await Utility.delay(0);

    $("html, body").animate({
      scrollTop: $(document).height()
    }, 0);
  }
}

// export
export default WhatsappAttacher;
