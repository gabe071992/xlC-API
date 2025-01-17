
import React from 'react';
import { cn } from "@/lib/utils";

interface GlowingOrbProps {
  onClick: () => void;
  className?: string;
}

export function GlowingOrb({ onClick, className }: GlowingOrbProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative cursor-pointer group",
        "w-24 h-24",
        className
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
      <div className="relative rounded-full w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
        Login
      </div>
    </div>
  );
}
