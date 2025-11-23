/**
 * Constantes globales pour ComboSelect
 * @packageDocumentation
 */

/**
 * Valeurs par défaut de configuration
 * @public
 */
export const DEFAULTS = {
    /** Placeholder par défaut */
    PLACEHOLDER: 'Sélectionner...',
    
    /** Nombre minimum de caractères avant recherche */
    MIN_CHARS: 1,
    
    /** Délai de debounce en millisecondes */
    DEBOUNCE_DELAY: 300,
    
    /** Méthode HTTP par défaut */
    HTTP_METHOD: 'GET' as const,
    
    /** Paramètre de recherche par défaut */
    SEARCH_PARAM: 'q',
    
    /** Clé de label par défaut */
    LABEL_KEY: 'label',
    
    /** Hauteur d'un item dans la liste (pour virtual scrolling) */
    ITEM_HEIGHT: 40,
    
    /** Nombre d'items visibles dans la dropdown */
    VISIBLE_ITEMS: 10,
  } as const;
  
  /**
   * Classes CSS utilisées dans le composant
   * @public
   */
  export const CSS_CLASSES = {
    // Container
    CONTAINER: 'comboselect-container',
    
    // Control
    CONTROL: 'comboselect-control',
    CONTROL_OPEN: 'comboselect-control--open',
    CONTROL_DISABLED: 'comboselect-control--disabled',
    CONTROL_LOADING: 'comboselect-control--loading',
    
    // Input
    INPUT: 'comboselect-input',
    INPUT_WRAPPER: 'comboselect-input-wrapper',
    
    // Dropdown
    DROPDOWN: 'comboselect-dropdown',
    DROPDOWN_OPEN: 'comboselect-dropdown--open',
    
    // Suggestions
    SUGGESTIONS: 'comboselect-suggestions',
    SUGGESTION_ITEM: 'comboselect-suggestion',
    SUGGESTION_ACTIVE: 'comboselect-suggestion--active',
    SUGGESTION_DISABLED: 'comboselect-suggestion--disabled',
    
    // Tags
    TAGS_CONTAINER: 'comboselect-tags',
    TAG: 'comboselect-tag',
    TAG_LABEL: 'comboselect-tag-label',
    TAG_REMOVE: 'comboselect-tag-remove',
    TAG_COUNTER: 'comboselect-tag-counter',
    
    // States
    LOADING: 'comboselect-loading',
    LOADING_SPINNER: 'comboselect-loading-spinner',
    NO_RESULTS: 'comboselect-no-results',
    ERROR: 'comboselect-error',
    
    // Utilities
    DISABLED: 'disabled',
    OPEN: 'open',
    HIDDEN: 'hidden',
  } as const;
  
  /**
   * Événements du composant
   * @public
   */
  export const EVENTS = {
    SELECT: 'select',
    REMOVE: 'remove',
    CHANGE: 'change',
    OPEN: 'open',
    CLOSE: 'close',
    SEARCH: 'search',
    ERROR: 'error',
    LOAD: 'load',
    CREATE: 'create',
    NAVIGATE: 'navigate',
    DISABLED: 'disabled',
    ENABLED: 'enabled',
  } as const;
  
  /**
   * Touches du clavier
   * @public
   */
  export const KEYBOARD_KEYS = {
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    BACKSPACE: 'Backspace',
    TAB: 'Tab',
    DELETE: 'Delete',
  } as const;
  
  /**
   * Attributs ARIA
   * @public
   */
  export const ARIA_ATTRIBUTES = {
    ROLE_COMBOBOX: 'combobox',
    ROLE_LISTBOX: 'listbox',
    ROLE_OPTION: 'option',
    AUTOCOMPLETE: 'list',
    EXPANDED: 'aria-expanded',
    HASPOPUP: 'aria-haspopup',
    ACTIVEDESCENDANT: 'aria-activedescendant',
    SELECTED: 'aria-selected',
    DISABLED: 'aria-disabled',
    LABEL: 'aria-label',
    LABELLEDBY: 'aria-labelledby',
  } as const;
  
  /**
   * Messages d'erreur
   * @public
   */
  export const ERROR_MESSAGES = {
    INVALID_SELECTOR: 'Invalid selector: element not found',
    NOT_INPUT_ELEMENT: 'Element must be an input element',
    MAX_ITEMS_INVALID: 'maxItems must be greater than 0',
    MIN_CHARS_INVALID: 'minChars cannot be negative',
    DEBOUNCE_INVALID: 'debounceDelay cannot be negative',
    INCREMENT_SIZE_INVALID: 'incrementValueSize must be greater than 0',
    NO_DATA_SOURCE: 'Neither autocompleteUrl nor dataSource provided',
    FETCH_ERROR: 'Error fetching data',
    PARSE_ERROR: 'Error parsing response',
  } as const;
  
  /**
   * Headers HTTP par défaut
   * @public
   */
  export const DEFAULT_HTTP_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  } as const;
  
  /**
   * Regex patterns
   * @internal
   */
  export const PATTERNS = {
    /** Pattern pour nettoyer le HTML */
    HTML_TAGS: /<[^>]*>/g,
    
    /** Pattern pour les espaces multiples */
    MULTIPLE_SPACES: /\s+/g,
    
    /** Pattern pour valider une URL */
    URL: /^https?:\/\/.+/i,
  } as const;
  
  /**
   * Timeouts et délais
   * @public
   */
  export const TIMEOUTS = {
    /** Délai avant fermeture automatique du dropdown (ms) */
    AUTO_CLOSE: 5000,
    
    /** Délai d'animation CSS (ms) */
    ANIMATION: 200,
    
    /** Délai avant retry en cas d'erreur (ms) */
    RETRY_DELAY: 1000,
    
    /** Timeout pour les requêtes HTTP (ms) */
    HTTP_TIMEOUT: 10000,
  } as const;
  
  /**
   * Limites du composant
   * @public
   */
  export const LIMITS = {
    /** Nombre maximum d'items dans la dropdown */
    MAX_SUGGESTIONS: 100,
    
    /** Longueur maximale du label d'un tag */
    MAX_TAG_LABEL_LENGTH: 50,
    
    /** Nombre maximum d'items sélectionnables par défaut */
    DEFAULT_MAX_ITEMS: 999,
    
    /** Taille maximale du cache (nombre d'entrées) */
    MAX_CACHE_SIZE: 50,
  } as const;
  
  /**
   * Type helper pour extraire les valeurs des constantes
   */
  export type ValueOf<T> = T[keyof T];
  
  /**
   * Type pour les classes CSS
   */
  export type CSSClass = ValueOf<typeof CSS_CLASSES>;
  
  /**
   * Type pour les événements
   */
  export type EventType = ValueOf<typeof EVENTS>;
  
  /**
   * Type pour les touches du clavier
   */
  export type KeyboardKey = ValueOf<typeof KEYBOARD_KEYS>;