export default function ApprovalsLoading() {
  return (
    <div className="space-y-6 max-w-[1100px] mx-auto animate-pulse">
      <div>
        <div className="h-7 w-28 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="h-9 w-12 bg-gray-200 rounded" />
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 bg-gray-200 rounded mt-0.5" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-24 bg-gray-200 rounded-md" />
                <div className="h-4 w-64 bg-gray-100 rounded" />
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 bg-gray-200 rounded-full" />
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                    <div className="h-2.5 w-40 bg-gray-50 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-100 rounded-lg" />
                <div className="h-9 w-20 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
