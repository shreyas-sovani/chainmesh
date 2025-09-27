"use client";
import { memo, PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesTextProps extends PropsWithChildren {
  className?: string;
  colors?: string[];
  density?: number; // number of sparkles
}

export const SparklesText = memo(function SparklesText({
  children,
  className,
  colors = ["#a78bfa", "#60a5fa", "#34d399", "#f472b6"],
  density = 12,
}: SparklesTextProps) {
  const items = Array.from({ length: density });
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
        {children}
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        {items.map((_, i) => {
          const size = 4 + Math.random() * 6;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const delay = Math.random() * 2;
          const color = colors[i % colors.length];
          return (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left: `${x}%`,
                top: `${y}%`,
                background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
                filter: "blur(0.5px)",
                opacity: 0.7,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.6, 1.2, 0.6],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{ repeat: Infinity, duration: 2.4, delay, ease: "easeInOut" }}
            />
          );
        })}
      </span>
    </span>
  );
});

export default SparklesText;