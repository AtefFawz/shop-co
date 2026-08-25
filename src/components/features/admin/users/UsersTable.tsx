import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { User as UserIcon, Shield, ChevronRight } from "lucide-react";

export default function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();

  const clickUser = (id: string) => {
    router.push(`/dashboard/admin/users/about/${id}`);
  };

  return (
    <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["User ID", "Customer", "Role", "Joined Date", ""].map((h, i) => (
              <th
                key={h || i}
                className="px-5 py-4 text-left text-[10px] text-nowrap font-black uppercase tracking-[0.15em] text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50 ">
          {users.map((user: any) => {
            const isAdmin = user.role?.toUpperCase() === "ADMIN";

            return (
              <tr
                key={user._id}
                onClick={() => clickUser(user._id)}
                className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group cursor-pointer"
              >
                {/* 1. User ID */}
                <td className="px-3 py-4">
                  <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">
                    #{user._id?.slice(-6).toUpperCase()}
                  </span>
                </td>

                {/* 2. Customer Avatar & Name & Email */}
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-9 h-9 rounded-xl border-2 border-white object-cover shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-gray-100 rounded-xl border-2 border-white flex items-center justify-center shrink-0 shadow-sm">
                        <UserIcon size={16} className="text-gray-400" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-black text-sm text-gray-900 leading-tight group-hover:text-black transition-colors truncate">
                        {user.fullName || "Unnamed User"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* 3. Role Badge */}
                <td className="px-3 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      isAdmin
                        ? "bg-black text-white border-black"
                        : "bg-gray-100 text-gray-700 border-gray-200/60"
                    }`}
                  >
                    {isAdmin && <Shield size={11} />}
                    {user.role || "USER"}
                  </span>
                </td>

                {/* 4. Created Date */}
                <td className="px-3 py-4 text-xs font-bold text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>

                {/* 5. Arrow Indicator */}
                <td className="px-3 py-4 text-right">
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all ml-auto">
                    <ChevronRight size={16} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
