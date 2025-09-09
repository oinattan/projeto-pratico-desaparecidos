"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, User, MapPin, Calendar, Clock, Send, Loader2 } from "lucide-react";
import { createPortal } from 'react-dom';
import { PessoaDTO } from "../../../types";
import { FileUpload } from "../forms";
import { ConfirmacaoContatoModal } from "./ConfirmacaoContatoModal";
import { applyPhoneMask } from "@/lib/utils/format";
import { fetchPessoas, fetchPessoaById } from "../../../lib/api/pessoa";
import type { OcorrenciaApiResponse } from "@/lib/utils/ocorrencia-feedback";

interface ParadeiroModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPessoaId?: string | number;
  preselectedPessoaName?: string;
  onSubmit?: (data: ParadeiroFormData) => Promise<OcorrenciaApiResponse | void>;
}

export interface ParadeiroFormData {
  pessoaId: string | number;
  pessoaNome: string;
  ocoId?: number;
  localizacao: string;
  dataAvistamento: string;
  informacaoAdicional: string;
  files?: File[];
  telefoneInformante?: string;
  emailInformante?: string;
}

export const ParadeiroModal: React.FC<ParadeiroModalProps> = ({
  isOpen,
  onClose,
  preselectedPessoaId,
  preselectedPessoaName,
  onSubmit
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPessoa, setSelectedPessoa] = useState<{id: string | number;nome: string;ocoId?: number;} | null>(null);
  const [searchResults, setSearchResults] = useState<PessoaDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingOcoId, setIsFetchingOcoId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [informanteOpen, setInformanteOpen] = useState(false);
  const [showConfirmacaoContato, setShowConfirmacaoContato] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<ParadeiroFormData | null>(null);
  const [formErrors, setFormErrors] = useState<{[key: string]: string;}>({});
  const [formData, setFormData] = useState<Partial<ParadeiroFormData>>({
  localizacao: "",
  dataAvistamento: "",
  informacaoAdicional: "",
  telefoneInformante: "",
  emailInformante: ""
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);
  }, []);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maskedValue = applyPhoneMask(e.target.value);
  setFormData({ ...formData, telefoneInformante: maskedValue });
  };

  useEffect(() => {
  if (preselectedPessoaId && preselectedPessoaName) {
  setSelectedPessoa({
    id: preselectedPessoaId,
    nome: preselectedPessoaName
  });
  setSearchTerm(preselectedPessoaName);
  }
  }, [preselectedPessoaId, preselectedPessoaName]);

  const searchPessoas = async (term: string) => {
  if (term.length < 2) {
  setSearchResults([]);
  return;
  }

  setIsSearching(true);
  try {

  const response = await fetchPessoas({
    nome: term,
    porPagina: 12,
    pagina: 0
  });

  if (response && response.content && Array.isArray(response.content)) {
    setSearchResults(response.content);
  } else {
    setSearchResults([]);
  }

  } catch (error) {
  setSearchResults([]);
  } finally {
  setIsSearching(false);
  }
  };

  useEffect(() => {
  const timer = setTimeout(() => {
  if (searchTerm && !selectedPessoa) {
    searchPessoas(searchTerm);
  }
  }, 300);

  return () => clearTimeout(timer);
  }, [searchTerm, selectedPessoa]);

  const handleSelectPessoa = async (pessoa: PessoaDTO) => {

  let ocoIdFinal = pessoa.ocoId;

  if (!ocoIdFinal) {
  setIsFetchingOcoId(true);
  try {
    const pessoaCompleta = await fetchPessoaById(pessoa.id);

    ocoIdFinal = pessoaCompleta.ocoId ||
    pessoaCompleta.ultimaOcorrencia?.ocoId ||
    pessoaCompleta.ultimaOcorrencia?.id ||
    pessoaCompleta.ocorrenciaId;

  } catch (error) {

  } finally {
    setIsFetchingOcoId(false);
  }
  }

  setSelectedPessoa({
  id: pessoa.id,
  nome: pessoa.nome,
  ocoId: ocoIdFinal
  });
  setSearchTerm(pessoa.nome);
  setSearchResults([]);

  if (formErrors.pessoa) {
  setFormErrors({ ...formErrors, pessoa: "" });
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setFormErrors({});

  const errors: {[key: string]: string;} = {};

  if (!selectedPessoa) {
  errors.pessoa = "Selecione uma pessoa desaparecida";
  }

  if (!formData.localizacao || formData.localizacao.trim() === "") {
  errors.localizacao = "Informe a localização do avistamento";
  }

  if (!formData.dataAvistamento || formData.dataAvistamento.trim() === "") {
  errors.dataAvistamento = "Informe a data do avistamento";
  }

  if (Object.keys(errors).length > 0) {
  setFormErrors(errors);
  return;
  }

  const submitData: ParadeiroFormData = {
  pessoaId: selectedPessoa!.id,
  pessoaNome: selectedPessoa!.nome,
  ocoId: selectedPessoa!.ocoId,
  localizacao: formData.localizacao!,
  dataAvistamento: formData.dataAvistamento!,
  informacaoAdicional: formData.informacaoAdicional || "",
  files: selectedFiles,
  telefoneInformante: formData.telefoneInformante,
  emailInformante: formData.emailInformante
  };

  const hasContacts = formData.telefoneInformante && formData.telefoneInformante.trim().length > 0 ||
  formData.emailInformante && formData.emailInformante.trim().length > 0;

  if (hasContacts) {

  setPendingSubmitData(submitData);
  setShowConfirmacaoContato(true);
  } else {

  await executeSubmit(submitData);
  }
  };

  const handleConfirmacaoContato = async (enviarContato: boolean) => {
  if (!pendingSubmitData) return;

  const finalSubmitData = { ...pendingSubmitData };

  if (!enviarContato) {

  finalSubmitData.telefoneInformante = "";
  finalSubmitData.emailInformante = "";
  }

  await executeSubmit(finalSubmitData);
  setPendingSubmitData(null);
  };

  const executeSubmit = async (submitData: ParadeiroFormData) => {
  setIsSubmitting(true);

  try {
  if (onSubmit) {
    await onSubmit(submitData);
  }

  setTimeout(() => {
    setFormData({
      localizacao: "",
      dataAvistamento: "",
      informacaoAdicional: "",
      telefoneInformante: "",
      emailInformante: ""
    });
    setSelectedFiles([]);
    setInformanteOpen(false);
    setFormErrors({});

    if (!preselectedPessoaId) {
      setSelectedPessoa(null);
      setSearchTerm("");
    }

    onClose();
  }, 100);
  } catch {

  } finally {
  setIsSubmitting(false);
  }
  };

  const resetSearch = () => {
  if (!preselectedPessoaId) {
  setSelectedPessoa(null);
  setSearchTerm("");
  setSearchResults([]);

  if (formErrors.pessoa) {
    setFormErrors({ ...formErrors, pessoa: "" });
  }
  }
  };

  if (!isOpen) return null;
  if (!mounted) return null;

  const modalContent =
  <>
  <AnimatePresence>
    {isOpen &&
  <div
    className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center p-2 sm:p-4 z-[9999]"
    style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
    
        <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y"
      style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
      
          {}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  Informar Paradeiro
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  Envie informações sobre o paradeiro desta pessoa
                </p>
              </div>
            </div>
            <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 ml-2">
          
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-0 pb-40 sm:pb-6">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pessoa Desaparecida *
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (formErrors.pessoa) {
                    setFormErrors({ ...formErrors, pessoa: "" });
                  }
                }}
                onFocus={() => !selectedPessoa && setSearchResults([])}
                disabled={!!preselectedPessoaId}
                placeholder="Digite o nome da pessoa..."
                className={`w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-base ${formErrors.pessoa ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`
                } />
              
                  {selectedPessoa && !preselectedPessoaId &&
              <button
                type="button"
                onClick={resetSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                
                      <X className="w-4 h-4" />
                    </button>
              }
                </div>
                {formErrors.pessoa &&
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.pessoa}</p>
            }

                {}
                {searchResults.length > 0 && !selectedPessoa &&
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchResults.map((pessoa) =>
              <button
                key={pessoa.id}
                type="button"
                onClick={() => handleSelectPessoa(pessoa)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0 flex items-center gap-3">
                
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{pessoa.nome}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {pessoa.idade} anos • {pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                            {pessoa.ocoId && ` • ID: ${pessoa.ocoId}`}
                          </p>
                        </div>
                      </button>
              )}
                  </div>
            }

                {}
                {(isSearching || isFetchingOcoId) &&
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 p-4 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {isSearching ? 'Buscando pessoas...' : 'Carregando dados da pessoa...'}
                    </p>
                  </div>
            }

                {}
                {!isSearching && !isFetchingOcoId && searchTerm.length >= 2 && searchResults.length === 0 && !selectedPessoa &&
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 p-4 text-center">
                    <User className="w-5 h-5 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma pessoa encontrada para &quot;{searchTerm}&quot;
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Tente usar termos diferentes ou verifique a ortografia
                    </p>
                  </div>
            }
              </div>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Localização *
              </label>
              <input
            type="text"
            value={formData.localizacao}
            onChange={(e) => {
              setFormData({ ...formData, localizacao: e.target.value });
              if (formErrors.localizacao) {
                setFormErrors({ ...formErrors, localizacao: "" });
              }
            }}
            placeholder="Endereço, bairro, cidade..."
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${formErrors.localizacao ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`
            }
            required />
          
              {formErrors.localizacao &&
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.localizacao}</p>
          }
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data do Avistamento *
              </label>
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-gray-400"><Calendar className="w-4 h-4" /></div>
                  <input
                type="datetime-local"
                value={formData.dataAvistamento || ''}
                onChange={(e) => {
                  setFormData({ ...formData, dataAvistamento: e.target.value });
                  if (formErrors.dataAvistamento) {
                    setFormErrors({ ...formErrors, dataAvistamento: '' });
                  }
                }}
                className={`w-full pr-4 py-2 sm:py-3 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${formErrors.dataAvistamento ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`
                }
                required />
              
                </div>
              </div>
              {formErrors.dataAvistamento &&
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.dataAvistamento}</p>
          }
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Informações Adicionais *
              </label>
              <textarea
            value={formData.informacaoAdicional}
            onChange={(e) => setFormData({ ...formData, informacaoAdicional: e.target.value })}
            placeholder="Descreva detalhes sobre o avistamento..."
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
            required />
          
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Anexos (Fotos, Vídeos ou PDFs)
              </label>
              <FileUpload
            onFilesChange={setSelectedFiles}
            onError={() => {}}
            maxFiles={10}
            maxSizePerFile={50}
            className="w-full" />
          
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Adicione fotos, vídeos ou documentos relacionados ao avistamento. Máximo 10 arquivos, 50MB cada.
              </p>
            </div>

            {}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
            type="button"
            onClick={() => setInformanteOpen(!informanteOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            
                <span className="text-left text-sm font-medium text-gray-900 dark:text-white">Dados do Informante (Opcional)</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Clique para abrir</span>
              </button>

              {informanteOpen &&
          <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                  type="tel"
                  value={formData.telefoneInformante}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base" />
                
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                      <input
                  type="email"
                  value={formData.emailInformante}
                  onChange={(e) => setFormData({ ...formData, emailInformante: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base" />
                
                    </div>
                  </div>
                </div>
          }
            </div>

            {}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            
                Cancelar
              </button>
              <button
            type="submit"
            disabled={isSubmitting || !selectedPessoa}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            
                {isSubmitting ?
            <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </> :

            <>
                    <Send className="w-4 h-4" />
                    Enviar Informação
                  </>
            }
              </button>
            </div>
          </form>



        </motion.div>
      </div>
  }
  </AnimatePresence>
  </>;

  return createPortal(
  <>
  {modalContent}
  {}
  <ConfirmacaoContatoModal
    isOpen={showConfirmacaoContato}
    onClose={() => {
      setShowConfirmacaoContato(false);
      setPendingSubmitData(null);
    }}
    onConfirm={handleConfirmacaoContato}
    telefone={formData.telefoneInformante}
    email={formData.emailInformante} />
  
  </>,
  document.body
  );
};