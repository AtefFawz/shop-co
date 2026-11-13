import LayoutProvider from "@/shared/components/layout/StorefrontShell";
import PageTransition from "@/shared/components/motion/RouteTransition";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutProvider>
        <main id="main-content" className="min-w-0 flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </LayoutProvider>
    </div>
  );
}
