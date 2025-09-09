import { api } from "./index";
import { apiConfig, buildEndpointUrl } from "../config/api";

export async function fetchPessoas(params: {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: "MASCULINO" | "FEMININO" | "";
  pagina?: number;
  porPagina?: number;
  status?: "DESAPARECIDO" | "LOCALIZADO" | "";
}) {
  try {
  const {
  nome = "",
  faixaIdadeInicial = 0,
  faixaIdadeFinal = 0,
  sexo = "",
  pagina = 0,
  porPagina = apiConfig.pagination.defaultPageSize,
  status = ""
  } = params || {};

  const url = `${apiConfig.endpoints.pessoas.filtro}?nome=${encodeURIComponent(nome)}&faixaIdadeInicial=${faixaIdadeInicial}&faixaIdadeFinal=${faixaIdadeFinal}&sexo=${sexo}&pagina=${pagina}&porPagina=${porPagina}&status=${status}`;

  const res = await api.get(url);

  return res.data;
  } catch (error) {

  throw error;
  }
}

export async function fetchPessoaById(id: string | number) {
  try {
  const url = buildEndpointUrl(apiConfig.endpoints.pessoas.byId, { id });

  const res = await api.get(url);

  return res.data;
  } catch (error) {

  throw error;
  }
}

export async function fetchEstatisticasPessoas() {
  try {
  const res = await api.get(apiConfig.endpoints.pessoas.estatisticas);
  return res.data;
  } catch (error) {

  throw error;
  }
}

export async function fetchOcorrenciaByPessoaId(pessoaId: string | number) {
  try {

  const pessoa = await fetchPessoaById(pessoaId);

  let ocorrenciaId: number | null = null;

  if (pessoa) {
  if (typeof pessoa.ocoId === 'number') {
    ocorrenciaId = pessoa.ocoId;
  } else if (pessoa.ultimaOcorrencia && typeof pessoa.ultimaOcorrencia.ocoId === 'number') {
    ocorrenciaId = pessoa.ultimaOcorrencia.ocoId;
  }
  }

  return {
  ocoId: ocorrenciaId,
  pessoaNome: pessoa?.nome || ''
  };
  } catch (error) {

  throw error;
  }
}

export async function fetchPessoasAberto() {
  try {
  const res = await api.get(apiConfig.endpoints.pessoas.aberto);
  return res.data;
  } catch (error) {

  throw error;
  }
}

export async function fetchPessoasDinamico() {
  try {
  const res = await api.get(apiConfig.endpoints.pessoas.dinamico);
  return res.data;
  } catch (error) {

  throw error;
  }
}