import Index from "@/features/home/components/StorefrontContent";
import CinematicIntro from "@/features/home/components/intro/CinematicIntro";

export default function StorefrontPage() {
  return (
    <>
      <CinematicIntro />
      <div>
        <Index />
      </div>
    </>
  );
}
