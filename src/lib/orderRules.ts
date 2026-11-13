/**
 * Mirrors the API's order-deletion rules so the UI never offers an action the
 * server will refuse. The server stays the source of truth (it answers 403/409).
 *
 * - Customers may delete only their own Pending orders.
 * - Admins/managers may delete Pending or Cancelled orders.
 * - Shipped and Delivered orders are financial records and can never be deleted.
 */
const normalize = (status: unknown) => String(status ?? "").trim().toLowerCase();

export const canCustomerDeleteOrder = (status: unknown) => normalize(status) === "pending";

export const canAdminDeleteOrder = (status: unknown) =>
  ["pending", "cancelled"].includes(normalize(status));
