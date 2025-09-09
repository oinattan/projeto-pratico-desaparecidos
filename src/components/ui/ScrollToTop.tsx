"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
  const toggleVisibility = () => {

  if (window.pageYOffset > 300) {
    setIsVisible(true);
  } else {
    setIsVisible(false);
  }
  };

  window.addEventListener("scroll", toggleVisibility);

  const footer = document.querySelector('footer');
  let observer: IntersectionObserver | null = null;
  if (footer) {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      setIsFooterVisible(entry.isIntersecting);
    });
  }, { root: null, threshold: 0 });
  observer.observe(footer);
  }

  return () => {
  window.removeEventListener("scroll", toggleVisibility);
  if (observer) observer.disconnect();
  };
  }, []);

  const scrollToTop = () => {
  window.scrollTo({
  top: 0,
  behavior: "smooth"
  });
  };

  return (
  <AnimatePresence>
  {isVisible &&
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{
      type: "spring",
      stiffness: 400,
      damping: 10,
      duration: 0.3
    }}
    onClick={scrollToTop}
    className={`fixed right-6 z-50 group transition-all duration-300 ${isFooterVisible ? 'bottom-28' : 'bottom-6'}`}
    aria-label="Voltar ao topo">
    
      {}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-2xl hover:shadow-2xl dark:shadow-slate-900/30 transition-all duration-300 overflow-hidden">
        {}
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(59,130,246,0.1),transparent)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
        
        {}
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24">
          
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </div>

        {}
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/0 group-hover:border-blue-500/20 transition-all duration-300" />
      </div>

      {}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
          Voltar ao topo
          <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      </div>
    </motion.button>
  }
  </AnimatePresence>);

}