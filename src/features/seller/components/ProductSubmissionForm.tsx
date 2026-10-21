"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle, PackagePlus } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type ProductSubmission = {
  name: string;
  description: string;
  price: string;
  category: string;
  type: string;
  section: string;
  isSale: string;
  discount: string;
  size: string;
  colors: string;
  photo: File | null;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg"]);

const initialProduct: ProductSubmission = {
  name: "",
  description: "",
  price: "",
  category: "",
  type: "",
  section: "",
  isSale: "false",
  discount: "0",
  size: "",
  colors: "",
  photo: null,
};

export const ProductSubmissionForm = () => {
  const { t, direction } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [item, setItem] = useState<ProductSubmission>(initialProduct);

  const handleChange = <K extends keyof ProductSubmission>(
    name: K,
    value: ProductSubmission[K],
  ) => {
    setItem((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      handleChange("photo", null);
      setError(t("sellerImageTypeError"));
      event.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      handleChange("photo", null);
      setError(t("sellerImageTooLarge"));
      event.target.value = "";
      return;
    }

    handleChange("photo", file);
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const price = Number(item.price);
    if (!item.name.trim() || !item.category.trim() || item.price.trim() === "" || !item.photo) {
      setError(t("sellerFormRequired"));
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError(t("sellerInvalidPrice"));
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
    });

    try {
      await api.post("product", formData);
      toast.success(t("sellerAddSuccess"));
      setItem({ ...initialProduct });
    } catch {
      const message = t("sellerAddFailed");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "min-h-11 w-full rounded-xl border border-border-subtle bg-surface px-3.5 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted focus:border-border-strong focus:ring-2 focus:ring-focus/20";
  const labelClass = "mb-1.5 block text-sm font-semibold text-secondary";

  return (
    <section
      dir={direction}
      className="mx-auto w-full max-w-4xl rounded-3xl border border-border-subtle bg-surface p-4 shadow-xl shadow-black/5 sm:p-7 lg:p-9"
    >
      <header className="mb-7 flex items-start gap-3 border-b border-border-subtle pb-6 sm:mb-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-subtle text-primary">
          <PackagePlus size={21} />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
            {t("sellerAddProductTitle")}
          </h1>
          <p className="mt-1.5 text-sm leading-6 text-muted">
            {t("sellerAddProductDescription")}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <div>
            <label htmlFor="seller-product-name" className={labelClass}>
              {t("sellerProductName")} <span aria-hidden="true" className="text-danger">*</span>
            </label>
            <input
              id="seller-product-name"
              className={inputClass}
              type="text"
              autoComplete="off"
              placeholder={t("sellerProductNamePlaceholder")}
              value={item.name}
              onChange={(event) => handleChange("name", event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="seller-category" className={labelClass}>
              {t("sellerCategory")} <span aria-hidden="true" className="text-danger">*</span>
            </label>
            <input
              id="seller-category"
              className={inputClass}
              type="text"
              placeholder={t("sellerCategoryPlaceholder")}
              value={item.category}
              onChange={(event) => handleChange("category", event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="seller-type" className={labelClass}>{t("adminDressStyleLabel")}</label>
            <input
              id="seller-type"
              className={inputClass}
              type="text"
              value={item.type}
              onChange={(event) => handleChange("type", event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="seller-section" className={labelClass}>{t("adminProductSectionLabel")}</label>
            <input
              id="seller-section"
              className={inputClass}
              type="text"
              value={item.section}
              onChange={(event) => handleChange("section", event.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="seller-description" className={labelClass}>{t("sellerDescription")}</label>
          <textarea
            id="seller-description"
            className={`${inputClass} min-h-28 resize-y leading-6`}
            placeholder={t("sellerDescriptionPlaceholder")}
            value={item.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-2xl bg-surface-subtle p-4 sm:grid-cols-3 sm:gap-5 sm:p-5">
          <div>
            <label htmlFor="seller-price" className={labelClass}>
              {t("sellerPriceEGP")} <span aria-hidden="true" className="text-danger">*</span>
            </label>
            <input
              id="seller-price"
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder={t("adminPricePlaceholder")}
              value={item.price}
              onChange={(event) => handleChange("price", event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="seller-discount" className={labelClass}>{t("sellerDiscount")}</label>
            <input
              id="seller-discount"
              className={inputClass}
              type="number"
              min="0"
              max="100"
              step="1"
              inputMode="numeric"
              placeholder="0"
              value={item.discount}
              onChange={(event) => handleChange("discount", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="seller-on-sale" className={labelClass}>{t("sellerOnSale")}</label>
            <select
              id="seller-on-sale"
              className={inputClass}
              value={item.isSale}
              onChange={(event) => handleChange("isSale", event.target.value)}
            >
              <option value="">{t("sellerSelectOption")}</option>
              <option value="true">{t("sellerYes")}</option>
              <option value="false">{t("sellerNo")}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <div>
            <label htmlFor="seller-sizes" className={labelClass}>{t("sellerSizesLabel")}</label>
            <input
              id="seller-sizes"
              className={inputClass}
              type="text"
              placeholder={t("sellerSizesPlaceholder")}
              value={item.size}
              onChange={(event) => handleChange("size", event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="seller-colors" className={labelClass}>{t("sellerColorsLabel")}</label>
            <input
              id="seller-colors"
              className={inputClass}
              type="text"
              placeholder={t("sellerColorsPlaceholder")}
              value={item.colors}
              onChange={(event) => handleChange("colors", event.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="seller-photo" className={labelClass}>{t("adminUploadImagesLabel")}</label>
          <label
            htmlFor="seller-photo"
            className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong bg-surface-subtle px-4 py-5 text-center transition-colors hover:bg-surface-muted focus-within:ring-2 focus-within:ring-focus/30"
          >
            {item.photo ? <CheckCircle2 size={22} className="text-success" /> : <ImagePlus size={22} className="text-muted" />}
            <span className="text-sm font-semibold text-primary">
              {item.photo
                ? t("sellerSelectedPhoto").replace("{name}", item.photo.name)
                : t("sellerUploadPhoto")}
            </span>
            <span className="text-xs text-muted">{t("sellerImageTypes")}</span>
          </label>
          <input
            id="seller-photo"
            type="file"
            accept="image/png,image/jpeg"
            onChange={handlePhotoChange}
            className="sr-only"
          />
          {item.photo && (
            <button
              type="button"
              className="mt-2 text-xs font-semibold text-danger underline-offset-4 hover:underline"
              onClick={() => handleChange("photo", null)}
            >
              {t("adminRemoveImage")}
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 px-3.5 py-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-action px-5 py-3 text-sm font-bold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle size={17} className="animate-spin" /> : <PackagePlus size={17} />}
          {loading ? t("sellerProcessing") : t("sellerAddToStore")}
        </button>
      </form>
    </section>
  );
};
