import { User } from "@/types/user";

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <div className="hidden md:block bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {["Name", "Email", "Avatar", "Role"].map((h) => (
              <th
                key={h}
                className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-b border-gray-50 hover:bg-gray-50"
            >
              <td className="px-5 py-4 font-black text-sm">{user.fullName}</td>

              <td className="px-5 py-4 text-sm">{user.email}</td>

              <td className="px-5 py-4">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </td>

              <td className="px-5 py-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
