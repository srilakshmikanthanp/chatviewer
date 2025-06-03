// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { parseString, Message } from 'whatsapp-chat-parser';
import { IMsg } from '../types';
import { getMimeType, replaceSpace } from './functions';
import JSzip from 'jszip';

export default class WhatsappParser {
  // private attributes of parser
  private chatFile: Blob;

  // Utility To Create IMsg Object
  private createMsgObject(message: Message, media?: Blob): IMsg {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { message: message.message, author: message.author!, timestamp: message.date, media: media };
  }

  // implement Iterable For Zip File
  private async *iteratorForZipFile(): AsyncIterableIterator<IMsg> {
    // Create Media from Attachments
    const createMsgWithMedia = async (msg: Message): Promise<IMsg> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const fileName = msg.attachment!.fileName;
      const zipObj = zipFile.file(new RegExp(`${fileName}$`));

      // if no media found
      if(zipObj.length === 0) {
        throw new Error(`${fileName} Media not Found`);
      }

      // Get the Media
      const medBlob = await zipObj[0].async('blob');

      // remove status
      msg.message = msg.message.replace(/.+\(file attached\)/, '');

      // return Message
      return this.createMsgObject(msg, medBlob.slice(
        0, medBlob.size, getMimeType(fileName)
      ));
    }

    // Create a new JSZip object
    const zipFile = await JSzip.loadAsync(this.chatFile);

    // Get the chat file
    const files = zipFile.file(/.txt/);

    // Length of files
    if (files.length !== 1) {
      throw new Error('None or Multiple txt files found');
    }

    // Get the chat file
    const chatFile = await files[0].async('string');

    // create a new Whatsapp Parser
    const messages = await parseString(replaceSpace(chatFile), {
      parseAttachments: true
    });

    // Create IMsg object
    for (const message of messages) {
      if (message.author === null) {
        continue;
      }

      if (message.attachment) {
        yield await createMsgWithMedia(message);
      } else {
        yield this.createMsgObject(message);
      }
    }
  }

  // implement Iterable For Text File
  private async *iteratorForTextFile(): AsyncIterableIterator<IMsg> {
    for (const msg of await parseString(replaceSpace(await this.chatFile.text()))) {
      if(msg.author !== null) {
        yield this.createMsgObject(msg);
      }
    }
  }

  // constructor
  constructor(chatFile: Blob) { this.chatFile = chatFile; }

  // implement Iterable interface
  public iterator(): AsyncIterator<IMsg> {
    // check if mimetype is application/zip
    if (this.chatFile.type === 'application/zip') {
      return this.iteratorForZipFile();
    }

    // check if mimetype is text/plain
    if (this.chatFile.type === 'text/plain') {
      return this.iteratorForTextFile();
    }

    // throw error if mimetype is not supported
    throw new Error('Mimetype Must be txt/zip');
  }

  // implement Iterable interface
  public [Symbol.asyncIterator](): AsyncIterator<IMsg> {
    return this.iterator();
  }
}
