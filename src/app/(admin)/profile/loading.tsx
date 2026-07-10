export default function ProfileLoading() {
  return (
    <div className="space-y-6 max-w-[800px] mx-auto pb-20 animate-pulse">
      <div>
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100">
          <div className="h-24 w-24 rounded-full bg-gray-200" />
          <div className="text-center sm:text-left space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded mx-auto sm:mx-0" />
            <div className="h-4 w-48 bg-gray-100 rounded mx-auto sm:mx-0" />
            <div className="h-5 w-20 bg-gray-100 rounded-md mx-auto sm:mx-0 mt-2" />
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-5 max-w-lg">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-11 w-full bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="pt-6 mt-6 border-t border-gray-100">
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
