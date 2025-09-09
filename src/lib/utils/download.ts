import type { PessoaDTO } from '../../types';

export async function downloadImage(imageUrl: string, filename?: string): Promise<void> {
  try {

  const response = await fetch(imageUrl);
  if (!response.ok) {
  throw new Error(`Erro ao baixar imagem: ${response.status}`);
  }

  const blob = await response.blob();

  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;

  if (filename) {
  link.download = filename;
  } else {

  const urlParts = imageUrl.split('/');
  const lastPart = urlParts[urlParts.length - 1];
  const filenameFromUrl = lastPart.split('?')[0];
  link.download = filenameFromUrl || 'cartaz-pessoa-desaparecida.jpg';
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(blobUrl);

  } catch (error) {

  throw error;
  }
}

export function generateFilename(pessoa: {nome: string;id?: string | number;}, tipo: 'cartaz' | 'foto' = 'cartaz'): string {

  const nomeClean = pessoa.nome.
  normalize('NFD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/[^a-zA-Z0-9\s]/g, '').
  replace(/\s+/g, '_').
  toUpperCase();

  const agora = new Date();
  const timestamp = agora.toISOString().split('T')[0];

  return `${tipo}_${nomeClean}_${pessoa.id || 'ID'}_${timestamp}.jpg`;
}

export const shareUtils = {

  createWhatsAppMessage(pessoa: PessoaDTO, pessoaUrl: string): string {
  return `🚨 PESSOA DESAPARECIDA 🚨\n\nNome: ${pessoa.nome}\n${pessoa.idade ? `Idade: ${pessoa.idade} anos\n` : ''}${pessoa.sexo ? `Sexo: ${pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}\n` : ''}${pessoa.ultimaOcorrencia?.dtDesaparecimento ? `Desapareceu em: ${new Date(pessoa.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString('pt-BR')}\n` : ''}${pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ? `Local: ${pessoa.ultimaOcorrencia.localDesaparecimentoConcat}\n` : ''}\nSe você tem informações, acesse: ${pessoaUrl}\n\n#PessoaDesaparecida #DesenvolveMT`;
  },

  createHashtags(pessoa: PessoaDTO): string {
  const nomeClean = pessoa.nome.replace(/\s+/g, '');
  return `#PessoaDesaparecida #DesenvolveMT #${nomeClean} #AjudeAEncontrar #CompartilheEAjude #CartazOficial`;
  },

  createInstagramCaption(pessoa: PessoaDTO): string {
  return `🚨 PESSOA DESAPARECIDA 🚨\n\nNome: ${pessoa.nome}\n${pessoa.idade ? `Idade: ${pessoa.idade} anos\n` : ''}${pessoa.sexo ? `Sexo: ${pessoa.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}\n` : ''}${pessoa.ultimaOcorrencia?.dtDesaparecimento ? `Desapareceu em: ${new Date(pessoa.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString('pt-BR')}\n` : ''}${pessoa.ultimaOcorrencia?.localDesaparecimentoConcat ? `Local: ${pessoa.ultimaOcorrencia.localDesaparecimentoConcat}\n` : ''}\n\nSe você tem informações, entre em contato!\n\n#PessoaDesaparecida #DesenvolveMT`;
  }
};