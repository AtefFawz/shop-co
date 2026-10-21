"use client";

import { use, useEffect, useState } from "react";
import { usePatch } from "@/hooks/editProduct";
import { useRouter } from "next/navigation";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import Image from "next/image";
import {
  Tag,
  AlignLeft,
  Banknote,
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

export default function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const { t, direction } = useLocale();

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
      setLocalError(t("adminPhotoLimitReached"));
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
      setLocalError(t("adminProductNeedsImage"));
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
      <div dir={direction} className="min-h-screen flex items-center justify-center bg-surface-subtle">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 animate-spin rounded-full border-2 border-border-strong border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted">
            {t("adminLoadingProductDetails")}
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
    <main dir={direction} className="min-h-screen bg-surface-subtle py-8 sm:py-10">
      <div className="mx-auto w-full  ">
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
              {t("adminEditProductHeading")}
            </h1>
            <p className="text-xs text-muted font-medium mt-0.5">
              {t("adminEditProductIntro")}
            </p>
          </div>
        </header>

        {/* Errors */}
        {(error || localError) && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-danger-border bg-danger-soft px-5 py-4 text-danger shadow-xs">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs sm:text-sm font-bold">
              {localError || error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 01: Identification */}
          <FormSection label={t("adminProductIdentification")} number="01">
            <div className="space-y-4">
              <Field label={t("adminProductNameField")} icon={<Tag size={13} />} required>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-focus/5"
                  type="text"
                  placeholder={t("adminProductNamePlaceholder")}
                  value={item.name || ""}
                  onChange={(e) =>
                    handleChange("name", e.target.value.toUpperCase())
                  }
                  required
                />
              </Field>

              <Field label={t("adminProductDescriptionLabel")} icon={<AlignLeft size={13} />}>
                <textarea
                  className="w-full min-h-24 resize-none rounded-xl border border-border bg-surface px-3.5 py-3 text-[13px] font-semibold text-primary leading-relaxed outline-none transition-all hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-focus/5"
                  placeholder={t("adminProductDescriptionPlaceholder")}
                  value={item.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </Field>
            </div>
          </FormSection>

          {/* Section 02: Categorization */}
          <FormSection label={t("adminCategorizationTarget")} number="02">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={t("adminTargetGender")} icon={<Users size={13} />} required>
                <select
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary cursor-pointer"
                  value={item.gender || "MEN"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="MEN">{t("adminProductGenderMen")}</option>
                  <option value="WOMEN">{t("adminProductGenderWomen")}</option>
                  <option value="KIDS">{t("adminGenderKids")}</option>
                  <option value="UNISEX">{t("adminProductGenderUnisex")}</option>
                </select>
              </Field>

              <Field label={t("adminMainCategory")} icon={<Layers size={13} />}>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary"
                  type="text"
                  placeholder={t("adminMainCategoryPlaceholder")}
                  value={item.category || ""}
                  onChange={(e) =>
                    handleChange("category", e.target.value.toUpperCase())
                  }
                />
              </Field>

              <Field label={t("adminProductSectionLabel")} icon={<Tag size={13} />}>
                <select
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary cursor-pointer"
                  value={item.section || "T-SHIRT"}
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
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary cursor-pointer"
                  value={item.style || "Casual"}
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
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00" inputMode="decimal"
                  value={item.price || ""}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </Field>

              <Field label={t("adminDiscountLabel")} icon={<Percent size={13} />}>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={item.discount || ""}
                  onChange={(e) => handleChange("discount", e.target.value)}
                />
              </Field>

              <Field label={t("adminOnSaleLabel")} icon={<Tag size={13} />}>
                <select
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary cursor-pointer"
                  value={String(item.isSale ?? "false")}
                  onChange={(e) => handleChange("isSale", e.target.value)}
                >
                  <option value="false">{t("adminNoOption")}</option>
                  <option value="true">{t("adminYesOption")}</option>
                </select>
              </Field>

              <Field label={t("adminStockUnitsLabel")} icon={<Boxes size={13} />} required>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary"
                  type="number"
                  min="0"
                  placeholder="50" inputMode="numeric"
                  value={item.countInStock ?? 1}
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
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary"
                  type="text"
                  placeholder={t("adminSizePlaceholder")}
                  value={displaySizes}
                  onChange={(e) => handleChange("size", e.target.value)}
                />
                <p className="text-[10px] text-muted">
                  Separate size tags with commas.
                </p>
              </Field>

              <Field label={t("adminProductColors")} icon={<Palette size={13} />}>
                <input
                  className="w-full min-h-[44px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[13px] font-semibold text-primary outline-none transition-all hover:border-border-strong focus:border-primary"
                  type="text"
                  placeholder={t("adminColorsPlaceholder")}
                  value={displayColors}
                  onChange={(e) => handleChange("colors", e.target.value)}
                />
                <p className="text-[10px] text-muted">
                  Separate color names with commas.
                </p>
              </Field>
            </div>
          </FormSection>

          {/* Section 05: Media & Gallery Management */}
          <FormSection
            label={t("adminMediaGallery")}
            number="05"
            description={t("adminProductImageCount").replace("{count}", String(totalCount))}
            action={
              totalCount > 0 ? (
                <button
                  type="button"
                  onClick={handleClearAllImages}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-danger hover:text-danger bg-danger-soft hover:bg-danger-soft px-3 py-1.5 rounded-xl transition-all cursor-pointer text-nowrap"
                >
                  <Trash2 size={13} />
                  {t("adminClearAllImages")}
                </button>
              ) : null
            }
          >
            <div className="space-y-4">
              {totalCount < 5 && (
                <label className="group relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-subtle/50 p-6 text-center transition-all hover:border-border-strong hover:bg-surface-subtle">
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleNewImagesChange}
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface shadow-xs ring-1 ring-border transition-all group-hover:bg-action">
                    <ImagePlus
                      size={18}
                      className="text-muted transition-colors group-hover:text-on-action"
                    />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-xs font-black uppercase tracking-wider text-secondary">
                      {t("adminAddImagesRemaining").replace("{count}", String(5 - totalCount))}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">
                      {t("adminImageUploadLimitHint")}
                    </p>
                  </div>
                </label>
              )}

              {totalCount > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 pt-1">
                  {existingImages.map((src, index) => (
                    <div
                      key={`existing-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-xs"
                    >
                      <Image
                        src={getImageUrl(src)}
                        alt={`${t("adminCurrentImage")} ${index + 1}`}
                        fill
                        sizes="100px"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(index)}
                        aria-label={t("adminRemoveImage")}
                        className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-action/75 text-on-action shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-danger hover:text-on-danger cursor-pointer"
                      >
                        <X size={12} />
                      </button>

                      {index === 0 && (
                        <span className="absolute bottom-2 start-2 rounded-md bg-action/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-on-action">
                          {t("adminCoverImage")}
                        </span>
                      )}
                      <span className="absolute top-2 start-2 rounded-md bg-surface/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-secondary backdrop-blur-xs shadow-xs">
                        {t("adminCurrentImage")}
                      </span>
                    </div>
                  ))}

                  {newPreviews.map((src, index) => {
                    const isGlobalCover =
                      existingImages.length === 0 && index === 0;
                    return (
                      <div
                        key={`new-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-success-border bg-success-soft shadow-xs"
                      >
                        <img
                          src={src}
                          alt={`${t("adminPreviewImageAlt")} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNew(index)}
                          aria-label={t("adminProductImageRemoveNew")}
                          className="absolute end-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-action/75 text-on-action shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-danger hover:text-on-danger cursor-pointer"
                        >
                          <X size={12} />
                        </button>

                        {isGlobalCover && (
                          <span className="absolute bottom-2 start-2 rounded-md bg-action/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-on-action">
                            Cover
                          </span>
                        )}
                        <span className="absolute top-2 start-2 rounded-md bg-success px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-on-success shadow-xs">
                          {t("adminNewImage")}
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-action px-5 py-4 text-xs font-black uppercase tracking-widest text-on-action shadow-[0_10px_28px_-8px_rgba(var(--shadow-rgb),0.1)] transition-all hover:bg-action-hover active:scale-[0.99] disabled:bg-surface-hover disabled:cursor-not-allowed cursor-pointer"
            >
              <Save size={16} />
              <span>{loading ? t("adminProductUpdateLoading") : t("adminProductUpdateAction")}</span>
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
        <div className="flex items-center gap-3">
          {description && (
            <p className="text-[10px] text-muted font-bold">{description}</p>
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
      <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-muted">
        {icon}
        <span className="truncate">{label}</span>
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}
