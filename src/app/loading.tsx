// app/loading.tsx

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      <h2 className="mt-4 text-xl font-semibold">Loading....🚀</h2>
    </div>
  );
}
