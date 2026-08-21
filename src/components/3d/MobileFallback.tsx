"use client";

import React from "react";

export const MobileFallback = () => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-[#f3f3f2] to-[#f9f9f8] dark:from-[#09090b] dark:to-[#0c0c0e] overflow-hidden flex items-center justify-center">
      {/* Blurred decorative backgrounds that mimic glass refractions */}
      <div className="absolute top-[20%] left-[10%] w-[45%] h-[50%] rounded-full bg-brand-ice opacity-40 dark:opacity-10 blur-[120px]"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[40%] rounded-full bg-[#cbdfe3] opacity-35 dark:opacity-5 blur-[100px]"></div>
      
      {/* Visual grain overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#121214_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)]"></div>

      {/* Modern architectural wireframe lines representing structure */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[75%] border border-brand-glass-border-light dark:border-brand-glass-border-dark flex items-center justify-center relative">
          {/* Inner framing lines */}
          <div className="absolute top-0 bottom-0 left-[35%] border-r border-brand-glass-border-light dark:border-brand-glass-border-dark"></div>
          <div className="absolute left-0 right-0 top-[40%] border-b border-brand-glass-border-light dark:border-brand-glass-border-dark"></div>
          
          {/* Shimmer/Reflective highlights */}
          <div className="absolute top-[10%] left-[5%] right-[70%] bottom-[65%] bg-gradient-to-tr from-white/10 to-white/40 dark:from-white/0 dark:to-white/15 backdrop-blur-[4px] border border-white/20 dark:border-white/5 rounded-sm"></div>
          <div className="absolute top-[45%] left-[40%] right-[15%] bottom-[15%] bg-gradient-to-tr from-white/5 to-white/30 dark:from-white/0 dark:to-white/10 backdrop-blur-[6px] border border-white/20 dark:border-white/5 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};
