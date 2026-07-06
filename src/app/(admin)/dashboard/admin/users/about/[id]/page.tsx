// import { serverApi } from "@/lib/serverApi";
import { notFound } from "next/navigation";
import {
  Mail,
  Calendar,
  ShoppingBag,
  Star,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import RoleSelector from "@/components/features/admin/users/RoleSelector";
import DeleteUserButton from "@/components/features/admin/users/DeleteUserButton";
import api from "@/lib/api";

export default async function AboutUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await api.get("/admin/users/" + id);

  if (!response || response.status !== 200) return notFound();

  const user = response.data?.data?.user;

  const totalSpent =
    user.orders?.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0) ||
    0;
  const joinDate = new Date(
    user.memberSince || user.createdAt,
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });

  return (
    <div className="max-w-6xl Responsive space-y-8 font-sans">
      {/* Header & Actions */}
      <div className="flex items-center  justify-between gap-4">
        <Link
          href="/dashboard/admin/users"
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-black text-nowrap uppercase xl:tracking-widest">
            Back to Users
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[10px] font-mono text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full text-nowrap">
            ID: {user._id}
          </span>
          {/* 🎯 Confirmation */}
          <DeleteUserButton userId={user._id} userName={user.fullName} />
        </div>
      </div>

      {/* 1. Main Profile Card */}
      <div className="bg-white rounded-[40px] border border-gray-100 p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center relative ">
        <img
          src={user.avatar || "/placeholder-user.png"}
          alt={user.fullName}
          className="w-32 h-32 md:w-44 md:h-44 rounded-[35px] object-cover border-4 border-gray-50 shadow-inner"
        />

        <div className="flex-1 text-center md:text-left space-y-5">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
              {user.fullName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-2">
              <span className="flex items-center gap-2 text-gray-500 text-sm font-bold tracking-tight">
                <Mail size={14} className="text-gray-300" /> {user.email}
              </span>
              <span className="flex items-center gap-2 text-gray-500 text-sm font-bold tracking-tight">
                <Calendar size={14} className="text-gray-300" /> Joined{" "}
                {joinDate}
              </span>
            </div>
          </div>

          {/* 🎯 (Role Selector) */}
          <div className="flex items-center justify-center md:justify-start ">
            <RoleSelector userId={user._id} initialRole={user.role} />
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          icon={<ShoppingBag className="text-blue-500" />}
          label="Total Orders"
          value={user.orders?.length || 0}
        />
        <StatCard
          icon={<DollarSign className="text-green-500" />}
          label="Total Spent"
          value={`$${totalSpent.toLocaleString()}`}
        />
        <StatCard
          icon={<Star className="text-orange-500" />}
          label="Reviews"
          value={user.reviews?.length || 0}
        />
      </div>

      {/* 3. Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Column */}
        {user.orders?.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-gray-900">
              Recent Orders{" "}
              <span className="text-gray-300 text-sm font-bold">
                ({user.orders?.length})
              </span>
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {user.orders?.map((order: any) => (
                <div
                  key={order._id}
                  className="bg-white border border-gray-100 p-5 rounded-[25px] flex justify-between items-center hover:border-gray-300 transition-all hover:shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      ${order.totalPrice}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl ${order.status === "Shipped" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Reviews Column */}
        {user.reviews?.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 text-gray-900">
              Latest Reviews{" "}
              <span className="text-gray-300 text-sm font-bold">
                ({user.reviews?.length})
              </span>
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {user.reviews?.map((review: any) => (
                <div
                  key={review._id}
                  className="bg-white border border-gray-100 p-6 rounded-[30px] space-y-3 hover:border-gray-300 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "fill-black text-black"
                              : "text-gray-100"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                      {review.product?.name || "Product"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

// Reusable Stat Card (Maintained Design)
function StatCard({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: any;
}) {
  return (
    <div className="bg-white p-7 rounded-[35px] border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 truncate">
          {label}
        </p>
        <p className="text-2xl font-black text-gray-900 tracking-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
