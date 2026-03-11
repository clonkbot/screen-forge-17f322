import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import GeneratePanel from './components/GeneratePanel';
import { Screen } from './types';

export default function App() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsGenerating(true);

    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newScreen: Screen = {
      id: `screen-${Date.now()}`,
      prompt,
      x: (Math.random() * 400 - 200) - pan.x / zoom,
      y: (Math.random() * 400 - 200) - pan.y / zoom,
      createdAt: new Date(),
      gradient: generateGradient(),
    };

    setScreens(prev => [...prev, newScreen]);
    setIsGenerating(false);
    setIsPanelOpen(false);
  }, [pan, zoom]);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.25), 3));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleDeleteScreen = useCallback((id: string) => {
    setScreens(prev => prev.filter(s => s.id !== id));
    setSelectedScreen(null);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0b] overflow-hidden select-none">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Ambient glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Main Canvas */}
      <Canvas
        screens={screens}
        setScreens={setScreens}
        zoom={zoom}
        pan={pan}
        setPan={setPan}
        selectedScreen={selectedScreen}
        setSelectedScreen={setSelectedScreen}
        onDeleteScreen={handleDeleteScreen}
      />

      {/* Toolbar */}
      <Toolbar
        zoom={zoom}
        onZoomIn={() => handleZoom(0.25)}
        onZoomOut={() => handleZoom(-0.25)}
        onResetView={handleResetView}
        onOpenPanel={() => setIsPanelOpen(true)}
        screenCount={screens.length}
      />

      {/* Generate Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <GeneratePanel
            onClose={() => setIsPanelOpen(false)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        )}
      </AnimatePresence>

      {/* Coordinates Display */}
      <div className="fixed bottom-16 md:bottom-4 left-4 font-mono text-[10px] text-slate-600 tracking-wider">
        <span className="text-slate-500">X:</span> {Math.round(-pan.x / zoom)} <span className="text-slate-500 ml-2">Y:</span> {Math.round(-pan.y / zoom)} <span className="text-slate-500 ml-2">Z:</span> {(zoom * 100).toFixed(0)}%
      </div>

      {/* Footer */}
      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 font-light tracking-wide">
        Requested by <span className="text-slate-500">@web-user</span> · Built by <span className="text-slate-500">@clonkbot</span>
      </footer>
    </div>
  );
}

function generateGradient(): string {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #20bf6b 0%, #0fb9b1 100%)',
    'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
    'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}
