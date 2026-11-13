import type { AdminOrderRecord } from "@/types/domain";

export type AdminOrdersListProps = {
  orders: AdminOrderRecord[];
  page: number;
  totalPages: number;
  total: number;
  goToPage: (page: number) => void;
  onOrderDeleted?: () => void;
};
