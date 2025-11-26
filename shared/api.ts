import axios, { AxiosRequestConfig, Method } from "axios";
import { ApiErrorResponse } from "@/lib/type";

export const apiRequest = async <T>(
  method: Method,
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

    // Asegurarse de que el endpoint comience con /
    let formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    // Normalizar URLs
    const normalizedBase = baseUrl.replace(/\/+$/, "");
    const fullUrl = `${normalizedBase}${formattedEndpoint}`;

    console.log("🌐 Making API request:", {
      method,
      url: fullUrl,
      hasData: !!data,
      hasToken: !!token
    });

    // Detectar si es FormData
    const isFormData = data instanceof FormData;

    // Headers básicos
    const headers: Record<string, string> = {
      "Accept": "application/json",
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Content-Type solo si no es FormData
    if (!isFormData && method !== "GET" && method !== "DELETE") {
      headers["Content-Type"] = "application/json";
    }

    // Combinar con headers adicionales
    if (config?.headers) {
      Object.assign(headers, config.headers);
    }

    const response = await axios({
      method,
      url: fullUrl,
      data: !isFormData && data ? JSON.stringify(data) : data,
      headers,
      timeout: 30000,
      validateStatus: (status) => status >= 200 && status < 500,
      ...config,
    });

    console.log("📥 API Response:", {
      status: response.status,
      data: response.data,
      url: fullUrl
    });

    // Si la respuesta es un error, lanzar excepción
    if (response.status >= 400) {
      const errorData: ApiErrorResponse = {
        message: response.data?.message || `Error ${response.status}: ${response.statusText}`,
        statusCode: response.status,
        error: response.data?.error || response.statusText,
        details: response.data || {}
      };

      console.error("❌ API Error Response:", errorData);

      throw errorData;
    }

    return response.data as T;
  } catch (error: any) {
    console.error("❌ API Request Failed:", {
      name: error.name,
      message: error.message,
      code: error.code,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
      } : 'No config',
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response'
    });

    // Si es nuestro error personalizado (ApiErrorResponse)
    if (error.statusCode) {
      const status = error.statusCode;

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // No redirigir automáticamente, dejar que el hook maneje esto
        }
        throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
      } else if (status === 403) {
        throw new Error("No tienes permisos para realizar esta acción.");
      } else if (status === 404) {
        throw new Error("Recurso no encontrado.");
      } else if (status >= 500) {
        throw new Error("Error interno del servidor. Por favor, intenta más tarde.");
      } else {
        throw new Error(error.message || `Error ${status}`);
      }
    }

    // Manejo de errores de Axios
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
      } else if (status === 403) {
        throw new Error("No tienes permisos para realizar esta acción.");
      } else if (status === 404) {
        throw new Error("Recurso no encontrado.");
      } else if (status >= 500) {
        throw new Error("Error interno del servidor. Por favor, intenta más tarde.");
      } else {
        throw new Error(error.response.data?.message || `Error ${status}: ${error.response.statusText}`);
      }
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    } else {
      throw new Error(error.message || "Error inesperado al realizar la solicitud.");
    }
  }
};
