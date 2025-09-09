import { FiltrosPessoa } from '../../components/features/pessoa/PessoaFiltro';
import { PessoaDTO } from '../../types/pessoa';

export function aplicarFiltrosPessoa(pessoas: PessoaDTO[], filtros: FiltrosPessoa): PessoaDTO[] {
  return pessoas.filter((pessoa) => {

  if (filtros.nome) {
  const nomeMatch = pessoa.nome?.toLowerCase().includes(filtros.nome.toLowerCase());
  if (!nomeMatch) return false;
  }

  if (filtros.idadeMinima) {
  const idadeMinima = parseInt(filtros.idadeMinima);
  const idade = pessoa.idade;
  if (idade === undefined || idade < idadeMinima) return false;
  }

  if (filtros.idadeMaxima) {
  const idadeMaxima = parseInt(filtros.idadeMaxima);
  const idade = pessoa.idade;
  if (idade === undefined || idade > idadeMaxima) return false;
  }

  if (filtros.sexo) {
  if (pessoa.sexo !== filtros.sexo) return false;
  }

  if (filtros.status) {

  const temDataLocalizacao = !!pessoa.ultimaOcorrencia?.dataLocalizacao;
  const encontradoVivo = pessoa.ultimaOcorrencia?.encontradoVivo === true;

  const isLocalizado = temDataLocalizacao || encontradoVivo;

  switch (filtros.status) {
    case 'desaparecido':

      if (isLocalizado) return false;
      break;

    case 'localizado':

      if (!isLocalizado) return false;
      break;

    default:
      break;
  }
  }

  return true;
  });
}

export function contarPorStatus(pessoas: PessoaDTO[]): {
  total: number;
  desaparecidos: number;
  localizados: number;
} {
  const stats = {
  total: pessoas.length,
  desaparecidos: 0,
  localizados: 0
  };

  pessoas.forEach((pessoa) => {

  const temDataLocalizacao = !!pessoa.ultimaOcorrencia?.dataLocalizacao;
  const encontradoVivo = pessoa.ultimaOcorrencia?.encontradoVivo === true;

  const isLocalizado = temDataLocalizacao || encontradoVivo;

  if (isLocalizado) {
  stats.localizados++;
  } else {
  stats.desaparecidos++;
  }
  });

  return stats;
}