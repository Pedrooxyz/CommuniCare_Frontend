// ToastBar.js
import React, { useEffect } from 'react';
import './ToastBar.css';

export default function ToastBar({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-bar ${type}`}>
      {message}
      <div className="toast-progress"></div> {}
    </div>
  );
}
