// Copyright (c) 2021 Sri Lakshmi Kanthan P
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// load modules
import WhatsappAttacher from "./attach.js";
import WhatsappPraser from "./praser.js";
import Utility from "./utility.js";

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
    $("#formstatus").text("loading");
    $("#authors").prop("disabled", true);
    $("#formsubmit").prop("disabled", true);

    try {
        var file = $("#file-input").get(0).files[0];

        if (!(file instanceof File)) {
            $("#formstatus").text("Please Seleact a file");
            $("#authors").prop("disabled", false);
            $("#formsubmit").prop("disabled", false);
            return false;
        }

        var whPraser = new WhatsappPraser(file);
        var messages = await whPraser.getData();
        var whattach = new WhatsappAttacher(messages);

        await whattach.startattach();
    } catch (errorMessage) {
        $("#formstatus").text(errorMessage);
    }

    $("#formstatus").text("done");
    $("#authors").prop("disabled", false);
    $("#formsubmit").prop("disabled", false);
}

/**
 * form submit event
 */
function formSubmit(evt) {
    evt.preventDefault();
    $("#formstatus").text("loading");
    $("#authors").prop("disabled", true);
    $("#formsubmit").prop("disabled", true);

    var primaryauthor = $("#authors").val().trim();

    if (primaryauthor == "select") {
        $("#formstatus").text("Select a a valid Author");
        return false;
    }

    var messages = $("#msg-container > div");

    for (var message of messages) {
        var author = $(message).find("span.msg-person").text();

        if (author == primaryauthor) {
            var msgBlock = $(message).find(".msg-box-left");
            $(msgBlock).removeClass("msg-box-left").addClass("msg-box-right");
        } else {
            var msgBlock = $(message).find(".msg-box-right");
            $(msgBlock).removeClass("msg-box-right").addClass("msg-box-left");
        }
    }

    $("#formstatus").text("done");
    $("#authors").prop("disabled", false);
    $("#formsubmit").prop("disabled", false);
    $("#form-dialog").dialog("close");
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

    new WhatsappAttacher(
        Utility.getJSON("assets/default.json")
    ).startattach();

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
