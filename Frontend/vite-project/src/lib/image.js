const DEFAULT_MAX_DIMENSION = 320;
const DEFAULT_QUALITY = 0.82;
const DEFAULT_MIME_TYPE = "image/webp";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = source;
  });
}

export async function getOptimizedImageDataUrl(
  file,
  {
    maxDimension = DEFAULT_MAX_DIMENSION,
    quality = DEFAULT_QUALITY,
    mimeType = DEFAULT_MIME_TYPE,
  } = {}
) {
  if (!file) {
    return "";
  }

  if (!file.type?.startsWith("image/")) {
    return readFileAsDataUrl(file);
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const { width, height } = image;
    const longestSide = Math.max(width, height);

    if (longestSide <= maxDimension && file.size <= 250 * 1024) {
      return readFileAsDataUrl(file);
    }

    const scale = maxDimension / longestSide;
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      return readFileAsDataUrl(file);
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL(mimeType, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}