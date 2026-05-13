"use client";

import api from "@/lib/api";
import { useEffect, useState, useCallback } from "react";

import { User } from "@/types/user";

import UsersTable from "@/components/features/admin/users/UsersTable";
import UsersMobile from "@/components/features/admin/users/UsersMobile";
import EmptyState from "@/components/features/admin/users/EmptyState";

import { RefreshCw } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("admin/users");

      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] ">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 px-3 sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1.5">
              Admin Panel
            </p>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-gray-900">
              All Users
            </h1>

            <p className="text-xs text-gray-400 font-medium mt-1">
              {users.length} user{users.length !== 1 ? "s" : ""} total
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-black uppercase tracking-widest"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-sm text-gray-400">Loading users...</p>
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
