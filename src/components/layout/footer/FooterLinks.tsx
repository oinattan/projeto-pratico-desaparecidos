"use client";
import React from "react";
import { ExternalLink, Phone, Users, Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function FooterLinks() {
  const router = useRouter();
  const pathname = usePathname();

  const handleAnchorClick = (href: string) => {

  if (href.startsWith('#')) {

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
  } else {

  router.push(href);
  }
  };

  const links = [
  {
  title: "Navegação",
  items: [
  { label: "Início", href: "/", icon: Search, isAnchor: false },
  { label: "Buscar Pessoas", href: "#pessoas", icon: Users, isAnchor: true },
  { label: "Contatos", href: "https://www.pjc.mt.gov.br/diretoria-geral", target: "_blank", icon: Phone, isAnchor: false }]

  }];

  return (
  <div>
  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Links Rápidos
  </h4>
  
  {links.map((section, sectionIndex) =>
  <div key={sectionIndex} className="space-y-3">
      {section.items.map((item, itemIndex) => {
      const IconComponent = item.icon;
      return item.isAnchor ?
      <button
        key={itemIndex}
        onClick={() => handleAnchorClick(item.href)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group bg-transparent border-none cursor-pointer p-0">
        
            <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </button> :

      <a
        key={itemIndex}
        href={item.href}
        target={item.target ?? undefined}
        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group">
        
            <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </a>;

    })}
      
      {}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <a
        href="https://portal.sesp.mt.gov.br/portaldaseguranca/pages/home.seam"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group">
        
          <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>SSP/MT</span>
        </a>
        <a
        href="https://www.pjc.mt.gov.br/inicio"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group mt-2">
        
          <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Polícia Civil/MT</span>
        </a>
      </div>
    </div>
  )}
  </div>);

}