import { StaticImageData } from "next/image";
import Casual from "@/assets/browse/casual.png";
import Formal from "@/assets/browse/formal.png";
import Party from "@/assets/browse/party.png";
import Gym from "@/assets/browse/gym.png";
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
