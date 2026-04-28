"use client";
import api from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  AlignLeft,
  DollarSign,
  Percent,
  Layers,
  Ruler,
  Palette,
  ImagePlus,
  PackagePlus,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value as any);
    });

    try {
      await api.post("product", formData);
      setSuccess(true);
      setItem({
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
        photo: null,
      });
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]  py-10">
      <div className="max-w-4xl mx-auto">
        {/* ── Page Header ── */}
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all shadow-sm flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-gray-900">
              Add New Product
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1 tracking-wide">
              Fill in the details to list a new item in your store
            </p>
          </div>
        </div>

        {/* ── Success Toast ── */}
        {success && (
          <div className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-bold px-5 py-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={18} className="flex-shrink-0" />
            Product added successfully! 🎉
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1 — Basic Info */}
          <FormSection label="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Product Name" icon={<Tag size={13} />} required>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Premium T-Shirt"
                  value={item.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value.toUpperCase())
                  }
                  required
                />
              </Field>
              <Field label="Category" icon={<Tag size={13} />}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Men's Fashion"
                  value={item.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </Field>
              <Field label="Section" icon={<Layers size={13} />}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Men, Women, Kids"
                  value={item.section}
                  onChange={(e) =>
                    handleChange("section", e.target.value.toUpperCase())
                  }
                />
              </Field>
              <Field label="Product Type" icon={<Layers size={13} />}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Shoes, T-Shirts"
                  value={item.type}
                  onChange={(e) =>
                    handleChange("type", e.target.value.toUpperCase())
                  }
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 2 — Description */}
          <FormSection label="Description">
            <Field label="Product Description" icon={<AlignLeft size={13} />}>
              <textarea
                className="form-input min-h-[100px] resize-none py-3 leading-relaxed"
                placeholder="Describe your product in detail…"
                value={item.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Field>
          </FormSection>

          {/* Section 3 — Pricing */}
          <FormSection label="Pricing & Sale">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Price ($)" icon={<DollarSign size={13} />} required>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={item.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </Field>
              <Field label="Discount (%)" icon={<Percent size={13} />}>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={item.discount}
                  onChange={(e) => handleChange("discount", e.target.value)}
                />
              </Field>
              <Field label="On Sale?" icon={<Tag size={13} />}>
                <select
                  className="form-input"
                  value={item.isSale}
                  onChange={(e) => handleChange("isSale", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </Field>
            </div>
          </FormSection>

          {/* Section 4 — Specs */}
          <FormSection label="Specifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Available Sizes" icon={<Ruler size={13} />}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="S, M, L, XL"
                  value={item.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                />
              </Field>
              <Field label="Available Colors" icon={<Palette size={13} />}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Red, Blue, Black"
                  value={item.colors}
                  onChange={(e) => handleChange("colors", e.target.value)}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 5 — Photo */}
          <FormSection label="Product Image">
            <label className="relative group flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-black hover:bg-gray-50/50 transition-all cursor-pointer">
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) =>
                  e.target.files && handleChange("photo", e.target.files[0])
                }
              />
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-black rounded-2xl flex items-center justify-center transition-colors duration-300">
                <ImagePlus
                  size={20}
                  className="text-gray-400 group-hover:text-white transition-colors"
                />
              </div>
              {item.photo ? (
                <div>
                  <p className="text-sm font-black text-green-600 uppercase tracking-widest">
                    ✓ {item.photo.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-gray-700">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </label>
          </FormSection>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-5 py-4 rounded-2xl text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-black/10"
          >
            <PackagePlus size={16} />
            {loading ? "Adding Product…" : "Add Product to Store"}
          </button>
        </form>
      </div>

      {/* ── Input styles ── */}
      <style>{`
        .form-input {
          width: 100%;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 11px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #111;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-input::placeholder { color: #9ca3af; font-weight: 500; }
        .form-input:focus {
          border-color: #000;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }
        select.form-input { cursor: pointer; }
      `}</style>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────

function FormSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          {label}
        </p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon,
  required,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-500">
        {icon}
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
