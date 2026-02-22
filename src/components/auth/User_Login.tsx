"use client";
import Link from "next/link";
import Image from "next/image";
import Login from "@/assets/shop/screenShop.png";
import { FaGoogle, FaApple, FaEnvelope, FaLock } from "react-icons/fa";
import { Inputs } from "../common/Inputs";
export default function LoginPage() {
  const arrayOfObject = [
    {
      placeholder: "email",
      type: "name@example.com",
      title: "Email Address",
      icon: <FaEnvelope />,
    },
    {
      placeholder: "••••••••",
      type: "password",
      title: "Password",
      icon: <FaLock />,
    },
  ];
  return (
    <div className="w-full min-h-screen flex bg-white">
      <div className="hidden md:block md:w-1/2 h-screen relative bg-gray-900">
        <Image
          src={Login}
          alt="Login Fashion"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
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
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[450px] space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Log In</h1>
            <p className="text-gray-500 mt-2">
              Enter your details below to continue shopping.
            </p>
          </div>
          <form className="space-y-6">
            {arrayOfObject.map((e, id) => (
              <Inputs data={e} key={id} />
            ))}
            <div className="py-5">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-black hover:underline "
              >
                Forgot Password?
              </Link>
            </div>
            <button className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition transform active:scale-[0.99]">
              Sign In
            </button>
          </form>
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
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/user/signup"
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
