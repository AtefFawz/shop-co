"use client";
import api from "@/lib/api";
import { useState } from "react";

export const ProductSubmissionForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    section: "",
    isSale: "",
    discount: "",
    size: "",
    colors: "",
    photo: null as File | null,
  });

  const handleChange = (name: string, value: string | File) => {
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    Object.entries(item).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      await api.post("product", formData);
      alert("Product added successfully! 🎉");
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-8 bg-surface rounded-2xl shadow-xl border border-border-subtle">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-secondary italic">
          Add New Product
        </h2>
        <p className="text-muted mt-2">
          Fill in the details to list a new item in your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary ml-1">
              Product Name
            </label>
            <input
              className="input-style"
              type="text"
              placeholder="e.g. Premium T-Shirt"
              value={item.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary ml-1">
              Category
            </label>
            <input
              className="input-style "
              type="text"
              placeholder="e.g. Men's Fashion"
              value={item.category}
              onChange={(e) => handleChange("category", e.target.value)}
            />
          </div>
        </div>

        {/* Section 2: Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-secondary ml-1">
            Description
          </label>
          <textarea
            className="input-style min-h-[100px] py-3"
            placeholder="Describe your product in detail..."
            value={item.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Section 3: Pricing & Sale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-subtle p-6 rounded-xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">
              Price ($)
            </label>
            <input
              className="input-style bg-surface"
              type="number"
              placeholder="0.00"
              value={item.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">
              Discount (%)
            </label>
            <input
              className="input-style bg-surface"
              type="number"
              placeholder="0"
              value={item.discount}
              onChange={(e) => handleChange("discount", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">
              On Sale?
            </label>
            <select
              className="input-style bg-surface"
              value={item.isSale}
              onChange={(e) => handleChange("isSale", e.target.value)}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {/* Section 4: Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            className="input-style"
            type="text"
            placeholder="Sizes (S, M, L, XL)"
            value={item.size}
            onChange={(e) => handleChange("size", e.target.value)}
          />
          <input
            className="input-style"
            type="text"
            placeholder="Colors (Red, Blue, Black)"
            value={item.colors}
            onChange={(e) => handleChange("colors", e.target.value)}
          />
        </div>

        {/* Section 5: Photo Upload */}
        <div className="relative group border-2 border-dashed border-border-strong rounded-xl p-8 text-center hover:border-border-strong transition-colors">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) =>
              e.target.files && handleChange("photo", e.target.files[0])
            }
          />
          <div className="space-y-2">
            <div className="text-secondary">
              {item.photo ? (
                <span className="text-success font-medium">
                  Selected: {item.photo.name}
                </span>
              ) : (
                "Click to upload product image"
              )}
            </div>
            <p className="text-xs text-muted">PNG, JPG up to 5MB</p>
          </div>
        </div>

        {error && (
          <p className="text-danger text-sm font-medium text-center">{error}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-action text-on-action py-4 rounded-xl font-bold text-lg hover:bg-action-hover transition-all active:scale-[0.98] disabled:bg-surface-hover"
        >
          {loading ? "Processing..." : "Add Product to Store"}
        </button>
      </form>
    </div>
  );
};
/* Tailwind Custom Styles (يمكن وضعها في globals.css) */
/*
      <style jsx>{`
        .input-style {
          @apply w-full px-4 py-3 rounded-lg border border-border outline-none focus:border-primary focus:ring-1 focus:ring-focus transition-all placeholder:text-subtle text-secondary;
        }
      `}</style>
*/
