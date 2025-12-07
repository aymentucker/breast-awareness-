export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mb-4"></div>
        <p className="text-lg text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
}
