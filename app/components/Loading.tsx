export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-transparent" />
    </div>
  );
}
