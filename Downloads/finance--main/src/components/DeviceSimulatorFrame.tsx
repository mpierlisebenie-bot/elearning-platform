import React from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';
import { DeviceMode } from '../types';

interface DeviceSimulatorFrameProps {
  deviceMode: DeviceMode;
  children: React.ReactNode;
}

export const DeviceSimulatorFrame: React.FC<DeviceSimulatorFrameProps> = ({
  deviceMode,
  children,
}) => {
  if (deviceMode === 'fullscreen') {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  const isIphone = deviceMode === 'iphone';

  return (
    <div className="min-h-screen py-8 px-2 flex flex-col items-center justify-center bg-[#070c18] relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Helper Frame Indicator */}
      <div className="mb-4 text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300 border border-white/15 backdrop-blur-md">
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          Simulateur Mobile {isIphone ? 'iPhone 15 Pro' : 'Android Pixel 8'}
        </span>
      </div>

      {/* Hardware Outer Frame */}
      <div
        className={`relative w-full max-w-[410px] h-[830px] rounded-[52px] bg-slate-950 p-3 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] border-4 ${
          isIphone ? 'border-slate-800' : 'border-slate-800'
        } ring-1 ring-white/20 transition-all duration-300`}
      >
        {/* Physical Side Buttons simulation */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-8 bg-slate-700 rounded-l-md"></div>
        <div className="absolute -left-[7px] top-40 w-[3px] h-12 bg-slate-700 rounded-l-md"></div>
        <div className="absolute -left-[7px] top-56 w-[3px] h-12 bg-slate-700 rounded-l-md"></div>
        <div className="absolute -right-[7px] top-36 w-[3px] h-16 bg-slate-700 rounded-r-md"></div>

        {/* Screen Inner Container */}
        <div className="w-full h-full rounded-[42px] bg-[#0f172a] overflow-hidden flex flex-col relative border border-white/10 shadow-inner">
          {/* Status Bar */}
          <div className="h-11 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between text-white text-[11px] font-semibold z-50 shrink-0 select-none">
            <span>09:41</span>

            {/* Dynamic Island for iPhone or Punchhole for Android */}
            {isIphone ? (
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-950"></div>
              </div>
            ) : (
              <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-800"></div>
            )}

            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* App Display Canvas inside Screen */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {children}
          </div>

          {/* Bottom Home Indicator Bar (iOS) or Nav Bar (Android) */}
          {isIphone ? (
            <div className="h-5 bg-slate-950/90 backdrop-blur-md flex items-center justify-center shrink-0 z-50">
              <div className="w-32 h-1 bg-white/40 rounded-full"></div>
            </div>
          ) : (
            <div className="h-5 bg-slate-950/90 backdrop-blur-md flex items-center justify-center shrink-0 z-50">
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
