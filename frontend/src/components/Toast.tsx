import React from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-green-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fade-in">
        <span className="font-semibold">Succès :</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">&times;</button>
      </div>
    </div>
  );
};

export default Toast;
