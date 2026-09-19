import { AlertTriangle, ArrowUpRight, Boxes, Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export const LowStackList = ({
  lowStockProducts,
}: {
  lowStockProducts: any;
}) => {
  const getImageUrl = (url?: string) => {
    if (!url) return "/placeholder.png";
    if (url.startsWith("http")) return url;
    return `https://res.cloudinary.com/dudit0nty/image/upload/${url}`;
  };

  return (
    <>
      {/* ── Low Stock WatchList ── */}
      <div className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={14} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900">
                Critical Inventory Watch list
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">
                Products with fewer than 5 units requiring immediate restock
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-black transition-colors self-end sm:self-auto"
          >
            Manage Catalog <ArrowUpRight size={13} />
          </Link>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Boxes size={18} />
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-gray-900">
              Inventory is healthy
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              All catalog items have comfortable stock margins.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[9px] font-black uppercase tracking-[0.14em] text-gray-400 bg-gray-50/20">
                  <th className="py-3 px-4 sm:px-6">Product</th>
                  <th className="py-3 px-4 sm:px-6">Category</th>
                  <th className="py-3 px-4 sm:px-6">Price</th>
                  <th className="py-3 px-4 sm:px-6">Remaining</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {lowStockProducts.slice(0, 6).map((item: any) => {
                  const stockVal = item.countInStock ?? 0;
                  const isOut = stockVal === 0;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-2.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200/80 shrink-0">
                            <Image
                              src={getImageUrl(item.images?.[0] || item.photo)}
                              alt={item.name || "Product"}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-[160px] sm:max-w-xs text-xs">
                              {item.name.length > 10
                                ? item.name.slice(0, 10) + " " + "...."
                                : item.name}
                            </p>
                            <span className="text-[9px] text-gray-400 uppercase font-semibold block truncate">
                              {item.section || item.style || "Standard"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-4 sm:px-6 text-gray-500 font-semibold uppercase text-[10px]">
                        {item.category || "General"}
                      </td>

                      <td className="py-2.5 px-4 sm:px-6 font-bold text-gray-900 text-xs">
                        ${item.price}
                      </td>

                      <td className="py-2.5 px-4 sm:px-6">
                        {isOut ? (
                          <span className="inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-nowrap">
                            Depleted (0)
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-nowrap">
                            Urgent: {stockVal} left
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-4 sm:px-6 text-right">
                        <Link
                          href={`/dashboard/products/edit/${item._id}`}
                          className="inline-flex items-center gap-1 bg-white border border-gray-200 hover:border-black px-2.5 py-1 rounded-lg font-bold text-[10px] text-gray-700 hover:text-black transition-all shadow-2xs text-nowrap"
                        >
                          <Edit3 size={11} /> Edit Stock
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
