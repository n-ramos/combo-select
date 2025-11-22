import type { ComboSelectConfig, SelectedItem } from '../types/index';
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
  private config: Config;
  private events: EventEmitter;
  private container: HTMLElement;
  private controlElement: HTMLElement;
  private tagsContainer: HTMLElement;
  private hiddenInput: HTMLInputElement;
  
  // Services
  private dataService: DataService;
  private searchService: SearchService;
  private renderService: RenderService;
  
  // Components
  private input: Input;
  private dropdown: Dropdown;
  private tagList: TagList;
  
  // State
  private isDisabled: boolean;
  private isLoading: boolean;

  constructor(selector: string, options: Partial<ComboSelectConfig> = {}) {
    const element = document.querySelector(selector);
    
    if (!element || !(element instanceof HTMLInputElement)) {
      throw new Error(`Element "${selector}" not found or is not an input element`);
    }

    this.originalInput = element;
    this.config = new Config(options);
    this.events = new EventEmitter();
    this.isDisabled = false;
    this.isLoading = false;

    // Initialiser les services
    this.dataService = new DataService(this.config);
    this.searchService = new SearchService(this.config);
    this.renderService = new RenderService(this.config);

    // Créer la structure DOM
    this.container = this.createContainer();
    this.controlElement = this.createControl();
    this.tagsContainer = this.createTagsContainer();
    this.hiddenInput = this.createHiddenInput();

    // Initialiser les composants
    this.input = new Input(this.config, this.events);
    this.dropdown = new Dropdown(this.config, this.events, this.renderService);
    this.tagList = new TagList(this.tagsContainer, this.config, this.events, this.renderService);

    // Assembler le DOM
    this.assemble();

    // Attacher les événements
    this.attachEvents();

    // Charger CSS personnalisé si fourni
    this.loadCustomCSS();

    // Cacher l'input original
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
    });
    return input;
  }

  private assemble(): void {
    // Insérer le container après l'input original
    this.originalInput.parentNode?.insertBefore(this.container, this.originalInput.nextSibling);

    // Assembler les éléments
    this.controlElement.appendChild(this.tagsContainer);
    this.controlElement.appendChild(this.input.getElement());
    
    this.container.appendChild(this.controlElement);
    this.container.appendChild(this.dropdown.getElement());
    this.container.appendChild(this.hiddenInput);
  }

  private attachEvents(): void {
    // Événement de recherche
    this.events.on('search', async (query: string) => {
      await this.handleSearch(query);
      
      const callback = this.config.get('onSearch');
      if (callback) {
        await callback(query);
      }
    });

    // Événement de sélection
    this.events.on('select', async (item: SelectedItem) => {
      await this.handleSelect(item);
      
      const callback = this.config.get('onSelect');
      if (callback) {
        await callback(item);
      }
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

    // Fermer le dropdown au clic extérieur
    document.addEventListener('click', (e) => {
      if (!DOMHelpers.isDescendant(this.container, e.target as HTMLElement)) {
        this.dropdown.close();
      }
    });
  }

  private async handleSearch(query: string): Promise<void> {

    
    if (this.isLoading) {

      return;
    }

    try {
      this.isLoading = true;
      this.dropdown.renderLoading();

  
      const data = await this.dataService.fetch(query);
   

      const suggestions = this.searchService.parseResults(data);
    
      const filteredSuggestions = this.searchService.filterSelected(
        suggestions,
        this.tagList.getItems()
      );

      this.dropdown.render(filteredSuggestions);

      const onLoad = this.config.get('onLoad');
      if (onLoad) {
        await onLoad(data);
      }
    } catch (error) {
      console.error('❌ Error during search:', error);
      this.dropdown.render([]);
      
      const onError = this.config.get('onError');
      if (onError && error instanceof Error) {
        await onError(error);
      }
    } finally {
      this.isLoading = false;

    }
  }
  private async handleSelect(item: SelectedItem): Promise<void> {
    const multiple = this.config.get('multiple');

    if (!multiple) {
      this.tagList.clear();
    }

    // Vérifier si on peut ajouter plus d'items
    if (!this.tagList.canAddMore()) {
      console.warn('Maximum number of items reached');
      return;
    }

    // MODIFIÉ : Vérifier si l'item existe déjà avant de l'ajouter
    if (this.tagList.hasItem(item)) {
      console.log('Item already selected, skipping:', item);
      // On peut optionnellement afficher un feedback visuel ici
      return;
    }

    // Ajouter l'item seulement s'il n'existe pas déjà
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

      // Appeler le callback onChange seulement si l'item a été ajouté
      const onChange = this.config.get('onChange');
      if (onChange) {
        await onChange(this.getValue());
      }

      // Appeler onSelect également
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
    
    // Mettre à jour aussi l'input original
    this.originalInput.value = this.hiddenInput.value;
  }

  private loadCustomCSS(): void {
    const cssUrl = this.config.get('cssUrl');
    if (cssUrl) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
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
    this.dataService.abort();
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
        void this.handleSearch(query);
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