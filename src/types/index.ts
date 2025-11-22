export interface ComboSelectConfig {
    autocompleteUrl?: string;
    maxItems?: number;
    cssUrl?: string;
    labelSuggestion?: string;
    valueSuggestion?: string | null;
    incrementValueSize?: number;
    multiple?: boolean;
    placeholder?: string;
    minChars?: number;
    debounceDelay?: number;
    httpMethod?: 'GET' | 'POST';
    httpHeaders?: Record<string, string>;
    searchParam?: string;
    closeOnSelect?: boolean;
    clearOnSelect?: boolean;
    allowCreate?: boolean;
    
    // NOUVEAU : Pour gérer les différentes structures de réponse API
    resultsKey?: string | string[]; // Clé(s) pour accéder aux résultats dans la réponse
    
    // Callbacks
    onCreate?: (input: string) => void | Promise<void>;
    onSelect?: (item: SelectedItem) => void | Promise<void>;
    onRemove?: (item: SelectedItem) => void | Promise<void>;
    onLoad?: (data: any[]) => void | Promise<void>;
    onChange?: (items: SelectedItem[]) => void | Promise<void>;
    onOpen?: () => void | Promise<void>;
    onClose?: () => void | Promise<void>;
    onSearch?: (query: string) => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
    
    // Render customization
    renderSuggestion?: (item: any) => string;
    renderTag?: (item: SelectedItem) => string;
    
    // Data source (alternative to autocompleteUrl)
    dataSource?: any[] | (() => any[] | Promise<any[]>);
    
    // Transform response (pour les cas très complexes)
    transformResponse?: (response: any) => any[];
  }
  
  export interface SelectedItem {
    label: string;
    value: any;
    original: any;
  }
  
  export interface SuggestionItem {
    label: string;
    value: any;
    original: any;
    disabled?: boolean;
  }
  
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
    | 'error';
  
  export interface EventHandler {
    event: ComboSelectEvent;
    callback: (...args: any[]) => void;
  }