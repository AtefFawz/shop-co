import type { Metadata } from "next";
import ProductDetailsPage from "@/features/catalog/pages/ProductDetailsPage";
import { getProductServer, SITE_URL } from "@/lib/productServer";
import { resolveImageUrl } from "@/lib/imageUrl";
import type { Product } from "@/types";

type RouteProps = { params: Promise<{ id: string }> };

const firstImage = (product: Product): string | undefined => {
  const raw =
    product.images?.find((i): i is string => typeof i === "string" && !!i.trim()) ||
    product.photo;
  return raw ? resolveImageUrl(raw) : undefined;
};

const finalPrice = (product: Product) => {
  const discount = Math.min(100, Math.max(0, Number(product.discount) || 0));
  return Math.round(Number(product.price) * (1 - discount / 100) * 100) / 100;
};

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductServer(id);
  if (!product) return { title: "Product | SHOP.CO", robots: { index: false } };

  const description =
    (product.description || "").replace(/\s+/g, " ").trim().slice(0, 160) ||
    `${product.name} at SHOP.CO`;
  const image = firstImage(product);
  const url = `${SITE_URL}/shop/details/${id}`;

  return {
    title: `${product.name} | SHOP.CO`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: RouteProps) {
  const { id } = await params;
  const product = await getProductServer(id);

  const jsonLd = product && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: (product.images?.length ? product.images : [product.photo])
      .filter((i): i is string => typeof i === "string" && !!i)
      .map((i) => resolveImageUrl(i)),
    sku: product._id,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/details/${id}`,
      priceCurrency: "EGP",
      price: finalPrice(product),
      availability:
        Number(product.countInStock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // "<" is escaped so product text can never close the script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <ProductDetailsPage id={id} initialProduct={product} />
    </>
  );
}
