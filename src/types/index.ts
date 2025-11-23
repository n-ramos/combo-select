/**
 * Types et interfaces pour ComboSelect
 */

/**
 * Item de suggestion affiché dans le dropdown
 */
export interface SuggestionItem<T = Record<string, unknown>> {
  label: string;
  value: unknown;
  original: T;
  disabled: boolean;
  highlighted?: boolean;
}

/**
 * Item sélectionné (tag)
 */
export interface SelectedItem<T = Record<string, unknown>> {
  label: string;
  value: unknown;
  original: T;
}

/**
 * Configuration du ComboSelect
 */
export interface ComboSelectConfig<T = Record<string, unknown>> {
  // ===========================
  // DATA SOURCE
  // ===========================
  
  /**
   * URL de l'API pour l'autocomplétion
   */
  autocompleteUrl?: string;

  /**
   * Source de données locale (tableau ou fonction)
   */
  dataSource?: T[] | (() => T[] | Promise<T[]>);

  /**
   * Clé pour extraire les résultats de la réponse API
   * Peut être une string avec notation point "data.items"
   * ou un tableau ["data", "items"]
   */
  resultsKey?: string | string[];

  /**
   * Fonction personnalisée pour transformer la réponse API
   */
  transformResponse?: (response: unknown) => T[];

  /**
   * Valeurs présélectionnées au chargement
   * Peut être un tableau de SelectedItem complets, d'objets, ou de valeurs primitives
   * 
   * @example
   * // Avec SelectedItem complets
   * values: [
   *   { label: 'John Doe', value: 1, original: {...} }
   * ]
   * 
   * // Avec objets (seront convertis selon labelSuggestion/valueSuggestion)
   * values: [
   *   { id: 1, name: 'John Doe' }
   * ]
   * 
   * // Avec valeurs primitives
   * values: ['JavaScript', 'TypeScript']
   */
  values?: SelectedItem<T>[] | T[] | unknown[];

  // ===========================
  // DISPLAY
  // ===========================

  /**
   * Clé de l'objet à afficher comme label
   * Supporte la notation point pour les propriétés imbriquées
   * @default 'label'
   */
  labelSuggestion?: string;

  /**
   * Clé de l'objet à utiliser comme valeur
   * Si null, utilise l'objet entier
   * @default null
   */
  valueSuggestion?: string | null;

  /**
   * Placeholder de l'input
   * @default 'Sélectionner...'
   */
  placeholder?: string;

  // ===========================
  // BEHAVIOR
  // ===========================

  /**
   * Autoriser la sélection multiple avec tags
   * @default false
   */
  multiple?: boolean;

  /**
   * Nombre maximum d'items sélectionnables
   */
  maxItems?: number;

  /**
   * Nombre de tags visibles avant d'afficher le compteur "+N"
   * Si undefined, tous les tags sont affichés
   */
  incrementValueSize?: number;

  /**
   * Nombre minimum de caractères avant de déclencher la recherche
   * @default 1
   */
  minChars?: number;

  /**
   * Délai de debounce en millisecondes
   * @default 300
   */
  debounceDelay?: number;

  /**
   * Fermer le dropdown après une sélection
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Vider l'input après une sélection
   * @default false
   */
  clearOnSelect?: boolean;

  /**
   * Autoriser la création de nouveaux items
   * @default false
   */
  allowCreate?: boolean;

  // ===========================
  // HTTP CONFIGURATION
  // ===========================

  /**
   * Méthode HTTP pour les requêtes API
   * @default 'GET'
   */
  httpMethod?: 'GET' | 'POST';

  /**
   * Headers HTTP personnalisés pour les requêtes API
   */
  httpHeaders?: Record<string, string>;

  /**
   * Nom du paramètre de recherche dans les requêtes
   * @default 'q'
   */
  searchParam?: string;

  // ===========================
  // STYLING
  // ===========================

  /**
   * URL d'un fichier CSS personnalisé
   */
  cssUrl?: string;

  // ===========================
  // CALLBACKS
  // ===========================

  /**
   * Callback appelé lors de la sélection d'un item
   */
  onSelect?: (item: SelectedItem<T>) => void | Promise<void>;

  /**
   * Callback appelé lors de la suppression d'un item
   */
  onRemove?: (item: SelectedItem<T>) => void | Promise<void>;

  /**
   * Callback appelé lors du changement de sélection
   */
  onChange?: (items: SelectedItem<T>[]) => void | Promise<void>;

  /**
   * Callback appelé après le chargement des données
   */
  onLoad?: (data: T[]) => void | Promise<void>;

  /**
   * Callback appelé à l'ouverture du dropdown
   */
  onOpen?: () => void | Promise<void>;

  /**
   * Callback appelé à la fermeture du dropdown
   */
  onClose?: () => void | Promise<void>;

  /**
   * Callback appelé lors d'une recherche
   */
  onSearch?: (query: string) => void | Promise<void>;

  /**
   * Callback appelé lors de la création d'un nouvel item
   */
  onCreate?: (input: string) => void | Promise<void>;

  /**
   * Callback appelé en cas d'erreur
   */
  onError?: (error: Error) => void | Promise<void>;

  // ===========================
  // CUSTOM RENDERING
  // ===========================

  /**
   * Fonction pour personnaliser le rendu des suggestions
   * Doit retourner du HTML sous forme de string
   */
  renderSuggestion?: (item: T) => string;

  /**
   * Fonction pour personnaliser le rendu des tags
   * Doit retourner du texte ou du HTML sous forme de string
   */
  renderTag?: (item: SelectedItem<T>) => string;
}

/**
 * Configuration par défaut
 */
export const DEFAULT_CONFIG: Partial<ComboSelectConfig> = {
  placeholder: 'Sélectionner...',
  multiple: false,
  minChars: 1,
  debounceDelay: 300,
  closeOnSelect: true,
  clearOnSelect: false,
  allowCreate: false,
  httpMethod: 'GET',
  searchParam: 'q',
  labelSuggestion: 'label',
  valueSuggestion: null,
};

/**
 * Type pour les événements du ComboSelect
 */
export type ComboSelectEvent = 
  | 'search'
  | 'select'
  | 'remove'
  | 'open'
  | 'close'
  | 'navigate'
  | 'change'
  | 'load'
  | 'error';

/**
 * Type pour les directions de navigation
 */
export type NavigationDirection = 'up' | 'down' | 'select';

/**
 * Type pour les touches du clavier
 */
export type KeyboardKey = 
  | 'Enter'
  | 'Escape'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Backspace'
  | 'Delete'
  | 'Tab';

/**
 * Options pour la création de tags
 */
export interface TagOptions {
  removable?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * État du composant
 */
export interface ComboSelectState {
  isOpen: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  query: string;
  selectedItems: SelectedItem[];
  suggestions: SuggestionItem[];
  focusedIndex: number;
}

/**
 * Résultat de validation
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Options pour le rendu
 */
export interface RenderOptions {
  className?: string;
  attributes?: Record<string, string>;
  innerHTML?: string;
}