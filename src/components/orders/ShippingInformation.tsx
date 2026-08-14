"use client";

import { MapPin, Phone, Truck } from "lucide-react";

type ShippingAddress = {
  address: string;
  city: string;
  phone: string;
};

export default function ShippingInformation({
  shippingAddress,
}: {
  shippingAddress: ShippingAddress;
}) {
  return (
    <div className="h-fit rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
          <MapPin size={18} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Shipping Information
          </h2>

          <p className="mt-0.5 text-xs text-gray-400">Delivery details</p>
        </div>
      </div>

      <div className="space-y-4">
        <InfoRow
          label="Address"
          value={shippingAddress.address}
          icon={<MapPin size={16} />}
        />

        <InfoRow
          label="City"
          value={shippingAddress.city}
          icon={<Truck size={16} />}
        />

        <InfoRow
          label="Phone"
          value={shippingAddress.phone}
          icon={<Phone size={16} />}
        />
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
