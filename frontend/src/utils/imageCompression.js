import heic2any from "heic2any";

// Image compression configuration
export const COMPRESSION_CONFIG = {
  maxWidth: 1024,
  quality: 0.8
};

/**
 * Compress an image file to reduce its size while maintaining quality.
 * Automatically converts HEIC/HEIF to JPEG before compression.
 *
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 1024)
 * @param {number} quality - JPEG quality from 0 to 1 (default: 0.8)
 * @returns {Promise<Blob>} - Compressed image as a Blob
 */
export async function compressImage(
  file,
  maxWidth = COMPRESSION_CONFIG.maxWidth,
  quality = COMPRESSION_CONFIG.quality
) {
  let imageFile = file;

  // 🟣 Step 1: Convert HEIC → JPEG if needed
  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  ) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality
      });

      imageFile = new File(
        [convertedBlob],
        file.name.replace(/\.hei[cf]$/i, ".jpg"),
        { type: "image/jpeg" }
      );

    } catch (err) {
      throw new Error("Failed to convert HEIC image");
    }
  }

  // 🟣 Step 2: Compress using canvas
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxWidth / img.width, 1); // only shrink
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a proper File object with correct MIME type
              const fileName = imageFile.name.replace(/\.(hei[cf]|jpeg|png|gif|webp)$/i, ".jpg");
              const file = new File([blob], fileName, {
                type: "image/jpeg",
                lastModified: Date.now()
              });
              resolve(file);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image for compression"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
  });
}
