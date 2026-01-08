"use client";
import { useRouter } from "next/navigation"; // 1. استيراد الهوك

export default function Selector() {
  const router = useRouter(); // 2. تعريف الراوتر

  // 3. دالة بتشتغل لما تغير الاختيار
  const handleNavigation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value; // بناخد المسار من الـ value
    router.push(path); // بنقول للراوتر روح للمسار ده
  };

  return (
    <section>
      {/* 4. ربط الدالة بـ onChange */}
      <select
        name="Selector"
        onChange={handleNavigation}
        defaultValue=""
        className="font-bold text-xl md:text-[16px] lg:text-xl"
      >
        {/* <option value="" disabled>
          Navigate to...
        </option>{" "} */}
        {/* اختيار مبدئي */}
        {/* 5. المسار بيتحط في الـ value */}
        <option value="/shop">Shop</option>
        <option value="/">home</option>
        <option value="/about">about</option>
      </select>
    </section>
  );
}
