"use client";

import { useToast } from './hooks/useToast';
import ToastContainer from '../components/ToastContainer';

export default function AppClientLayout({ children }) {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
} 