export type TimerCallback = () => void;

interface TimerTask {
  timerId: ReturnType<typeof setTimeout>;
  endAt: number;
}

/**
 * Wraps Node/Bun's setTimeout to manage room phase countdowns.
 */
export class TimerService {
  private activeTimers = new Map<string, TimerTask>();

  /**
   * Starts a countdown for a specific room.
   * @param roomId Target room ID
   * @param seconds Duration in seconds
   * @param onComplete Callback when the timer hits zero
   * @returns UNIX timestamp (ms) of the exact moment the timer expires
   */
  public startTimer(roomId: string, seconds: number, onComplete: TimerCallback): number {
    this.clearTimer(roomId);

    const ms = seconds * 1000;
    const endAt = Date.now() + ms;
    
    const timerId = setTimeout(() => {
      this.activeTimers.delete(roomId);
      onComplete();
    }, ms);

    this.activeTimers.set(roomId, { timerId, endAt });
    return endAt;
  }

  /**
   * Clears any active timer for a room (e.g., if players vote instantly to skip the clock).
   */
  public clearTimer(roomId: string): void {
    const task = this.activeTimers.get(roomId);
    if (task) {
      clearTimeout(task.timerId);
      this.activeTimers.delete(roomId);
    }
  }

  /**
   * Retrieves the remaining milliseconds of a room's timer. Null if no timer.
   */
  public getRemainingMs(roomId: string): number | null {
    const task = this.activeTimers.get(roomId);
    if (!task) return null;
    const left = task.endAt - Date.now();
    return left > 0 ? left : 0;
  }
}
