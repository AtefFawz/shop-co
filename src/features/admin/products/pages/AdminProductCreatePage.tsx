"use client";

import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useRouter } from "next/navigation";
import {
  Tag,
  AlignLeft,
  Banknote,
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

import { getApiErrorDetails } from "@/lib/errorUtils";
export default function AdminProductCreatePage() {
  const router = useRouter();
  const { t, direction } = useLocale();

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
    // type: "T-SHIRT",
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
      //   type: "T-SHIRT",
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
      setError(t("adminImageRequired"));
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
    } catch (err: unknown) {
      const details = getApiErrorDetails(err);
      setError(
        details.response?.data?.message ||
          details.message ||
          t("adminCreateProductFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir={direction} className="min-h-screen bg-surface-subtle">
      <div className="Responsive w-full py-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={t("adminBackLabel")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-secondary shadow-xs transition-all hover:bg-surface-subtle active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-primary leading-tight">
              {t("adminAddProductHeading")}
            </h1>
            <p className="text-xs text-muted font-medium mt-0.5">
              {t("adminAddProductIntro")}
            </p>
          </div>
        </header>

        {/* Alerts */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-success-border bg-success-soft px-5 py-4 text-success shadow-xs">
            <CheckCircle2 size={18} className="shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                {t("adminProductPublished")}
              </p>
              <p className="text-[11px] text-success">
                {t("adminProductPublishedDescription")}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-danger-border bg-danger-soft px-5 py-4 text-danger shadow-xs">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 01: Identification */}
          <FormSection label={t("adminProductIdentification")} number="01">
            <div className="space-y-4">
              <Field
                label={t("adminProductNameField")}
                icon={<Tag size={13} />}
                required
              >
                <input
                  className="input-base"
                  type="text"
                  placeholder={t("adminProductNamePlaceholder")}
                  value={item.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </Field>

              <Field
                label={t("adminProductDescriptionLabel")}
                icon={<AlignLeft size={13} />}
              >
                <textarea
                  className="input-base min-h-24 resize-none py-3 leading-relaxed"
                  placeholder={t("adminProductDescriptionPlaceholder")}
                  value={item.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 02: Categorization */}
          <FormSection label={t("adminCategorizationTarget")} number="02">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label={t("adminTargetGender")}
                icon={<Users size={13} />}
                required
              >
                <select
                  className="input-base cursor-pointer"
                  value={item.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="MEN">{t("adminProductGenderMen")}</option>
                  <option value="WOMEN">{t("adminProductGenderWomen")}</option>
                  <option value="KIDS">{t("adminGenderKids")}</option>
                  <option value="UNISEX">
                    {t("adminProductGenderUnisex")}
                  </option>
                </select>
              </Field>

              <Field label={t("adminMainCategory")} icon={<Layers size={13} />}>
                <input
                  className="input-base"
                  type="text"
                  placeholder={t("adminMainCategoryPlaceholder")}
                  value={item.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </Field>

              <Field
                label={t("adminProductSectionLabel")}
                icon={<Tag size={13} />}
              >
                <select
                  className="input-base cursor-pointer"
                  value={item.section}
                  onChange={(e) => {
                    handleChange("section", e.target.value);
                    handleChange("type", e.target.value);
                  }}
                >
                  <option value="T-SHIRT">{t("adminSectionTShirt")}</option>
                  <option value="SHIRT">{t("adminSectionShirt")}</option>
                  <option value="PANTS">{t("adminSectionPants")}</option>
                  <option value="JEANS">{t("adminSectionJeans")}</option>
                </select>
              </Field>

              <Field label={t("adminDressStyle")} icon={<Sparkles size={13} />}>
                <select
                  className="input-base cursor-pointer"
                  value={item.style}
                  onChange={(e) => handleChange("style", e.target.value)}
                >
                  <option value="Casual">{t("casual")}</option>
                  <option value="Formal">{t("formal")}</option>
                  <option value="Party">{t("party")}</option>
                  <option value="Gym">{t("gym")}</option>
                </select>
              </Field>
            </div>
          </FormSection>

          {/* Section 03: Pricing & Inventory */}
          <FormSection label={t("adminPricingInventory")} number="03">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field
                label={t("adminBasePrice")}
                icon={<Banknote size={13} />}
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

              <Field
                label={t("adminDiscountLabel")}
                icon={<Percent size={13} />}
              >
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

              <Field label={t("adminOnSaleLabel")} icon={<Tag size={13} />}>
                <select
                  className="input-base cursor-pointer"
                  value={item.isSale}
                  onChange={(e) => handleChange("isSale", e.target.value)}
                >
                  <option value="false">{t("adminNoOption")}</option>
                  <option value="true">{t("adminYesOption")}</option>
                </select>
              </Field>

              <Field
                label={t("adminStockUnitsLabel")}
                icon={<Boxes size={13} />}
                required
              >
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
          <FormSection label={t("adminProductVariants")} number="04">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label={t("adminProductSizes")} icon={<Ruler size={13} />}>
                <input
                  className="input-base"
                  type="text"
                  placeholder={t("adminSizePlaceholder")}
                  value={item.size}
                  onChange={(e) => handleChange("size", e.target.value)}
                />
                <p className="text-[10px] text-muted">
                  {t("adminSeparateWithCommas")}
                </p>
              </Field>

              <Field
                label={t("adminProductColors")}
                icon={<Palette size={13} />}
              >
                <input
                  className="input-base"
                  type="text"
                  placeholder={t("adminColorsPlaceholder")}
                  value={item.colors}
                  onChange={(e) => handleChange("colors", e.target.value)}
                />
                <p className="text-[10px] text-muted">
                  {t("adminSeparateColorsWithCommas")}
                </p>
              </Field>
            </div>
          </FormSection>

          {/* Section 05: Media & Gallery */}
          <FormSection
            label={t("adminMediaGallery")}
            number="05"
            description={t("adminMaxFiveImages")}
          >
            <div className="space-y-4">
              <label className="group relative flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-subtle/50 p-6 text-center transition-all hover:border-border-strong hover:bg-surface-subtle">
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleImagesChange}
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface shadow-xs ring-1 ring-border transition-all group-hover:bg-action">
                  <ImagePlus
                    size={20}
                    className="text-muted transition-colors group-hover:text-on-action"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-black uppercase tracking-wider text-secondary">
                    {t("adminUploadImagesLabel")}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {t("adminImageFormatHint")}
                  </p>
                </div>
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {previews.map((src, index) => (
                    <div
                      key={src}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-xs"
                    >
                      <img
                        src={src}
                        alt={t("adminPreviewImageAlt")}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-action/75 text-on-action shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-danger hover:text-on-danger cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 start-2 rounded-md bg-action/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-on-action backdrop-blur-xs">
                          {t("adminCoverImage")}
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-action px-5 py-4 text-xs font-black uppercase tracking-widest text-on-action shadow-[0_10px_28px_-8px_rgba(var(--shadow-rgb),0.1)] transition-all hover:bg-action-hover active:scale-[0.99] disabled:bg-surface-hover disabled:cursor-not-allowed cursor-pointer"
            >
              <PackagePlus size={16} />
              <span>
                {loading
                  ? t("adminProductLoadingSave")
                  : t("adminProductAddTitle")}
              </span>
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
    <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-xs">
      <div className="flex items-center justify-between border-b border-border-subtle bg-surface-subtle/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-action text-[10px] font-black text-on-action">
            {number}
          </span>
          <p className="text-xs font-black uppercase tracking-wider text-secondary">
            {label}
          </p>
        </div>
        {description && (
          <p className="text-[10px] text-muted font-bold">{description}</p>
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
      <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-muted">
        {icon}
        <span className="truncate">{label}</span>
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}
