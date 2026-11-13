import api from "@/lib/api";
import type { Product } from "@/types";

export type StylistGender = "MEN" | "WOMEN" | "KIDS" | "UNISEX";
export type StylistStyle = "casual" | "streetwear" | "minimal" | "classic" | "formal" | "sporty" | "elegant";
export type StylistOccasion = "everyday" | "work" | "evening" | "party" | "sport" | "travel";
export type StylistSlot = "onePiece" | "top" | "bottom" | "shoes" | "accessory";

export type PersonalStylistPreferences = {
  gender: StylistGender;
  style: StylistStyle;
  occasion: StylistOccasion;
  color?: string;
  budget: number;
};

export type PersonalStylistItem = {
  slot: StylistSlot;
  effectivePrice: number;
  product: Product;
};

export type PersonalStylistResult = {
  items: PersonalStylistItem[];
  total: number;
  remaining: number;
  budget: number;
  isComplete: boolean;
  missingSlots: StylistSlot[];
  strategy: "catalogue-fit-v1";
};

export async function requestPersonalizedLook(
  preferences: PersonalStylistPreferences,
): Promise<PersonalStylistResult> {
  const response = await api.post("features/stylist", preferences);
  const result = response.data?.data as PersonalStylistResult | undefined;
  if (!result || !Array.isArray(result.items)) {
    throw new Error("The stylist service returned an invalid response.");
  }
  return result;
}
