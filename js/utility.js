// Copyright (c) 2021 Sri Lakshmi Kanthan P
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Utility class
 */
class Utility {
    /**
     * holds mime types
     */
    static #mimeTypes = Utility.#init();

    /**
     * static initializer
     */
    static #init() {
        var mimeTypes = null;

        $.ajax("/assets/mime.json", {
            async: false,
            success: (data) => {
                mimeTypes = data;
            }
        });

        return mimeTypes;
    }

    /**
     * generates randpm color
     */
    static randColor() {
        return (`
            rgb(
                ${Math.random() * 255},
                ${Math.random() * 255},
                ${Math.random() * 255}
            );
        `);
    }

    /**
     * get memi type with ext
     */
    static getMimeType(ext) {
        return Utility.#mimeTypes[ext];
    }

    /**
     * encodes text to html entities
     */
    static htmlEncode(str) {
        return (
            $("<div></div>")
            .text(str)
            .html()
            .replace(/\r?\n/g, "<br />")
            .replace(/ /g, "&nbsp;")
            .replace(
                /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g,
                '<a href="$1" target="_blank">$1</a>'
            )
            .replace(
                /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,
                '<a href="mailto:$1">$1</a>'
            )
        );
    }
}

// export
export default Utility;
