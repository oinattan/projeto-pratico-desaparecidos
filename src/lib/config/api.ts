export const apiConfig = {

  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),

  endpoints: {

    auth: {
      login: "/login",
      refreshToken: "/refresh-token"
    },

    pessoas: {
      byId: "/pessoas/{id}",
      aberto: "/pessoas/aberto",
      filtro: "/pessoas/aberto/filtro",
      estatisticas: "/pessoas/aberto/estatistico",
      dinamico: "/pessoas/aberto/dinamico"
    },

    ocorrencias: {
      informacoesDesaparecido: "/ocorrencias/informacoes-desaparecido",
      delegaciaDigital: "/ocorrencias/delegacia-digital",
      verificarDuplicidade: "/ocorrencias/delegacia-digital/verificar-duplicidade",
      motivos: "/ocorrencias/motivos"
    }
  },

  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  }
};

export function validateApiConfig() {

  return {
    isValid: true,
    config: apiConfig
  };
}

export function buildEndpointUrl(endpoint: string, params?: Record<string, string | number>) {
  let url = endpoint;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
  }

  return url;
}