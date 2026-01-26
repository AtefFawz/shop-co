import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import Heading from "@/components/ui/Heading";
export const Media = () => {
  return (
    <div>
      <Heading title="Shop.co" styling="text-start" />
      <p className="text-sm text-gray-500 mt-4">
        We have clothes that suits your style and which you’re proud to wear.
        From women to men.
      </p>
      <div className="flex gap-4 mt-6">
        {[FaFacebookF, FaTwitter, FaInstagram, FaGithub].map((Icon, index) => (
          <span
            key={index}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-700 hover:text-white cursor-pointer transition text-2xl p-1"
          >
            <Icon />
          </span>
        ))}
      </div>
    </div>
  );
};
