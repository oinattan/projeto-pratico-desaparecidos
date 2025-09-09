"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { PessoaCard } from "./PessoaCard";
import { PessoaFiltro, FiltrosPessoa } from "./PessoaFiltro";
import { Pagination } from "../../shared/Pagination";
import { fetchPessoas, fetchEstatisticasPessoas } from "../../../lib/api/pessoa";
import { EstatisticasPessoas, PessoaDTO } from "../../../types/pessoa";
import { Loading } from "../../ui/feedback/Loading";
import { ErrorMessage } from "../../ui/feedback/ErrorMessage";

interface PessoaListHomePaginatedProps {
  className?: string;
}

export function PessoaListHomePaginated({ className = "" }: PessoaListHomePaginatedProps) {
  const [pessoasPage, setPessoasPage] = useState<PessoaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchingInBackground, setSearchingInBackground] = useState(false);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [estatisticasAPI, setEstatisticasAPI] = useState<EstatisticasPessoas | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  const [cacheTodosRegistros, setCacheTodosRegistros] = useState<PessoaDTO[]>([]);
  const [filtrosCache, setFiltrosCache] = useState<FiltrosPessoa | null>(null);

  const [filtros, setFiltros] = useState<FiltrosPessoa>({
  nome: '',
  idadeMinima: '',
  idadeMaxima: '',
  sexo: '',
  status: ''
  });

  const [filtrosDebounced, setFiltrosDebounced] = useState<FiltrosPessoa>(filtros);

  useEffect(() => {
  const timeoutId = setTimeout(() => {
  setFiltrosDebounced(filtros);
  }, 1000);

  return () => clearTimeout(timeoutId);
  }, [filtros]);

  const temFiltrosAtivos = Object.values(filtrosDebounced).some((valor) => valor !== '');

  const statsExibir = useMemo(() => {
  if (temFiltrosAtivos) {

  const total = totalElements || 0;

  const status = (filtrosDebounced.status || '').toLowerCase();
  return {
    total,
    desaparecidos: status === 'desaparecido' ? total : 0,
    localizados: status === 'localizado' ? total : 0
  };
  } else {
  const totalLocalizados = estatisticasAPI?.quantPessoasEncontradas || 0;
  const totalDesaparecidos = estatisticasAPI?.quantPessoasDesaparecidas || 0;
  return {
    total: totalLocalizados + totalDesaparecidos,
    desaparecidos: totalDesaparecidos,
    localizados: totalLocalizados
  };
  }
  }, [temFiltrosAtivos, totalElements, estatisticasAPI, filtrosDebounced.status]);

  const ITEMS_PER_PAGE = 12;
  const totalFilteredPages = totalPages;
  const pessoasPaginadas = pessoasPage;

  useEffect(() => {
  let mounted = true;
  const loadStats = async () => {
  try {
    setLoadingProgress('Carregando estatísticas...');
    const estatisticasResponse = await fetchEstatisticasPessoas();
    if (mounted && estatisticasResponse) {
      setEstatisticasAPI(estatisticasResponse);
    }
  } catch (err) {

  } finally {
    setLoadingProgress('');
  }
  };
  loadStats();
  return () => {mounted = false;};
  }, []);

  useEffect(() => {
  let mounted = true;

  const mapFiltrosToApi = (f: FiltrosPessoa) => {
  const nome = f.nome || '';
  const faixaIdadeInicial = f.idadeMinima ? Number(f.idadeMinima) : 0;
  const faixaIdadeFinal = f.idadeMaxima ? Number(f.idadeMaxima) : 0;

  const sexoLower = (f.sexo || '').toString().toUpperCase();
  const sexoApi: "" | "MASCULINO" | "FEMININO" = sexoLower === 'MASCULINO' || sexoLower === 'FEMININO' ? sexoLower as "MASCULINO" | "FEMININO" : '';

  const statusLower = (f.status || '').toString().toLowerCase();
  let statusApi: "" | "DESAPARECIDO" | "LOCALIZADO" = '';
  if (statusLower === 'desaparecido') statusApi = 'DESAPARECIDO';
  if (statusLower === 'localizado') statusApi = 'LOCALIZADO';

  return {
    nome,
    faixaIdadeInicial,
    faixaIdadeFinal,
    sexo: sexoApi,
    status: statusApi
  };
  };

  const loadPage = async (pageNumber: number) => {
  try {

    const isPageChange = pageNumber !== currentPage;
    const isFilterChange = !isPageChange;

    if (isFilterChange && pessoasPage.length > 0) {
      setSearchingInBackground(true);
    } else {
      setLoading(true);
    }

    setError(null);
    setLoadingProgress(`Carregando página ${pageNumber}...`);

    const apiParams = mapFiltrosToApi(filtrosDebounced);

    if (filtrosDebounced.status) {
      let todosRegistros = cacheTodosRegistros;

      const filtrosMudaram = !filtrosCache ||
      filtrosCache.nome !== filtrosDebounced.nome ||
      filtrosCache.idadeMinima !== filtrosDebounced.idadeMinima ||
      filtrosCache.idadeMaxima !== filtrosDebounced.idadeMaxima ||
      filtrosCache.sexo !== filtrosDebounced.sexo;

      if (filtrosMudaram || todosRegistros.length === 0) {
        setLoadingProgress('Carregando registros da base de dados...');

        todosRegistros = [];
        let paginaAPI = 0;
        let temMaisPaginas = true;

        while (temMaisPaginas) {
          setLoadingProgress(`Buscando dados... Página ${paginaAPI + 1}`);

          const response = await fetchPessoas({
            nome: apiParams.nome,
            faixaIdadeInicial: apiParams.faixaIdadeInicial,
            faixaIdadeFinal: apiParams.faixaIdadeFinal,
            sexo: apiParams.sexo,
            status: '',
            pagina: paginaAPI,
            porPagina: 100
          });

          if (!mounted || !response || !response.content) break;

          todosRegistros = [...todosRegistros, ...response.content];

          paginaAPI++;
          temMaisPaginas = paginaAPI < (response.totalPages || 0);

          setLoadingProgress(`Processados ${todosRegistros.length} registros...`);
        }

        setCacheTodosRegistros(todosRegistros);
        setFiltrosCache({ ...filtrosDebounced, status: '' });
      }

      if (!mounted) return;

      setLoadingProgress('Filtrando registros...');
      const registrosFiltrados = todosRegistros.filter((pessoa: PessoaDTO) => {
        const temDataLocalizacao = !!pessoa.ultimaOcorrencia?.dataLocalizacao;
        const encontradoVivo = pessoa.ultimaOcorrencia?.encontradoVivo === true;
        const isLocalizado = temDataLocalizacao || encontradoVivo;

        if (filtrosDebounced.status === 'desaparecido') {
          return !isLocalizado;
        } else if (filtrosDebounced.status === 'localizado') {
          return isLocalizado;
        }
        return true;
      });

      const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
      const registrosPaginados = registrosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setPessoasPage(registrosPaginados);
      setTotalPages(Math.ceil(registrosFiltrados.length / ITEMS_PER_PAGE));
      setTotalElements(registrosFiltrados.length);

    } else {

      setCacheTodosRegistros([]);
      setFiltrosCache(null);

      const response = await fetchPessoas({
        ...apiParams,
        pagina: pageNumber - 1,
        porPagina: ITEMS_PER_PAGE
      });

      if (!mounted) return;

      if (response && response.content) {
        setPessoasPage(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else {
        setPessoasPage([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    }

  } catch (err) {

    if (mounted) {
      setError('Erro ao carregar registros');
    }
  } finally {
    if (mounted) {
      setLoading(false);
      setSearchingInBackground(false);
      setLoadingProgress('');
    }
  }
  };

  if (!loading && !searchingInBackground) {
  loadPage(currentPage);
  }

  return () => {mounted = false;};
  }, [currentPage, filtrosDebounced]);

  useEffect(() => {

  setCurrentPage(1);

  const filtrosMudaram = filtrosCache && (
  filtrosCache.nome !== filtrosDebounced.nome ||
  filtrosCache.idadeMinima !== filtrosDebounced.idadeMinima ||
  filtrosCache.idadeMaxima !== filtrosDebounced.idadeMaxima ||
  filtrosCache.sexo !== filtrosDebounced.sexo);

  if (filtrosMudaram) {
  setCacheTodosRegistros([]);
  setFiltrosCache(null);
  }
  }, [filtrosDebounced]);

  const handlePageChange = useCallback((page: number) => {
  setIsChangingPage(true);
  setCurrentPage(page);

  setTimeout(() => {

  const filtrosSection = document.getElementById('filtros');
  if (filtrosSection) {

    const rect = filtrosSection.getBoundingClientRect();
    const offsetTop = window.pageYOffset + rect.top - 60;

    window.scrollTo({
      top: Math.max(0, offsetTop),
      behavior: 'smooth'
    });
  } else {

    const pessoasSection = document.getElementById('pessoas');
    if (pessoasSection) {
      const offsetTop = pessoasSection.offsetTop - 80;
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
    } else {

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setTimeout(() => {
    setIsChangingPage(false);
  }, 800);
  }, 50);
  }, []);

  const handleFiltrosChange = useCallback((novosFiltros: FiltrosPessoa) => {
  setFiltros(novosFiltros);
  }, []);

  const limparFiltros = useCallback(() => {
  setFiltros({
  nome: '',
  idadeMinima: '',
  idadeMaxima: '',
  sexo: '',
  status: ''
  });
  }, []);

  if (loading && !searchingInBackground) {
  return (
  <div className="flex flex-col justify-center items-center py-16 space-y-4">
    <Loading />
    {loadingProgress &&
    <div className="text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {loadingProgress}
        </p>
      </div>
    }
  </div>);

  }

  if (error) {
  return (
  <div className="py-16">
    <ErrorMessage message={error} />
  </div>);

  }

  return (
  <motion.div
  className={`w-full ${className}`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}>
  
  {}
  <div className="relative">
    {}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-purple-50/80 dark:from-slate-900/80 dark:via-slate-800/40 dark:to-slate-900/80 rounded-3xl" />
    
    {}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.1)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)]" />
    
    <div className="relative px-6 py-12 lg:px-8 lg:py-16">
      {}
      <div className="text-center mb-8">
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          
          Pessoas Desaparecidas
        </motion.h2>
        <motion.p
          className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          
          Ajude-nos a reencontrar essas pessoas. Sua colaboração pode fazer a diferença.
        </motion.p>

        {}
        {searchingInBackground &&
        <motion.div
          className="inline-flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>
          
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Aplicando filtros...
            </span>
          </motion.div>
        }

        {}
        {temFiltrosAtivos && !searchingInBackground &&
        <motion.p
          className="text-sm text-blue-600 dark:text-blue-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}>
          
            Estatísticas baseadas nos filtros aplicados
          </motion.p>
        }
        
        {}
        {statsExibir.total > 0 &&
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}>
          
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {statsExibir.total} total
              </span>
            </div>
            {statsExibir.desaparecidos > 0 &&
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm rounded-full border border-red-200/60 dark:border-red-700/60">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {statsExibir.desaparecidos} desaparecidos
                </span>
              </div>
          }
            {statsExibir.localizados > 0 &&
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm rounded-full border border-green-200/60 dark:border-green-700/60">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {statsExibir.localizados} localizados
                </span>
              </div>
          }
          </motion.div>
        }
      </div>

      {}
      <motion.div
        id="filtros"
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        
        <PessoaFiltro
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onLimpar={limparFiltros}
          isSearching={searchingInBackground} />
        
      </motion.div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: isChangingPage ? 0.7 : 1,
          y: 0,
          scale: isChangingPage ? 0.98 : 1
        }}
        transition={{
          delay: isChangingPage ? 0 : 0.5,
          duration: isChangingPage ? 0.3 : 0.6
        }}
        className="mb-12 relative">
        
        {}
        {isChangingPage &&
        <motion.div
          className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Carregando página...
              </span>
            </div>
          </motion.div>
        }
        
        {pessoasPaginadas.length > 0 ?
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pessoasPaginadas.map((pessoa: PessoaDTO, index: number) =>
          <motion.div
            key={pessoa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}>
            
                <PessoaCard pessoa={pessoa} />
              </motion.div>
          )}
          </div> :

        <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {totalElements === 0 ? 'Nenhuma pessoa encontrada' : 'Nenhum resultado para os filtros aplicados'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {totalElements === 0 ?
              'Não há registros disponíveis no momento.' :
              'Tente ajustar os filtros para ver mais resultados.'
              }
              </p>
            </div>
          </div>
        }
      </motion.div>

      {}
      {totalFilteredPages > 1 &&
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-lg">
            <Pagination
            page={currentPage}
            totalPages={totalFilteredPages}
            onChange={handlePageChange} />
          
          </div>
        </motion.div>
      }

    </div>
  </div>
  </motion.div>);

}