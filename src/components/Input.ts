import { Config } from '@core/Config';
import { EventEmitter } from '@core/EventEmitter';
import { DOMHelpers } from '@utils/DOMHelpers';
import { debounce } from '@utils/Debounce';

export class Input {
  private element: HTMLInputElement;
  private config: Config;
  private events: EventEmitter;
  private debouncedSearch: (query: string) => void;

  constructor(config: Config, events: EventEmitter) {
    this.config = config;
    this.events = events;
    this.element = this.create();
    this.debouncedSearch = debounce(
      (query: string) => this.handleSearch(query),
      config.get('debounceDelay') || 300
    );
    this.attachEvents();
  }

  private create(): HTMLInputElement {
    const input = DOMHelpers.createElement('input', 'comboselect-input', {
      type: 'text',
      placeholder: this.config.get('placeholder') || '',
      autocomplete: 'off',
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': 'false',
      'aria-haspopup': 'listbox',
    });

    return input;
  }

  private attachEvents(): void {
    this.element.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const query = target.value.trim();
      const minChars = this.config.get('minChars') || 1;

      if (query.length >= minChars) {
        this.debouncedSearch(query);
      } else if (query.length === 0) {
        this.events.emit('close');
      }
    });

    this.element.addEventListener('focus', () => {
      const query = this.element.value.trim();
      const minChars = this.config.get('minChars') || 1;
      
      if (query.length >= minChars) {
        this.handleSearch(query);
      }
    });

    this.element.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });
  }

  private handleSearch(query: string): void {
    this.events.emit('search', query);
  }

  private handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.events.emit('navigate', 'down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.events.emit('navigate', 'up');
        break;
      case 'Enter':
        e.preventDefault();
        this.events.emit('navigate', 'select');
        break;
      case 'Escape':
        e.preventDefault();
        this.events.emit('close');
        break;
    }
  }

  getElement(): HTMLInputElement {
    return this.element;
  }

  getValue(): string {
    return this.element.value;
  }

  setValue(value: string): void {
    this.element.value = value;
  }

  clear(): void {
    this.element.value = '';
  }

  focus(): void {
    this.element.focus();
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

  destroy(): void {
    this.element.remove();
  }
}