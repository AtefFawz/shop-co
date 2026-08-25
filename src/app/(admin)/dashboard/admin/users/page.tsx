"use client";
import UsersTable from "@/components/features/admin/users/UsersTable";
import UsersMobile from "@/components/features/admin/users/UsersMobile";
import EmptyState from "@/components/features/admin/users/EmptyState";

import { RefreshCw } from "lucide-react";
import useData from "@/hooks/getData";

export default function AdminUsers() {
  const { loading, data, refetch } = useData("admin/users");

  const countUsers = data?.pagination?.total ?? 0;
  const users = data?.data?.users ?? [];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 px-3 sm:px-6 pt-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5">
              Admin Panel
            </p>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-gray-900">
              All Users
            </h1>

            <p className="text-xs text-gray-400 font-medium mt-1">
              {countUsers} user{countUsers !== 1 ? "s" : ""} total
            </p>
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-black uppercase tracking-widest text-gray-600 hover:text-black transition-all shadow-sm shrink-0 disabled:opacity-60"
          >
            <RefreshCw
              size={13}
              className={loading ? "animate-spin text-black" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3 px-3 sm:px-6">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 h-20 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && users.length === 0 && <EmptyState />}

        {/* Desktop */}
        {!loading && users.length > 0 && <UsersTable users={users} />}

        {/* Mobile */}
        {!loading && users.length > 0 && <UsersMobile users={users} />}
      </div>
    </div>
  );
}
