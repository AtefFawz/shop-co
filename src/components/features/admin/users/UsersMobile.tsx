"use client";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

interface Props {
  users: User[];
}

export default function UsersMobile({ users }: Props) {
  const router = useRouter();

  const handleNavigate = (id: string) => {
    router.push(`/dashboard/admin/users/about/${id}`);
  };

  return (
    <div className="md:hidden space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* ── Top Section ── */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={user.avatar || "/placeholder-user.png"}
                  alt={user.fullName}
                  loading="lazy"
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-gray-50"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${user.fullName}`;
                  }}
                />

                {/* Online/Admin Indicator */}
                {user.role === "ADMIN" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* User Info */}
              <div className="min-w-0">
                <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight truncate">
                  {user.fullName}
                </h3>

                <p className="text-[11px] font-medium text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* User ID */}
            <span className="font-mono text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
              #{user._id.slice(-6).toUpperCase()}
            </span>
          </div>

          {/* Divider */}
          <div className="px-4">
            <div className="h-px bg-gray-50" />
          </div>

          {/* ── Bottom Section ── */}
          <div className="px-4 py-3 flex items-center justify-between bg-gray-50/30 rounded-b-3xl">
            {/* Role */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-gray-400">
                Current Role:
              </span>

              <span
                className={`
                  px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider
                  
                  ${
                    user.role === "ADMIN"
                      ? "bg-red-50 text-red-500"
                      : user.role === "MANGER"
                        ? "bg-blue-50 text-blue-500"
                        : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                {user.role}
              </span>
            </div>

            {/* Details Button */}
            <button
              onClick={() => {
                handleNavigate(user?._id);
              }}
              className="text-[10px] font-black uppercase text-black underline underline-offset-2 hover:text-gray-600 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
