/**
 * Émetteur d'événements simple avec typage fort
 */

import type { SelectedItem } from '../types/index';

/**
 * Map des événements et leurs types de paramètres
 */
export interface EventMap {
  search: [query: string];
  select: [item: SelectedItem];
  remove: [item: SelectedItem];
  open: [];
  close: [];
  navigate: [direction: 'up' | 'down' | 'select'];
}

export type ComboSelectEvent = keyof EventMap;

/**
 * Type pour les callbacks d'événements avec typage fort
 */
type EventCallback<E extends ComboSelectEvent> = (...args: EventMap[E]) => void;

export class EventEmitter {
  private events: Map<ComboSelectEvent, Set<EventCallback<ComboSelectEvent>>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * Enregistrer un listener pour un événement
   */
  on<E extends ComboSelectEvent>(event: E, callback: EventCallback<E>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    const eventSet = this.events.get(event);
    if (eventSet) {
      eventSet.add(callback as EventCallback<ComboSelectEvent>);
    }
  }

  /**
   * Retirer un listener pour un événement
   */
  off<E extends ComboSelectEvent>(event: E, callback: EventCallback<E>): void {
    const eventSet = this.events.get(event);
    if (eventSet) {
      eventSet.delete(callback as EventCallback<ComboSelectEvent>);
    }
  }

  /**
   * Émettre un événement avec des arguments typés
   */
  emit<E extends ComboSelectEvent>(event: E, ...args: EventMap[E]): void {
    const eventSet = this.events.get(event);
    if (eventSet) {
      eventSet.forEach((callback) => {
        try {
          // CORRECTION: Cast vers le bon type
          (callback as (...args: EventMap[E]) => void)(...args);
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