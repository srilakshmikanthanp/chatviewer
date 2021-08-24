// Copyright (c) 2021 Sri Lakshmi Kanthan P
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * prase the file
 */
class WhatsappPraser {
    /**
     * prase the txt file
     */
    async #prasetext() {
        // read data from file
        var data = await new Promise((resolve, reject) => {
            var fileReader = new FileReader();
        
            fileReader.onload = function (evt) {
              resolve(evt.target.result);
            };
        
            fileReader.onerror = reject;
        
            fileReader.readAsText(this.file);
        });

        // prase with paser
        return await whatsappChatParser.parseString(data);
    }

    /**
     * prase the zip file
     */
    async #prasezip() {
        // read the data from zip
        var zipData  = await (new JSZip()).loadAsync(this.file);
        var names = [];
        var datum = [];

        // let's load data
        zipData.forEach((relpath, entry) => {
            names.push(entry.name);
            datum.push(entry.async('blob'));
        });

        // promise all
        datum = await Promise.all(datum).then(datum => datum);

        // store the txt count
        var count = 0, pos = null;

        // count
        for(var i = 0; i < names.length; ++i) {
            if(names[i].endsWith(".txt")) {
                pos = i;
                ++count;
            }
        }

        // check all are well
        if(count != 1) {
            throw "Error in zip file";
        }

        // read messages
        var messages = await whatsappChatParser.parseString(
            await datum[pos].text(), {
                parseAttachments: true
        });

        // final setp
        for(var i = 0; i < messages.length; ++i) {
            if('attachment' in messages[i]) {
                var pos = names.findIndex(name => {
                    return name.includes(messages[i].attachment.fileName)
                });

                messages[i].attachment.blob = datum[pos];
            }
        }

        // done
        return messages;
    }

    /**
     * starts the prase
     */
    async #startprase() {
        if(this.file.name.endsWith(".txt")) {
           return await this.#prasetext();
        } else if(this.file.name.endsWith(".zip")) {
           return await this.#prasezip();
        } else {
           throw "File Type is Not Valid";
        }
    }

    /**
     * constructor
     * @param file file to prase
     */
    constructor(file) {
       this.file = file; 
    }

    /**
     * returns the data prased
     */
    async getData() {
        return await this.#startprase();
    }
}

// export the praser
export default WhatsappPraser;
