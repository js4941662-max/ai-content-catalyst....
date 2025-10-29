
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private requestsPerMinute: number;
  private minDelay: number;

  constructor(requestsPerMinute: number = 10) {
    this.requestsPerMinute = requestsPerMinute;
    this.minDelay = 60000 / this.requestsPerMinute; // ms between requests
  }

  /**
   * Adds an API call to the queue and returns a Promise that resolves with the result.
   * @param apiCall A function that returns a Promise for the API call.
   */
  async enqueue<T>(apiCall: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await apiCall();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      await task();
      
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.minDelay));
      }
    }
    
    this.processing = false;
  }
}

// A global instance of the rate limiter for the Gemini API.
// The default of 10 requests per minute is a very safe limit for the free tier.
export const geminiRateLimiter = new RateLimiter(10);
