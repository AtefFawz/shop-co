"use client";

import api from "@/lib/api";
import { useState, useEffect } from "react";
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
  AlertCircle,
  X,
  Boxes,
  Sparkles,
  Users,
} from "lucide-react";

export default function AddProduct() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [item, setItem] = useState({
    name: "",
    description: "",
    gender: "MEN",
    category: "CLOTHING",
    section: "T-SHIRT",
    type: "T-SHIRT",
    style: "Casual",
    price: "",
    discount: "",
    isSale: "false",
    countInStock: "1",
    size: "",
    colors: "",
  });

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = (name: string, value: string) => {
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const updatedFiles = [...images, ...selectedFiles].slice(0, 5);

    previews.forEach((url) => URL.revokeObjectURL(url));

    setImages(updatedFiles);
    setPreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setItem({
      name: "",
      description: "",
      gender: "MEN",
      category: "CLOTHING",
      section: "T-SHIRT",
      type: "T-SHIRT",
      style: "Casual",
      price: "",
      discount: "",
      isSale: "false",
      countInStock: "1",
      size: "",
      colors: "",
    });
    setImages([]);
    setPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();

    Object.entries(item).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await api.post("product", formData);
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while publishing the product.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8]">
      <div className="Responsive w-full">
        {/* Header */}
        <header className="mb-6 sm:mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-xs transition-all hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-gray-900 leading-tight">
              Add New Product
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Fill in the technical and catalog details to list a new item.
            </p>
          </div>
        </header>

        {/* Alerts */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-xs">
            <CheckCircle2 size={18} className="shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                Product published successfully!
              </p>
              <p className="text-[11px] text-emerald-600">
                The item is now live in your catalog.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 shadow-xs">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 01: Identification */}
          <FormSection label="Product Identification" number="01">
            <div className="space-y-4">
              <Field label="Product Name" icon={<Tag size={13} />} required>
                <input
                  className="input-base"
                  type="text"
                  placeholder="e.g. Graphic Relaxed T-Shirt"
                  value={item.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value.toUpperCase())
                  }
                  required
                />
              </Field>

              <Field label="Description" icon={<AlignLeft size={13} />}>
                <textarea
                  className="input-base min-h-24 resize-none py-3 leading-relaxed"
                  placeholder="Describe cuts, fabric compositions, and specific measurements..."
                  value={item.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 02: Categorization */}
          <FormSection label="Categorization & Target" number="02">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Target Gender" icon={<Users size={13} />} required>
                <select
                  className="input-base cursor-pointer"
                  value={item.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="KIDS">Kids</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </Field>

              <Field label="Main Category" icon={<Layers size={13} />}>
                <input
                  className="input-base"
                  type="text"
                  placeholder="e.g. CLOTHING"
                  value={item.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </Field>

              <Field label="Section (Subcategory)" icon={<Tag size={13} />}>
                <select
                  className="input-base cursor-pointer"
                  value={item.section}
                  onChange={(e) => {
                    handleChange("section", e.target.value);
                    handleChange("type", e.target.value);
                  }}
                >
                  <option value="T-SHIRT">T-SHIRT</option>
                  <option value="SHIRT">SHIRT</option>
                  <option value="PANTS">PANTS</option>
                  <option value="JEANS">JEANS</option>
                </select>
              </Field>

              <Field label="Dress Style" icon={<Sparkles size={13} />}>
                <select
                  className="input-base cursor-pointer"
                  value={item.style}
                  onChange={(e) => handleChange("style", e.target.value)}
                >
                  <option value="Casual">Casual</option>
                  <option value="Formal">Formal</option>
                  <option value="Party">Party</option>
                  <option value="Gym">Gym</option>
                </select>
              </Field>
            </div>
          </FormSection>

          {/* Section 03: Pricing & Inventory */}
          <FormSection label="Pricing & Inventory" number="03">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label="Base Price ($)"
                icon={<DollarSign size={13} />}
                required
              >
                <input
                  className="input-base"
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
                  className="input-base"
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
                  className="input-base cursor-pointer"
                  value={item.isSale}
                  onChange={(e) => handleChange("isSale", e.target.value)}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </Field>

              <Field label="Units in Stock" icon={<Boxes size={13} />} required>
                <input
                  className="input-base"
                  type="number"
                  min="0"
                  placeholder="50"
                  value={item.countInStock}
                  onChange={(e) => handleChange("countInStock", e.target.value)}
                  required
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 04: Variants */}
          <FormSection label="Product Variants" number="04">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Available Sizes" icon={<Ruler size={13} />}>
                <input
                  className="input-base"
                  type="text"
                  placeholder="S, M, L, XL, XXL"
                  value={item.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                />
                <p className="text-[10px] text-gray-400">
                  Separate options with commas.
                </p>
              </Field>

              <Field label="Available Colors" icon={<Palette size={13} />}>
                <input
                  className="input-base"
                  type="text"
                  placeholder="Red, Blue, Black"
                  value={item.colors}
                  onChange={(e) => handleChange("colors", e.target.value)}
                />
                <p className="text-[10px] text-gray-400">
                  Separate color names or hexes with commas.
                </p>
              </Field>
            </div>
          </FormSection>

          {/* Section 05: Media & Gallery */}
          <FormSection
            label="Media & Gallery"
            number="05"
            description="Max 5 images"
          >
            <div className="space-y-4">
              <label className="group relative flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center transition-all hover:border-gray-400 hover:bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleImagesChange}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-gray-200 transition-all group-hover:bg-black">
                  <ImagePlus
                    size={20}
                    className="text-gray-500 transition-colors group-hover:text-white"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-black uppercase tracking-wider text-gray-700">
                    Upload product imagery
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    PNG, JPG or WEBP · First image will be assigned as primary
                    Cover
                  </p>
                </div>
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {previews.map((src, index) => (
                    <div
                      key={src}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-xs"
                    >
                      <img
                        src={src}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-white shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-md bg-black/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white backdrop-blur-xs">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <PackagePlus size={16} />
              <span>{loading ? "Publishing..." : "Publish Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormSection({
  label,
  number,
  description,
  children,
}: {
  label: string;
  number: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-[10px] font-black text-white">
            {number}
          </span>
          <p className="text-xs font-black uppercase tracking-wider text-gray-700">
            {label}
          </p>
        </div>
        {description && (
          <p className="text-[10px] text-gray-400 font-bold">{description}</p>
        )}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
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
    <div className="flex flex-col gap-1.5 min-w-0">
      <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-500">
        {icon}
        <span className="truncate">{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
