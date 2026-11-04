import AdminProductCatalogView from "@/features/admin/products/pages/AdminProductCatalogView";
import { products } from "@/lib/Products";

import type { Product } from "@/types";
export default async function AdminProductCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    keyword?: string;
    stockStatus?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page) || 1);
  const limit = 10;
  const keyword = typeof params?.keyword === "string" ? params.keyword.trim().slice(0, 120) : "";
  const stockStatus = ["healthy", "low", "out"].includes(params?.stockStatus || "") ? params!.stockStatus! : "all";
  const sort = ["newest", "price-asc", "price-desc", "stock-asc"].includes(params?.sort || "") ? params!.sort! : "newest";
  const productsData = await products("/product", page, limit, {
    keyword: keyword || null,
    stockStatus: stockStatus === "all" ? null : stockStatus,
    sort,
    includeStats: true,
  });
  const productList: Product[] = productsData?.data?.Products ?? [];
  const pagination = productsData?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  };
  const totalCount = pagination?.total ?? productList.length;
  const statsObj = productsData?.stats || {};
  const onSaleCount =
    statsObj.onSaleCount ??
    productList.filter((p: any) => (p.discount ?? 0) > 0 || p.onSale).length;
  const lowStockCount =
    statsObj.lowStockCount ??
    productList.filter((p: Product) => (p.countInStock ?? 10) <= 5).length;
  const pageCatalogValue = productList.reduce(
    (sum: number, p: Product) => sum + (Number(p.price) || 0),
    0,
  );
  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <AdminProductCatalogView
      page={page}
      totalCount={totalCount}
      productList={productList}
      pagination={pagination}
      onSaleCount={onSaleCount}
      lowStockCount={lowStockCount}
      pageCatalogValue={pageCatalogValue}
      startItem={startItem}
      endItem={endItem}
      keyword={keyword}
      stockStatus={stockStatus}
      sort={sort}
    />
  );
}
