"use client";
import Link from "next/link";
import Image from "next/image";
import Login from "@/assets/shop/screenShop.png";
import { FaGoogle, FaApple, FaEnvelope, FaLock } from "react-icons/fa";

// افترضت إن الصورة اسمها fashion-couple.jpg
// لو عندك اسم تاني غيره في كود الـ Image تحت

export default function LoginPage() {
  return (
    // h-screen عشان ياخد طول الشاشة بالكامل
    <div className="w-full min-h-screen flex bg-white">
      {/* القسم الأيسر: الصورة (كاملة من الحافة للحافة) */}
      {/* hidden on mobile, w-1/2 on desktop, relative for Image fill */}
      <div className="hidden md:block md:w-1/2 h-screen relative bg-gray-900">
        <Image
          src={Login} // 👈 تأكد من مسار صورتك هنا
          alt="Login Fashion"
          fill // عشان تملا الكونتينر
          className="object-cover opacity-90" // opacity عشان نغمقها سنة
          priority
        />
        {/* طبقة تدرج لوني فوق الصورة عشان النص يظهر بوضوح */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* النص فوق الصورة */}
        <div className="absolute bottom-[10%] left-[10%] text-white z-10 max-w-md p-4">
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Welcome Back.
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            Log in to unlock exclusive offers and discover styles curated just
            for you.
          </p>
        </div>
      </div>

      {/* القسم الأيمن: الفورم */}
      {/* w-full on mobile, w-1/2 on desktop. Flex center to center the form itself */}
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[450px] space-y-8">
          {/* العنوان */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Log In</h1>
            <p className="text-gray-500 mt-2">
              Enter your details below to continue shopping.
            </p>
          </div>

          {/* الفورم */}
          <form className="space-y-6">
            {/* حقل الإيميل */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2 pl-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* حقل الباسورد */}
            <div>
              <div className="flex justify-between items-center mb-2 pl-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-black hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* زرار الدخول */}
            <button className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition transform active:scale-[0.99]">
              Sign In
            </button>
          </form>

          {/* فاصل */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* أزرار السوشيال */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition font-semibold">
              <FaGoogle className="text-red-500 text-xl" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border-2 border-gray-100 rounded-xl hover:bg-gray-50 transition font-semibold">
              <FaApple className="text-black text-2xl" />
              <span>Apple</span>
            </button>
          </div>

          {/* رابط إنشاء حساب */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-black hover:underline ml-1"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
