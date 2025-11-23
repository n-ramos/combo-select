import { ComboSelect } from '@core/ComboSelect';
import type { ComboSelectConfig, SelectedItem } from '../types/index';
import styles from '../styles/comboselect.css?inline';

/**
 * Type pour les données du Web Component
 */
type WebComponentData = Record<string, unknown>;

/**
 * Web Component personnalisé pour ComboSelect
 * Utilise le Shadow DOM pour l'encapsulation CSS
 */
export class ComboSelectElement extends HTMLElement {
  private comboSelect?: ComboSelect;
  private inputElement?: HTMLInputElement;
  private _dataSource?: WebComponentData[] | (() => WebComponentData[] | Promise<WebComponentData[]>);

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Attributs observés pour les changements
   */
  static get observedAttributes(): string[] {
    return [
      'placeholder',
      'multiple',
      'max-items',
      'min-chars',
      'debounce-delay',
      'label-suggestion',
      'value-suggestion',
      'increment-value-size',
      'disabled',
      'autocomplete-url',
      'results-key',
      'close-on-select',
    ];
  }

  /**
   * Appelé quand l'élément est ajouté au DOM
   */
  connectedCallback(): void {
    this.render();
    this.initComboSelect();
  }

  /**
   * Appelé quand l'élément est retiré du DOM
   */
  disconnectedCallback(): void {
    this.comboSelect?.destroy();
  }

  /**
   * Appelé quand un attribut change
   */
  attributeChangedCallback(_name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue && this.comboSelect) {
      this.updateConfig();
    }
  }

  /**
   * Créer la structure HTML dans le Shadow DOM
   */
  private render(): void {
    if (!this.shadowRoot) {
      return;
    }

    // Créer le style
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;

    // Créer l'input
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = 'comboselect-internal-input';
    this.inputElement.id = 'combo-input';

    // Ajouter au Shadow DOM
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(this.inputElement);
  }

  /**
   * Initialiser le ComboSelect
   */
  private initComboSelect(): void {
    if (!this.inputElement || !this.shadowRoot) {
      return;
    }

    const config = this.buildConfig();
    const inputEl = this.shadowRoot.querySelector('#combo-input') as HTMLInputElement;

    if (!inputEl) {
      return;
    }

    this.comboSelect = new ComboSelect(inputEl, config);
  }

  /**
   * Construire la configuration depuis les attributs
   */
  private buildConfig(): Partial<ComboSelectConfig> {
    const config: Partial<ComboSelectConfig> = {
      placeholder: this.getAttribute('placeholder') || 'Sélectionner...',
      multiple: this.hasAttribute('multiple'),
      labelSuggestion: this.getAttribute('label-suggestion') || 'label',
      valueSuggestion: this.getAttribute('value-suggestion') || null,
    };

    // Max items
    const maxItems = this.getAttribute('max-items');
    if (maxItems) {
      config.maxItems = parseInt(maxItems, 10);
    }

    // Min chars
    const minChars = this.getAttribute('min-chars');
    if (minChars) {
      config.minChars = parseInt(minChars, 10);
    }

    // Debounce delay
    const debounceDelay = this.getAttribute('debounce-delay');
    if (debounceDelay) {
      config.debounceDelay = parseInt(debounceDelay, 10);
    }

    // Increment value size
    const incrementValueSize = this.getAttribute('increment-value-size');
    if (incrementValueSize) {
      config.incrementValueSize = parseInt(incrementValueSize, 10);
    }

    // Data source depuis la propriété JavaScript
    if (this._dataSource) {
      config.dataSource = this._dataSource;
    }

    // Autocomplete URL
    const autocompleteUrl = this.getAttribute('autocomplete-url');
    if (autocompleteUrl) {
      config.autocompleteUrl = autocompleteUrl;
    }

    // Results key
    const resultsKey = this.getAttribute('results-key');
    if (resultsKey) {
      config.resultsKey = resultsKey;
    }

    // Close on select
    const closeOnSelect = this.getAttribute('close-on-select');
    if (closeOnSelect !== null) {
      config.closeOnSelect = closeOnSelect === 'true';
    }

    // Ajouter les callbacks pour émettre des événements
    config.onSelect = (item: SelectedItem) => {
      this.dispatchEvent(new CustomEvent('comboselect-select', { 
        detail: item,
        bubbles: true,
        composed: true 
      }));
    };

    config.onChange = (items: SelectedItem[]) => {
      this.dispatchEvent(new CustomEvent('comboselect-change', { 
        detail: items,
        bubbles: true,
        composed: true 
      }));
      this.dispatchEvent(new CustomEvent('change', { 
        detail: items,
        bubbles: true,
        composed: true 
      }));
    };

    config.onRemove = (item: SelectedItem) => {
      this.dispatchEvent(new CustomEvent('comboselect-remove', { 
        detail: item,
        bubbles: true,
        composed: true 
      }));
    };

    config.onOpen = () => {
      this.dispatchEvent(new CustomEvent('comboselect-open', { 
        bubbles: true,
        composed: true 
      }));
    };

    config.onClose = () => {
      this.dispatchEvent(new CustomEvent('comboselect-close', { 
        bubbles: true,
        composed: true 
      }));
    };

    config.onSearch = (query: string) => {
      this.dispatchEvent(new CustomEvent('comboselect-search', { 
        detail: { query },
        bubbles: true,
        composed: true 
      }));
    };

    config.onLoad = (data: unknown[]) => {
      this.dispatchEvent(new CustomEvent('comboselect-load', { 
        detail: data,
        bubbles: true,
        composed: true 
      }));
    };

    config.onError = (error: Error) => {
      console.error('ComboSelect error:', error);
      this.dispatchEvent(new CustomEvent('comboselect-error', { 
        detail: error,
        bubbles: true,
        composed: true 
      }));
    };

    return config;
  }

  /**
   * Mettre à jour la configuration
   */
  private updateConfig(): void {
    if (this.comboSelect) {
      this.comboSelect.destroy();
      this.initComboSelect();
    }
  }

  // ===========================
  // API PUBLIQUE
  // ===========================

  /**
   * Obtenir la source de données
   */
  get dataSource(): WebComponentData[] | (() => WebComponentData[] | Promise<WebComponentData[]>) | undefined {
    return this._dataSource;
  }

  /**
   * Définir la source de données
   */
  set dataSource(value: WebComponentData[] | (() => WebComponentData[] | Promise<WebComponentData[]>) | undefined) {
    this._dataSource = value;
    
    if (this.comboSelect) {
      this.updateConfig();
    }
  }

  /**
   * Obtenir les valeurs sélectionnées
   */
  getValue(): SelectedItem[] {
    return this.comboSelect?.getValue() || [];
  }

  /**
   * Définir les valeurs sélectionnées
   */
  setValue(items: SelectedItem[]): void {
    this.comboSelect?.setValue(items);
  }

  /**
   * Vider toutes les sélections
   */
  clear(): void {
    this.comboSelect?.clear();
  }

  /**
   * Ouvrir le dropdown
   */
  open(): void {
    this.comboSelect?.open();
  }

  /**
   * Fermer le dropdown
   */
  close(): void {
    this.comboSelect?.close();
  }

  /**
   * Obtenir l'état désactivé
   */
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  /**
   * Définir l'état désactivé
   */
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
      this.comboSelect?.disable();
    } else {
      this.removeAttribute('disabled');
      this.comboSelect?.enable();
    }
  }
}

/**
 * Enregistrer le custom element
 */
if (!customElements.get('combo-select')) {
  customElements.define('combo-select', ComboSelectElement);
}