import { ProfileClient } from "./ProfileClient";

// ─── Server Component ─────────────────────────────────────

// import api from "@/lib/api";
import { serverApi } from "@/lib/serverApi";
const Profile = async () => {
  const res = await serverApi("profile/me/");

  const user = res?.data?.user;
  const { fullName, email, avatar, orders, reviews } = user;

  return (
    <ProfileClient
      fullName={fullName}
      email={email}
      avatar={avatar}
      orders={orders}
      reviews={reviews}
    />
  );
};

export { Profile };
