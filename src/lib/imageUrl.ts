const CLOUDINARY_UPLOAD_BASE =
  "https://res.cloudinary.com/dudit0nty/image/upload/";

export type ImageSource = string | null | undefined;

/**
 * Resolve an image source from an API payload.
 * Absolute/local/data/blob URLs are returned unchanged; Cloudinary public IDs
 * are normalized through one shared resolver so every feature behaves the same.
 */
export function resolveImageUrl(
  raw: ImageSource,
  fallback = "",
): string {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return fallback;
  }

  const value = raw.trim();

  if (
    /^(?:https?:)?\/\//i.test(value) ||
    /^(?:data|blob):/i.test(value) ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `${CLOUDINARY_UPLOAD_BASE}${value.replace(/^\/+/, "")}`;
}

type ProductImageSource = {
  photo?: ImageSource;
  images?: readonly ImageSource[] | null;
} | null | undefined;

/** Resolve the primary image for products with either a `photo` or `images` field. */
export function resolveProductImageUrl(
  product: ProductImageSource,
  fallback = "",
): string {
  return resolveImageUrl(product?.photo || product?.images?.[0], fallback);
}
