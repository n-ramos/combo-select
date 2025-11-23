/**
 * Émetteur d'événements simple
 */

export type ComboSelectEvent = 'search' | 'select' | 'remove' | 'open' | 'close' | 'navigate';

/**
 * Type pour les callbacks d'événements
 * Utilise unknown au lieu de any pour forcer les vérifications de type
 */
type EventCallback = (...args: unknown[]) => void;

export class EventEmitter {
  private events: Map<ComboSelectEvent, Set<EventCallback>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * Enregistrer un listener pour un événement
   */
  on(event: ComboSelectEvent, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    const eventSet = this.events.get(event);
    if (eventSet) {
      eventSet.add(callback);
    }
  }

  /**
   * Retirer un listener pour un événement
   */
  off(event: ComboSelectEvent, callback: EventCallback): void {
    const eventSet = this.events.get(event);
    if (eventSet) {
      eventSet.delete(callback);
    }
  }

  /**
   * Émettre un événement avec des arguments
   */
  emit(event: ComboSelectEvent, ...args: unknown[]): void {
    const eventSet = this.events.get(event);
    if (eventSet) {
      eventSet.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Vider tous les événements
   */
  clear(): void {
    this.events.clear();
  }
}