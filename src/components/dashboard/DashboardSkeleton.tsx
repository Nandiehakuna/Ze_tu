'use client';

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <div className="pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((col) => (
            <div key={col} className="space-y-6">
              {[0, 1].map((card) => (
                <div
                  key={`${col}-${card}`}
                  className="h-48 rounded-2xl border border-gray-100 bg-white animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
