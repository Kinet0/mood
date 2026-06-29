import { motion } from 'framer-motion';
import type { MouseEvent } from 'react';

interface ChecklistItemProps {
  label: string;
  completed: boolean;
  onToggle: () => void;
  onClick?: (event: MouseEvent<HTMLLabelElement>) => void;
}

const ChecklistItem = ({ label, completed, onToggle, onClick }: ChecklistItemProps) => {
  return (
    <motion.label
      htmlFor={label}
      onClick={onClick}
      className={`group flex cursor-pointer items-center gap-4 rounded-[28px] border border-white/60 bg-white/70 p-4 text-sm shadow-glow transition-all duration-300 ${
        completed ? 'bg-[#ffe4ec] border-pink-200/90' : 'hover:border-pink-200/90'
      }`}
      whileHover={{ y: -2, rotate: [0, 1, -1, 0] }}
      whileTap={{ scale: 0.98, rotate: [0, -2, 2, 0], x: [0, -2, 2, -1, 1, 0] }}
    >
      <input
        id={label}
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="peer sr-only"
        aria-checked={completed}
      />
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-pink-200/80 bg-white shadow-sm transition-all duration-300 ${
          completed ? 'bg-gradient-to-br from-primary to-accent text-white shadow-[0_0_18px_rgba(255,20,147,0.35)]' : 'bg-white text-pink-500'
        }`}
      >
        <motion.span
          animate={{ scale: completed ? [0.7, 1.05, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="text-lg"
        >
          {completed ? '✓' : ''}
        </motion.span>
      </span>
      <span className={`flex-1 text-left text-sm font-medium text-[#6a1749] ${completed ? 'line-through text-[#a86a90]' : ''}`}>
        {label}
      </span>
    </motion.label>
  );
};

export default ChecklistItem;
