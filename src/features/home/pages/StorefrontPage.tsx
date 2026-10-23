import Index from "@/features/home/components/StorefrontContent";
import CinematicIntro from "@/features/home/components/intro/CinematicIntro";

export default function StorefrontPage() {
  return (
    <>
      <CinematicIntro />
      <div className="pt-18 md:pt-20">
        <Index />
      </div>
    </>
  );
}
