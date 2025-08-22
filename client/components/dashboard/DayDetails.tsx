import React from 'react';
import { Notebook } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DayDetailsData {
  date: string;
  workedTime: string;
  payedAmount: number | string;
  totalPayMonth: string;
  clockIn: string;
  breakPeriod: string;
  clockOut: string;
  status: 'worked' | 'absent' | 'future';
  paymentType: 'positive' | 'negative' | 'neutral';
}

interface DayDetailsProps {
  data: DayDetailsData;
  className?: string;
}

export function DayDetails({ data, className }: DayDetailsProps) {
  const getPaymentBadgeStyles = () => {
    switch (data.paymentType) {
      case 'positive':
        return 'bg-[#4DA64D] bg-opacity-20 text-[#4DA64D]';
      case 'negative':
        return 'bg-[#FFA501] bg-opacity-20 text-[#FFA501]';
      case 'neutral':
        return 'bg-[#63CDFA] bg-opacity-20 text-[#63CDFA]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getPaymentText = () => {
    if (data.status === 'future') return '-';
    if (typeof data.payedAmount === 'number') {
      if (data.payedAmount > 0) return `+ ${data.payedAmount} TND`;
      if (data.payedAmount === 0) return '0 TND';
      return `- ${Math.abs(data.payedAmount)} TND`;
    }
    return data.payedAmount;
  };
  
  const getNotebookStates = () => {
    // Based on the Figma design: first two are active (blue), third varies
    const states = [
      { active: true, color: '#63CDFA' },
      { active: true, color: '#63CDFA' },
      { active: data.status === 'worked', color: data.status === 'worked' ? '#63CDFA' : '#D7D7D7' }
    ];
    return states;
  };
  
  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 sm:p-8 lg:p-15 w-full max-w-[450px] flex flex-col gap-6 sm:gap-8 lg:gap-10",
      className
    )}>
      {/* Date header */}
      <h2 className="text-2xl font-semibold text-center text-black font-poppins">
        {data.date}
      </h2>
      
      {/* Worked time */}
      <div className="flex justify-between items-end gap-2">
        <span className="text-base font-medium text-black font-poppins flex-shrink-0">
          Worked time
        </span>
        <span className="text-base text-[#7F7F7F] font-poppins">
          {data.workedTime}
        </span>
      </div>
      
      {/* Payment section headers */}
      <div className="flex justify-between items-start gap-4">
        <span className="text-base font-medium text-black font-poppins flex-1 text-center">
          Payed amount
        </span>
        <span className="text-base font-medium text-black font-poppins flex-1 text-center">
          Total pay / month
        </span>
      </div>
      
      {/* Payment section values */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col items-center flex-1">
          <div className={cn(
            "px-5 py-1 rounded-2xl inline-flex items-center justify-center min-w-[115px]",
            getPaymentBadgeStyles()
          )}>
            <span className="font-semibold text-base font-poppins whitespace-nowrap">
              {getPaymentText()}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center flex-1 text-center">
          <span className="text-base text-[#7F7F7F] font-poppins">
            {data.totalPayMonth}
          </span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-[#71839B]"></div>
      
      {/* Clock times headers */}
      <div className="flex justify-between items-start gap-4">
        <span className="text-base font-medium text-black font-poppins flex-1 text-center">
          Clock in
        </span>
        <span className="text-base font-medium text-black font-poppins flex-1 text-center">
          Break period
        </span>
        <span className="text-base font-medium text-black font-poppins flex-1 text-center">
          Clock out
        </span>
      </div>
      
      {/* Clock times values */}
      <div className="flex justify-between items-start gap-4">
        <span className="text-base text-[#7F7F7F] font-poppins flex-1 text-center">
          {data.clockIn}
        </span>
        <span className="text-base text-[#7F7F7F] font-poppins flex-1 text-center">
          {data.breakPeriod}
        </span>
        <span className="text-base text-[#7F7F7F] font-poppins flex-1 text-center">
          {data.clockOut}
        </span>
      </div>
      
      {/* Notebook icons */}
      <div className="flex justify-center items-center gap-12 sm:gap-16 lg:gap-28">
        {getNotebookStates().map((state, index) => (
          <Notebook 
            key={index}
            className="w-7 h-7 sm:w-8 sm:h-8" 
            style={{ color: state.color }}
          />
        ))}
      </div>
    </div>
  );
}
