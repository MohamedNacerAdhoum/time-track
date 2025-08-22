import React from "react";
import { Notebook } from "lucide-react";

interface DayDetailsProps {
  date: string;
  workTime?: string;
  payAmount?: number;
  totalPay?: string;
  clockIn?: string;
  breakPeriod?: string;
  clockOut?: string;
  status: "worked" | "not-worked" | "future";
}

export function DayDetails({
  date,
  workTime = "",
  payAmount = 0,
  totalPay = "1950 TND",
  clockIn = "hh:mm:ss",
  breakPeriod = "hh:mm:ss",
  clockOut = "hh:mm:ss",
  status = "worked",
}: DayDetailsProps) {
  const getPaymentBadgeStyle = () => {
    switch (status) {
      case "worked":
        return "bg-green-100 text-green-700";
      case "not-worked":
        return "bg-yellow-100 text-yellow-700";
      case "future":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentText = () => {
    switch (status) {
      case "worked":
        return `+ ${payAmount} TND`;
      case "not-worked":
        return "0 TND";
      case "future":
        return "-";
      default:
        return "-";
    }
  };

  const getNotebookColors = () => {
    switch (status) {
      case "worked":
        return ["text-[#63CDFA]", "text-[#63CDFA]", "text-[#63CDFA]"];
      case "not-worked":
        return ["text-[#63CDFA]", "text-[#63CDFA]", "text-[#D7D7D7]"];
      case "future":
        return ["text-[#63CDFA]", "text-[#63CDFA]", "text-[#D7D7D7]"];
      default:
        return ["text-[#D7D7D7]", "text-[#D7D7D7]", "text-[#D7D7D7]"];
    }
  };

  const notebookColors = getNotebookColors();

  return (
    <div className="bg-white rounded-xl p-6 lg:p-15 w-full max-w-[450px] flex flex-col gap-6 lg:gap-10">
      <h2 className="text-xl lg:text-2xl font-semibold text-center text-black">
        {date}
      </h2>

      <div className="flex justify-between items-end gap-2">
        <span className="text-sm lg:text-base font-medium text-black">
          Worked time
        </span>
        <span className="text-sm lg:text-base text-gray-500">
          {status === "future" ? "-" : workTime || "0h 0mn"}
        </span>
      </div>

      <div className="flex justify-between items-start gap-4">
        <span className="text-sm lg:text-base font-medium text-black">
          Payed amount
        </span>
        <span className="text-sm lg:text-base font-medium text-black">
          Total pay / month
        </span>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className={`px-4 lg:px-5 py-1 rounded-xl ${getPaymentBadgeStyle()}`}
          >
            <span className="font-semibold text-sm lg:text-base">
              {getPaymentText()}
            </span>
          </div>
        </div>
        <span className="text-sm lg:text-base text-gray-500 text-right">
          {totalPay}
        </span>
      </div>

      <div className="w-full h-px bg-[#71839B]"></div>

      <div className="flex justify-between items-start gap-2">
        <span className="text-sm lg:text-base font-medium text-black text-center flex-1">
          Clock in
        </span>
        <span className="text-sm lg:text-base font-medium text-black text-center flex-1">
          Break period
        </span>
        <span className="text-sm lg:text-base font-medium text-black text-center flex-1">
          Clock out
        </span>
      </div>

      <div className="flex justify-between items-start gap-2">
        <span className="text-sm lg:text-base text-gray-500 text-center flex-1">
          {status === "future" ? "-" : clockIn}
        </span>
        <span className="text-sm lg:text-base text-gray-500 text-center flex-1">
          {status === "future" ? "-" : breakPeriod}
        </span>
        <span className="text-sm lg:text-base text-gray-500 text-center flex-1">
          {status === "future" ? "-" : clockOut}
        </span>
      </div>

      <div className="flex justify-center items-center gap-8 lg:gap-28">
        <Notebook className={`w-6 h-6 lg:w-8 lg:h-8 ${notebookColors[0]}`} />
        <Notebook className={`w-6 h-6 lg:w-8 lg:h-8 ${notebookColors[1]}`} />
        <Notebook className={`w-6 h-6 lg:w-8 lg:h-8 ${notebookColors[2]}`} />
      </div>
    </div>
  );
}
