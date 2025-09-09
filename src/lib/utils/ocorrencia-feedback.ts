import { AlertType } from "@/components/ui/feedback/Alert";

export interface OcorrenciaApiResponse {
  success: boolean;
  status: number;
  statusText: string;
  data?: unknown;
  message: string;
  id?: number | null;
  timestamp: string;
  details?: unknown;
  originalError?: string;
}

export interface AlertFeedback {
  type: AlertType;
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function processOcorrenciaResponse(response: OcorrenciaApiResponse): AlertFeedback {
  if (response.success) {
  return {
  type: "success",
  title: "Sucesso!",
  message: response.message || "Informações enviadas com sucesso!",
  autoClose: true,
  autoCloseDelay: 5000
  };
  } else {

  let title = "Erro";
  let message = response.message;
  let type: AlertType = "error";
  let autoClose = true;
  const autoCloseDelay = 8000;

  switch (response.status) {
  case 400:
    title = "Dados Inválidos";
    message = response.message || "Os dados enviados são inválidos. Verifique as informações e tente novamente.";
    type = "warning";
    break;

  case 401:
    title = "Não Autorizado";
    message = "Você não tem permissão para realizar esta ação.";
    type = "error";
    break;

  case 403:
    title = "Acesso Negado";
    message = "Acesso negado. Verifique suas permissões.";
    type = "error";
    break;

  case 404:
    title = "Não Encontrado";
    message = "A ocorrência solicitada não foi encontrada.";
    type = "warning";
    break;

  case 422:
    title = "Erro de Validação";
    message = response.message || "Os dados não passaram na validação do servidor.";
    type = "warning";
    break;

  case 500:
    title = "Erro do Servidor";
    message = "Erro interno do servidor. Tente novamente em alguns minutos.";
    type = "error";
    autoClose = false;
    break;

  case 0:
    title = "Erro de Conexão";
    message = "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.";
    type = "error";
    break;

  default:
    title = "Erro Inesperado";
    message = response.message || `Erro ${response.status}: ${response.statusText}`;
    type = "error";
  }

  return {
  type,
  title,
  message,
  autoClose,
  autoCloseDelay
  };
  }
}

export function processValidationError(error: Error): AlertFeedback {
  const message = error.message;

  if (message.includes("ID da ocorrência inválido")) {
  return {
  type: "warning",
  title: "ID Inválido",
  message: "O ID da ocorrência é inválido. Verifique se a ocorrência existe.",
  autoClose: true,
  autoCloseDelay: 6000
  };
  }

  if (message.includes("Informação não pode estar vazia")) {
  return {
  type: "warning",
  title: "Campo Obrigatório",
  message: "Por favor, preencha o campo de informações.",
  autoClose: true,
  autoCloseDelay: 5000
  };
  }

  if (message.includes("Data inválida")) {
  return {
  type: "warning",
  title: "Data Inválida",
  message: "A data deve estar no formato correto (YYYY-MM-DD).",
  autoClose: true,
  autoCloseDelay: 5000
  };
  }

  if (message.includes("Tipo de arquivo não suportado")) {
  return {
  type: "warning",
  title: "Arquivo Inválido",
  message: "Tipo de arquivo não suportado. Use apenas imagens, vídeos ou PDFs.",
  autoClose: true,
  autoCloseDelay: 6000
  };
  }

  if (message.includes("Arquivo muito grande")) {
  return {
  type: "warning",
  title: "Arquivo Muito Grande",
  message: "O arquivo é muito grande. Tamanho máximo permitido: 50MB.",
  autoClose: true,
  autoCloseDelay: 6000
  };
  }

  return {
  type: "error",
  title: "Erro de Validação",
  message: message || "Erro desconhecido de validação.",
  autoClose: true,
  autoCloseDelay: 6000
  };
}

export function showOcorrenciaFeedback(
response: OcorrenciaApiResponse,
showAlert: (type: AlertType, message: string, options?: {title?: string;autoClose?: boolean;autoCloseDelay?: number;}) => void)
{
  const feedback = processOcorrenciaResponse(response);

  showAlert(feedback.type, feedback.message, {
  title: feedback.title,
  autoClose: feedback.autoClose,
  autoCloseDelay: feedback.autoCloseDelay
  });
}

export function showValidationError(
error: Error,
showAlert: (type: AlertType, message: string, options?: {title?: string;autoClose?: boolean;autoCloseDelay?: number;}) => void)
{
  const feedback = processValidationError(error);

  showAlert(feedback.type, feedback.message, {
  title: feedback.title,
  autoClose: feedback.autoClose,
  autoCloseDelay: feedback.autoCloseDelay
  });
}