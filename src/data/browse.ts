import { StaticImageData } from "next/image";
import Casual from "@/assets/browse/casual.webp";
import Formal from "@/assets/browse/formal.webp";
import Party from "@/assets/browse/party.webp";
import Gym from "@/assets/browse/gym.webp";
interface typeBrowse {
  image: StaticImageData;
  name: string;
  cols: string;
}

export const ItemsBrowse: typeBrowse[] = [
  { image: Casual, name: "Casual", cols: "col-span-1" },
  { image: Formal, name: "Formal", cols: "col-span-2" },
  { image: Party, name: "Party", cols: "col-span-2" },
  { image: Gym, name: "Gym", cols: "col-span-1" },
];
