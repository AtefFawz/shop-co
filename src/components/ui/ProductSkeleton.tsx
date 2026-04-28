export const ProductSkeleton = () => {
  return (
    <section className="w-full container mx-auto px-4 space-y-4 animate-pulse">
      <div className="aspect-square w-full bg-gray-200 rounded-2xl" />

      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />

        <div className="h-3 bg-gray-200 rounded-full w-1/2" />

        <div className="h-6 bg-gray-200 rounded-full w-1/4" />
      </div>
    </section>
  );
};
