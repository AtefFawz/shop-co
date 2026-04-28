"use client";
import VerifiedRoucndedIcon from "@mui/icons-material/VerifiedRounded";
import { motion } from "framer-motion";
import { Product } from "@/types";
import StarRating from "@/components/common/StarsRating";
import Heading from "@/components/ui/Heading";

export const Reviews = ({ item }: { item: Product }) => {
  interface RawReview {
    user: {
      fullName: string;
      avatar: string;
    };
    rating: number;
    comment: string;
  }

  interface Review {
    fullName: string;
    rating: number;
    comment: string;
    avatar: string;
  }

  const reviewsList =
    item?.reviews?.map((e: RawReview) => ({
      fullName: e.user?.fullName || "Anonymous",
      rating: e.rating,
      comment: e.comment,
      avatar: e.user?.avatar,
    })) || [];

  return (
    <section className=" ">
      <Heading title="Customer Reviews" styling="!text-start " />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 ">
        {reviewsList.length > 0 ? (
          reviewsList.map((e: Review, id: number) => (
            <motion.div
              whileHover={{ rotate: 2 }}
              transition={{ duration: 0.4 }}
              key={id}
              className="shadow-md p-8 rounded-2xl space-y-4 bg-[#FAFAFA]"
            >
              <StarRating rating={e.rating} />

              <div className="text-xl font-bold space-x-3 flex items-center">
                <div>
                  <img
                    src={e.avatar}
                    alt={e.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <span>{e.fullName}</span>
                <span>
                  <VerifiedRoucndedIcon className="text-green-500 text-sm" />
                </span>
              </div>

              <p className="mt-2 text-gray-500 tracking-wide">{e.comment}</p>
            </motion.div>
          ))
        ) : (
          <h1 className="text-xl text-gray-400 text-center">
            No reviews Yet 🫠
          </h1>
        )}
      </div>
    </section>
  );
};
