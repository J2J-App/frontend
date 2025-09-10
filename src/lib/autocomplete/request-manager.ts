/**
 * Request cancellation and management utilities
 * Prevents race conditions and manages concurrent requests
 */

export interface RequestInfo {
  id: number;
  signal: AbortSignal;
  timestamp: number;
  isLatest: () => boolean;
}

export class RequestManager {
  private currentRequestId = 0;
  private activeRequests = new Map<number, AbortController>();
  private requestHistory: number[] = [];
  private readonly maxHistorySize = 10;

  /**
   * Create a new request with cancellation support
   */
  createRequest(): RequestInfo {
    // Cancel all previous requests
    this.cancelAllRequests();
    
    // Create new request
    const requestId = ++this.currentRequestId;
    const abortController = new AbortController();
    
    this.activeRequests.set(requestId, abortController);
    this.addToHistory(requestId);
    
    return {
      id: requestId,
      signal: abortController.signal,
      timestamp: Date.now(),
      isLatest: () => this.isLatestRequest(requestId)
    };
  }

  /**
   * Cancel a specific request by ID
   */
  cancelRequest(requestId: number): boolean {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
      return true;
    }
    return false;
  }

  /**
   * Cancel all active requests
   */
  cancelAllRequests(): void {
    for (const [id, controller] of this.activeRequests.entries()) {
      controller.abort();
    }
    this.activeRequests.clear();
  }

  /**
   * Check if a request is the latest one
   */
  isLatestRequest(requestId: number): boolean {
    return requestId === this.currentRequestId;
  }

  /**
   * Get the current request ID
   */
  getCurrentRequestId(): number {
    return this.currentRequestId;
  }

  /**
   * Get number of active requests
   */
  getActiveRequestCount(): number {
    return this.activeRequests.size;
  }

  /**
   * Get request statistics
   */
  getStats() {
    return {
      currentRequestId: this.currentRequestId,
      activeRequests: this.activeRequests.size,
      requestHistory: [...this.requestHistory],
      totalRequests: this.currentRequestId
    };
  }

  /**
   * Clean up completed requests
   */
  cleanup(): void {
    // Remove completed/aborted requests
    for (const [id, controller] of this.activeRequests.entries()) {
      if (controller.signal.aborted) {
        this.activeRequests.delete(id);
      }
    }
  }

  /**
   * Reset the request manager
   */
  reset(): void {
    this.cancelAllRequests();
    this.currentRequestId = 0;
    this.requestHistory = [];
  }

  private addToHistory(requestId: number): void {
    this.requestHistory.push(requestId);
    
    // Keep history size limited
    if (this.requestHistory.length > this.maxHistorySize) {
      this.requestHistory.shift();
    }
  }
}

/**
 * Global request manager instance for autocomplete
 */
export const autocompleteRequestManager = new RequestManager();

/**
 * Utility function to create a cancellable promise
 */
export function createCancellablePromise<T>(
  promise: Promise<T>,
  signal: AbortSignal
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Handle abort signal
    if (signal.aborted) {
      reject(new Error('Request was cancelled'));
      return;
    }

    // Listen for abort events
    const abortHandler = () => {
      reject(new Error('Request was cancelled'));
    };
    
    signal.addEventListener('abort', abortHandler);

    // Handle promise resolution/rejection
    promise
      .then((result) => {
        signal.removeEventListener('abort', abortHandler);
        if (!signal.aborted) {
          resolve(result);
        }
      })
      .catch((error) => {
        signal.removeEventListener('abort', abortHandler);
        if (!signal.aborted) {
          reject(error);
        }
      });
  });
}

/**
 * Utility to wrap fetch with cancellation support
 */
export async function cancellableFetch(
  url: string,
  options: RequestInit & { signal?: AbortSignal } = {}
): Promise<Response> {
  const { signal, ...fetchOptions } = options;
  
  if (signal?.aborted) {
    throw new Error('Request was cancelled before starting');
  }

  return fetch(url, {
    ...fetchOptions,
    signal
  });
}

/**
 * Race condition prevention utility
 * Ensures only the latest request result is processed
 */
export class RaceConditionGuard {
  private latestRequestId = 0;

  /**
   * Create a new request token
   */
  createToken(): number {
    return ++this.latestRequestId;
  }

  /**
   * Check if the token represents the latest request
   */
  isLatest(token: number): boolean {
    return token === this.latestRequestId;
  }

  /**
   * Reset the guard
   */
  reset(): void {
    this.latestRequestId = 0;
  }

  /**
   * Get current token
   */
  getCurrentToken(): number {
    return this.latestRequestId;
  }
}