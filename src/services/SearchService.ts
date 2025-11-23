/**
 * Service de recherche
 * Gère la recherche, le debounce et les événements associés
 */

import type { ComboSelectConfig, SuggestionItem } from '../types';
import { DataService } from './DataService';
import { DEFAULTS } from '../core/constants';

/**
 * Type pour le callback de résultats
 */
type SearchResultCallback<T> = (results: SuggestionItem<T>[]) => void;

/**
 * Type pour le callback d'erreur
 */
type SearchErrorCallback = (error: Error) => void;

/**
 * Service pour gérer la recherche
 * @public
 */
export class SearchService<T = Record<string, unknown>> {
  private config: ComboSelectConfig<T>;
  private dataService: DataService<T>;
  private debounceTimer: number | null = null;
  private lastQuery: string = '';
  private isSearching: boolean = false;

  // Callbacks
  private onResults: SearchResultCallback<T> | null = null;
  private onError: SearchErrorCallback | null = null;
  private onSearchStart: (() => void) | null = null;
  private onSearchEnd: (() => void) | null = null;

  constructor(config: ComboSelectConfig<T>, dataService: DataService<T>) {
    this.config = config;
    this.dataService = dataService;
  }

  /**
   * Effectuer une recherche
   * @param query - Requête de recherche
   */
  search(query: string): void {
    // Vérifier le nombre minimum de caractères
    const minChars = this.config.minChars ?? DEFAULTS.MIN_CHARS;
    
    if (query.length < minChars) {
      this.clearResults();
      return;
    }

    // Si la requête n'a pas changé, ne rien faire
    if (query === this.lastQuery) {
      return;
    }

    this.lastQuery = query;

    // Annuler le timer précédent
    this.cancelDebounce();

    // Appliquer le debounce
    const debounceDelay = this.config.debounceDelay ?? DEFAULTS.DEBOUNCE_DELAY;
    
    this.debounceTimer = window.setTimeout(() => {
      void this.performSearch(query);
    }, debounceDelay);
  }

  /**
   * Effectuer la recherche immédiatement (sans debounce)
   * @param query - Requête de recherche
   */
  searchImmediate(query: string): void {
    this.cancelDebounce();
    this.lastQuery = query;
    void this.performSearch(query);
  }

  /**
   * Effectuer la recherche réelle
   * @param query - Requête de recherche
   * @private
   */
  private async performSearch(query: string): Promise<void> {
    if (this.isSearching) {
      return;
    }

    this.isSearching = true;
    this.onSearchStart?.();

    // Callback onSearch si défini
    if (this.config.onSearch) {
      try {
        await this.config.onSearch(query);
      } catch (error) {
        console.error('Error in onSearch callback:', error);
      }
    }

    try {
      // Charger les données
      const data = await this.dataService.loadData(query);

      // Filtrer si source locale
      let filteredData = data;
      if (this.config.dataSource) {
        filteredData = this.dataService.filterData(data, query);
      }

      // Transformer en SuggestionItems
      const suggestions = this.transformToSuggestions(filteredData);

      // Envoyer les résultats
      this.onResults?.(suggestions);

      // Callback onLoad si défini
      if (this.config.onLoad) {
        try {
          await this.config.onLoad(filteredData);
        } catch (error) {
          console.error('Error in onLoad callback:', error);
        }
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Search failed');
      this.onError?.(errorObj);

      // Callback onError si défini
      if (this.config.onError) {
        try {
          await this.config.onError(errorObj);
        } catch (callbackError) {
          console.error('Error in onError callback:', callbackError);
        }
      }
    } finally {
      this.isSearching = false;
      this.onSearchEnd?.();
    }
  }

  /**
   * Transformer les données en SuggestionItems
   * @param data - Données brutes
   * @private
   */
  private transformToSuggestions(data: T[]): SuggestionItem<T>[] {
    const { labelSuggestion, valueSuggestion } = this.config;
    const labelKey = (labelSuggestion as string) || DEFAULTS.LABEL_KEY;
    const valueKey = valueSuggestion as string | null;

    return data.map((item) => {
      let label: string;
      let value: unknown;

      // Extraire le label
      if (typeof item === 'string') {
        label = item;
        value = item;
      } else if (typeof item === 'object' && item !== null) {
        const itemRecord = item as Record<string, unknown>;
        label = String(itemRecord[labelKey] ?? '');
        value = valueKey ? itemRecord[valueKey] : itemRecord[labelKey];
      } else {
        label = String(item);
        value = item;
      }

      return {
        label,
        value,
        original: item,
        disabled: false,
        highlighted: false,
      };
    });
  }

  /**
   * Vider les résultats
   */
  clearResults(): void {
    this.lastQuery = '';
    this.onResults?.([]);
  }

  /**
   * Annuler le debounce en cours
   */
  cancelDebounce(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Annuler toutes les requêtes en cours
   */
  abort(): void {
    this.cancelDebounce();
    this.dataService.abort();
    this.isSearching = false;
  }

  /**
   * Définir le callback pour les résultats
   * @param callback - Fonction appelée avec les résultats
   */
  setOnResults(callback: SearchResultCallback<T>): void {
    this.onResults = callback;
  }

  /**
   * Définir le callback pour les erreurs
   * @param callback - Fonction appelée en cas d'erreur
   */
  setOnError(callback: SearchErrorCallback): void {
    this.onError = callback;
  }

  /**
   * Définir le callback pour le début de recherche
   * @param callback - Fonction appelée au début de la recherche
   */
  setOnSearchStart(callback: () => void): void {
    this.onSearchStart = callback;
  }

  /**
   * Définir le callback pour la fin de recherche
   * @param callback - Fonction appelée à la fin de la recherche
   */
  setOnSearchEnd(callback: () => void): void {
    this.onSearchEnd = callback;
  }

  /**
   * Vérifier si une recherche est en cours
   */
  get searching(): boolean {
    return this.isSearching;
  }

  /**
   * Obtenir la dernière requête
   */
  getLastQuery(): string {
    return this.lastQuery;
  }

  /**
   * Réinitialiser le service
   */
  reset(): void {
    this.abort();
    this.clearResults();
    this.lastQuery = '';
  }
}