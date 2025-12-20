import { json, error } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import type { GetImageURLUploadResponse } from "$lib/types/images";

//TODO: Create this validation for the image
// You can upload the following image formats to Cloudflare Images:

// PNG
// GIF (including animations)
// JPEG
// WebP (Cloudflare Images also supports uploading animated WebP files)
// SVG
// HEIC
// Note

// Cloudflare can ingest HEIC images for decoding, but they must be served in web-safe formats such as AVIF, WebP, JPG, or PNG.

// Dimensions and sizes
// These are the maximum allowed sizes and dimensions when uploading to Images:

// Maximum image dimension is 12,000 pixels.
// Maximum image area is limited to 100 megapixels (for example, 10,000×10,000 pixels).
// Image metadata is limited to 1024 bytes (when uploaded and stored in Cloudflare).
// Images have a 10 megabyte (MB) size limit (when uploaded and stored in Cloudflare).
// Animated GIFs/WebP, including all frames, are limited to 50 megapixels (MP).

export async function POST() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );
  // Handle HTTP errors from Cloudflare API
  if (!response.ok) {
    // Throw an expected error with a 404 status and a custom message
    throw error(500, "Error uploading image");
  }

  // Parse the response from Cloudflare Images API
  const data = (await response.json()) as GetImageURLUploadResponse;

  //Return the direct_upload url
  return json({ uploadURL: data.result.uploadURL }, { status: 201 });
}
