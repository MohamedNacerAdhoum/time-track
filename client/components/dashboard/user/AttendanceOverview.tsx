import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { useTimeSheets, type TimeSheet } from "@/contexts/TimeSheetsContext";
import { useMembersStore } from "@/contexts/MembersContext";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Category,
  Tooltip,
  StackingColumnSeries,
  Legend,
} from "@syncfusion/ej2-react-charts";

type ViewType = "week" | "month";

interface ChartDataItem {
  date: string;
  value: number;
  maxValue: number;
  actualHours: number;
  dateKey?: string;
}

interface StackedChartDataItem extends Omit<ChartDataItem, "maxValue"> {
  remaining: number;
}

const calculateHours = (start: string, end: string | null): number => {
  if (!end) return 0;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return Math.round(((endTime - startTime) / (1000 * 60 * 60)) * 10) / 10;
};

export function AttendanceOverview() {
  const [selectedView, setSelectedView] = useState<ViewType>("week");

  const viewOptions = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];
  const {
    fetchDayTimeSheet,
    fetchUserTimeSheets,
    timeSheets = [],
    loading,
    error,
  } = useTimeSheets();
  const { currentUser } = useMembersStore();
  const EXPECTED_HOURS_PER_DAY = currentUser?.hours || 8;

  const [localTimeSheets, setLocalTimeSheets] = useState<TimeSheet[]>(
    timeSheets || [],
  );
  const [currentPage, setCurrentPage] = useState(0);
  const DAYS_PER_PAGE = 7;

  // Fetch function
  const fetchCurrentPage = async () => {
    const startOffset = currentPage * DAYS_PER_PAGE;
    const endOffset = startOffset + DAYS_PER_PAGE;
    const today = new Date();
    const fetchedTimeSheets: TimeSheet[] = [];

    try {
      const startDate = format(subDays(today, endOffset - 1), "yyyy-MM-dd");
      const endDate = format(subDays(today, startOffset), "yyyy-MM-dd");
      const allTimeSheets = await fetchUserTimeSheets({
        start_date: startDate,
        end_date: endDate,
      });

      if (allTimeSheets && allTimeSheets.length > 0) {
        setLocalTimeSheets((prev) => {
          const existingIds = new Set(prev.map((ts) => ts.id));
          const newSheets = allTimeSheets.filter(
            (ts) => !existingIds.has(ts.id),
          );
          return [...prev, ...newSheets].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
        });
        return;
      }
    } catch (err) {
      console.error("Error fetching range:", err);
    }

    // Fallback: day by day
    for (let i = startOffset; i < endOffset; i++) {
      const dateStr = format(subDays(today, i), "yyyy-MM-dd");
      try {
        const ts = await fetchDayTimeSheet(dateStr);
        if (ts) fetchedTimeSheets.push(ts);
      } catch (err) {
        console.error(`Error fetching ${dateStr}:`, err);
      }
    }
    setLocalTimeSheets((prev) => {
      const existingDates = new Set(prev.map((ts) => ts.date));
      const newSheets = fetchedTimeSheets.filter(
        (ts) => !existingDates.has(ts.date),
      );
      return [...prev, ...newSheets].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });
  };

  // Initial load
  useEffect(() => {
    fetchCurrentPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Page change fetch
  useEffect(() => {
    fetchCurrentPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleNextPage = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handlePrevPage = () => setCurrentPage((prev) => prev + 1);

  const { weekData, monthData, dateRange } = useMemo(() => {
    const sheetsToProcess = [...localTimeSheets, ...timeSheets].filter(
      (sheet, idx, self) =>
        idx ===
        self.findIndex(
          (s) =>
            s.id === sheet.id ||
            (s.date === sheet.date && s.employee === sheet.employee),
        ),
    );

    const dailyHours = sheetsToProcess.reduce(
      (acc, entry) => {
        if (!entry) return acc;
        const dateKey = entry.date;
        let hoursWorked = 0;
        if (entry.clock_in && entry.clock_out) {
          hoursWorked = calculateHours(entry.clock_in, entry.clock_out);
          if (entry.break_start && entry.break_end) {
            hoursWorked = Math.max(
              0,
              hoursWorked - calculateHours(entry.break_start, entry.break_end),
            );
          }
        }
        acc[dateKey] = (acc[dateKey] || 0) + parseFloat(hoursWorked.toFixed(1));
        return acc;
      },
      {} as Record<string, number>,
    );

    // Week view range
    const viewEndDate = subDays(new Date(), currentPage * DAYS_PER_PAGE);
    const viewStartDate = subDays(viewEndDate, DAYS_PER_PAGE - 1);
    const viewDays = eachDayOfInterval({
      start: viewStartDate,
      end: viewEndDate,
    }).reverse();

    const weekData: ChartDataItem[] = viewDays
      .map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        return {
          date: format(day, "dd MMM"),
          dateKey,
          value: dailyHours[dateKey] || 0,
          maxValue: EXPECTED_HOURS_PER_DAY,
          actualHours: dailyHours[dateKey] || 0,
        };
      })
      .reverse();

    // Month view logic
    const currentDate = subDays(new Date(), currentPage * DAYS_PER_PAGE);
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth,
      end: endOfMonth,
    });

    const monthData: ChartDataItem[] = daysInMonth.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      const hours = dailyHours[dateKey] || 0;
      return {
        date: format(day, "dd MMM"),
        dateKey,
        value: hours,
        maxValue: EXPECTED_HOURS_PER_DAY,
        actualHours: hours,
      };
    });

    const dateRange =
      selectedView === "week"
        ? `${format(viewStartDate, "dd MMM")} - ${format(viewEndDate, "dd MMM")}`
        : `${format(startOfMonth, "dd MMM")} - ${format(endOfMonth, "dd MMM")}`;

    return { weekData, monthData, dateRange };
  }, [timeSheets, localTimeSheets, selectedView, currentPage]);

  const currentData = selectedView === "week" ? weekData : monthData;
  const stackedData: StackedChartDataItem[] = currentData.map((item) => ({
    date: item.date,
    value: Math.min(item.value, item.maxValue),
    remaining: Math.max(0, item.maxValue - item.value),
    actualHours: item.value,
    dateKey: item.dateKey || item.date,
  }));

  return (
    <div className="w-full max-w-full flex flex-col items-end gap-5 relative bg-white rounded-lg overflow-hidden">
      {/* Dropdown */}
      <CustomDropdown
        value={selectedView}
        options={viewOptions}
        onChange={(value) => setSelectedView(value as ViewType)}
        className="self-end"
      />

      {/* Header */}
      <div className="flex justify-between w-full">
        <h2 className="text-2xl font-semibold">Attendance Overview</h2>
        <span className="text-[#77838F] font-bold">{dateRange}</span>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ChartComponent
          primaryXAxis={{
            valueType: "Category",
            majorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            lineStyle: { width: 0 },
            labelStyle: {
              color: "#77838F",
              fontWeight: "600",
              size: selectedView === "week" ? "14px" : "11px",
            },
            labelIntersectAction: "Rotate45",
            labelRotation: selectedView === "month" ? 45 : 0,
          }}
          primaryYAxis={{
            minimum: 0,
            maximum: EXPECTED_HOURS_PER_DAY,
            interval: Math.ceil(EXPECTED_HOURS_PER_DAY / 4),
            lineStyle: { width: 0 },
            majorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            labelStyle: { color: "#77838F", fontWeight: "600" },
            labelFormat: "{value}h",
          }}
          chartArea={{ border: { width: 0 }, background: "white" }}
          tooltip={{
            enable: true,
            format: "${point.y} hours",
            header: "${point.x}",
          }}
          legendSettings={{ visible: false }}
          height="300px"
          width="100%"
        >
          <Inject
            services={[StackingColumnSeries, Category, Tooltip, Legend]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              type="StackingColumn"
              dataSource={stackedData}
              xName="date"
              yName="value"
              columnWidth={selectedView === "week" ? 0.4 : 0.7}
              fill="#63CDFA"
              cornerRadius={{ bottomLeft: 6, bottomRight: 6 }}
              name="Worked Hours"
              opacity={1}
            />
            <SeriesDirective
              type="StackingColumn"
              dataSource={stackedData}
              xName="date"
              yName="remaining"
              columnWidth={selectedView === "week" ? 0.4 : 0.7}
              fill="#E6ECF2"
              cornerRadius={{ topLeft: 6, topRight: 6 }}
              name="Remaining"
              opacity={1}
              enableTooltip={false}
            />
          </SeriesCollectionDirective>
        </ChartComponent>

        {/* Navigation */}
        <div className="flex gap-7 w-full justify-center mt-4">
          <button
            className="w-10 h-10 rounded-full bg-[#63CDFA] flex items-center justify-center"
            onClick={handlePrevPage}
            disabled={loading}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-[#63CDFA] flex items-center justify-center"
            onClick={handleNextPage}
            disabled={currentPage === 0 || loading}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
