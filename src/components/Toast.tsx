import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-blue-200 bg-white px-5 py-3.5 shadow-xl shadow-blue-900/10 text-slate-800"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          </div>
          <span className="text-xs font-semibold text-slate-700">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
