export default function OrderDetailsSkeleton() {
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl animate-pulse px-4 py-8 sm:px-6">
        <div className="mb-5 h-5 w-20 rounded bg-gray-200" />

        <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-4 w-20 rounded bg-gray-200" />

          <div className="mt-3 h-7 w-72 rounded bg-gray-200" />

          <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
        </div>

        <div className="mb-5 rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-5 w-32 rounded bg-gray-200" />

          <div className="mt-6 h-16 rounded bg-gray-100" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="h-80 rounded-2xl bg-white shadow-sm" />

          <div className="h-64 rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    </section>
  );
}
