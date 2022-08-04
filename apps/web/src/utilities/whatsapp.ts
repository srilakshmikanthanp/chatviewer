// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { parseString } from 'whatsapp-chat-parser';
import { IMsg } from '../interfaces';
import JSzip, { file } from 'jszip';
import { fileTypeFromBuffer } from 'file-type';
import { Message } from 'whatsapp-chat-parser/types/types';

export default class WhatsappParser {
  // private attributes of parser
  private chatFile: Blob;

  // Utility To Create IMsg Object
  private createMsgObject(message: Message, media?: Blob): IMsg {
    return { message: message.message, author: message.author, timestamp: message.date, media: media };
  }

  // Utility To get the Media From Buffer
  private async getMedia(arrayBuffer: ArrayBuffer | undefined): Promise<Blob> {
    // check if arrayBuffer is undefined
    if (!arrayBuffer) { throw new Error('No Media Found'); }

    // get the file type from buffer
    const fileType = await fileTypeFromBuffer(arrayBuffer);

    // check if file type is undefined
    if (!fileType) { throw new Error('No Media Found'); }

    // return the media
    return new Blob([arrayBuffer], { type: fileType.mime });
  }

  // implement Iterable For Zip File
  private async *iteratorForZipFile(): AsyncIterableIterator<IMsg> {
    // Create a new JSZip object
    const zipFile = await JSzip.loadAsync(this.chatFile);

    // Get the chat file
    const files = zipFile.file(/.txt/);

    // Length of files
    if (file.length !== 1) {
      throw new Error('No or Multiple chat files found');
    }

    // Get the chat file
    const chatFile = await files[0].async('string');

    // create a new Whatsapp Parser
    const messages = await parseString(chatFile, {
      parseAttachments: true
    });

    // Create Media from Attachments
    const createMsgWithMedia = async (msg: Message): Promise<IMsg> => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const zipObj = zipFile.file(msg.attachment!.fileName);
      const buffer = await zipObj?.async('arraybuffer');
      const mMedia = await this.getMedia(buffer);
      return this.createMsgObject(msg, mMedia);
    }

    // Create IMsg object
    for (const message of messages) {
      if (message.attachment) {
        yield await createMsgWithMedia(message);
      } else {
        yield this.createMsgObject(message);
      }
    }
  }

  // implement Iterable For Text File
  private async *iteratorForTextFile(): AsyncIterableIterator<IMsg> {
    for (const msg of await parseString(this.chatFile.toString())) {
      yield this.createMsgObject(msg);
    }
  }

  // implement Iterable interface
  private async *iteratorForMessages(): AsyncIterator<IMsg> {
    // check if mimetype is application/zip
    if (this.chatFile.type === 'application/zip') {
      return this.iteratorForZipFile();
    }

    // check if mimetype is text/plain
    if (this.chatFile.type === 'text/plain') {
      yield* this.iteratorForTextFile();
    }

    // throw error if mimetype is not supported
    throw new Error('Mimetype not supported');
  }

  // constructor
  constructor(chatFile: Blob) { this.chatFile = chatFile; }

  // implement Iterable interface
  async [Symbol.asyncIterator](): Promise<AsyncIterator<IMsg>> {
    return this.iteratorForMessages();
  }
}
