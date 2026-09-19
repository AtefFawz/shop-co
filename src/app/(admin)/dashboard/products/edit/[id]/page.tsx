"use client";

import { use, useEffect, useState } from "react";
import { usePatch } from "@/hooks/editProduct";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Tag,
  AlignLeft,
  DollarSign,
  Percent,
  Layers,
  Ruler,
  Palette,
  ImagePlus,
  Save,
  ArrowLeft,
  X,
  Trash2,
  Boxes,
  Sparkles,
  Users,
  AlertCircle,
} from "lucide-react";

const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${url}`;
};

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const { item, error, loading, handleChange, handleUpdate, fetchProduct } =
    usePatch();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  useEffect(() => {
    if (item && (item.images || item.photo)) {
      const serverImgs =
        item.images && item.images.length > 0
          ? item.images
          : item.photo
            ? [item.photo]
            : [];
      setExistingImages(
        serverImgs.filter(
          (image): image is string => typeof image === "string",
        ),
      );
    }
  }, [item._id, item.photo, item.images]);
  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  const handleRemoveExisting = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveNew = (indexToRemove: number) => {
    URL.revokeObjectURL(newPreviews[indexToRemove]);
    setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllImages = () => {
    newPreviews.forEach((url) => URL.revokeObjectURL(url));
    setExistingImages([]);
    setNewImages([]);
    setNewPreviews([]);
  };

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const currentTotal = existingImages.length + newImages.length;
    const availableSlots = Math.max(0, 5 - currentTotal);

    if (availableSlots <= 0) {
      setLocalError("You have already reached the maximum of 5 images.");
      return;
    }

    setLocalError("");
    const filesToAdd = selectedFiles.slice(0, availableSlots);
    const updatedFiles = [...newImages, ...filesToAdd];

    newPreviews.forEach((url) => URL.revokeObjectURL(url));

    setNewImages(updatedFiles);
    setNewPreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    const totalImages = existingImages.length + newImages.length;
    if (totalImages === 0) {
      setLocalError("A product must have at least one image.");
      return;
    }

    const formData = new FormData();

    Object.entries(item).forEach(([key, value]) => {
      if (
        key !== "photo" &&
        key !== "images" &&
        value !== null &&
        value !== undefined &&
        value !== ""
      ) {
        if (Array.isArray(value)) {
          formData.append(key, value.join(", "));
        } else {
          formData.append(key, value as any);
        }
      }
    });

    existingImages.forEach((imgUrl) => {
      formData.append("existingImages", imgUrl);
    });

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    handleUpdate(id, formData);
  };

  if (loading && !item.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 animate-spin rounded-full border-2 border-black border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Loading Product Details…
          </p>
        </div>
      </div>
    );
  }

  const displaySizes = Array.isArray(item.size)
    ? item.size.join(", ")
    : item.size || "";
  const displayColors = Array.isArray(item.colors)
    ? item.colors.join(", ")
    : item.colors || "";
  const totalCount = existingImages.length + newImages.length;

  return (
    <main className="min-h-screen bg-[#F8F8F8] py-8 sm:py-10">
      <div className="mx-auto w-full  ">
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
              Edit Product
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Update product specs, pricing, inventory, and images.
            </p>
          </div>
        </header>

        {/* Errors */}
        {(error || localError) && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 shadow-xs">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs sm:text-sm font-bold">
              {localError || error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 01: Identification */}
          <FormSection label="Product Identification" number="01">
            <div className="space-y-4">
              <Field label="Product Name" icon={<Tag size={13} />} required>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5"
                  type="text"
                  placeholder="e.g. Graphic Relaxed T-Shirt"
                  value={item.name || ""}
                  onChange={(e) =>
                    handleChange("name", e.target.value.toUpperCase())
                  }
                  required
                />
              </Field>

              <Field label="Description" icon={<AlignLeft size={13} />}>
                <textarea
                  className="w-full min-h-24 resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-[13px] font-semibold text-gray-900 leading-relaxed outline-none transition-all hover:border-gray-300 focus:border-black focus:ring-2 focus:ring-black/5"
                  placeholder="Describe cuts, fabric compositions, and specific measurements..."
                  value={item.description || ""}
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
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black cursor-pointer"
                  value={item.gender || "MEN"}
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
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black"
                  type="text"
                  placeholder="e.g. CLOTHING"
                  value={item.category || ""}
                  onChange={(e) =>
                    handleChange("category", e.target.value.toUpperCase())
                  }
                />
              </Field>

              <Field label="Section (Subcategory)" icon={<Tag size={13} />}>
                <select
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black cursor-pointer"
                  value={item.section || "T-SHIRT"}
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
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black cursor-pointer"
                  value={item.style || "Casual"}
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
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={item.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </Field>

              <Field label="Discount (%)" icon={<Percent size={13} />}>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={item.discount || ""}
                  onChange={(e) => handleChange("discount", e.target.value)}
                />
              </Field>

              <Field label="On Sale?" icon={<Tag size={13} />}>
                <select
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black cursor-pointer"
                  value={String(item.isSale ?? "false")}
                  onChange={(e) => handleChange("isSale", e.target.value)}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </Field>

              <Field label="Units in Stock" icon={<Boxes size={13} />} required>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black"
                  type="number"
                  min="0"
                  placeholder="50"
                  value={item.countInStock ?? 1}
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
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black"
                  type="text"
                  placeholder="S, M, L, XL, XXL"
                  value={displaySizes}
                  onChange={(e) => handleChange("size", e.target.value)}
                />
                <p className="text-[10px] text-gray-400">
                  Separate size tags with commas.
                </p>
              </Field>

              <Field label="Available Colors" icon={<Palette size={13} />}>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black"
                  type="text"
                  placeholder="Red, Blue, Black"
                  value={displayColors}
                  onChange={(e) => handleChange("colors", e.target.value)}
                />
                <p className="text-[10px] text-gray-400">
                  Separate color names with commas.
                </p>
              </Field>
            </div>
          </FormSection>

          {/* Section 05: Media & Gallery Management */}
          <FormSection
            label="Media & Gallery"
            number="05"
            description={`${totalCount}/5 images`}
            action={
              totalCount > 0 ? (
                <button
                  type="button"
                  onClick={handleClearAllImages}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-nowrap"
                >
                  <Trash2 size={13} />
                  Clear All
                </button>
              ) : null
            }
          >
            <div className="space-y-4">
              {totalCount < 5 && (
                <label className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center transition-all hover:border-gray-400 hover:bg-gray-50">
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleNewImagesChange}
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-gray-200 transition-all group-hover:bg-black">
                    <ImagePlus
                      size={18}
                      className="text-gray-500 transition-colors group-hover:text-white"
                    />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-xs font-black uppercase tracking-wider text-gray-700">
                      Add more images ({5 - totalCount} remaining)
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                  </div>
                </label>
              )}

              {totalCount > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 pt-1">
                  {existingImages.map((src, index) => (
                    <div
                      key={`existing-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-xs"
                    >
                      <Image
                        src={getImageUrl(src)}
                        alt={`Existing ${index + 1}`}
                        fill
                        sizes="100px"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(index)}
                        aria-label="Remove image"
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-white shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>

                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-md bg-black/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                          Cover
                        </span>
                      )}
                      <span className="absolute top-2 left-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gray-700 backdrop-blur-xs shadow-xs">
                        Current
                      </span>
                    </div>
                  ))}

                  {newPreviews.map((src, index) => {
                    const isGlobalCover =
                      existingImages.length === 0 && index === 0;
                    return (
                      <div
                        key={`new-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/20 shadow-xs"
                      >
                        <img
                          src={src}
                          alt={`New preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNew(index)}
                          aria-label="Remove new image"
                          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-white shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-red-500 cursor-pointer"
                        >
                          <X size={12} />
                        </button>

                        {isGlobalCover && (
                          <span className="absolute bottom-2 left-2 rounded-md bg-black/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                            Cover
                          </span>
                        )}
                        <span className="absolute top-2 left-2 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-xs">
                          New
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </FormSection>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-black/10 transition-all hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save size={16} />
              <span>{loading ? "Saving Changes…" : "Save Changes"}</span>
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
  action,
  children,
}: {
  label: string;
  number: string;
  description?: string;
  action?: React.ReactNode;
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
        <div className="flex items-center gap-3">
          {description && (
            <p className="text-[10px] text-gray-400 font-bold">{description}</p>
          )}
          {action}
        </div>
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
