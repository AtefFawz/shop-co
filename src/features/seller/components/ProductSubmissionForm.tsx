"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ImagePlus, LoaderCircle, PackagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type ProductSubmission = {
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  categoryEn: string;
  categoryAr: string;
  sectionEn: string;
  sectionAr: string;
  genderEn: string;
  genderAr: string;
  styleEn: string;
  styleAr: string;
  price: string;
  discount: string;
  isSale: string;
  countInStock: string;
  size: string;
  colors: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 4;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const EMPTY_ITEM: ProductSubmission = {
  nameEn: "", nameAr: "", descriptionEn: "", descriptionAr: "",
  categoryEn: "", categoryAr: "", sectionEn: "", sectionAr: "",
  genderEn: "UNISEX", genderAr: "للجنسين", styleEn: "Casual", styleAr: "كاجوال",
  price: "", discount: "0", isSale: "false", countInStock: "0", size: "", colors: "",
};

export const ProductSubmissionForm = () => {
  const { t, direction } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [item, setItem] = useState<ProductSubmission>(EMPTY_ITEM);
  const [images, setImages] = useState<File[]>([]);

  const handleChange = <K extends keyof ProductSubmission>(name: K, value: ProductSubmission[K]) => {
    setItem((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    const accepted: File[] = [];
    for (const file of selected) {
      if (images.length + accepted.length >= MAX_IMAGES) {
        setError(direction === "rtl" ? "الحد الأقصى 4 صور للمنتج." : "A product can have up to 4 images.");
        break;
      }
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        setError(direction === "rtl" ? "الصيغ المدعومة JPG وPNG وWebP فقط." : "Only JPG, PNG and WebP images are supported.");
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError(direction === "rtl" ? "حجم كل صورة يجب ألا يتجاوز 5 ميجابايت." : "Each image must be 5 MB or smaller.");
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length) setImages((current) => [...current, ...accepted]);
    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    const price = Number(item.price);
    const discount = Number(item.discount || 0);
    const stock = Number(item.countInStock || 0);
    const requiredFields = [item.nameEn, item.nameAr, item.descriptionEn, item.descriptionAr,
      item.categoryEn, item.categoryAr, item.sectionEn, item.sectionAr];
    if (requiredFields.some((value) => !value.trim()) || !item.price.trim() || images.length === 0) {
      setError(direction === "rtl" ? "أكمل بيانات المنتج باللغتين وأضف صورة واحدة على الأقل." : "Complete the English and Arabic product details and add at least one image.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(discount) || discount < 0 || discount > 100 || !Number.isInteger(stock) || stock < 0) {
      setError(direction === "rtl" ? "راجع السعر والخصم والكمية المتاحة." : "Check the price, discount and stock quantity.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => {
      if (value !== "") formData.append(key, value);
    });
    images.forEach((file) => formData.append("images", file));

    try {
      await api.post("product", formData);
      toast.success(t("sellerAddSuccess"));
      setItem(EMPTY_ITEM);
      setImages([]);
    } catch (submitError: unknown) {
      const apiMessage = (submitError as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const message = apiMessage || t("sellerAddFailed");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "min-h-11 w-full rounded-xl border border-border-subtle bg-surface px-3.5 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted focus:border-border-strong focus:ring-2 focus:ring-focus/20";
  const labelClass = "mb-1.5 block text-sm font-semibold text-secondary";
  const field = (key: keyof ProductSubmission, label: string, required = false, type = "text") => (
    <div key={key}>
      <label htmlFor={`seller-${key}`} className={labelClass}>{label}{required && <span className="ms-1 text-danger">*</span>}</label>
      <input id={`seller-${key}`} className={inputClass} type={type} value={item[key]} onChange={(event) => handleChange(key, event.target.value)} required={required} />
    </div>
  );

  return (
    <section dir={direction} className="mx-auto w-full max-w-4xl rounded-3xl border border-border-subtle bg-surface p-4 shadow-xl shadow-black/5 sm:p-7 lg:p-9">
      <header className="mb-7 flex items-start gap-3 border-b border-border-subtle pb-6 sm:mb-8">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-subtle text-primary"><PackagePlus size={21} /></span>
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">{t("sellerAddProductTitle")}</h1>
          <p className="mt-1.5 text-sm leading-6 text-muted">{t("sellerAddProductDescription")}</p>
          <p className="mt-2 text-xs text-secondary">{direction === "rtl" ? "أدخل المحتوى بالعربية والإنجليزية ليظهر المنتج بلغتي المتجر." : "Provide both languages so the product is localized across the store."}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-3">
          <h2 className="text-sm font-black text-primary">{direction === "rtl" ? "بيانات المنتج" : "Product content"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("nameEn", direction === "rtl" ? "اسم المنتج — English" : "Product name — English", true)}
            {field("nameAr", direction === "rtl" ? "اسم المنتج — العربية" : "Product name — Arabic", true)}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="seller-descriptionEn" className={labelClass}>{direction === "rtl" ? "الوصف — English" : "Description — English"} *</label>
              <textarea id="seller-descriptionEn" className={`${inputClass} min-h-28 resize-y leading-6`} value={item.descriptionEn} onChange={(event) => handleChange("descriptionEn", event.target.value)} required />
            </div>
            <div>
              <label htmlFor="seller-descriptionAr" className={labelClass}>{direction === "rtl" ? "الوصف — العربية" : "Description — Arabic"} *</label>
              <textarea id="seller-descriptionAr" dir="rtl" className={`${inputClass} min-h-28 resize-y leading-6`} value={item.descriptionAr} onChange={(event) => handleChange("descriptionAr", event.target.value)} required />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {field("categoryEn", direction === "rtl" ? "التصنيف — English" : "Category — English", true)}
          {field("categoryAr", direction === "rtl" ? "التصنيف — العربية" : "Category — Arabic", true)}
          {field("sectionEn", direction === "rtl" ? "القسم — English" : "Section — English", true)}
          {field("sectionAr", direction === "rtl" ? "القسم — العربية" : "Section — Arabic", true)}
          <div>
            <label htmlFor="seller-gender" className={labelClass}>{direction === "rtl" ? "الفئة المستهدفة" : "Target audience"}</label>
            <select id="seller-gender" className={inputClass} value={item.genderEn} onChange={(event) => {
              const value = event.target.value;
              const arabic: Record<string, string> = { MEN: "رجالي", WOMEN: "نسائي", KIDS: "أطفال", UNISEX: "للجنسين" };
              setItem((current) => ({ ...current, genderEn: value, genderAr: arabic[value] || "للجنسين" }));
            }}>
              <option value="MEN">Men / رجالي</option><option value="WOMEN">Women / نسائي</option><option value="KIDS">Kids / أطفال</option><option value="UNISEX">Unisex / للجنسين</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field("styleEn", direction === "rtl" ? "النمط — English" : "Style — English")}
            {field("styleAr", direction === "rtl" ? "النمط — العربية" : "Style — Arabic")}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-2xl bg-surface-subtle p-4 sm:grid-cols-4 sm:gap-5 sm:p-5">
          {field("price", t("sellerPriceEGP"), true, "number")}
          {field("discount", t("sellerDiscount"), false, "number")}
          {field("countInStock", direction === "rtl" ? "الكمية المتاحة" : "Stock quantity", false, "number")}
          <div><label htmlFor="seller-on-sale" className={labelClass}>{t("sellerOnSale")}</label><select id="seller-on-sale" className={inputClass} value={item.isSale} onChange={(event) => handleChange("isSale", event.target.value)}><option value="false">{t("sellerNo")}</option><option value="true">{t("sellerYes")}</option></select></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {field("size", t("sellerSizesLabel"))}
          {field("colors", t("sellerColorsLabel"))}
        </div>

        <div>
          <label htmlFor="seller-images" className={labelClass}>{direction === "rtl" ? "صور المنتج (حتى 4 صور، 5MB لكل صورة)" : "Product images (up to 4, 5MB each)"} *</label>
          <label htmlFor="seller-images" className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-strong bg-surface-subtle px-4 py-5 text-center transition-colors hover:bg-surface-muted focus-within:ring-2 focus-within:ring-focus/30">
            <ImagePlus size={22} className="text-muted" />
            <span className="text-sm font-semibold text-primary">{direction === "rtl" ? "اختر صور المنتج" : "Choose product images"}</span>
            <span className="text-xs text-muted">JPG · PNG · WebP</span>
          </label>
          <input id="seller-images" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleImagesChange} className="sr-only" />
          {images.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2">{images.map((file, index) => <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-subtle px-3 py-2 text-xs"><span className="flex min-w-0 items-center gap-2"><CheckCircle2 size={15} className="shrink-0 text-success" /><span className="truncate">{file.name}</span></span><button type="button" aria-label={direction === "rtl" ? "حذف الصورة" : "Remove image"} onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} className="rounded-md p-1 text-danger hover:bg-danger/10"><X size={14} /></button></div>)}</div>}
        </div>

        {error && <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 px-3.5 py-3 text-sm font-medium text-danger">{error}</p>}
        <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-action px-5 py-3 text-sm font-bold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? <LoaderCircle size={17} className="animate-spin" /> : <PackagePlus size={17} />}{loading ? t("sellerProcessing") : t("sellerAddToStore")}
        </button>
      </form>
    </section>
  );
};
