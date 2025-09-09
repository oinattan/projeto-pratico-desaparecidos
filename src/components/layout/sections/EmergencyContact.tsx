"use client";
import React from "react";
import { Phone, AlertTriangle, Clock, Sparkles } from "lucide-react";

export function EmergencyContact() {
  const emergencyNumbers = [
  { number: "181", description: "Polícia Civil" },
  { number: "197", description: "Polícia Civil" }];

  return (
  <section className="relative py-16 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
  {}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
  </div>

  <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    {}
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Não encontrou quem procura?
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Entre em contato com as autoridades competentes
      </p>
    </div>

    {}
    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
      {emergencyNumbers.map((emergency) =>
      <a
        key={emergency.number}
        href={`tel:${emergency.number}`}
        className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 overflow-hidden">
        
          {}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/50 dark:via-red-900/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </div>

          {}
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-red-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {emergency.number}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {emergency.description}
            </p>
            
            <div className="inline-flex items-center gap-2 text-red-600 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Ligar agora</span>
            </div>
          </div>
        </a>
      )}
    </div>

    {}
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-gray-900 dark:text-white">
          Informações importantes
        </span>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Atendimento 24h gratuito</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span>Tenha dados básicos prontos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          <span>Local e horário do ocorrido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span>Mantenha a calma</span>
        </div>
      </div>
    </div>
  </div>
  </section>);

}