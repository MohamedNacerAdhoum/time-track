import React, { useState, useEffect } from "react";
import { ArrowLeftToLine, Coffee, ArrowRightFromLine, Loader2, NotepadText } from "lucide-react";
import { useTimeSheets } from "@/contexts/TimeSheetsContext";
import { useMembers } from "@/contexts/MembersContext";
import { toast } from "sonner";

type ActionType = 'clock_in' | 'break' | 'clock_out';

const TimeClockControl = () => {
  const [notes, setNotes] = useState({
    clock_in: "",
    break: "",
    clock_out: "",
  });
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const {
    todayTimeSheet,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    fetchTodayTimeSheet,
    loading
  } = useTimeSheets();

  const { fetchCurrentUser } = useMembers();

  useEffect(() => {
    fetchTodayTimeSheet();
  }, [fetchTodayTimeSheet]);

  const handleNoteChange = (type: ActionType, value: string) => {
    setNotes(prev => ({ ...prev, [type]: value }));
  };

  const handleAction = async (action: ActionType) => {
    setActiveAction(action);

    try {
      // Get the note for all actions
      const note = notes[action] || '';

      switch (action) {
        case 'clock_in':
          await clockIn(note);
          // Only refresh current user data after clock in
          await fetchCurrentUser(true); // Force refresh
          break;
        case 'break':
          if (todayTimeSheet?.time_sheet?.status === 'IN BREAK') {
            await endBreak(note);
          } else {
            await startBreak(note);
          }
          // Force refresh user data after break action
          await fetchCurrentUser(true); // Force refresh
          break;
        case 'clock_out':
          if (todayTimeSheet?.time_sheet?.status === 'IN BREAK') {
            await endBreak();
          }
          await clockOut(note);
          // Only refresh current user data after clock out
          await fetchCurrentUser(true); // Force refresh
          break;
      }

      // Fetch the latest time sheet to get the updated status
      const updatedTimeSheet = await fetchTodayTimeSheet();

      let actionText = action.replace('_', ' ');

      if (action === 'break') {
        // Determine if we just started or ended the break based on the updated status
        const isNowOnBreak = updatedTimeSheet?.time_sheet?.status === 'IN BREAK';
        actionText = isNowOnBreak ? 'started break' : 'ended break';
      }

      toast.success(`Successfully ${actionText}`);
      setNotes({ clock_in: '', break: '', clock_out: '' });
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to ${action.replace('_', ' ')}: ${errorMessage}`);
    } finally {
      setActiveAction(null);
    }
  };

  const getButtonState = (action: ActionType) => {
    if (!todayTimeSheet?.time_sheet) return 'UNSOLVED';

    switch (action) {
      case 'clock_in':
        return todayTimeSheet.time_sheet.clock_in ? 'DONE' : 'UNSOLVED';
      case 'break':
        return todayTimeSheet.time_sheet.status === 'IN BREAK' ? 'DONE' : 'UNSOLVED';
      case 'clock_out':
        return todayTimeSheet.time_sheet.clock_out ? 'DONE' : 'UNSOLVED';
      default:
        return 'UNSOLVED';
    }
  };

  const renderNoteInput = (action: ActionType) => {
    const bgColor = {
      'clock_in': 'bg-[rgba(77,166,77,0.2)]',
      'break': 'bg-[#FFF4E5]',
      'clock_out': 'bg-[#FFEEEE]'
    }[action];

    return (
      <div className={`flex h-[100px] lg:h-[120px] p-4 lg:p-5 flex-col items-center gap-2.5 w-full rounded-[10px] ${bgColor}`}>
        <textarea
          value={notes[action]}
          onChange={(e) => handleNoteChange(action, e.target.value)}
          placeholder="Write your note here"
          className="flex-1 w-full text-[#666] text-xs font-normal font-poppins resize-none bg-transparent border-none outline-none placeholder:text-[#666]"
        />
        <div className="flex items-center gap-2 w-full">
          <NotepadText className="w-4 h-4 text-[#77838F] opacity-50 flex-shrink-0" />
          <span className="text-[#77838F] opacity-50 text-[11px] font-normal font-poppins">
            Note
          </span>
        </div>
      </div>
    );
  };

  const renderActionButton = (action: ActionType, icon: React.ReactNode, label: string, color: string) => {
    const state = getButtonState(action);
    const isActive = activeAction === action && loading;
    const isNotClockedIn = !todayTimeSheet?.time_sheet?.clock_in;
    const isDone = state === 'DONE';
    const isBreakInProgress = action === 'break' && todayTimeSheet?.time_sheet?.status === 'IN BREAK';

    // Determine if the button should be disabled
    const shouldDisable = (() => {
      if (action === 'break') {
        // Allow clicking the break button to end the break if it's in progress
        if (isBreakInProgress) {
          return isActive; // Only disable if action is in progress
        }
        // Otherwise, disable if not clocked in, clocked out, or action is active
        return isNotClockedIn || 
               todayTimeSheet?.time_sheet?.status === 'OUT' || 
               isActive;
      } else if (action === 'clock_in') {
        return isDone || isActive;
      } else if (action === 'clock_out') {
        return isDone || isNotClockedIn || isActive;
      }
      return false;
    })();

    // Base button class
    let buttonClass = `flex w-full lg:w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-full shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform ${color}`;

    // Apply appropriate styles based on button state
    if (shouldDisable) {
      buttonClass += ' opacity-70 cursor-not-allowed';
    } else if (action === 'break' && isBreakInProgress) {
      buttonClass = 'flex w-full lg:w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-full shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] bg-opacity-10 border-2 border-amber-500 text-amber-500';
    } else {
      buttonClass += ' hover:scale-105 active:scale-95';
    }

    const buttonText = (() => {
      if (action === 'break' && isBreakInProgress) return 'End Break';
      return label;
    })();

    const buttonContent = isActive ? (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="font-semibold text-sm lg:text-base font-poppins">Processing...</span>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        {React.cloneElement(icon as React.ReactElement, {
          className: `w-4 h-4 ${action === 'break' && isBreakInProgress ? 'text-amber-500' : 'currentColor'}`
        })}
        <span className="font-semibold text-sm lg:text-base font-poppins">
          {buttonText}
        </span>
      </div>
    );

    const isDisabled = (action === 'clock_in' && isDone) ||
      (action === 'clock_out' && (isDone || isNotClockedIn)) ||
      (action === 'break' && (isNotClockedIn || (isDone && !isBreakInProgress))) ||
      isActive;

    return (
      <div key={action} className="flex flex-col items-center gap-4 w-full max-w-[280px] lg:w-[180px]">
        <button
          onClick={() => handleAction(action)}
          disabled={isDisabled}
          className={buttonClass}
        >
          {buttonContent}
        </button>

        {renderNoteInput(action)}

      </div>
    );
  };

  if (!todayTimeSheet) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-2">
      <div className="flex md:hidden justify-center items-center gap-4 w-full">
        {renderActionButton(
          'clock_in',
          <ArrowLeftToLine className="w-4 h-4 text-white" />,
          'Clock In',
          'bg-green-500 text-white'
        )}

        {renderActionButton(
          'break',
          <Coffee className="w-4 h-4 text-amber-500" />,
          'Break',
          'bg-amber-500 text-white'
        )}

        {renderActionButton(
          'clock_out',
          <ArrowRightFromLine className="w-4 h-4 text-white" />,
          'Clock Out',
          'bg-red-500 text-white'
        )}
      </div>

      <div className="hidden md:flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 lg:gap-8 w-full">
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {renderActionButton(
            'clock_in',
            <ArrowLeftToLine className="w-5 h-5 text-white" />,
            'Clock In',
            'bg-green-500 text-white'
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {renderActionButton(
            'break',
            <Coffee className="w-5 h-5 text-white" />,
            'Break',
            'bg-amber-500 text-white'
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {renderActionButton(
            'clock_out',
            <ArrowRightFromLine className="w-5 h-5 text-white" />,
            'Clock Out',
            'bg-red-500 text-white'
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeClockControl;