import type { ComboSelectEvent } from '../types/index';

export class EventEmitter {
  private events: Map<ComboSelectEvent, Set<(...args: any[]) => void>>;

  constructor() {
    this.events = new Map();
  }

  on(event: ComboSelectEvent, callback: (...args: any[]) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: ComboSelectEvent, callback: (...args: any[]) => void): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  emit(event: ComboSelectEvent, ...args: any[]): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  clear(): void {
    this.events.clear();
  }
}