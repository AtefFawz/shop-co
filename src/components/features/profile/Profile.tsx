import { ProfileClient } from "./ProfileClient";

// ─── Server Component ─────────────────────────────────────

// import api from "@/lib/api";
import { serverApi } from "@/lib/serverApi";
const Profile = async () => {
  const res = await serverApi("profile/me/");

  const user = res?.data?.user;

  return <ProfileClient user={user} />;
};

export { Profile };
