import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../types';

interface ScreenCardProps {
  screen: Screen;
  index: number;
  zoom: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdatePosition: (x: number, y: number) => void;
}

export default function ScreenCard({
  screen,
  index,
  zoom,
  isSelected,
  onSelect,
  onDelete,
  onUpdatePosition,
}: ScreenCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    }
  }, [onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && cardRef.current) {
      const parent = cardRef.current.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const newX = (e.clientX - parentRect.left - parentRect.width / 2 - dragOffset.x) / zoom;
        const newY = (e.clientY - parentRect.top - parentRect.height / 2 - dragOffset.y) / zoom;
        onUpdatePosition(newX, newY);
      }
    }
  }, [isDragging, dragOffset, zoom, onUpdatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left - rect.width / 2,
        y: touch.clientY - rect.top - rect.height / 2,
      });
    }
  }, [onSelect]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && cardRef.current) {
      const touch = e.touches[0];
      const parent = cardRef.current.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const newX = (touch.clientX - parentRect.left - parentRect.width / 2 - dragOffset.x) / zoom;
        const newY = (touch.clientY - parentRect.top - parentRect.height / 2 - dragOffset.y) / zoom;
        onUpdatePosition(newX, newY);
      }
    }
  }, [isDragging, dragOffset, zoom, onUpdatePosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: index * 0.05
      }}
      className="absolute cursor-move"
      style={{
        left: `calc(50% + ${screen.x}px)`,
        top: `calc(50% + ${screen.y}px)`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Phone frame */}
      <div
        className={`relative transition-all duration-200 ${
          isSelected ? 'ring-2 ring-amber-500/50 ring-offset-4 ring-offset-[#0a0a0b]' : ''
        }`}
      >
        {/* Glow effect */}
        <div
          className="absolute -inset-4 rounded-[2.5rem] opacity-30 blur-xl transition-opacity"
          style={{ background: screen.gradient }}
        />

        {/* Phone body */}
        <div className="relative w-[180px] h-[380px] bg-[#1a1a1c] rounded-[2rem] p-2 shadow-2xl shadow-black/50">
          {/* Inner bezel */}
          <div className="w-full h-full bg-[#0d0d0e] rounded-[1.5rem] overflow-hidden relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1a1c] rounded-b-xl z-10" />

            {/* Screen content */}
            <div
              className="w-full h-full flex flex-col items-center justify-center p-4"
              style={{ background: screen.gradient }}
            >
              {/* Simulated UI elements */}
              <div className="w-full space-y-3 mt-6">
                <div className="w-3/4 h-3 bg-white/30 rounded-full mx-auto" />
                <div className="w-1/2 h-2 bg-white/20 rounded-full mx-auto" />
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="w-full space-y-2 mb-4">
                <div className="w-full h-8 bg-white/20 rounded-lg" />
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-white/10 rounded-lg" />
                  <div className="flex-1 h-8 bg-white/10 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
          </div>
        </div>

        {/* Delete button (visible on selection) */}
        {isSelected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Label */}
      <div className="mt-3 text-center max-w-[180px]">
        <p className="text-[10px] text-slate-500 truncate font-medium tracking-wide uppercase">
          {screen.prompt}
        </p>
      </div>
    </motion.div>
  );
}
