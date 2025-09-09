"use client";
import React from "react";
import { motion } from "framer-motion";
import { ContactInfo } from "./ContactInfo";
import { FooterLinks } from "./FooterLinks";
import { Logo } from "./Logo";
import { Phone, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
  <footer className="relative bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
  {}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
  </div>

  <div className="relative max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
    {}
    <div className="py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        
        {}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Logo />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Portal Desaparecidos
              </h3>
            </div>
            <span className="text-sm sm:text-lg font-bold text-gray-700 dark:text-gray-300 sm:ml-1">
              | PJC-MT
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
            Plataforma dedicada a auxiliar na localização de pessoas desaparecidas, 
            oferecendo suporte às famílias em todo o Mato Grosso.
          </p>

          {}
          <a
            href="tel:181"
            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors cursor-pointer md:hidden lg:flex">
            
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Emergência 24h
              </p>
              <span className="text-red-500 font-bold">
                181
              </span>
            </div>
          </a>

          <a
            href="tel:197"
            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl mt-4 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors cursor-pointer md:hidden lg:flex">
            
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Emergência 24h
              </p>
              <span className="text-red-500 font-bold">
                197
              </span>
            </div>
          </a>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}>
          
          <FooterLinks />
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}>
          
          <ContactInfo />
        </motion.div>
      </div>
    </div>

    {}
    <motion.div
      className="py-6 border-t border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}>
      
      <div className="flex flex-col md:flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          <span>© {currentYear} Desenvolve MT.</span>
          <span className="text-gray-400">•</span>
          <span>Desenvolvido por</span>
          <a
            href="https://natangomes.dev" target="_blank" rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
            
            Natan Gomes
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="flex justify-center lg:justify-end items-center gap-2 sm:gap-4 text-[11px] sm:text-sm max-w-full whitespace-nowrap overflow-hidden">
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-1 sm:px-2 py-1 rounded-md text-center whitespace-nowrap">
            
            Política de Privacidade
          </a>
          <a
            href="#"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-1 sm:px-2 py-1 rounded-md text-center whitespace-nowrap">
            
            Termos de Uso
          </a>
          <a
            href="https://portal.mt.gov.br/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-1 sm:px-2 py-1 rounded-md whitespace-nowrap">
            
            <span>Governo MT</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  </div>
  </footer>);

}