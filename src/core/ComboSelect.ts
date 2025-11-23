import type { ComboSelectConfig, SelectedItem, SuggestionItem } from '../types/index';
import { Config } from './Config';
import { EventEmitter } from './EventEmitter';
import { DataService } from '@services/DataService';
import { SearchService } from '@services/SearchService';
import { RenderService } from '@services/RenderService';
import { Input } from '@components/Input';
import { Dropdown } from '@components/Dropdown';
import { TagList } from '@components/TagList';
import { DOMHelpers } from '@utils/DOMHelpers';

export class ComboSelect {
  private originalInput: HTMLInputElement;
  public config: Config;
  private events: EventEmitter;
  private container: HTMLElement;
  private controlElement: HTMLElement;
  private tagsContainer: HTMLElement;
  private hiddenInput: HTMLInputElement;
  private rootElement: Document | ShadowRoot;
  private clickHandler?: (e: Event) => void; // ← AJOUT
  
  // Services
  private dataService: DataService<any>;
  private searchService: SearchService<any>;
  private renderService: RenderService;
  
  // Components
  private input: Input;
  private dropdown: Dropdown;
  public tagList: TagList;
  
  // State
  private isDisabled: boolean;

  constructor(selector: string | HTMLInputElement, options: Partial<ComboSelectConfig> = {}) {
    let element: HTMLInputElement;
    
    if (typeof selector === 'string') {
      const el = document.querySelector(selector);
      if (!el || !(el instanceof HTMLInputElement)) {
        throw new Error(`Element "${selector}" not found or is not an input element`);
      }
      element = el;
    } else if (selector instanceof HTMLInputElement) {
      element = selector;
    } else {
      throw new Error('Selector must be a string or an HTMLInputElement');
    }

    this.originalInput = element;
    this.rootElement = element.getRootNode() as Document | ShadowRoot;
    
    this.config = new Config(options);
    this.events = new EventEmitter();
    this.isDisabled = false;

    const fullConfig = this.config.getAll();
    this.dataService = new DataService<any>(fullConfig as any);
    this.searchService = new SearchService<any>(fullConfig as any, this.dataService);
    this.renderService = new RenderService(this.config);

    this.container = this.createContainer();
    this.controlElement = this.createControl();
    this.tagsContainer = this.createTagsContainer();
    this.hiddenInput = this.createHiddenInput();

    this.input = new Input(this.config, this.events);
    this.dropdown = new Dropdown(this.events, this.renderService);
    this.tagList = new TagList(this.tagsContainer, this.config, this.events, this.renderService);

    this.assemble();
    this.attachEvents();
    this.setupSearchCallbacks();
    this.loadCustomCSS();

    this.originalInput.style.display = 'none';
  }

  private createContainer(): HTMLElement {
    const container = DOMHelpers.createElement('div', 'comboselect-wrapper');
    return container;
  }

  private createControl(): HTMLElement {
    const control = DOMHelpers.createElement('div', 'comboselect-control');
    
    control.addEventListener('click', () => {
      if (!this.isDisabled) {
        this.input.focus();
      }
    });

    return control;
  }

  private createTagsContainer(): HTMLElement {
    return DOMHelpers.createElement('div', 'comboselect-tags');
  }

  private createHiddenInput(): HTMLInputElement {
    const input = DOMHelpers.createElement('input', '', {
      type: 'hidden',
      name: this.originalInput.name || '',
    }) as HTMLInputElement;
    return input;
  }

  private assemble(): void {
    this.originalInput.parentNode?.insertBefore(this.container, this.originalInput.nextSibling);

    this.controlElement.appendChild(this.tagsContainer);
    this.controlElement.appendChild(this.input.getElement());
    
    this.container.appendChild(this.controlElement);
    this.container.appendChild(this.dropdown.getElement());
    this.container.appendChild(this.hiddenInput);
  }

  private setupSearchCallbacks(): void {
    this.searchService.setOnResults((suggestions: SuggestionItem<any>[]) => {
      const selected = this.tagList.getItems();
      const selectedValues = new Set(selected.map(item => JSON.stringify(item.value)));
      
      const filteredSuggestions = suggestions.map(suggestion => ({
        ...suggestion,
        disabled: selectedValues.has(JSON.stringify(suggestion.value))
      }));

      this.dropdown.render(filteredSuggestions);
    });

    this.searchService.setOnError((error: Error) => {
      console.error('Search error:', error);
      this.dropdown.render([]);
    });

    this.searchService.setOnSearchStart(() => {
    
      this.dropdown.renderLoading();
    });

  }

