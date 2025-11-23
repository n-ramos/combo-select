import { Config } from '@core/Config';
import { EventEmitter } from '@core/EventEmitter';
import { DOMHelpers } from '@utils/DOMHelpers';

export class Input {
  private element: HTMLInputElement;
  private config: Config;
  private events: EventEmitter;

  constructor(config: Config, events: EventEmitter) {
    this.config = config;
    this.events = events;
    this.element = this.create();
    this.attachEvents();
  }

  private create(): HTMLInputElement {
    const input = DOMHelpers.createElement('input', 'comboselect-input', {
      type: 'text',
      placeholder: this.config.get('placeholder') || 'Sélectionner...',
      autocomplete: 'off',
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': 'false',
    }) as HTMLInputElement;

    return input;
  }

  private attachEvents(): void {
    // Événement input
    this.element.addEventListener('input', () => {
      const query = this.element.value;
      this.events.emit('search', query);
    });

    // Événements clavier
    this.element.addEventListener('keydown', (e: KeyboardEvent) => {
      this.handleKeyDown(e);
    });
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const key = e.key;

    if (key === 'ArrowUp') {
      e.preventDefault();
      this.events.emit('navigate', 'up');
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      this.events.emit('navigate', 'down');
    } else if (key === 'Enter') {
      e.preventDefault();
      this.events.emit('navigate', 'select');
    } else if (key === 'Escape') {
      e.preventDefault();
      this.events.emit('close');
    }
  }

  focus(): void {
    this.element.focus();
  }

  clear(): void {
    this.element.value = '';
  }

  getValue(): string {
    return this.element.value;
  }

  setValue(value: string): void {
    this.element.value = value;
  }

  disable(): void {
    this.element.disabled = true;
  }

  enable(): void {
    this.element.disabled = false;
  }

  setAriaExpanded(expanded: boolean): void {
    this.element.setAttribute('aria-expanded', String(expanded));
  }

  getElement(): HTMLInputElement {
    return this.element;
  }

  destroy(): void {
    // Pas besoin de retirer les événements car l'élément sera supprimé du DOM
  }
}