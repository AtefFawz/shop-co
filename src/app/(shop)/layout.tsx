import LayoutProvider from "../../components/layout/LayoutProvider";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <LayoutProvider>
        <main className="flex-1">{children}</main>
      </LayoutProvider>
    </div>
  );
}
