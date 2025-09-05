import { Skeleton } from "./skeleton";


interface TableSkeletonProps {
  columns: number;
  rows: number;
  headers?: string[];
}

export const TableSkeleton = ({ columns, rows, headers }: TableSkeletonProps) => {
  return (
    <div className="w-full p-6 bg-white overflow-x-auto">
      <Skeleton className="h-8 w-48 mb-6" />
      
      {/* Controls Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-[200px]" />
        </div>
        <Skeleton className="h-9 w-[140px]" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg overflow-hidden min-w-[800px]">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="py-4 px-4 text-left">
                  {headers && headers[index] ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <Skeleton className="h-4 w-16" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100">
                {Array.from({ length: columns }).map((_, cellIndex) => (
                  <td key={cellIndex} className="py-4 px-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};