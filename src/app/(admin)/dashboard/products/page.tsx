import type { Metadata } from "next";
import AdminProductCatalogPage from "@/features/admin/products/pages/AdminProductCatalogPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog Studio · All Products",
  description: "Manage SHOP.CO luxury garments, pricing, and real-time warehouse stock levels.",
};

export default AdminProductCatalogPage;
