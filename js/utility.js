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
    static #mimeTypes = Utility.getJSON("assets/mime.json");

    /**
     * static initializer
     */
    static getJSON(name) {
        var mimeTypes = null;

        $.ajax(name, {
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

    /**
     * delay funcetion
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * get media type with filename extension
     */
    static getmediatype(file) {
        switch (file.split(".").pop()) {
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "webp":
                return "image";
            case "mp4":
            case "webm":
                return "video";
            case "ogg":
            case "ogv":
            case "opus":
                return "audio";
            default:
                return "file";
        }
    }

    /**
     * url for blob
     */
    static getBlobURL(blob, mimeType) {
        blob = blob.slice(0, blob.size, mimeType);
        var url = URL.createObjectURL(blob);
        return url;
    }
}

// export
export default Utility;
