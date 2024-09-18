/**
 * Type specification for a function
 */
export type Action<T = unknown, A extends Array<unknown> = Array<unknown>> = (
  ...args: A
) => Promise<T> | T;

/**
 * Callback function
 */
export type Callback<T = unknown> = (err: Error | null, data?: T) => void;
