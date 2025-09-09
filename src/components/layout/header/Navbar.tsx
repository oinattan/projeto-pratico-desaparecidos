"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ThemeToggle } from "../../ui/buttons";
import { useMobileMenu } from "../../../hooks/useMobileMenu";
import ComoAjudarModal from '../../ui/modals/ComoAjudarModal';
import { useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu, menuRef } = useMobileMenu();

  const navItems = [
  { href: "/", label: "Início" },
  { href: "#pessoas", label: "Pessoas", isAnchor: true },
  { href: "#contato", label: "Contatos", isAnchor: true }];

  const handleAnchorClick = (href: string) => {

  closeMobileMenu();

  if (pathname === '/') {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  } else {

  router.push(`/${href}`);
  }
  };

  const [isComoAjudarOpen, setIsComoAjudarOpen] = useState(false);

  const openComoAjudar = () => {
  setIsComoAjudarOpen(true);
  closeMobileMenu();
  };

  return (
  <nav ref={menuRef} className="navbar-custom backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <Logo />
      
      {}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) =>
        item.isAnchor ?
        <button
          key={item.href}
          onClick={() => handleAnchorClick(item.href)}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 bg-transparent border-none cursor-pointer">
          
              {item.label}
            </button> :

        <Link
          key={item.href}
          href={item.href}
          className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
          
              {item.label}
            </Link>

        )}
        {}
        <button
          onClick={openComoAjudar}
          className="ml-2 inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium shadow-sm"
          aria-label="Como Ajudar">
          
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
          Como Ajudar
        </button>
      </div>
      
      {}
      <div className="hidden lg:flex items-center space-x-4 ml-4">
        <a href="tel:190" className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium shadow-sm relative">
          <span className="relative inline-flex items-center mr-2">
            <span className="absolute -right-2 -top-1 inline-flex h-2 w-2 rounded-full bg-red-400 animate-ping" />
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V21a1 1 0 01-1.09 1 19 19 0 01-8.63-3.07 19 19 0 01-6-6A19 19 0 012 3.09 1 1 0 013 2h4.09a1 1 0 011 .75c.12.67.3 1.33.55 1.97a1 1 0 01-.25 1L7.7 8.7a14 14 0 006 6l1-1a1 1 0 011-.25c.64.25 1.3.43 1.97.55a1 1 0 01.75 1V21z" />
            </svg>
          </span>
          Emergência: 190
        </a>
        {}
        <div className="hidden lg:inline-flex">
          <ThemeToggle />
        </div>
      </div>

      {}
      <div className="md:hidden flex items-center space-x-3">
        <ThemeToggle />
        {}
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}>
          
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            
            {isMobileMenuOpen ?
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :

            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>
    </div>

    {}
    <AnimatePresence>
      {isMobileMenuOpen &&
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden">
        
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mobile-menu-overlay">
            {navItems.map((item, index) =>
          item.isAnchor ?
          <button
            key={item.href}
            onClick={() => handleAnchorClick(item.href)}
            className="mobile-menu-item block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
            
                  {item.label}
                </button> :

          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileMenu}
            className="mobile-menu-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
            style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
            
                  {item.label}
                </Link>

          )}
                {}
                <div className="pt-2 border-t border-gray-100 dark:border-slate-700 space-y-2">
                  <button
              onClick={openComoAjudar}
              className="w-full text-left px-3 py-2 rounded-md bg-indigo-600 text-white font-medium">
              
                    <svg className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4" /></svg>
                    Como Ajudar
                  </button>

                  <a href="tel:190" className="w-full inline-block px-3 py-2 rounded-md bg-red-600 text-white text-left font-medium relative">
                    <span className="inline-flex items-center mr-2 relative">
                      <span className="absolute -right-2 -top-1 inline-flex h-2 w-2 rounded-full bg-red-400 animate-ping" />
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92V21a1 1 0 01-1.09 1 19 19 0 01-8.63-3.07 19 19 0 01-6-6A19 19 0 012 3.09 1 1 0 013 2h4.09a1 1 0 011 .75c.12.67.3 1.33.55 1.97a1 1 0 01-.25 1L7.7 8.7a14 14 0 006 6l1-1a1 1 0 011-.25c.64.25 1.3.43 1.97.55a1 1 0 01.75 1V21z" />
                      </svg>
                    </span>
                    Emergência: 190
                  </a>
                </div>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  </div>
  
  {}
  <ComoAjudarModal isOpen={isComoAjudarOpen} onClose={() => setIsComoAjudarOpen(false)} />
  </nav>);

}