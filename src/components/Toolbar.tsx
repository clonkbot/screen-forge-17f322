import React from 'react';
import { motion } from 'framer-motion';

interface ToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onOpenPanel: () => void;
  screenCount: number;
}

export default function Toolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onOpenPanel,
  screenCount,
}: ToolbarProps) {
  return (
    <>
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-50"
      >
        {/* Logo */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#141415]/90 backdrop-blur-xl rounded-xl border border-slate-800/50">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-200 tracking-tight hidden sm:block">ScreenForge</span>
          </div>
        </div>

        {/* Screen count */}
        <div className="pointer-events-auto">
          <div className="px-3 py-2 bg-[#141415]/90 backdrop-blur-xl rounded-xl border border-slate-800/50">
            <span className="text-xs text-slate-400">
              <span className="text-amber-500 font-semibold">{screenCount}</span> {screenCount === 1 ? 'screen' : 'screens'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bottom toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none z-50"
      >
        {/* Zoom controls */}
        <div className="pointer-events-auto flex items-center bg-[#141415]/90 backdrop-blur-xl rounded-xl border border-slate-800/50 overflow-hidden">
          <button
            onClick={onZoomOut}
            className="p-3 hover:bg-slate-800/50 transition-colors active:bg-slate-700/50"
            aria-label="Zoom out"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <button
            onClick={onResetView}
            className="px-3 py-2 min-w-[60px] text-center hover:bg-slate-800/50 transition-colors active:bg-slate-700/50"
          >
            <span className="text-xs font-mono text-slate-400">{(zoom * 100).toFixed(0)}%</span>
          </button>

          <button
            onClick={onZoomIn}
            className="p-3 hover:bg-slate-800/50 transition-colors active:bg-slate-700/50"
            aria-label="Zoom in"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={onOpenPanel}
          className="pointer-events-auto group relative p-4 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-amber-500/40 hover:scale-105 active:scale-95"
        >
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 animate-ping opacity-25" />

          <svg className="w-5 h-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Fit view button */}
        <div className="pointer-events-auto">
          <button
            onClick={onResetView}
            className="p-3 bg-[#141415]/90 backdrop-blur-xl rounded-xl border border-slate-800/50 hover:bg-slate-800/50 transition-colors active:bg-slate-700/50"
            aria-label="Reset view"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </motion.div>
    </>
  );
}
