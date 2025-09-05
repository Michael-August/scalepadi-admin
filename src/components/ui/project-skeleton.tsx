export const ProjectSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 border-b border-[#EDEEF3] pb-4">
        <div className="flex w-full items-center justify-between">
          <div className="top w-full flex items-center gap-3">
            <div className="bg-gray-200 animate-pulse h-[54px] w-[54px] rounded-[11.68px]"></div>
            <div className="flex flex-col gap-2">
              <div className="bg-gray-200 animate-pulse h-4 w-40 rounded"></div>
              <div className="flex gap-4">
                <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-4 w-20 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="opacity-0 h-4">Hi</div>
              <div className="bg-gray-200 animate-pulse h-4 w-28 rounded"></div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="bg-gray-200 animate-pulse h-10 w-28 rounded-[14px]"></div>
            <div className="bg-gray-200 animate-pulse h-10 w-32 rounded-[14px]"></div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5">
          <div className="w-[52px] h-[52px] rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex flex-col gap-2">
            <div className="bg-gray-200 animate-pulse h-6 w-40 rounded"></div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 animate-pulse h-4 w-20 rounded"></div>
              <div className="bg-gray-200 animate-pulse h-4 w-24 rounded"></div>
              <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="w-full lg:w-[895px] pb-10">
        {/* Tabs Skeleton */}
        <div className="tab pt-2 w-1/2 flex items-center gap-5 bg-[#F9FAFB]">
          <div className="flex w-full items-center justify-center border-b-2 pb-3 border-transparent">
            <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
          </div>
          <div className="flex w-full items-center justify-center border-b-2 pb-3 border-transparent">
            <div className="bg-gray-200 animate-pulse h-4 w-28 rounded"></div>
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="w-full border border-[#F2F2F2] rounded-2xl p-6 flex flex-col gap-6 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="bg-gray-200 animate-pulse h-4 w-32 rounded"></div>
              <div className="bg-gray-200 animate-pulse h-4 w-full rounded"></div>
              <div className="bg-gray-200 animate-pulse h-4 w-3/4 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};