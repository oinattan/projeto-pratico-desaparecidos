import { api } from "./index";
import { apiConfig } from "../config/api";

export interface OcorrenciaInformacaoDTO {
  ocoId: number;
  informacao: string;
  data: string;
  descricao?: string;
  files?: File[];
  id?: number;
  anexos?: string[];
}

export interface OcorrenciaDTO {
  id?: number;
  ocoId?: number;

}

export interface MotivoDto {
  id?: number;
  descricao?: string;

}

export async function fetchInformacoesDesaparecido(ocorrenciaId: number): Promise<OcorrenciaInformacaoDTO[]> {
  try {
  const url = `${apiConfig.endpoints.ocorrencias.informacoesDesaparecido}?ocorrenciaId=${ocorrenciaId}`;
  const response = await api.get<OcorrenciaInformacaoDTO[]>(url);

  return response.data;
  } catch (error: unknown) {

  interface AxiosError {
  response?: {status?: number;};
  }
  if ((error as AxiosError)?.response?.status === 404) {
  return [];
  }

  throw error;
  }
}

export async function postInformacoesDesaparecido(data: OcorrenciaInformacaoDTO) {
  try {

  if (!data.ocoId || data.ocoId <= 0) {
  throw new Error(`ID da ocorrência inválido: ${data.ocoId}`);
  }

  if (!data.informacao || data.informacao.trim().length === 0) {
  throw new Error('Informação não pode estar vazia');
  }

  let dataFormatada = data.data;
  if (data.data && data.data.includes('T')) {
  dataFormatada = data.data.split('T')[0];
  }

  if (!dataFormatada || !dataFormatada.match(/^\d{4}-\d{2}-\d{2}$/)) {
  throw new Error(`Data inválida: ${data.data}. Deve estar no formato YYYY-MM-DD`);
  }

  const params = new URLSearchParams();
  params.append('informacao', data.informacao);
  params.append('data', dataFormatada);
  params.append('ocoId', data.ocoId.toString());

  if (data.descricao && data.descricao.trim().length > 0) {
  params.append('descricao', data.descricao);
  }

  const url = `${apiConfig.endpoints.ocorrencias.informacoesDesaparecido}?${params.toString()}`;

  const formData = new FormData();

  if (data.files && data.files.length > 0) {
  data.files.forEach((file) => {

    const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm',
    'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não suportado: ${file.type}. Tipos permitidos: imagens, vídeos e PDF`);
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande: ${file.name}. Tamanho máximo: 50MB`);
    }

    formData.append('files', file);
  });
  } else {

  formData.append('files', '');
  }

  const res = await api.post(url, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'accept': '*/*'
  }
  });

  return {
  success: true,
  status: res.status,
  statusText: res.statusText,
  data: res.data,
  message: res.data?.message || "Informações enviadas com sucesso!",
  id: res.data?.id || res.data?.ocorrenciaId || null,
  timestamp: new Date().toISOString()
  };
  } catch (error: unknown) {

  interface AxiosErrorResponse {
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
  }

  const err = error as AxiosErrorResponse;
  const errorInfo = {
  success: false,
  status: err.response?.status || 0,
  statusText: err.response?.statusText || 'Network Error',
  message: err.response?.data?.message || err.response?.data?.error || err.message,
  details: err.response?.data || null,
  timestamp: new Date().toISOString(),
  originalError: err.message
  };

  const enhancedError = new Error(errorInfo.message);
  (enhancedError as AxiosErrorResponse & {response?: unknown;errorInfo?: unknown;}).response = err.response;
  (enhancedError as AxiosErrorResponse & {response?: unknown;errorInfo?: unknown;}).errorInfo = errorInfo;

  throw enhancedError;
  }
}

export async function postDelegaciaDigital(data: OcorrenciaDTO) {
  try {
  const res = await api.post(apiConfig.endpoints.ocorrencias.delegaciaDigital, data);
  return res.data;
  } catch (error) {
  throw error;
  }
}

export async function postVerificarDuplicidade(data: Record<string, unknown>) {
  try {
  const res = await api.post(apiConfig.endpoints.ocorrencias.verificarDuplicidade, data);
  return res.data;
  } catch (error) {
  throw error;
  }
}

export async function fetchMotivos() {
  try {
  const res = await api.get(apiConfig.endpoints.ocorrencias.motivos);
  return res.data;
  } catch (error) {
  throw error;
  }
}