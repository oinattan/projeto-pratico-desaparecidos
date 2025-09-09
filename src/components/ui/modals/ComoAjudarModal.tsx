"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Share2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ComoAjudarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComoAjudarModal: React.FC<ComoAjudarModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);
  }, []);
  const handleShare = async () => {
  try {
  const url = typeof window !== 'undefined' ? window.location.href : '/';
  if (navigator.share) {
    await navigator.share({ title: document.title, url });
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    alert('Link copiado para a área de transferência');
  } else {

    prompt('Copie o link abaixo:', url);
  }
  } catch (e) {
  }
  };

  if (!mounted) return null;

  const modalContent =
  <AnimatePresence>
  {isOpen &&

  <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto">
  
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <motion.div
    initial={{ y: 16, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 16, opacity: 0 }}
    transition={{ duration: 0.18 }}
    className="relative bg-white dark:bg-slate-900 rounded-t-xl md:rounded-xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden ring-1 ring-black/5 dark:ring-white/5 flex flex-col max-h-[92vh]"
    role="dialog"
    aria-modal="true"
    aria-label="Como ajudar">
    
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="flex-shrink-0 bg-indigo-600 text-white rounded-full p-2 shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Como Ajudar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Pequenas ações aumentam muito as chances de localização — compartilhe com responsabilidade.</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-gray-500 hover:text-gray-800 dark:hover:text-white rounded focus:outline-none">
            <X />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto min-h-0">
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <p>
              Você pode ajudar compartilhando informações nas redes sociais, verificando dados antes de divulgar
              e avisando autoridades caso tenha informações confiáveis.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Compartilhe a página da pessoa com contexto e fontes confiáveis.</li>
              <li>Verifique datas, locais e evite suposições.</li>
              <li>Se tiver uma pista confiável, entre em contato com as autoridades competentes.</li>
              <li>Em risco iminente, ligue imediatamente para o telefone de emergência.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 dark:bg-slate-700 p-2 rounded-md">
                  <Share2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Compartilhar</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Divulgue com responsabilidade</div>
                </div>
              </div>
              <button onClick={handleShare} className="ml-4 inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">Compartilhar</button>
            </div>

            <div className="bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 dark:bg-slate-700 p-2 rounded-md">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Ligar</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Em caso de risco ou informação urgente</div>
                </div>
              </div>
              <a href="tel:190" className="ml-4 inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm">Ligar</a>
            </div>

            <div className="mt-auto text-xs text-gray-400">Ao compartilhar, preserve a privacidade e verifique fontes antes de divulgar.</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-t from-white/75 dark:from-slate-900/75 flex justify-end flex-shrink-0 sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 bg-transparent text-sm text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-slate-800">Fechar</button>
        </div>
      </motion.div>
    </motion.div>
  }
  </AnimatePresence>;

  return createPortal(modalContent, document.body);
};

export default ComoAjudarModal;