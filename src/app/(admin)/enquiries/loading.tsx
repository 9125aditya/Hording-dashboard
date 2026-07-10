export default function EnquiriesLoading() {
  return (
    <div className="space-y-6 max-w-[1100px] mx-auto h-[calc(100vh-8rem)] flex flex-col animate-pulse">
      <div>
        <div className="h-7 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl flex flex-1 overflow-hidden">
        {/* Left Panel Skeleton */}
        <div className="w-full md:w-[360px] lg:w-[400px] border-r border-gray-200 flex-col hidden md:flex">
          <div className="p-4 border-b border-gray-200">
            <div className="h-9 w-full bg-gray-100 rounded-lg" />
            <div className="flex gap-2 mt-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-7 w-16 bg-gray-200 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-100 rounded mt-1" />
                    </div>
                  </div>
                </div>
                <div className="ml-[42px] space-y-1">
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel Skeleton */}
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 hidden md:flex">
          <div className="h-14 w-14 bg-gray-200 rounded-full mb-4" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-100 rounded mt-2" />
        </div>
      </div>
    </div>
  );
}
