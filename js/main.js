// Copyright (c) 2021 Sri Lakshmi Kanthan P
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// load modules
import WhatsappAttacher from "./attach.js";
import WhatsappPraser from "./praser.js";

/**
 * trigger the dialog box
 */
function triggerDialog(evt) {
    $("#form-dialog").dialog({
        show: true,
    });
}

/**
 * center the dialog
 */
function centerDialog(evt) {
    $("#form-dialog").dialog("option", "position", {
        my: "center",
        at: "center",
        of: window
    });
}

/**
 * on file change
 */
async function fileInput(evt) {
    evt.preventDefault();

    try {
        var file = $("#file-input").get(0).files[0];

        if (!(file instanceof File)) {
            $("#formstatus").text("Please Seleact a file");
            return false;
        }

        var whPraser = new WhatsappPraser(file);
        var messages = await whPraser.getData();
        var whattach = new WhatsappAttacher(messages);
        var authorid = $("#authors");
        var authors  = []
        
        for(var msg of messages) {
            if(!authors.includes(msg.author) && msg.author != "System") {
                authors.push(msg.author);
            }
        }

        $("#authors > option").not(":first").remove();

        for (var author of authors) {
            authorid.append(
              `<option value="${author}">${author}</option>`
            );
        }

        whattach.startattach();
    } catch (errorMessage) {
        $("#formstatus").text(errorMessage);
    }
}

/**
 * form submit event
 */
function formSubmit(evt) {
    evt.preventDefault();
}

/**
 * main function
 */
function main() {
    // initilize the page
    $("#form-dialog").dialog({
        show: true,
        title: "Choose Exported Chat",
        draggable: false,
        resizable: false,
        my: "center",
        at: "center",
        of: window,
        modal: true,
        width: "auto",
        open: function () {
            $('body').css("overflow", "hidden");
        },
        beforeClose: function () {
            $('body').css("overflow", "auto");
        }
    });

    // event listeners
    $(window).on("resize", centerDialog);
    $(".menu-btn").on("click", triggerDialog);
    $("#file-input").on("change", fileInput);
    $("#form-dialog").on("submit", formSubmit);
}

/**
 * on page load
 */
$(function () {
    var bootstrapButton = $.fn.button.noConflict();
    $.fn.bootstrapBtn = bootstrapButton;
    main();
    feather.replace();
});
