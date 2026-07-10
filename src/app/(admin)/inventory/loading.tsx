export default function InventoryLoading() {
  return (
    <div className="space-y-6 max-w-[1100px] mx-auto animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-7 w-28 bg-gray-200 rounded-lg" />
          <div className="h-4 w-56 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-indigo-100 rounded-lg" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Tabs skeleton */}
        <div className="flex border-b border-gray-200 px-4">
          <div className="h-4 w-36 bg-gray-200 rounded my-4 mr-6" />
          <div className="h-4 w-40 bg-gray-100 rounded my-4" />
        </div>
        {/* Sub-tabs skeleton */}
        <div className="bg-gray-50/60 border-b border-gray-200 px-4 py-3 flex gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-7 w-20 bg-gray-200 rounded-full" />
          ))}
        </div>
        {/* Toolbar skeleton */}
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between">
          <div className="h-9 w-80 bg-gray-100 rounded-lg" />
          <div className="h-9 w-32 bg-gray-100 rounded-lg" />
        </div>
        {/* Table header */}
        <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-200 flex gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-3 w-16 bg-gray-200 rounded" />
          ))}
        </div>
        {/* Table rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="px-5 py-3.5 border-b border-gray-100 flex gap-8 items-center">
            <div className="h-3 w-6 bg-gray-100 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-12 bg-gray-100 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
            <div className="h-5 w-16 bg-gray-100 rounded-md" />
            <div className="h-5 w-5 bg-gray-100 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
