"use client";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const usePatch = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: "".toUpperCase(),
    section: "".toUpperCase(),
    isSale: "",
    discount: "",
    size: "",
    colors: "",
    photo: null as File | null,
  });

  const handleChange = (name: string, value: string | File) => {
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`product/${id}`);
      const data = res.data?.data?.product;
      setItem({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        category: data.category || "",
        type: data.type || "",
        section: data.section || "",
        isSale: data.isSale?.toString() || "false",
        discount: data.discount || "",
        size: data.size || "",
        colors: data.colors || "",
        photo: null,
      });
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);

    const dataToSend = new FormData();
    Object.entries(item).forEach(([key, value]) => {
      if (key === "photo") {
        if (value instanceof File) {
          dataToSend.append(key, value);
        }
      } else {
        if (value !== null && value !== undefined) {
          dataToSend.append(key, value as string);
        }
      }
    });

    try {
      await api.patch(`product/${id}`, dataToSend);
      router.refresh();
    } catch (error: any) {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return { item, error, loading, handleChange, handleUpdate, fetchProduct };
};
