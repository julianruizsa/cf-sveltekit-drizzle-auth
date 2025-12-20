/**
 * Type for upload result
 */
export interface UploadResult {
  id: string;
  uploadURL: string;
}

/**
 * Type for image upload URL response
 */
export interface GetImageURLUploadResponse {
  result: UploadResult;
  success: boolean;
  errors: string[];
  messages: string[];
}

//Images API Response after upload the image to Cloudflare
export interface ImageResult {
  id: string;
  metadata: Record<string, string>;
  uploaded: string;
  requireSignedURLs: boolean;
  variants: string[];
  draft: boolean;
}

export interface ImageApiResponse {
  result: ImageResult;
  success: boolean;
  errors: string[];
  messages: string[];
}
