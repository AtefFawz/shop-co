import type { Product } from "@/types";
import type { User } from "@/types/user";

/** Normalized order line returned by the REST API. */
export interface OrderLineItem {
  _id?: string;
  product?:
    | string
    | Product
    | { _id?: string; name?: string; photo?: string; image?: string };
  name?: string;
  image?: string;
  photo?: string;
  price?: number | string;
  count?: number;
  quantity?: number;
  size?: string | string[];
  color?: string | string[];
  colors?: string | string[];
}

/** Customer/admin order data used by the order history and details screens. */
export interface OrderRecord {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  totalPrice?: number;
  shippingFee?: number;
  paymentMethod?: "cod" | "card";
  orderItems: OrderLineItem[];
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  shippingAddress?: {
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  user?: User | string;
}

export interface ReviewRecord {
  _id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  user?: Pick<User, "_id" | "fullName" | "email" | "avatar" | "role">;
  product?: Product | { _id?: string; name?: string } | string;
}

export interface AdminUserRecord extends User {
  createdAt?: string;
  updatedAt?: string;
  memberSince?: string;
  orders?: AdminOrderRecord[];
  reviews?: ReviewRecord[];
  isActive?: boolean;
}

export interface WeeklySalesPoint {
  day: string;
  revenue: number;
}

export interface AdminDashboardStats {
  onSaleCount?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
  totalRevenue?: number;
  totalOrders?: number;
  totalUsers?: number;
  pendingOrders?: number;
  currentMonthRevenue?: number;
  lastMonthRevenue?: number;
  currentMonthOrders?: number;
  lastMonthOrders?: number;
  currentMonthUsers?: number;
  lastMonthUsers?: number;
  weeklySales?: WeeklySalesPoint[];
}

export interface AdminOrderItem {
  _id?: string;
  name?: string;
  image?: string;
  price?: number | string;
  quantity?: number;
  qty?: number;
  product?: {
    _id?: string;
    name?: string;
    price?: number;
    photo?: string;
    image?: string;
  };
}

export interface AdminOrderRecord {
  _id: string;
  status: string;
  createdAt?: string;
  totalPrice?: number;
  orderItems: AdminOrderItem[];
  user?: { _id?: string; fullName?: string; email?: string };
  paymentMethod?: string;
  shippingAddress?: {
    city?: string;
    address?: string;
    postalCode?: string;
    country?: string;
  };
  address?: string;
}

export interface CustomerOrderRecord {
  _id: string;
  createdAt?: string;
  status: string;
  totalPrice: number;
  orderItems: Array<{
    _id: string;
    product: string;
    name: string;
    image: string;
  }>;
}

export interface ApiNotificationRecord {
  _id: string;
  title?: string;
  message?: string;
  read?: boolean;
  order?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ApiResponse {
  data?: {
    Products?: Product[];
    products?: Product[];
    product?: Product;
    orders?: CustomerOrderRecord[];
    reviews?: ReviewRecord[];
    users?: AdminUserRecord[];
    user?: AdminUserRecord;
    email?: string;
    token?: string;
    notifications?: ApiNotificationRecord[];
    [key: string]: unknown;
  };
  pagination?: {
    page?: number;
    total?: number;
    totalPages?: number;
    totalExpenses?: number;
    [key: string]: unknown;
  };
  stats?: AdminDashboardStats;
  [key: string]: unknown;
}
/** Derived weekly revenue figures shown by the dashboard revenue chart. */
// export interface RevenueAnalyticsSummary {
//   /** Revenue points the summary was computed from (one per day). */
//   points: WeeklySalesPoint[];
//   /** Sum of revenue across all points. */
//   totalRevenue: number;
//   /** totalRevenue divided by the number of points (rounded). */
//   averageDailyRevenue: number;
//   /** Highest revenue value in the period. */
//   maxRevenue: number;
//   /** The best-performing day. */
//   peakDay: WeeklySalesPoint;
//   /** Share (0-100) of totalRevenue that the active/selected day represents. */
//   activeSharePercent: number;
//   /** Position (8-92) of the average line relative to the tallest bar. */
//   averageLinePercent: number;
//   /** Change vs the previous period, in percent. Omitted when not comparable. */
//   trendPercent?: number;
// }
export interface RevenueAnalyticsSummary {
  grossSales: number;
  discounts: number; // موجب، والمكوّن بيعرضه كخصم
  refunds: number; // موجب، والمكوّن بيعرضه كخصم
  shippingRevenue: number;

  costOfGoodsSold: number | null;
  grossProfit: number | null;
  paymentFees: number | null;
  shippingCosts: number | null;
  operatingExpenses: number | null;

  netProfit: number | null;
  profitMarginPercent: number | null;
  profitAvailable: boolean;
}
