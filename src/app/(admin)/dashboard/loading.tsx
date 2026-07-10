export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-[1100px] animate-pulse">
      <div>
        <div className="h-7 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
      </div>
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-9 w-16 bg-gray-200 rounded mt-2" />
            <div className="h-3 w-12 bg-gray-100 rounded mt-2" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="h-3 rounded-full bg-gray-100 w-full" />
        <div className="flex gap-6 mt-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-3 w-24 bg-gray-100 rounded" />)}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="h-5 w-16 bg-gray-200 rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-50 flex items-center gap-8">
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-2.5 w-40 bg-gray-100 rounded-full" />
            <div className="h-4 w-8 bg-gray-100 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
