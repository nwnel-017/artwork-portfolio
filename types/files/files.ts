export type UploadInput = {
  filename: string;
  buffer: Buffer;
  size?: number;
  contentType?: string;
};
