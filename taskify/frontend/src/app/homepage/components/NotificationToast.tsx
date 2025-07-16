import React from "react";

interface NotificationToastProps {
  message: string;
  type?: 'success' | 'error';
  open: boolean;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type = 'success', open }) => {
  if (!open) return null;
  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-bold text-lg transition bg-green-600 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
    >
      {message}
    </div>
  );
};

export default NotificationToast; 