import { NextResponse } from "next/server";
import { products } from "../../../data/data";

export async function GET() {
  return NextResponse.json(products);
}
