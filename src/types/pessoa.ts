export interface CartazDTO {
  urlCartaz: string;
  tipoCartaz: 'INSTA_DESAPARECIDO' | 'FACEBOOK_DESAPARECIDO' | string;
}

export interface PessoaDTO {
  id: string;
  nome: string;
  status: string;
  urlFoto?: string;
  idade?: number;
  sexo?: 'MASCULINO' | 'FEMININO';
  vivo?: boolean;
  ocoId?: number;
  ocorrenciaId?: number;
  ultimaOcorrencia?: {
  id?: number;
  ocoId?: number;
  dtDesaparecimento?: string;
  dataLocalizacao?: string;
  encontradoVivo?: boolean;
  localDesaparecimentoConcat?: string;
  listaCartaz?: CartazDTO[];
  ocorrenciaEntrevDesapDTO?: {
  informacao?: string;
  vestimentasDesaparecido?: string;
  };
  };

  data_desaparecimento?: string;
  local_desaparecimento?: string;
  data_nascimento?: string;
}

export interface EstatisticasPessoas {
  quantPessoasDesaparecidas: number;
  quantPessoasEncontradas: number;
}

export interface FiltrosAPI {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: "MASCULINO" | "FEMININO" | "";
  pagina?: number;
  porPagina?: number;
  status?: "DESAPARECIDO" | "LOCALIZADO" | "";
}

export interface ResponsePessoas {
  content: PessoaDTO[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}