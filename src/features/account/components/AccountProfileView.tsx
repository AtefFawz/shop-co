import { serverApi } from "@/lib/serverApi";
import { AccountProfileClient } from "@/features/account/components/AccountProfileClient";

const AccountProfileView = async () => {
  return <AccountProfileClient />;
};

export { AccountProfileView };
