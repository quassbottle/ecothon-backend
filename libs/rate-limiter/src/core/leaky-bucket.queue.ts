import { Action, Callback } from '../types/leaky-bucket.types';

/**
 * A Leaky Bucket Queue implementation for rate limiting actions.
 */
export class LeakyBucketQueue {
  private queue: Array<{
    action: Action;
    args: Array<unknown>;
    callback: Callback;
  }> = [];
  private interval: NodeJS.Timeout | null = null;
  private readonly intervalMs: number;

  /**
   * Constructs a new LeakyBucketQueue with the given rate limit.
   *
   * @param rateLimit - The maximum number of actions allowed per second.
   */
  constructor(rateLimit: number) {
    this.intervalMs = Math.ceil(1000 / rateLimit);
  }

  /**
   * Executes the next action in the queue.
   * If the queue is empty, it clears the interval.
   */
  private execNext() {
    if (this.queue.length === 0) {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      return;
    }

    const next = this.queue.shift();
    if (!next) return;

    const { action, args, callback } = next;

    try {
      const result = action(...args);

      if (result instanceof Promise) {
        result
          .then((data) => callback(null, data))
          .catch((err) => callback(err));
      } else {
        callback(null, result);
      }
    } catch (err) {
      callback(err as Error);
    }
  }

  /**
   * Enqueues an action to be executed with the given arguments and callback.
   * If the interval is not running, it starts the interval.
   *
   * @param action - The action to be executed.
   * @param args - The arguments to be passed to the action.
   * @param callback - The callback to be called after the action is executed.
   */
  enqueue<T, A extends Array<unknown>>(
    action: Action<T, A>,
    args: A,
    callback: Callback<T>,
  ) {
    this.queue.push({
      action: action as Action<unknown, Array<unknown>>,
      args,
      callback: callback as Callback<unknown>,
    });

    if (!this.interval) {
      this.interval = setInterval(() => this.execNext(), this.intervalMs);
    }
  }

  /**
   * Executes an action asynchronously with the given arguments and returns a Promise.
   *
   * @param action - The action to be executed.
   * @param args - The arguments to be passed to the action.
   *
   * @returns A Promise that resolves to an array containing an error (if any) and the result of the action.
   */
  async execute<T, A extends Array<unknown>>(
    action: Action<T, A>,
    ...args: A
  ): Promise<[Error | null, T | null]> {
    return new Promise<[Error | null, T | null]>((resolve) => {
      this.enqueue(action, args, (err, data) => {
        if (err) {
          resolve([err, null]);
        } else {
          resolve([null, data as T]);
        }
      });
    });
  }
}