  private attachEvents(): void {
    // Événement de recherche
    this.events.on('search', async (query: string) => {
      this.searchService.search(query);
    });

    // Événement de sélection
    this.events.on('select', async (item: SelectedItem) => {
      await this.handleSelect(item);
    });

    // Événement de suppression
    this.events.on('remove', async (item: SelectedItem) => {
      this.tagList.remove(item);
      this.updateHiddenInput();
      this.input.focus();
      
      const onRemove = this.config.get('onRemove');
      if (onRemove) {
        await onRemove(item);
      }

      const onChange = this.config.get('onChange');
      if (onChange) {
        await onChange(this.getValue());
      }
    });

    // Événements d'ouverture/fermeture
    this.events.on('open', async () => {
      this.input.setAriaExpanded(true);
      
      const callback = this.config.get('onOpen');
      if (callback) {
        await callback();
      }
    });

    this.events.on('close', async () => {
      this.dropdown.close();
      this.input.setAriaExpanded(false);
      
      const callback = this.config.get('onClose');
      if (callback) {
        await callback();
      }
    });

    // ========================================
    // FERMER AU CLIC EXTÉRIEUR - VERSION ROBUSTE
    // ========================================
    this.clickHandler = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      
      // Utiliser composedPath pour gérer le Shadow DOM
      const path = mouseEvent.composedPath ? mouseEvent.composedPath() : [];
      
      // Vérifier si le clic est dans notre composant
      let isInside = false;
      
      // Méthode 1: Vérifier dans le composedPath
      for (const element of path) {
        if (element === this.container) {
          isInside = true;
          break;
        }
      }
      
      // Méthode 2: Fallback avec contains (pour les navigateurs plus anciens)
      if (!isInside && mouseEvent.target) {
        isInside = this.container.contains(mouseEvent.target as Node);
      }
      
      // Si le clic est en dehors ET que le dropdown est ouvert, le fermer
      if (!isInside && this.dropdown.isDropdownOpen()) {
        this.dropdown.close();
      }
    };

    // Attacher au document en phase de capture pour intercepter tous les clics
    // true = capture phase (important pour Shadow DOM)
    document.addEventListener('click', this.clickHandler as EventListener, true);

    // ========================================
    // BONUS: Fermer au blur avec délai
    // ========================================
    this.input.getElement().addEventListener('blur', () => {
      // Petit délai pour permettre aux clics sur les options de fonctionner
      setTimeout(() => {
        // Vérifier si le focus n'est pas dans le composant
        const activeElement = document.activeElement;
        const shadowActiveElement = this.rootElement instanceof ShadowRoot 
          ? this.rootElement.activeElement 
          : null;
        
        const hasFocus = this.container.contains(activeElement as Node) ||
                        (shadowActiveElement && this.container.contains(shadowActiveElement as Node));
        
        if (!hasFocus && this.dropdown.isDropdownOpen()) {
          this.dropdown.close();
        }
      }, 200);
    });
  }

  private async handleSelect(item: SelectedItem): Promise<void> {
    const multiple = this.config.get('multiple');

    if (!multiple) {
      this.tagList.clear();
    }

    if (!this.tagList.canAddMore()) {
      console.warn('Maximum number of items reached');
      return;
    }

    if (this.tagList.hasItem(item)) {
      console.log('Item already selected, skipping:', item);
      return;
    }

    const added = this.tagList.add(item);
    
    if (added) {
      this.updateHiddenInput();

      if (this.config.get('clearOnSelect')) {
        this.input.clear();
      }

      if (this.config.get('closeOnSelect')) {
        this.dropdown.close();
      }

      this.input.focus();

      const onChange = this.config.get('onChange');
      if (onChange) {
        await onChange(this.getValue());
      }

      const onSelect = this.config.get('onSelect');
      if (onSelect) {
        await onSelect(item);
      }
    }
  }

  private updateHiddenInput(): void {
    const items = this.tagList.getItems();
    const values = items.map((item) => item.value);
    this.hiddenInput.value = JSON.stringify(values);
    this.originalInput.value = this.hiddenInput.value;
  }

  private loadCustomCSS(): void {
    const cssUrl = this.config.get('cssUrl');
    if (cssUrl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      
      if (this.rootElement instanceof ShadowRoot) {
        this.rootElement.appendChild(link);
      } else {
        document.head.appendChild(link);
      }
    }
  }

  // Public API

  public getValue(): SelectedItem[] {
    return this.tagList.getItems();
  }

  public setValue(items: SelectedItem[]): void {
    this.tagList.clear();
    items.forEach((item) => {
      if (this.tagList.canAddMore()) {
        this.tagList.add(item);
      }
    });
    this.updateHiddenInput();
  }

  public clear(): void {
    this.tagList.clear();
    this.input.clear();
    this.dropdown.close();
    this.updateHiddenInput();
    this.searchService.reset();
  }

  public disable(): void {
    this.isDisabled = true;
    this.input.disable();
    this.controlElement.classList.add('disabled');
    this.dropdown.close();
  }

  public enable(): void {
    this.isDisabled = false;
    this.input.enable();
    this.controlElement.classList.remove('disabled');
  }

  public destroy(): void {
    // ========================================
    // IMPORTANT: Retirer le click handler
    // ========================================
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler as EventListener, true);
    }
    
    this.searchService.abort();
    this.events.clear();
    this.input.destroy();
    this.dropdown.destroy();
    this.tagList.destroy();
    this.container.remove();
    this.originalInput.style.display = '';
  }

  public open(): void {
    if (!this.isDisabled) {
      const query = this.input.getValue();
      if (query) {
        this.searchService.searchImmediate(query);
      }
    }
  }

  public close(): void {
    this.dropdown.close();
  }

  public addItem(item: SelectedItem): void {
    if (this.tagList.canAddMore()) {
      this.tagList.add(item);
      this.updateHiddenInput();
    }
  }

  public removeItem(item: SelectedItem): void {
    this.tagList.remove(item);
    this.updateHiddenInput();
  }

  public clearCache(): void {
    this.dataService.clearCache();
  }
}