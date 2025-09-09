"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShimmerButton } from "../../ui/buttons";
import { ParadeiroModal, type ParadeiroFormData } from "../../ui/modals";
import { Alert, useAlert } from "../../ui/feedback";
import { postInformacoesDesaparecido, type OcorrenciaInformacaoDTO } from "../../../lib/api/ocorrencia";
import type { OcorrenciaApiResponse } from "../../../lib/utils/ocorrencia-feedback";

export function Hero() {
  const [isParadeiroModalOpen, setIsParadeiroModalOpen] = useState(false);
  const { showAlert, hideAlert, alert } = useAlert();

  const handleParadeiroSubmit = async (data: ParadeiroFormData): Promise<OcorrenciaApiResponse | void> => {
  try {

  const dataHoraAtual = new Date().toLocaleString('pt-BR');
  const dataAvistamentoFormatada = new Date(data.dataAvistamento).toLocaleString('pt-BR');

  const informacaoFormatada = `INFORMAÇÃO DE PARADEIRO - ${dataHoraAtual}

  LOCALIZAÇÃO: ${data.localizacao}
  DATA DO AVISTAMENTO: ${dataAvistamentoFormatada}

  INFORMAÇÕES ADICIONAIS:
  ${data.informacaoAdicional || 'Não informado'}

  DADOS DO INFORMANTE (opcional):
  Telefone ${data.telefoneInformante || 'não informado'}
  E-mail ${data.emailInformante || 'não informado'}

  ---
  Informação enviada através do portal Desenvolve MT`;

  if (!data.ocoId || isNaN(Number(data.ocoId))) {
    const errorMsg = `❌ ERRO: Pessoa "${data.pessoaNome}" não possui ID de ocorrência válido (ocoId: ${data.ocoId}).

    Isso pode acontecer se:
    1. A pessoa não tem uma ocorrência ativa no sistema
    2. Os dados da API estão incompletos
    3. A pessoa foi localizada e a ocorrência foi fechada

    Tente selecionar outra pessoa ou entre em contato com o suporte.`;

    throw new Error(`ID da ocorrência inválido: ${data.ocoId}. A pessoa selecionada deve ter um ocoId válido.`);
  }

  const ocorrenciaData: OcorrenciaInformacaoDTO = {
    ocoId: Number(data.ocoId),
    informacao: informacaoFormatada,
    data: data.dataAvistamento,
    descricao: data.informacaoAdicional,
    files: data.files
  };

  const resultado = await postInformacoesDesaparecido(ocorrenciaData);

  showAlert(
    'success',
    `Obrigado por informar o paradeiro de ${data.pessoaNome}. Sua informação foi registrada e será analisada pela equipe responsável.`,
    {
      title: 'Informação de Paradeiro Enviada!',
      autoClose: true,
      autoCloseDelay: 8000
    }
  );

  setTimeout(() => {
    setIsParadeiroModalOpen(false);
  }, 1000);

  return resultado;

  } catch (error: unknown) {

  const errorMessage = error instanceof Error ? error.message : 'Não foi possível enviar a informação do paradeiro. Tente novamente.';

  showAlert(
    'error',
    errorMessage,
    {
      title: 'Erro ao Enviar Informação',
      autoClose: false
    }
  );

  interface ErrorWithAxiosInfo {
    response?: unknown;
    request?: unknown;
    config?: unknown;
    errorInfo?: unknown;
  }

  const errorWithInfo = error as ErrorWithAxiosInfo;

  const processedError = {
    response: errorWithInfo?.response || null,
    request: errorWithInfo?.request || null,
    config: errorWithInfo?.config || null,
    message: errorMessage,
    errorInfo: errorWithInfo?.errorInfo || null
  };

  throw processedError;
  }
  };

  return (
  <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-4">
  {}
  {alert.isVisible &&
  <Alert
    type={alert.type}
    title={alert.title}
    message={alert.message}
    isVisible={alert.isVisible}
    onClose={hideAlert}
    autoClose={alert.autoClose}
    autoCloseDelay={alert.autoCloseDelay} />

  }

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center max-w-6xl mx-auto">
    
    {}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-8">
      
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Sistema Oficial PJC-MT
        </span>
      </div>
    </motion.div>

    {}
    <motion.h1
      className="text-2xl md:text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}>
      
      <span className="text-slate-900 dark:text-white">Encontre Pessoas </span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A03C] to-[#786428] dark:from-[#C8A03C] dark:to-[#786428]">
        Desaparecidas
      </span>
    </motion.h1>

    {}
    <motion.p
      className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}>
      
      Sistema de consulta e registro de informações sobre pessoas desaparecidas
      da <strong className="text-slate-800 dark:text-white">Polícia Judiciária Civil de Mato Grosso</strong>
    </motion.p>

    {}
    <motion.div
      className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}>
      
      <Link href="#pessoas">
        <ShimmerButton className="text-sm px-8 py-4 bg-blue-600 hover:bg-blue-700">
          Consultar Registros
        </ShimmerButton>
      </Link>

      <ShimmerButton
        className="text-sm px-8 py-4 bg-blue-600 hover:bg-blue-700"
        onClick={() => setIsParadeiroModalOpen(true)}>
        
        Informar Paradeiro
      </ShimmerButton>

      <Link href="https://delegaciadigital.pjc.mt.gov.br/login?redirectURL=%2Fdesaparecidos" target="_blank" rel="noopener noreferrer">
        <ShimmerButton className="text-sm px-8 py-4 bg-blue-600 hover:bg-blue-700">
          Registrar Desaparecimento
        </ShimmerButton>
      </Link>

    </motion.div>
  </motion.div>

  {}
  <ParadeiroModal
    isOpen={isParadeiroModalOpen}
    onClose={() => setIsParadeiroModalOpen(false)}
    onSubmit={handleParadeiroSubmit} />
  
  </div>);

}