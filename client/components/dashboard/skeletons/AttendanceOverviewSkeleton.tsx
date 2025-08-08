import { Skeleton } from "@/components/ui/skeleton"; // ✅ correct import
import { Card, CardContent } from "@/components/ui/card";

export function AttendanceOverviewSkeleton() {
  return (
    <Card className="w-full p-4">
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Chart Placeholder */}
        <Skeleton className="h-64 w-full rounded-lg" />

        {/* Footer */}
        <div className="flex gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
