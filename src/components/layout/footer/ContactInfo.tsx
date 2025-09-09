"use client";
import React from "react";
import { Phone, MapPin, Clock, Globe } from "lucide-react";

export function ContactInfo() {
  const contacts = [
  {
  icon: Phone,
  label: "Emergência",
  value: "181",
  href: "tel:181",
  highlight: true
  },
  {
  icon: Phone,
  label: "Emergência",
  value: "197",
  href: "tel:197",
  highlight: true
  },
  {
  icon: Phone,
  label: "Polícia Civil",
  value: "(65) 3613-6981",
  href: "tel:+556536136981"
  },
  {
  icon: MapPin,
  label: "Endereço",
  value: "Cuiabá - MT",
  href: "https://www.google.com.br/maps/place/Av.+Cel.+Escol%C3%A1stico,+346+-+Bandeirantes,+Cuiab%C3%A1+-+MT,+78008-500/@-15.5976122,-56.0913204,17z/data=!4m6!3m5!1s0x939db1bfb14c138d:0xcbc2aa94026960f3!8m2!3d-15.597452!4d-56.0902582!16s%2Fg%2F11csgq8323?coh=164777&entry=tt&shorturl=1",
  target: "_blank"
  }];

  return (
  <div>
  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Contato
  </h4>
  
  <div className="space-y-4">
    {contacts.map((contact, index) => {
      const IconComponent = contact.icon;
      return (
        <a
          key={index}
          href={contact.href}
          target={contact.href.startsWith('http') ? '_blank' : undefined}
          rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`flex items-start gap-3 p-3 rounded-lg transition-all group ${
          contact.highlight ?
          'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-950/30' :
          'hover:bg-gray-50 dark:hover:bg-slate-800'}`
          }>
          
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          contact.highlight ?
          'bg-red-500 text-white' :
          'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-500 group-hover:text-white'} transition-colors`
          }>
            <IconComponent className="w-4 h-4" />
          </div>
          
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {contact.label}
            </p>
            <p className={`text-sm font-medium break-words ${
            contact.highlight ?
            'text-red-600 dark:text-red-400' :
            'text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400'} transition-colors`
            }>
              {contact.value}
            </p>
          </div>
        </a>);

    })}
    
    {}
    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
        <Clock className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
          Horário
        </p>
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
          24 horas por dia
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          Todos os dias da semana
        </p>
      </div>
    </div>

    {}
    <a
      href="https://www.mt.gov.br"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-all group">
      
      <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Portal Oficial
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
          Governo de MT
        </p>
      </div>
    </a>
  </div>
  </div>);

}