import { useEffect, useMemo, useState } from 'react';
import { useTimeSheets } from '@/contexts/TimeSheetsContext';
import { useMembersStore } from '@/contexts/MembersContext';
import { useToast } from '@/components/ui/use-toast';

// Constants
const DEFAULT_TARGET_HOURS = 40;
const CIRCLE_RADIUS = 80;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

// Interfaces
interface TimeOverview {
  hoursWorked: number;
  targetHours: number;
  percentage: number;
  remainingHours: number;
}

interface CardProps {
  children: React.ReactNode;
  title: string;
}

interface LegendProps {
  label: string;
  color: string;
}

// Utility function to parse hours string
const parseHoursWorked = (hoursStr: string): number => {
  if (!hoursStr) return 0;

  if (hoursStr.includes(':')) {
    const [hours, minutes] = hoursStr.split(':').map(Number);
    return (hours || 0) + (minutes || 0) / 60;
  }

  return parseFloat(hoursStr) || 0;
};

export function TimeOverviewChart() {
  const { fetchUserTimeSheets, timeSheets, loading, error } = useTimeSheets();
  const { currentUser } = useMembersStore();
  const { toast } = useToast();
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch timesheet data
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserTimeSheets();
      } catch (err: unknown) {
        const errorMessage = 'Failed to load timesheet data. Please try again later.';
        setLocalError(errorMessage);

        const status = (err as { response?: { status: number } })?.response?.status;
        toast({
          title: status === 403 ? 'Access Denied' : 'Error',
          description: status === 403
            ? 'You do not have permission to view timesheet data.'
            : errorMessage,
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, [fetchUserTimeSheets, toast]);

  // Calculate time overview metrics
  const timeOverview: TimeOverview = useMemo(() => {
    const totalHours = timeSheets.reduce((sum, ts) => sum + parseHoursWorked(ts.hours_worked), 0);
    const hoursWorked = Math.round(totalHours * 10) / 10;
    const targetHours = currentUser?.hours || DEFAULT_TARGET_HOURS;
    const percentage = targetHours > 0 ? Math.min(Math.round((hoursWorked / targetHours) * 100), 100) : 0;

    return {
      hoursWorked,
      targetHours,
      percentage,
      remainingHours: Math.max(0, targetHours - hoursWorked),
    };
  }, [timeSheets, currentUser]);

  if (loading) {
    return (
      <Card title="Time Overview">
        <div className="flex h-48 items-center justify-center text-gray-500 animate-pulse">
          Loading...
        </div>
      </Card>
    );
  }

  const errorMessage = error || localError;
  if (errorMessage) {
    return (
      <Card title="Time Overview">
        <div className="py-8 text-center text-gray-500">
          Unable to load timesheet data
        </div>
      </Card>
    );
  }

  return (
    <Card title="Time Overview">
      <div className="mb-6 flex justify-center">
        <div className="relative h-48 w-48">
          <svg width="194" height="194" viewBox="0 0 194 194" className="-rotate-90">
            <circle
              cx="97"
              cy="97"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#E6EEF5"
              strokeWidth="24"
            />
            <circle
              cx="97"
              cy="97"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#63CDFA"
              strokeWidth="24"
              strokeDasharray={`${CIRCLE_CIRCUMFERENCE * (timeOverview.percentage / 100)} ${CIRCLE_CIRCUMFERENCE * (1 - timeOverview.percentage / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-black">{timeOverview.percentage}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Legend label="Worked" color="#63CDFA" />
          <Legend label="Remaining" color="#E6EEF5" />
        </div>
      </div>
    </Card>
  );
}

// Card component
function Card({ children, title }: CardProps) {
  return (
    <div className="rounded-2xl border border-[#B7B9C7] bg-white p-6">
      <h3 className="mb-6 text-base font-bold text-[#1F1F25]">{title}</h3>
      {children}
    </div>
  );
}

// Legend component
function Legend({ label, color }: LegendProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-[#5F5F5F]">{label}</span>
    </div>
  );
}