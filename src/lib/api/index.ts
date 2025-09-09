import axios from "axios";
import { apiConfig, validateApiConfig } from "../config/api";

validateApiConfig();

export const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout
});

export * from "./pessoa";
export * from "./ocorrencia";