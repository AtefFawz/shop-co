import { products } from "@/lib/Products";
import { ProfileClient } from "./ProfileClient";

import { serverApi } from "@/lib/serverApi";

const Profile = async () => {
  const user = await serverApi("profile/me/");
  const orders = await products("profile/my-orders");
  const reviews = await serverApi("profile/my-reviews");

  return <ProfileClient user={user} order={orders} review={reviews} />;
};

export { Profile };
