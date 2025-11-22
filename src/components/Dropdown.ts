import type { SuggestionItem } from '../types/index';
import { Config } from '@core/Config';
import { EventEmitter } from '@core/EventEmitter';
import { RenderService } from '@services/RenderService';
import { DOMHelpers } from '@utils/DOMHelpers';

export class Dropdown {
  private element: HTMLElement;
  // Suppression de la ligne inutilisée 'config'
  private events: EventEmitter;
  private renderService: RenderService;
  private suggestions: SuggestionItem[];
  private focusedIndex: number;
  private isOpen: boolean;

  constructor(_config: Config, events: EventEmitter, renderService: RenderService) {
    // On n'a pas besoin de stocker config car on ne l'utilise pas dans cette classe
    this.events = events;
    this.renderService = renderService;
    this.suggestions = [];
    this.focusedIndex = -1;
    this.isOpen = false;
    this.element = this.create();
    this.attachEvents();
  }

  private create(): HTMLElement {
    const dropdown = DOMHelpers.createElement('div', 'comboselect-dropdown hidden', {
      role: 'listbox',
    });

    return dropdown;
  }

  private attachEvents(): void {
    this.events.on('navigate', (direction: 'up' | 'down' | 'select') => {
      this.handleNavigation(direction);
    });
  }

  open(): void {
    if (!this.isOpen) {
      this.element.classList.remove('hidden');
      this.isOpen = true;
      this.events.emit('open');
    }
  }

  close(): void {
    if (this.isOpen) {
      this.element.classList.add('hidden');
      this.isOpen = false;
      this.focusedIndex = -1;
      this.events.emit('close');
    }
  }

  render(suggestions: SuggestionItem[]): void {
    console.log('🎨 Dropdown.render called with suggestions:', suggestions);
    console.log('📊 Number of suggestions:', suggestions.length);
    
    this.suggestions = suggestions;
    this.focusedIndex = -1;
    DOMHelpers.removeAllChildren(this.element);

    if (suggestions.length === 0) {
      console.log('⚠️ No suggestions - showing "no results" message');
      this.element.innerHTML = this.renderService.renderNoResults();
      this.open();
      return;
    }

    console.log('✅ Rendering', suggestions.length, 'suggestions');
    suggestions.forEach((suggestion, index) => {
      console.log(`  → Creating option ${index}:`, suggestion);
      const option = this.createOption(suggestion, index);
      this.element.appendChild(option);
    });

    this.open();
  }

  renderLoading(): void {
    DOMHelpers.removeAllChildren(this.element);
    this.element.innerHTML = this.renderService.renderLoading();
    this.open();
  }

  private createOption(suggestion: SuggestionItem, index: number): HTMLElement {
    const option = DOMHelpers.createElement('div', 'comboselect-option', {
      role: 'option',
      'data-index': String(index),
    });

    option.innerHTML = this.renderService.renderSuggestion(suggestion);

    if (suggestion.disabled) {
      option.classList.add('disabled');
      option.setAttribute('aria-disabled', 'true');
    }

    option.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Empêche la perte de focus de l'input
      if (!suggestion.disabled) {
        this.selectOption(index);
      }
    });

    option.addEventListener('mouseenter', () => {
      if (!suggestion.disabled) {
        this.focusOption(index);
      }
    });

    return option;
  }

  private handleNavigation(direction: 'up' | 'down' | 'select'): void {
    if (!this.isOpen || this.suggestions.length === 0) {
      return;
    }

    if (direction === 'select') {
      if (this.focusedIndex >= 0) {
        this.selectOption(this.focusedIndex);
      }
      return;
    }

    const maxIndex = this.suggestions.length - 1;
    let newIndex = this.focusedIndex;

    if (direction === 'down') {
      newIndex = this.focusedIndex < maxIndex ? this.focusedIndex + 1 : 0;
    } else if (direction === 'up') {
      newIndex = this.focusedIndex > 0 ? this.focusedIndex - 1 : maxIndex;
    }

    // Sauter les options désactivées
    while (this.suggestions[newIndex]?.disabled) {
      if (direction === 'down') {
        newIndex = newIndex < maxIndex ? newIndex + 1 : 0;
      } else {
        newIndex = newIndex > 0 ? newIndex - 1 : maxIndex;
      }

      // Éviter une boucle infinie si toutes les options sont désactivées
      if (newIndex === this.focusedIndex) {
        return;
      }
    }

    this.focusOption(newIndex);
  }

  private focusOption(index: number): void {
    // Retirer le focus de l'option précédente
    if (this.focusedIndex >= 0) {
      const prevOption = this.element.querySelector(`[data-index="${this.focusedIndex}"]`);
      prevOption?.classList.remove('focused');
    }

    this.focusedIndex = index;

    // Ajouter le focus à la nouvelle option
    const option = this.element.querySelector(`[data-index="${index}"]`);
    if (option) {
      option.classList.add('focused');
      option.scrollIntoView({ block: 'nearest' });
    }
  }

  private selectOption(index: number): void {
    const suggestion = this.suggestions[index];
    if (suggestion && !suggestion.disabled) {
      this.events.emit('select', {
        label: suggestion.label,
        value: suggestion.value,
        original: suggestion.original,
      });
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  isDropdownOpen(): boolean {
    return this.isOpen;
  }

  destroy(): void {
    this.close();
    this.element.remove();
  }
}