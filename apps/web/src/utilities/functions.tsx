// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import MimeTypes from "../assets/json/mime-types.json";

/**
 * Text Link to Anchor Tag converter
 *
 * @param inputText Input Text
 * @returns replaced text
 */
export function linkify(inputText: string) {
  // initialize the return string
  let replacedText: string = escapeHtml(inputText);

  //URLs starting with http://, https://, or ftp://
  const replaceHttp = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
  replacedText = replacedText.replace(replaceHttp, '<a href="$1" target="_blank">$1</a>');

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replaceWww = /(^|[^/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replaceWww, '$1<a href="http://$2" target="_blank">$2</a>');

  //Change email addresses to mailto:: links.
  const replaceMail = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replaceMail, '<a href="mailto:$1">$1</a>');

  // return the replaced text
  return replacedText;
}

/**
 * Escape the html string
 *
 * @param html string
 * @return string
 */
export function escapeHtml(html: string) {
  const text = document.createTextNode(html);
  const p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

/**
 * Get MIME Type from File Name
 * @param fileName File Name
 * @return MIME Type
 */
export function getMimeType(fileName: string) {
  const extension = fileName.split('.').pop();

  if (!extension) {
    return 'application/octet-stream';
  }

  type MimeType = keyof typeof MimeTypes;

  return (
    MimeTypes[extension as MimeType] ||
    'application/octet-stream'
  );
}
