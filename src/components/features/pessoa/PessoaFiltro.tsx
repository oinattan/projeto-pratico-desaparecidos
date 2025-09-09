"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input, Select } from "../../ui/forms";

export interface FiltrosPessoa {
  nome: string;
  idadeMinima: string;
  idadeMaxima: string;
  sexo: string;
  status: string;
}

interface PessoaFiltroProps {
  filtros: FiltrosPessoa;
  onFiltrosChange: (filtros: FiltrosPessoa) => void;
  onLimpar: () => void;
  isSearching?: boolean;
}

export function PessoaFiltro({ filtros, onFiltrosChange, onLimpar, isSearching = false }: PessoaFiltroProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchingLocal, setIsSearchingLocal] = useState(false);

  useEffect(() => {
  if (filtros.nome) {
  setIsSearchingLocal(true);
  const timer = setTimeout(() => setIsSearchingLocal(false), 1500);
  return () => clearTimeout(timer);
  } else {
  setIsSearchingLocal(false);
  }
  }, [filtros.nome]);

  const showSearching = isSearching || isSearchingLocal;

  const handleChange = (campo: keyof FiltrosPessoa, valor: string) => {
  onFiltrosChange({
  ...filtros,
  [campo]: valor
  });
  };

  const opcoesStatus = [
  { value: '', label: 'Todos os status' },
  { value: 'desaparecido', label: 'Desaparecido' },
  { value: 'localizado', label: 'Localizado' }];

  const opcoesSexo = [
  { value: '', label: 'Todos os sexos' },
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMININO', label: 'Feminino' }];

  const temFiltrosAtivos = Object.values(filtros).some((valor) => valor !== '');

  return (
  <motion.div
  className="relative"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}>
  
  {}
  <div className="relative bg-white dark:bg-white/6 dark:backdrop-blur-lg rounded-2xl border border-gray-300 dark:border-white/20 shadow-sm overflow-hidden">
    
    
    {}
    <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.1),transparent)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
    
    {}
    <motion.div
      className="relative p-6 cursor-pointer select-none rounded-t-2xl z-10"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.001 }}
      whileTap={{ scale: 0.999 }}>
      

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          {}
          <motion.div
            className="relative p-3 bg-gray-100 dark:bg-white/8 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-white/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}>
            
            <svg className="relative w-5 h-5 text-gray-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
          </motion.div>
          
          <div>
            <motion.h3
              className="text-xl font-bold text-gray-800 dark:text-white"
              layoutId="title">
              
              Filtros de Busca
            </motion.h3>
            {temFiltrosAtivos &&
            <motion.div
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}>
              
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse" />
                <p className="text-sm font-medium text-gray-600 dark:text-emerald-300">
                  Filtros ativos aplicados
                </p>
              </motion.div>
            }
            {isSearching &&
            <motion.div
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}>
              
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse" />
                <p className="text-sm font-medium text-gray-600 dark:text-blue-300">
                  Aplicando filtros...
                </p>
              </motion.div>
            }
            {showSearching && !isSearching &&
            <motion.div
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}>
              
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse" />
                <p className="text-sm font-medium text-gray-600 dark:text-orange-300">
                  Aguardando busca...
                </p>
              </motion.div>
            }
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {temFiltrosAtivos &&
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}>
            
              <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onLimpar();
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-white hover:text-red-500 dark:hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all backdrop-blur-sm">
              
                Limpar
              </button>
            </motion.div>
          }
          
          {}
          <motion.div
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-gray-200 dark:border-slate-700/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            
            <motion.svg
              className="w-5 h-5 text-gray-600 dark:text-white/90"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.div>
        </div>
      </div>
      
      {}
      <motion.div
        className="absolute bottom-0 left-6 right-6 h-px animate-shimmer bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] bg-[length:200%_100%]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.35 }} />
      
    </motion.div>

    {}
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="overflow-hidden">
      
      <div className="relative p-6 space-y-6 rounded-b-2xl">
        
        {}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
          transition={{ delay: 0.1 }}>
          
          <div className="relative">
            <Input
              label="Nome"
              placeholder="Digite o nome da pessoa..."
              value={filtros.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="bg-white dark:bg-white/4 border-gray-300 dark:border-white/10 focus:bg-white dark:focus:bg-white/8 focus:border-blue-500 dark:focus:border-white/20 transition-all text-gray-900 dark:text-white/90 placeholder:text-gray-500 dark:placeholder:text-white/60 backdrop-blur-sm" />
            
            {showSearching &&
            <motion.div
              className="absolute right-3 top-9 flex items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}>
              
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            }
          </div>
          {showSearching && !isSearching &&
          <motion.p
            className="text-xs text-blue-600 dark:text-blue-400 mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}>
            
              A busca será aplicada quando você parar de digitar...
            </motion.p>
          }
          {isSearching &&
          <motion.p
            className="text-xs text-green-600 dark:text-green-400 mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}>
            
              Aplicando filtros...
            </motion.p>
          }
        </motion.div>

        {}
        <motion.div
          className="relative grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
          transition={{ delay: 0.2 }}>
          
          <Input
            label="Idade Mínima"
            type="number"
            placeholder="Ex: 18"
            min="0"
            max="120"
            value={filtros.idadeMinima}
            onChange={(e) => handleChange('idadeMinima', e.target.value)}
            className="bg-white dark:bg-white/4 border-gray-300 dark:border-white/10 focus:bg-white dark:focus:bg-white/8 focus:border-blue-500 dark:focus:border-white/20 transition-all text-gray-900 dark:text-white/90 placeholder:text-gray-500 dark:placeholder:text-white/60 backdrop-blur-sm" />
          
          <Input
            label="Idade Máxima"
            type="number"
            placeholder="Ex: 65"
            min="0"
            max="120"
            value={filtros.idadeMaxima}
            onChange={(e) => handleChange('idadeMaxima', e.target.value)}
            className="bg-white dark:bg-white/4 border-gray-300 dark:border-white/10 focus:bg-white dark:focus:bg-white/8 focus:border-blue-500 dark:focus:border-white/20 transition-all text-gray-900 dark:text-white/90 placeholder:text-gray-500 dark:placeholder:text-white/60 backdrop-blur-sm" />
          
        </motion.div>

        {}
        <motion.div
          className="relative grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
          transition={{ delay: 0.3 }}>
          
          <Select
            label="Sexo"
            options={opcoesSexo}
            value={filtros.sexo}
            onChange={(e) => handleChange('sexo', e.target.value)}
            className="bg-white dark:bg-white/4 border-gray-300 dark:border-white/10 focus:bg-white dark:focus:bg-white/8 focus:border-blue-500 dark:focus:border-white/20 transition-all text-gray-900 dark:text-white/90 backdrop-blur-sm" />
          
          <Select
            label="Status"
            options={opcoesStatus}
            value={filtros.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="bg-white dark:bg-white/4 border-gray-300 dark:border-white/10 focus:bg-white dark:focus:bg-white/8 focus:border-blue-500 dark:focus:border-white/20 transition-all text-gray-900 dark:text-white/90 backdrop-blur-sm" />
          
        </motion.div>

        {}
        {temFiltrosAtivos &&
        <motion.div
          className="relative pt-6 border-t border-gray-200 dark:border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 20 }}
          transition={{ delay: 0.4 }}>
          
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse" />
              <p className="text-sm font-medium text-gray-600 dark:text-emerald-300">
                Filtros ativos:
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filtros.nome &&
            <motion.span
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white text-xs rounded-full border border-gray-300 dark:border-white/10 relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-shimmer" />
                  <span className="relative z-10">Nome: {filtros.nome}</span>
                  <button
                onClick={() => handleChange('nome', '')}
                className="relative z-10 hover:bg-blue-700/50 rounded-full p-0.5 transition-colors">
                
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.span>
            }
              {filtros.idadeMinima &&
            <motion.span
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white text-xs rounded-full border border-gray-300 dark:border-white/10 relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}>
              
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-shimmer" />
                  <span className="relative z-10">Idade mín: {filtros.idadeMinima}</span>
                  <button
                onClick={() => handleChange('idadeMinima', '')}
                className="relative z-10 hover:bg-green-700/50 rounded-full p-0.5 transition-colors">
                
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.span>
            }
              {filtros.idadeMaxima &&
            <motion.span
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white text-xs rounded-full border border-gray-300 dark:border-white/10 relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.2 }}>
              
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-shimmer" />
                  <span className="relative z-10">Idade máx: {filtros.idadeMaxima}</span>
                  <button
                onClick={() => handleChange('idadeMaxima', '')}
                className="relative z-10 hover:bg-green-700/50 rounded-full p-0.5 transition-colors">
                
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.span>
            }
              {filtros.sexo &&
            <motion.span
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white text-xs rounded-full border border-gray-300 dark:border-white/10 relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.3 }}>
              
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-shimmer" />
                  <span className="relative z-10">Sexo: {opcoesSexo.find((op) => op.value === filtros.sexo)?.label}</span>
                  <button
                onClick={() => handleChange('sexo', '')}
                className="relative z-10 hover:bg-purple-700/50 rounded-full p-0.5 transition-colors">
                
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.span>
            }
              {filtros.status &&
            <motion.span
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white text-xs rounded-full border border-gray-300 dark:border-white/10 relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.4 }}>
              
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-shimmer" />
                  <span className="relative z-10">Status: {opcoesStatus.find((op) => op.value === filtros.status)?.label}</span>
                  <button
                onClick={() => handleChange('status', '')}
                className="relative z-10 hover:bg-orange-700/50 rounded-full p-0.5 transition-colors">
                
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.span>
            }
            </div>
          </motion.div>
        }
      </div>
    </motion.div>
  </div>
  </motion.div>);

}