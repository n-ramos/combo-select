/**
 * ComboSelect Type Definitions
 * @packageDocumentation
 */

/**
 * Configuration principale de ComboSelect
 * @typeParam T - Type des items de données
 * @public
 */
export interface ComboSelectConfig<T = any> {
    // === Source de données ===
    /** URL de l'API d'autocomplétion */
    autocompleteUrl?: string;
    
    /** Données locales (tableau ou fonction asynchrone) */
    dataSource?: T[] | (() => T[] | Promise<T[]>);
    
    /** Clé(s) pour accéder aux résultats dans la réponse API */
    resultsKey?: string | string[];
    
    /** Fonction pour transformer la réponse API */
    transformResponse?: (response: any) => T[];
    
    // === Configuration de recherche ===
    /** Clé du label dans les objets de suggestion */
    labelSuggestion?: keyof T | string;
    
    /** Clé de la valeur dans les objets de suggestion */
    valueSuggestion?: keyof T | string | null;
    
    /** Nombre minimum de caractères avant déclenchement */
    minChars?: number;
    
    /** Délai de debounce en millisecondes */
    debounceDelay?: number;
    
    /** Paramètre de recherche dans l'URL */
    searchParam?: string;
    
    // === Sélection multiple ===
    /** Activer la sélection multiple */
    multiple?: boolean;
    
    /** Nombre maximum d'items sélectionnables */
    maxItems?: number;
    
    /** Nombre de tags visibles avant affichage du compteur +N */
    incrementValueSize?: number;
    
    // === Comportement ===
    /** Texte du placeholder */
    placeholder?: string;
    
    /** Fermer la dropdown après sélection */
    closeOnSelect?: boolean;
    
    /** Vider l'input après sélection */
    clearOnSelect?: boolean;
    
    /** Permettre la création de nouvelles valeurs */
    allowCreate?: boolean;
    
    // === HTTP Configuration ===
    /** Méthode HTTP pour les requêtes */
    httpMethod?: 'GET' | 'POST';
    
    /** En-têtes HTTP personnalisés */
    httpHeaders?: Record<string, string>;
    
    /** URL du CSS personnalisé */
    cssUrl?: string;
    
    // === Callbacks ===
    /** Callback lors de la création d'une nouvelle valeur */
    onCreate?: (input: string) => void | Promise<void>;
    
    /** Callback lors de la sélection d'un item */
    onSelect?: (item: SelectedItem<T>) => void | Promise<void>;
    
    /** Callback lors de la suppression d'un item */
    onRemove?: (item: SelectedItem<T>) => void | Promise<void>;
    
    /** Callback lors du chargement des données */
    onLoad?: (data: T[]) => void | Promise<void>;
    
    /** Callback lors du changement de valeur */
    onChange?: (items: SelectedItem<T>[]) => void | Promise<void>;
    
    /** Callback lors de l'ouverture de la dropdown */
    onOpen?: () => void | Promise<void>;
    
    /** Callback lors de la fermeture de la dropdown */
    onClose?: () => void | Promise<void>;
    
    /** Callback lors de la recherche */
    onSearch?: (query: string) => void | Promise<void>;
    
    /** Callback lors d'une erreur */
    onError?: (error: Error) => void | Promise<void>;
    
    // === Rendu personnalisé ===
    /** Fonction de rendu des suggestions */
    renderSuggestion?: (item: T) => string;
    
    /** Fonction de rendu des tags */
    renderTag?: (item: SelectedItem<T>) => string;
  }
  
  /**
   * Item sélectionné dans le ComboSelect
   * @typeParam T - Type de l'objet original
   * @public
   */
  export interface SelectedItem<T = any> {
    /** Label affiché */
    readonly label: string;
    
    /** Valeur de l'item */
    readonly value: any;
    
    /** Objet original complet */
    readonly original: T;
  }
  
  /**
   * Item de suggestion dans la dropdown
   * @typeParam T - Type de l'objet original
   * @public
   */
  export interface SuggestionItem<T = any> {
    /** Label affiché */
    label: string;
    
    /** Valeur de l'item */
    value: any;
    
    /** Objet original complet */
    original: T;
    
    /** Item désactivé */
    disabled?: boolean;
    
    /** Item mis en surbrillance */
    highlighted?: boolean;
  }
  
  /**
   * Événements disponibles dans ComboSelect
   * @public
   */
  export type ComboSelectEvent = 
    | 'select'
    | 'remove'
    | 'load'
    | 'open'
    | 'close'
    | 'search'
    | 'change'
    | 'create'
    | 'navigate'
    | 'error'
    | 'disabled'
    | 'enabled';
  
  /**
   * Handler d'événement
   * @internal
   */
  export interface EventHandler {
    event: ComboSelectEvent;
    callback: (...args: any[]) => void;
  }
  
  /**
   * API publique de ComboSelect
   * @typeParam T - Type des items de données
   * @public
   */
  export interface ComboSelectAPI<T = any> {
    /** Récupérer les items sélectionnés */
    getValue(): SelectedItem<T>[];
    
    /** Définir les items sélectionnés */
    setValue(items: SelectedItem<T>[]): void;
    
    /** Vider la sélection */
    clear(): void;
    
    /** Ajouter un item */
    addItem(item: SelectedItem<T>): void;
    
    /** Supprimer un item */
    removeItem(item: SelectedItem<T>): void;
    
    /** Ouvrir la dropdown */
    open(): void;
    
    /** Fermer la dropdown */
    close(): void;
    
    /** Désactiver le composant */
    disable(): void;
    
    /** Activer le composant */
    enable(): void;
    
    /** Vider le cache */
    clearCache(): void;
    
    /** Détruire le composant */
    destroy(): void;
    
    /** Vérifier si le composant est désactivé */
    get disabled(): boolean;
    
    /** Vérifier si le composant charge des données */
    get loading(): boolean;
  }
  
  /**
   * Extrait le type des items d'une dataSource
   * @public
   */
  export type ExtractDataType<T> = T extends (infer U)[] ? U
    : T extends () => (infer U)[] ? U
    : T extends () => Promise<(infer U)[]> ? U
    : never;
  
  /**
   * Configuration avec types inférés
   * @public
   */
  export type TypedComboSelectConfig<T> = Omit<ComboSelectConfig<T>, 
    'labelSuggestion' | 'valueSuggestion'> & {
    labelSuggestion?: keyof T;
    valueSuggestion?: keyof T | null;
  };
  
  /**
   * Options de configuration strictes pour l'autocomplétion
   * @public
   */
  export interface StrictAutocompleteConfig<T = any> extends ComboSelectConfig<T> {
    autocompleteUrl: string;
    searchParam: string;
    labelSuggestion: keyof T | string;
  }
  
  /**
   * Options de configuration strictes pour les données locales
   * @public
   */
  export interface StrictLocalDataConfig<T = any> extends ComboSelectConfig<T> {
    dataSource: T[] | (() => T[] | Promise<T[]>);
    labelSuggestion: keyof T | string;
  }