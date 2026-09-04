"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      className={cn(
        "fixed bottom-20 lg:bottom-6 right-5 z-30 w-11 h-11 rounded-full bg-zinc-950/85 hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 duration-200 cursor-pointer animate-in fade-in zoom-in-75 focus:outline-none focus:ring-2 focus:ring-orange-500"
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
