"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ProductEditItem {
  _id?: string;
  name: string;
  description: string;
  price: string | number;
  category: string;
  type: string;
  section: string;
  gender: string;
  isSale: string | boolean;
  discount: string | number;
  size: string | string[];
  colors: string | string[];
  style: string;
  countInStock: string | number;
  images: string[];
  photo?: string | File | null;
}

export const usePatch = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [item, setItem] = useState<ProductEditItem>({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    section: "",
    gender: "MEN",
    isSale: "false",
    discount: "",
    size: "",
    colors: "",
    style: "Casual",
    countInStock: "1",
    images: [],
    photo: null,
  });

  const handleChange = (name: string, value: any) => {
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`product/${id}`);
      const data =
        res.data?.data?.product ||
        res.data?.product ||
        res.data?.Product ||
        res.data;

      if (!data) throw new Error("Product not found");

      setItem({
        _id: data._id,
        name: data.name || "",
        description: data.description || "",
        price: data.price !== undefined ? String(data.price) : "",
        category: data.category || "",
        type: data.type || data.section || "",
        section: data.section || data.type || "T-SHIRT",
        gender: data.gender || "MEN",
        isSale: String(data.isSale ?? "false"),
        discount: data.discount !== undefined ? String(data.discount) : "",
        size: data.size || "",
        colors: data.colors || "",
        style: data.style || "Casual",
        countInStock:
          data.countInStock !== undefined ? String(data.countInStock) : "1",
        images:
          data.images && data.images.length > 0
            ? data.images
            : data.photo
              ? [data.photo]
              : [],
        photo: data.photo || null,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load product details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, customFormData?: FormData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    let payload: FormData;

    if (customFormData instanceof FormData) {
      payload = customFormData;
    } else {
      payload = new FormData();
      Object.entries(item).forEach(([key, value]) => {
        if (key === "photo" && value instanceof File) {
          payload.append("images", value);
        } else if (
          key !== "photo" &&
          key !== "images" &&
          value !== null &&
          value !== undefined &&
          value !== ""
        ) {
          if (Array.isArray(value)) {
            payload.append(key, value.join(", "));
          } else {
            payload.append(key, String(value));
          }
        }
      });

      item.images?.forEach((img) => payload.append("existingImages", img));
    }

    try {
      await api.patch(`product/${id}`, payload);
      setSuccess(true);
      router.refresh();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update product.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    item,
    setItem,
    error,
    setError,
    loading,
    success,
    handleChange,
    handleUpdate,
    fetchProduct,
  };
};
