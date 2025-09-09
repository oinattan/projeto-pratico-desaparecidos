"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Shield, Eye } from "lucide-react";
import { createPortal } from 'react-dom';

interface ConfirmacaoContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (enviarContato: boolean) => void;
  telefone?: string;
  email?: string;
}

export const ConfirmacaoContatoModal: React.FC<ConfirmacaoContatoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  telefone,
  email
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);
  }, []);

  const handleConfirm = (enviarContato: boolean) => {
  onConfirm(enviarContato);
  onClose();
  };

  if (!isOpen) return null;
  if (!mounted) return null;

  const hasContacts = telefone && telefone.trim().length > 0 || email && email.trim().length > 0;

  const modalContent =
  <AnimatePresence>
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-[10001] overflow-y-auto">
    <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 20 }}
    transition={{ duration: 0.2 }}
    className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto my-4">
    
      {}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirmação de Contato
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Privacidade dos seus dados
            </p>
          </div>
        </div>
        <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        
          <X className="w-5 h-5" />
        </button>
      </div>

      {}
      <div className="p-4">
        <div className="space-y-3">
          {}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Eye className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-1 text-sm">
                  Dados Públicos
                </h3>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Os dados de contato se tornarão <strong>públicos</strong> e 
                  ficarão visíveis para outras pessoas.
                </p>
              </div>
            </div>
          </div>

          {}
          {hasContacts &&
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                Dados preenchidos:
              </h4>
              <div className="space-y-1">
                {telefone && telefone.trim().length > 0 &&
            <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Telefone:</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {telefone}
                    </span>
                  </div>
            }
                {email && email.trim().length > 0 &&
            <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">E-mail:</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {email}
                    </span>
                  </div>
            }
              </div>
            </div>
        }

          {}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1 text-sm">
                  Opção Anônima
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Você pode enviar sem dados de contato mantendo o anonimato.
                </p>
              </div>
            </div>
          </div>

          {}
          <div className="text-center pt-1">
            <p className="text-gray-900 dark:text-white font-medium mb-3 text-sm">
              Incluir dados de contato na informação?
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="flex flex-col gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
        onClick={() => handleConfirm(false)}
        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
        
          Enviar anonimamente
        </button>
        
        <button
        onClick={() => handleConfirm(true)}
        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm">
        
          Incluir meus dados de contato
        </button>
        
        <button
        onClick={onClose}
        className="w-full px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        
          Cancelar
        </button>
      </div>
    </motion.div>
  </div>
  </AnimatePresence>;

  return createPortal(modalContent, document.body);

};

export default ConfirmacaoContatoModal;