import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadToCloudinary(
  file: string,
  folder: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder: `bizskills/${folder}`,
    resource_type: "auto",
  });
  return result.secure_url;
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
