"use client";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
interface dataType {
  onSubmit: (data: any) => void;
  state: boolean;
}
export const ShippingForm = ({ onSubmit, state }: dataType) => {
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
        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={state}
          className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-black/10 mt-2"
        >
          {state ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Place Order…
            </>
          ) : (
            <>
              Place Order
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
