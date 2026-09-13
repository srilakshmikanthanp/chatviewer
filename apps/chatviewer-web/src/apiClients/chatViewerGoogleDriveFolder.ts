// Copyright (c) 2026 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import axios from 'axios';

const DRIVE_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const DRIVE_FOLDER_NAME = 'ChatViewer';
const DRIVE_FOLDER_PROPERTY = 'ChatViewer';

type DriveFolderResponse = {
  id: string;
};

type DriveFolderListResponse = {
  files: DriveFolderResponse[];
};

export class ChatViewerGoogleDriveFolder {
  private request: Promise<string> | null = null;

  private async findOrCreate(accessToken: string): Promise<string> {
    const headers = { Authorization: `Bearer ${accessToken}` };

    const query = [
      `appProperties has { key='application' and value='${DRIVE_FOLDER_PROPERTY}' }`,
      `mimeType = '${DRIVE_FOLDER_MIME_TYPE}'`,
      'trashed = false',
      "'root' in parents",
    ].join(' and ');

    const existingFolder = await axios.get<DriveFolderListResponse>(
      'https://www.googleapis.com/drive/v3/files',
      { headers, params: { q: query, fields: 'files(id)', spaces: 'drive' } }
    );

    if (existingFolder.data.files[0]?.id) {
      return existingFolder.data.files[0].id;
    }

    const newFolder = await axios.post<DriveFolderResponse>(
      'https://www.googleapis.com/drive/v3/files',
      {
        name: DRIVE_FOLDER_NAME,
        mimeType: DRIVE_FOLDER_MIME_TYPE,
        appProperties: { application: DRIVE_FOLDER_PROPERTY },
      },
      { headers: { ...headers, 'Content-Type': 'application/json' } }
    );

    return newFolder.data.id;
  }

  async getId(accessToken: string): Promise<string> {
    if (!this.request) {
      this.request = this.findOrCreate(accessToken).finally(() => {
        this.request = null;
      });
    }

    return this.request;
  }
}

export const chatViewerGoogleDriveFolder = new ChatViewerGoogleDriveFolder();
