import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Screen } from '../types';
import ScreenCard from './ScreenCard';

interface CanvasProps {
  screens: Screen[];
  setScreens: React.Dispatch<React.SetStateAction<Screen[]>>;
  zoom: number;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  selectedScreen: string | null;
  setSelectedScreen: (id: string | null) => void;
  onDeleteScreen: (id: string) => void;
}

export default function Canvas({
  screens,
  setScreens,
  zoom,
  pan,
  setPan,
  selectedScreen,
  setSelectedScreen,
  onDeleteScreen,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart(pan);
      setSelectedScreen(null);
    }
  }, [pan, setSelectedScreen]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan({
        x: panStart.x + dx,
        y: panStart.y + dy,
      });
    }
  }, [isPanning, dragStart, panStart, setPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    // Zoom is handled by parent, we just prevent default
  }, []);

  // Touch handling for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
        setTouchStart({ x: touch.clientX, y: touch.clientY });
        setPanStart(pan);
        setSelectedScreen(null);
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setInitialDistance(Math.sqrt(dx * dx + dy * dy));
    }
  }, [pan, setSelectedScreen]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchStart) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      setPan({
        x: panStart.x + dx,
        y: panStart.y + dy,
      });
    }
  }, [touchStart, panStart, setPan]);

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
    setInitialDistance(null);
  }, []);

  const updateScreenPosition = useCallback((id: string, x: number, y: number) => {
    setScreens(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
  }, [setScreens]);

  return (
    <div
      ref={canvasRef}
      data-canvas="true"
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        data-canvas="true"
        className="absolute w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Center crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-8 h-[1px] bg-slate-700/50" />
          <div className="w-[1px] h-8 bg-slate-700/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Screens */}
        {screens.map((screen, index) => (
          <ScreenCard
            key={screen.id}
            screen={screen}
            index={index}
            zoom={zoom}
            isSelected={selectedScreen === screen.id}
            onSelect={() => setSelectedScreen(screen.id)}
            onDelete={() => onDeleteScreen(screen.id)}
            onUpdatePosition={(x, y) => updateScreenPosition(screen.id, x, y)}
          />
        ))}

        {/* Empty state */}
        {screens.length === 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-sm font-medium">No screens yet</p>
                <p className="text-slate-600 text-xs">Press the + button to generate your first screen</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
