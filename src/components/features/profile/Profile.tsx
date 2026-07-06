import { ProfileClient } from "./ProfileClient";

// ─── Server Component ─────────────────────────────────────

import api from "@/lib/api";

const Profile = async () => {
  const res = await api.get("profile/me/");

  const user = res.data?.data?.user;
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

// const res = await serverApi("profile/me/");
// const [user, setUser] = useState<any>([]);
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const res = await api.get("profile/me/");
//       const user = res.data.data.user;
//       setUser(user);
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//     }
//   };

//   fetchData();
// }, []);
