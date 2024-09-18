/**
 * This interface defines the parameters for the rate limiter module.
 *
 * @remarks
 * The rate limiter module is responsible for controlling the rate of incoming requests.
 *
 * @interface
 */
export interface RateLimiterModuleParams {
  /**
   * The maximum number of requests allowed per second.
   * If not provided, the default value is 30.
   */
  requestsPerSecond?: number;
}
