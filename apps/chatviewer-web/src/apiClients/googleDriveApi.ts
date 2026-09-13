// Copyright (c) 2026 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { chatViewerGoogleDriveFolder } from './chatViewerGoogleDriveFolder';

async function uploadDriveChat(
  file: File,
  name: string,
  accessToken: string
): Promise<string> {
  const lowerName = file.name.toLowerCase();
  const folderId = await chatViewerGoogleDriveFolder.getId(accessToken);

  const metadata = {
    name: name || file.name,
    mimeType: file.type || (lowerName.endsWith('.zip') ? 'application/zip' : 'text/plain'),
    parents: [folderId],
  };

  const formData = new FormData();

  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );

  formData.append('file', file);

  const response = await axios.post<{ id: string }>(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    formData,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return response.data.id;
}

async function downloadDriveChat(
  driveFileId: string,
  accessToken: string
): Promise<Blob> {
  const response = await axios.get<Blob>(
    `https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'blob',
    }
  );

  return response.data;
}

async function deleteDriveChat(
  driveFileId: string,
  accessToken: string
): Promise<void> {
  try {
    await axios.delete(
      `https://www.googleapis.com/drive/v3/files/${driveFileId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 404) {
      throw error;
    }
  }
}

async function shareDriveChat(
  driveFileId: string,
  accessToken: string,
  emailAddress: string
): Promise<void> {
  const permission: Record<string, string> = {
    role: 'reader',
    type: 'user',
  };

  permission.emailAddress = emailAddress;

  await axios.post(
    `https://www.googleapis.com/drive/v3/files/${driveFileId}/permissions?sendNotificationEmail=false`,
    permission,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
}

export function useUploadDriveChat() {
  return useMutation({
    mutationFn: async ({ file, name, accessToken }: { file: File; name: string; accessToken: string }) => {
      return uploadDriveChat(file, name, accessToken);
    },
  });
}

export function useDownloadDriveChat() {
  return useMutation({
    mutationFn: async ({
      driveFileId,
      accessToken,
    }: {
      driveFileId: string;
      accessToken: string;
    }) => {
      return downloadDriveChat(driveFileId, accessToken);
    },
  });
}

export function useDeleteDriveChat() {
  return useMutation({
    mutationFn: async ({ driveFileId, accessToken }: { driveFileId: string; accessToken: string }) => {
      return deleteDriveChat(driveFileId, accessToken);
    },
  });
}

export function useShareDriveChat() {
  return useMutation({
    mutationFn: async ({
      driveFileId,
      emailAddress,
      accessToken,
    }: {
      driveFileId: string;
      emailAddress: string;
      accessToken: string;
    }) => {
      return shareDriveChat(driveFileId, accessToken, emailAddress);
    },
  });
}
