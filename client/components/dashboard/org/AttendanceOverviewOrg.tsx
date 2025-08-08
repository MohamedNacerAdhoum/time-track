import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Category,
  Tooltip,
  StackingColumnSeries,
} from "@syncfusion/ej2-react-charts";

type ViewType = "week" | "month";

export function AttendanceOverviewOrg() {
  const [selectedView, setSelectedView] = useState<ViewType>("week");

  const viewOptions = [
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  const weekData = [
    { date: "26 Dec", value: 7, maxValue: 8 },
    { date: "27 Dec", value: 4, maxValue: 8 },
    { date: "28 Dec", value: 2.5, maxValue: 8 },
    { date: "29 Dec", value: 6, maxValue: 8 },
    { date: "30 Dec", value: 7.5, maxValue: 8 },
    { date: "31 Dec", value: 5, maxValue: 8 },
  ];

  const monthData = [
    { date: "1", value: 3.5, maxValue: 8 },
    { date: "2", value: 6, maxValue: 8 },
    { date: "3", value: 7.5, maxValue: 8 },
    { date: "4", value: 6.5, maxValue: 8 },
    { date: "5", value: 6.8, maxValue: 8 },
    { date: "6", value: 7.2, maxValue: 8 },
    { date: "7", value: 6.5, maxValue: 8 },
    { date: "8", value: 8, maxValue: 8 },
    { date: "9", value: 1.5, maxValue: 8 },
    { date: "10", value: 0, maxValue: 8 },
    { date: "11", value: 6.8, maxValue: 8 },
    { date: "12", value: 6.2, maxValue: 8 },
    { date: "13", value: 6.5, maxValue: 8 },
    { date: "14", value: 7.5, maxValue: 8 },
    { date: "15", value: 5.5, maxValue: 8 },
    { date: "16", value: 6.8, maxValue: 8 },
    { date: "17", value: 7.2, maxValue: 8 },
    { date: "18", value: 4.5, maxValue: 8 },
    { date: "19", value: 7.8, maxValue: 8 },
    { date: "20", value: 7.6, maxValue: 8 },
    { date: "21", value: 6.8, maxValue: 8 },
    { date: "22", value: 6.5, maxValue: 8 },
    { date: "23", value: 8, maxValue: 8 },
    { date: "24", value: 6.2, maxValue: 8 },
    { date: "25", value: 6.8, maxValue: 8 },
    { date: "26", value: 2.5, maxValue: 8 },
    { date: "27", value: 7.8, maxValue: 8 },
    { date: "28", value: 6.8, maxValue: 8 },
    { date: "29", value: 6.2, maxValue: 8 },
    { date: "30", value: 5.2, maxValue: 8 },
    { date: "31", value: 0, maxValue: 8 },
  ];

  const currentData = selectedView === "week" ? weekData : monthData;
  const dateRange = selectedView === "week" ? "26 Dec - 31 Dec" : "Dec 2023";

  // Create data for the stacked columns
  const getStackedData = () => {
    return currentData.map((item) => ({
      date: item.date,
      value: item.value,
      remaining: item.maxValue - item.value,
    }));
  };

  const stackedData = getStackedData();

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
          }}
          primaryYAxis={{
            minimum: 0,
            maximum: 8,
            interval: 2,
            lineStyle: { width: 0 },
            majorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            labelStyle: { color: "#77838F", fontWeight: "600" },
          }}
          chartArea={{ border: { width: 0 } }}
          tooltip={{
            enable: true,
            format: "${point.y} hours",
            header: "${point.x}",
          }}
          legendSettings={{ visible: false }}
          height="300px"
          width="100%"
        >
          <Inject services={[StackingColumnSeries, Category, Tooltip]} />
          <SeriesCollectionDirective>
            {/* Blue bottom section - actual value */}
            <SeriesDirective
              type="StackingColumn"
              dataSource={stackedData}
              xName="date"
              yName="value"
              columnWidth={selectedView === "week" ? 0.4 : 0.7}
              fill="#63CDFA"
              cornerRadius={{ bottomLeft: 6, bottomRight: 6 }}
              name="value"
              opacity={1}
            />
            {/* Gray top section - remaining (non-interactive) */}
            <SeriesDirective
              type="StackingColumn"
              dataSource={stackedData}
              xName="date"
              yName="remaining"
              columnWidth={selectedView === "week" ? 0.4 : 0.7}
              fill="#E6ECF2"
              cornerRadius={{ topLeft: 6, topRight: 6 }}
              name="_hidden"
              opacity={1}
              enableTooltip={false}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>

      {/* Navigation */}
      <div className="flex gap-7 w-full justify-center">
        <button className="w-10 h-10 rounded-full bg-[#63CDFA] flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button className="w-10 h-10 rounded-full bg-[#63CDFA] flex items-center justify-center">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
