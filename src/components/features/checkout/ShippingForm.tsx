"use client";
import { useState } from "react";

export const ShippingForm = ({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <h3 className="text-xl font-bold mb-6">Shipping Address</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Street Address"
          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-black"
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            placeholder="City"
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-black"
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <input
            required
            placeholder="Phone Number"
            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-black"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-4 rounded-full font-bold mt-4 hover:bg-gray-800"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};
