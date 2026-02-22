"use client";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle, FaApple, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Signup from "@/assets/shop/signup.png";
export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen flex bg-white">
      <div className="hidden md:block md:w-1/2 h-screen relative bg-gray-900">
        <Image
          src={Signup}
          alt="Sign Up Fashion"
          fill
          className="object-fill opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-[10%] left-[10%] text-white z-10 max-w-md p-4">
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Join the Club.
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            Create your account today and get exclusive access to new drops and
            member-only sales.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[450px] space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Create Account
            </h1>
            <p className="text-gray-500 mt-2">
              Sign up for free to start your style journey.
            </p>
          </div>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
            <button className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition transform active:scale-[0.99] mt-4">
              Create Account
            </button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or sign up with
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
            Already have an account?{" "}
            <Link
              href="/user/login"
              className="font-bold text-black hover:underline ml-1"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
