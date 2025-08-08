import { useEffect, useRef } from "react";

interface NotificationItem {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  avatarColor?: string;
}

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "1",
    user: "User YYY",
    message: "Missing attendance claim",
    timestamp: "10 min ago",
    avatarColor: "#63CDFA"
  },
  {
    id: "2",
    user: "User YYY",
    message: "New demand",
    timestamp: "10 min ago",
    avatarColor: "#63CDFA"
  },
  {
    id: "3",
    user: "User YYY",
    message: "Leave request",
    timestamp: "10 min ago",
    avatarColor: "#63CDFA"
  },
  {
    id: "4",
    user: "User YYY",
    message: "Missing attendance claim",
    timestamp: "10 min ago",
    avatarColor: "#63CDFA"
  }
];

export function NotificationPopup({
  isOpen,
  onClose,
  notifications = defaultNotifications
}: NotificationPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-full right-0 mt-2 w-[392px] bg-white rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] border border-gray-100 z-50 overflow-hidden"
    >
      <div className="h-[320px]">
        {/* Notifications Container */}
        <div className="p-2.5 overflow-y-auto h-full">
          <div className="flex flex-col gap-2.5">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-2.5 pl-[10px] border border-[#BDBDBD] rounded-[12px] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {/* Left side: Avatar + Content */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-[50px] h-[50px] flex-shrink-0">
                    <div
                      className="w-full h-full rounded-full border border-[#BDBDBD]"
                      style={{ backgroundColor: notification.avatarColor }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <div className="text-[#333] text-[17px] font-normal leading-normal tracking-[-0.17px]">
                      {notification.user}
                    </div>
                    <div className="text-[#828282] text-[10px] font-normal leading-normal tracking-[-0.1px]">
                      {notification.message}
                    </div>
                  </div>
                </div>

                {/* Right side: Timestamp */}
                <div className="text-[#828282] text-[10px] font-normal leading-normal tracking-[-0.1px] self-start mt-[29px] mr-[11px]">
                  {notification.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
