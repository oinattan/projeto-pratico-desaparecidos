"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { ThemeBackground } from "../../../components/ui/backgrounds";
import { OcorrenciaInformacoes } from "../../../components/features/pessoa";
import { ParadeiroModal, ParadeiroFormData, ShareModal } from "../../../components/shared";
import { fetchPessoaById, fetchOcorrenciaByPessoaId } from "../../../lib/api/index";
import { postInformacoesDesaparecido, OcorrenciaInformacaoDTO } from "../../../lib/api/ocorrencia";
import type { OcorrenciaApiResponse } from "../../../lib/utils/ocorrencia-feedback";
import { PessoaDTO } from "../../../types";
import { formatDate } from "../../../lib/utils";
import { downloadImage, generateFilename, shareUtils } from "../../../lib/utils/download";
import { useAlert } from "../../../components/ui/feedback/useAlert";
import { Alert } from "../../../components/ui/feedback/Alert";
import { showOcorrenciaFeedback, showValidationError } from "../../../lib/utils/ocorrencia-feedback";

export default function PessoaDetalhePage() {
  const params = useParams();
  const { alert, showAlert, hideAlert } = useAlert();
  const [pessoa, setPessoa] = useState<PessoaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isParadeiroModalOpen, setIsParadeiroModalOpen] = useState(false);
  const [ocorrenciaInfo, setOcorrenciaInfo] = useState<{ocoId: number | null;pessoaNome: string;} | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pendingAlert, setPendingAlert] = useState<{
  type: 'success' | 'error';
  data: OcorrenciaApiResponse | {errorInfo: OcorrenciaApiResponse;};
  } | null>(null);

  const getInstagramCartaz = (): string | null => {
  const listaCartaz = pessoa?.ultimaOcorrencia?.listaCartaz;
  if (listaCartaz && listaCartaz.length > 0) {

  const cartazInstagram = listaCartaz.find((cartaz) => cartaz.tipoCartaz === 'INSTA_DESAPARECIDO');
  if (cartazInstagram && cartazInstagram.urlCartaz) {
    return cartazInstagram.urlCartaz;
  }

  return listaCartaz[0].urlCartaz || null;
  }

  return pessoa?.urlFoto ?? null;
  };

  useEffect(() => {
  if (params.id) {
  carregarPessoa(params.id as string);
  }
  }, [params.id]);

  useEffect(() => {
  if (!isParadeiroModalOpen && pendingAlert) {

  setTimeout(() => {
    if (pendingAlert.type === 'success') {

      showOcorrenciaFeedback(pendingAlert.data as OcorrenciaApiResponse, showAlert);
    } else {

      const errorData = pendingAlert.data;
      if (errorData instanceof Error) {
        showValidationError(errorData, showAlert);
      } else if (errorData && typeof errorData === 'object' && 'errorInfo' in errorData) {
        showOcorrenciaFeedback((errorData as {errorInfo: OcorrenciaApiResponse;}).errorInfo, showAlert);
      } else {
        showAlert("error", "Erro inesperado ao enviar informações.", {
          title: "Erro",
          autoClose: true,
          autoCloseDelay: 8000
        });
      }
    }
    setPendingAlert(null);
  }, 300);
  }
  }, [isParadeiroModalOpen, pendingAlert, showAlert]);

  const carregarPessoa = async (id: string) => {
  try {
  setLoading(true);
  setError(null);
  const data = await fetchPessoaById(id);
  const pessoaData = data as PessoaDTO;
  setPessoa(pessoaData);

  try {
    const ocorrencia = await fetchOcorrenciaByPessoaId(id);
    setOcorrenciaInfo(ocorrencia);
  } catch {
    setOcorrenciaInfo(null);
  }
  } catch {
  setError("Erro ao carregar informações da pessoa");
  } finally {
  setLoading(false);
  }
  };

  const handleParadeiroSubmit = async (data: ParadeiroFormData): Promise<OcorrenciaApiResponse> => {
  try {

  const ocorrenciaIdParaUsar = ocorrenciaInfo?.ocoId || pessoa?.ocoId || pessoa?.ultimaOcorrencia?.ocoId;

  if (!ocorrenciaIdParaUsar) {
    throw new Error("ID da ocorrência não encontrado. Não é possível salvar a informação.");
  }

  const dataFormatada = new Date().toISOString().split('T')[0];

  const informacaoCompleta = [
  `INFORMAÇÃO DE PARADEIRO - ${new Date().toLocaleString('pt-BR')}`,
  `LOCALIZAÇÃO: ${data.localizacao || 'Não informada'}`,
  `DATA DO AVISTAMENTO: ${data.dataAvistamento ? new Date(data.dataAvistamento).toLocaleString('pt-BR') : 'Não informada'}`,
  data.informacaoAdicional ? `INFORMAÇÕES ADICIONAIS: ${data.informacaoAdicional}` : null,
  '---',
  'Informação enviada através do portal Desenvolve MT'].
  filter(Boolean).join('\n');

  const ocorrenciaData: OcorrenciaInformacaoDTO = {
    ocoId: ocorrenciaIdParaUsar,
    informacao: informacaoCompleta,
    data: dataFormatada,
    files: data.files || []

  };

  const resultado = await postInformacoesDesaparecido(ocorrenciaData);

  setRefreshTrigger((prev) => prev + 1);

  setPendingAlert({ type: 'success', data: resultado });

  return resultado;
  } catch (error: unknown) {

  if (error instanceof Error) {
    showValidationError(error, showAlert);
  } else if (error && typeof error === 'object' && 'errorInfo' in error) {
    showOcorrenciaFeedback((error as {errorInfo: OcorrenciaApiResponse;}).errorInfo, showAlert);
  } else {
    showAlert("error", "Erro inesperado ao enviar informações. Tente novamente.", {
      title: "Erro",
      autoClose: true,
      autoCloseDelay: 8000
    });
  }

  throw error;
  }
  };

  if (loading) {
  return (
  <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden">
    <ThemeBackground />
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-900 dark:text-white text-xl">Carregando informações...</p>
      </div>
    </div>
  </div>);

  }

  if (error || !pessoa) {
  return (
  <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden">
    <ThemeBackground />
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Pessoa não encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error || "Não foi possível encontrar as informações desta pessoa."}
        </p>
        <Link
          href="/pessoa"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
          
          Voltar à lista
        </Link>
      </div>
    </div>
  </div>);

  }

  return (
  <div className="min-h-screen bg-white dark:bg-slate-900 relative overflow-hidden">
  <ThemeBackground />
  
  <div className="relative z-10 container mx-auto px-4 py-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}>
      
      {}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <nav className="flex space-x-2 text-sm">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Início
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-700 dark:text-gray-300">{pessoa.nome}</span>
        </nav>
        
        {}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-1">
          <button
            onClick={() => setIsParadeiroModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg transition-colors text-center font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base lg:px-3 lg:py-1.5 lg:gap-1 lg:text-sm">
            
            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-5m-8 4h8m-8 4h8" />
            </svg>
            <span className="hidden sm:inline">Informar Avistamento</span>
            <span className="sm:hidden">Informar</span>
          </button>
          
          <Link
            href="/#pessoas"
            className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 px-3 sm:px-4 md:px-4 py-2 sm:py-3 rounded-lg transition-colors text-center font-medium flex items-center justify-center gap-2 text-xs sm:text-sm md:text-sm lg:px-3 lg:py-1.5 lg:gap-1 lg:text-sm">
            
            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Voltar à Lista</span>
            <span className="sm:hidden">Voltar</span>
          </Link>
        </div>

        {}
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 lg:flex-row lg:gap-2 lg:items-center">
          {}
          <button
            onClick={() => {
              const baseUrl = window.location.origin;
              const pessoaUrl = `${baseUrl}/pessoa/${pessoa.id}`;
              const message = shareUtils.createWhatsAppMessage(pessoa, pessoaUrl);
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
            }}
            className="bg-white border border-gray-200 dark:border-gray-700 text-gray-900 px-2 sm:px-3 md:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-center font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-1 text-xs sm:text-sm md:text-sm lg:px-2 lg:py-1.5 lg:text-sm">
            
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097" />
            </svg>
              <span className="hidden sm:inline">Compartilhar WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          {}
          {(pessoa.ultimaOcorrencia?.listaCartaz && pessoa.ultimaOcorrencia.listaCartaz.length > 0 || pessoa.urlFoto) &&
          <>
              {}
              <button
              onClick={async () => {
                try {
                  const cartazUrl = getInstagramCartaz();
                  const listaCartaz = pessoa.ultimaOcorrencia?.listaCartaz;
                  const isCartazOficial = !!(listaCartaz && listaCartaz.length > 0);
                  const filename = generateFilename(pessoa, isCartazOficial ? 'cartaz' : 'foto');

                  await downloadImage(cartazUrl!, filename);
                  showAlert("success", "Download iniciado com sucesso!", {
                    title: "Download",
                    autoClose: true,
                    autoCloseDelay: 3000
                  });
                } catch {
                  showAlert("error", "Erro ao baixar a imagem. Tente novamente.", {
                    title: "Erro",
                    autoClose: true,
                    autoCloseDelay: 5000
                  });
                }
              }}
              className="bg-white border border-gray-200 dark:border-gray-700 text-gray-900 px-2 sm:px-3 md:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-center font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-1 text-xs sm:text-sm md:text-sm lg:px-2 lg:py-1.5 lg:text-sm">
              
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Baixar Cartaz</span>
                <span className="sm:hidden">Baixar</span>
              </button>

              {}
              <button
              onClick={() => {
                const cartazUrl = getInstagramCartaz();
                const listaCartaz = pessoa.ultimaOcorrencia?.listaCartaz;
                const isCartazOficial = !!(listaCartaz && listaCartaz.length > 0);

                const modal = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
                if (modal) {
                  const modalHtml = ShareModal({
                    pessoa,
                    imageUrl: cartazUrl!,
                    isCartazOficial
                  });
                  modal.document.write(modalHtml);
                  modal.document.close();
                }
              }}
              className="bg-white border border-gray-200 dark:border-gray-700 text-gray-900 px-3 sm:px-4 py-2 rounded-lg transition-colors text-center font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-1 text-xs sm:text-sm lg:px-3 lg:py-1.5 lg:text-sm">
              
              <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="hidden sm:inline">Compartilhar Instagram</span>
              <span className="sm:hidden">Instagram</span>
            </button>
            </>
          }
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            {}
            <div className="relative">
              {pessoa.urlFoto ?
              <div className="relative w-full max-h-[80vh] overflow-auto flex items-center lg:items-start justify-center">
                    <Image
                  src={pessoa.urlFoto}
                  alt={pessoa.nome}
                  width={800}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="w-full h-auto object-contain object-top cursor-pointer"
                  onClick={() => {

                    const modal = window.open('', '_blank');
                    if (modal) {
                      modal.document.write(`
                            <html>
                              <head><title>Foto - ${pessoa.nome}</title></head>
                              <body style="margin:0;padding:20px;background:#000;display:flex;align-items:center;justify-content:center;">
                                <img src="${pessoa.urlFoto}" style="max-width:100%;max-height:100vh;object-fit:contain;" alt="${pessoa.nome}" />
                              </body>
                            </html>
                          `);
                    }
                  }} />
                
                  </div> :

              <div className="aspect-[4/5] bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Sem foto disponível</span>
                  </div>
                </div>
              }
            </div>
            
            {}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {pessoa.nome}
              </h1>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  pessoa.vivo ?
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`
                  }>
                    {pessoa.vivo ? 'Localizada' : 'Desaparecida'}
                  </span>
                </div>
                
                {pessoa.idade &&
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Idade:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{pessoa.idade} anos</span>
                  </div>
                }
                
                {pessoa.sexo &&
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sexo:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="lg:col-span-2 space-y-6">

          {}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Informações Gerais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pessoa.sexo &&
              <div>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">Sexo:</span>
                  <span className="text-gray-900 dark:text-white">
                    {pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                  </span>
                </div>
              }
              
              {pessoa.idade !== null && pessoa.idade !== undefined &&
              <div>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">Idade:</span>
                  <span className="text-gray-900 dark:text-white">{pessoa.idade} anos</span>
                </div>
              }
              
              {pessoa.data_nascimento &&
              <div>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">Data de Nascimento:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(pessoa.data_nascimento)}
                  </span>
                </div>
              }
              
              {pessoa.status &&
              <div>
                  <span className="block text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-gray-900 dark:text-white">{pessoa.status}</span>
                </div>
              }
            </div>
          </div>

          {}
          {pessoa.ultimaOcorrencia &&
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Última Ocorrência
              </h2>
              
              <div className="space-y-3">
                {pessoa.ultimaOcorrencia.dtDesaparecimento &&
              <div>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">Data do Desaparecimento:</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(pessoa.ultimaOcorrencia.dtDesaparecimento)}
                    </span>
                  </div>
              }
                
                {pessoa.ultimaOcorrencia.localDesaparecimentoConcat &&
              <div>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">Local do Desaparecimento:</span>
                    <span className="text-gray-900 dark:text-white">
                      {pessoa.ultimaOcorrencia.localDesaparecimentoConcat}
                    </span>
                  </div>
              }
                
                {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.informacao &&
              <div>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">Informações:</span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
                    </p>
                  </div>
              }
                
                {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido &&
              <div>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">Vestimentas:</span>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {pessoa.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}
                    </p>
                  </div>
              }
              </div>
            </div>
          }

          {}
          {ocorrenciaInfo?.ocoId ?
          <OcorrenciaInformacoes
            key={refreshTrigger}
            ocorrenciaId={ocorrenciaInfo.ocoId}
            pessoaNome={pessoa.nome} /> :

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Informações da Ocorrência
              </h2>

            </div>
          }
        </div>
      </div>
      
    </motion.div>
  </div>

  {}
  <ParadeiroModal
    isOpen={isParadeiroModalOpen}
    onClose={() => {
      setIsParadeiroModalOpen(false);
    }}
    preselectedPessoaId={pessoa?.id}
    preselectedPessoaName={pessoa?.nome}
    onSubmit={handleParadeiroSubmit} />
  

  {}
  <Alert
    type={alert.type}
    title={alert.title}
    message={alert.message}
    isVisible={alert.isVisible}
    onClose={hideAlert}
    autoClose={alert.autoClose}
    autoCloseDelay={alert.autoCloseDelay} />
  
  </div>);

}