"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProduct } from "@/store/cardStore";
export default function Shopping() {
  const stack = useProduct((e) => e.stack);
  const fileting = stack.filter((e) => e.isChose == true);
  console.log(fileting);
  const router = useRouter();

  const handleCardClick = (productId: number) => {
    console.log(`User clicked on therapist number: ${productId}`);
    router.push(`/shopping/${productId}`);
  };
  return (
    <section className="flex items-center justify-center container mx-auto h-screen w-full">
      <h1>hello from cart</h1>
      {fileting.map((e) => (
        <div key={e.id}>
          <Image src={e.image} alt={e.title} width={500} height={500} />
          <h1>{e.title}</h1>
          <h1>{e.price}</h1>
          <h1>{e.rating}</h1>
          <button onClick={() => handleCardClick(e.id)}>details</button>
        </div>
      ))}
    </section>
  );
}
