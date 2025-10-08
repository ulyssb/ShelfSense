// Image compression configuration
export const COMPRESSION_CONFIG = {
  maxWidth: 1024,
  quality: 0.8
}

/**
 * Compress an image file to reduce its size while maintaining quality
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 1024)
 * @param {number} quality - JPEG quality from 0 to 1 (default: 0.8)
 * @returns {Promise<Blob>} - Compressed image as a Blob
 */
export function compressImage(file, maxWidth = COMPRESSION_CONFIG.maxWidth, quality = COMPRESSION_CONFIG.quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(maxWidth / img.width, 1); // only shrink
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality // 0.8 = 80% quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}
