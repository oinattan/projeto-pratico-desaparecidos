"use client";
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { motion } from "framer-motion";
import { ActionButton } from "../../ui/buttons";

interface PessoaCardProps {
  pessoa: {
  id: string;
  nome: string;
  status: string;
  urlFoto?: string;
  idade?: number;
  sexo?: string;
  vivo?: boolean;
  ultimaOcorrencia?: {
  dtDesaparecimento?: string;
  dataLocalizacao?: string;
  encontradoVivo?: boolean;
  localDesaparecimentoConcat?: string;
  ocorrenciaEntrevDesapDTO?: {
    informacao?: string;
    vestimentasDesaparecido?: string;
  };
  };

  data_desaparecimento?: string;
  local_desaparecimento?: string;
  data_nascimento?: string;
  };
}

export function PessoaCard({ pessoa }: PessoaCardProps) {

  const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
  return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
  return '';
  }
  };

  const formatIdade = (idade?: number, dataNascimento?: string) => {
  if (idade !== undefined && idade >= 0) {
  if (idade === 0) {

    if (dataNascimento) {
      try {
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        const diffTime = hoje.getTime() - nascimento.getTime();
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));

        if (diffMonths < 12) {
          return `${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
        }
      } catch {

      }
    }
    return '0 anos';
  } else if (idade < 2) {

    if (dataNascimento) {
      try {
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        const diffTime = hoje.getTime() - nascimento.getTime();
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));

        if (diffMonths < 24) {
          return `${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
        }
      } catch {

      }
    }
    return `${idade} ${idade === 1 ? 'ano' : 'anos'}`;
  } else {
    return `${idade} anos`;
  }
  }
  return '';
  };

  const statusConfig = (() => {

  const encontradoVivo = pessoa.ultimaOcorrencia?.encontradoVivo === true;
  const temDataLocalizacao = !!pessoa.ultimaOcorrencia?.dataLocalizacao;

  if (encontradoVivo || temDataLocalizacao) {
  return {
    pill: 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-600/60',
    glow: 'shadow-emerald-500/10',
    text: 'Localizado'
  };
  }

  return {
  pill: 'bg-red-100/90 text-red-700 dark:bg-red-900/60 dark:text-red-200 border border-red-300/60 dark:border-red-600/60',
  glow: 'shadow-red-500/10',
  text: 'Desaparecido'
  };
  })();

  return (
  <motion.div
  whileHover={{ y: -3, scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
  
  {}
  <div className="relative flex flex-col h-full">
    {}
    <div className="relative h-48 md:h-64 lg:h-72 w-full overflow-hidden rounded-t-xl flex-shrink-0">
      {pessoa.urlFoto ?
      <div className="relative h-full w-full">
          <Image
          src={pessoa.urlFoto}
          alt={pessoa.nome}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105 bg-transparent" />
        
        </div> :

      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-700">
          <div className="rounded-full bg-slate-200 dark:bg-slate-600 p-4">
            <svg className="w-12 h-12 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      }

      {}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {}
      <div className="absolute top-4 left-4">
        <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${statusConfig.pill}`}>
          {statusConfig.text}
        </span>
      </div>

      {}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-semibold text-white drop-shadow-md line-clamp-2 leading-tight">
          {pessoa.nome}
        </h3>
      </div>
    </div>

    {}
    <div className="p-4 space-y-3 flex-grow flex flex-col">
      {}
      <div className="space-y-2 text-sm flex-grow">
        {}
        {pessoa.idade !== null && pessoa.idade !== undefined || pessoa.sexo ?
        <div className="flex flex-wrap gap-3">
            {pessoa.idade !== null && pessoa.idade !== undefined &&
          <span className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">Idade:</span>{' '}
                {pessoa.idade === 0 && pessoa.ultimaOcorrencia?.dtDesaparecimento ?
            (() => {
              try {
                const dataDesap = new Date(pessoa.ultimaOcorrencia.dtDesaparecimento);
                const hoje = new Date();
                const diffTime = hoje.getTime() - dataDesap.getTime();
                const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
                return diffMonths > 0 ? `${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}` : 'Recém-nascido';
              } catch {
                return '0 anos';
              }
            })() :

            formatIdade(pessoa.idade, pessoa.data_nascimento)
            }
              </span>
          }
            {pessoa.sexo &&
          <span className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">Sexo:</span>{' '}
                {pessoa.sexo === 'MASCULINO' ? 'Masculino' : pessoa.sexo === 'FEMININO' ? 'Feminino' : pessoa.sexo}
              </span>
          }
          </div> :
        null}

        {}
        {pessoa.ultimaOcorrencia?.dtDesaparecimento || pessoa.data_desaparecimento ?
        <div className="text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-800 dark:text-slate-200">Data:</span>{' '}
            {formatDate(pessoa.ultimaOcorrencia?.dtDesaparecimento || pessoa.data_desaparecimento || '')}
          </div> :
        null}

        {}
        {pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || pessoa.local_desaparecimento ?
        <div className="text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-800 dark:text-slate-200">Local:</span>{' '}
            <span className="break-words">
              {pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || pessoa.local_desaparecimento}
            </span>
          </div> :
        null}
      </div>

      {}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        <Link href={`/pessoa/${pessoa.id}`} className="block">
          <ActionButton
            variant="ghost"
            size="sm"
            className="w-full justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            
            Ver detalhes
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </ActionButton>
        </Link>
      </div>
    </div>
  </div>

  {}
  </motion.div>);

}