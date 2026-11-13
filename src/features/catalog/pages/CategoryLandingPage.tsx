import { CategoryGallery as Cat } from "@/features/catalog/components/CategoryGallery";
export default function CategoryLandingPage() {
  return (
    <section className="page-section min-h-[calc(100svh-var(--navbar-h))] px-4 sm:px-6">
      <Cat />
    </section>
  );
}
