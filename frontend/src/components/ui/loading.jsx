export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-primary">Loading...</p>
    </div>
  );
}