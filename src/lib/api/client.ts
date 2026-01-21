/**
 * Base API Client for handling HTTP requests
 * Provides centralized error handling, request/response interceptors, and retry logic
 */

interface RequestConfig extends RequestInit {
  baseURL?: string;
  timeout?: number;
  retries?: number;
}

interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(baseURL: string = "/api", timeout: number = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultRetries = 3;
  }

  /**
   * Generic request method with timeout and retry logic
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      baseURL = this.baseURL,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      headers = {},
      ...restConfig
    } = config;

    const url = `${baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    let lastError: ApiError | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...restConfig,
          headers: defaultHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          throw {
            message: errorData.message || `HTTP ${response.status}`,
            status: response.status,
            data: errorData,
          } as ApiError;
        }

        return await this.parseSuccessResponse<T>(response);
      } catch (error) {
        lastError = this.handleError(error as Error);

        if (attempt < retries && this.shouldRetry(lastError)) {
          console.warn(`Retry attempt ${attempt}/${retries} for ${url}`);
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }

        throw lastError;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw lastError;
  }

  /**
   * Parse successful response
   */
  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return await response.json();
    }

    return (await response.text()) as unknown as T;
  }

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response): Promise<{
    message: string;
    [key: string]: unknown;
  }> {
    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }
      return { message: await response.text() };
    } catch {
      return { message: response.statusText };
    }
  }

  /**
   * Handle errors and convert to ApiError
   */
  private handleError(error: Error): ApiError {
    if (error.name === "AbortError") {
      return {
        message: "Request timeout",
        status: 408,
      };
    }

    if ("status" in error) {
      return error as ApiError;
    }

    return {
      message: error.message || "Network error",
      status: 0,
    };
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: ApiError): boolean {
    // Retry on network errors or 5xx server errors
    return error.status === 0 || error.status >= 500;
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  public async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  public async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  public async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }

  /**
   * Set base URL
   */
  public setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Get current base URL
   */
  public getBaseURL(): string {
    return this.baseURL;
  }
}

// Export singleton instance
export const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || "/api"
);

export default ApiClient;
export type { ApiError, RequestConfig };
