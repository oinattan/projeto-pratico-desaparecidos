export * from './pessoa';
export type { CartazDTO } from './pessoa';
import type { CartazDTO } from './pessoa';

export type PessoaSummary = {
  id: string | number;
  nome: string;
  status?: "Desaparecida" | "Localizada" | string;
  urlFoto?: string;
  vivo?: boolean;
  idade?: number;
  data_desaparecimento?: string;
  ultimaOcorrencia?: {
  dtDesaparecimento?: string;
  dataLocalizacao?: string;
  encontradoVivo?: boolean;
  localDesaparecimentoConcat?: string;
  ocorrenciaEntrevDesapDTO?: {
  informacao?: string;
  vestimentasDesaparecido?: string;
  };
  listaCartaz?: CartazDTO[];
  ocoId?: number;
  };
};

export type PessoaDetail = PessoaSummary & {
  descricao?: string;
  endereco?: string;
  contatos?: Array<{tipo: string;valor: string;}>;
};

export type FiltroPessoa = {
  idadeInicial?: number;
  idadeFinal?: number;
  sexo?: "MASCULINO" | "FEMININO" | "";
  status?: "DESAPARECIDO" | "LOCALIZADO" | "";
};