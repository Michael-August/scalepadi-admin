"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-4 space-y-4">
          <CardContent className="space-y-3">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-2 mt-4">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-44" />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-24 rounded-md" /> {/* Left button */}
            <Skeleton className="h-8 w-28 rounded-md" /> {/* Right button */}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
