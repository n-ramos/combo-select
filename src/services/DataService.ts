/**
 * Service de gestion des données
 * Gère le chargement et la transformation des données depuis différentes sources
 */

import type { ComboSelectConfig } from '../types';
import { DEFAULTS, DEFAULT_HTTP_HEADERS, ERROR_MESSAGES, TIMEOUTS } from '../core/constants';

/**
 * Service pour gérer les sources de données
 * @public
 */
export class DataService<T = any> {
  private config: ComboSelectConfig<T>;
  private cache: Map<string, T[]> = new Map();
  private abortController: AbortController | null = null;

  constructor(config: ComboSelectConfig<T>) {
    this.config = config;
  }

  /**
   * Charger les données selon la configuration
   * @param query - Requête de recherche (pour API)
   * @returns Promesse avec les données
   */
  async loadData(query?: string): Promise<T[]> {
    // Source locale
    if (this.config.dataSource) {
      return this.loadLocalData();
    }

    // Source API
    if (this.config.autocompleteUrl) {
      return this.loadRemoteData(query || '');
    }

    throw new Error(ERROR_MESSAGES.NO_DATA_SOURCE);
  }

  /**
   * Charger les données locales
   * @private
   */
  private async loadLocalData(): Promise<T[]> {
    const { dataSource } = this.config;

    if (!dataSource) {
      return [];
    }

    // Si c'est une fonction
    if (typeof dataSource === 'function') {
      const result = dataSource();
      // Si la fonction retourne une promesse
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    }

    // Si c'est un tableau
    return dataSource;
  }

  /**
   * Charger les données depuis une API
   * @param query - Requête de recherche
   * @private
   */
  private async loadRemoteData(query: string): Promise<T[]> {
    const { autocompleteUrl, searchParam, httpMethod, httpHeaders } = this.config;

    if (!autocompleteUrl) {
      throw new Error(ERROR_MESSAGES.NO_DATA_SOURCE);
    }

    // Vérifier le cache
    const cacheKey = `${autocompleteUrl}:${query}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Annuler la requête précédente si elle existe
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    try {
      let url = autocompleteUrl;
      const fetchOptions: RequestInit = {
        signal: this.abortController.signal,
        headers: {
          ...DEFAULT_HTTP_HEADERS,
          ...httpHeaders,
        },
      };

      const method = httpMethod || DEFAULTS.HTTP_METHOD;
      const param = searchParam || DEFAULTS.SEARCH_PARAM;

      if (method === 'GET') {
        // Ajouter le paramètre de recherche à l'URL
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${param}=${encodeURIComponent(query)}`;
        fetchOptions.method = 'GET';
      } else {
        // POST - Envoyer dans le body
        fetchOptions.method = 'POST';
        fetchOptions.body = JSON.stringify({ [param]: query });
      }

      // Timeout
      const timeoutId = setTimeout(() => {
        this.abortController?.abort();
      }, TIMEOUTS.HTTP_TIMEOUT);

      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`${ERROR_MESSAGES.FETCH_ERROR}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const results = this.extractResults(data);

      // Mettre en cache
      this.cache.set(cacheKey, results);

      return results;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Requête annulée, ne pas logger
          return [];
        }
        throw new Error(`${ERROR_MESSAGES.FETCH_ERROR}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Extraire les résultats de la réponse API
   * @param data - Données brutes de l'API
   * @private
   */
  private extractResults(data: any): T[] {
    const { resultsKey, transformResponse } = this.config;

    // Si une fonction de transformation est fournie
    if (transformResponse) {
      try {
        return transformResponse(data);
      } catch (error) {
         console.error('Error extracting results:', error);
        throw new Error(ERROR_MESSAGES.PARSE_ERROR);
      }
    }

    // Si une clé de résultats est spécifiée
    if (resultsKey) {
      try {
        // Support pour les clés imbriquées: "data.items" ou ["data", "items"]
        const keys = Array.isArray(resultsKey) ? resultsKey : resultsKey.split('.');
        let result = data;

        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = result[key];
          } else {
            throw new Error(`Key "${key}" not found in response`);
          }
        }

        if (Array.isArray(result)) {
          return result as T[];
        }

        throw new Error('Results is not an array');
      } catch (error) {
        console.error('Error extracting results:', error);
        throw new Error(ERROR_MESSAGES.PARSE_ERROR);
      }
    }

    // Par défaut, retourner les données si c'est un tableau
    if (Array.isArray(data)) {
      return data as T[];
    }

    throw new Error(ERROR_MESSAGES.PARSE_ERROR);
  }

  /**
   * Filtrer les données localement
   * @param data - Données à filtrer
   * @param query - Requête de recherche
   * @returns Données filtrées
   */
  filterData(data: T[], query: string): T[] {
    if (!query || query.trim() === '') {
      return data;
    }

    const searchTerm = query.toLowerCase().trim();
    const { labelSuggestion } = this.config;
    const labelKey = (labelSuggestion as string) || DEFAULTS.LABEL_KEY;

    return data.filter((item) => {
      // Récupérer le label de l'item
      const label = this.getItemLabel(item, labelKey);
      return label.toLowerCase().includes(searchTerm);
    });
  }

  /**
   * Obtenir le label d'un item
   * @param item - Item
   * @param labelKey - Clé du label
   * @private
   */
  private getItemLabel(item: T, labelKey: string): string {
    if (typeof item === 'string') {
      return item;
    }

    if (typeof item === 'object' && item !== null) {
      const value = (item as any)[labelKey];
      return value !== undefined && value !== null ? String(value) : '';
    }

    return String(item);
  }

  /**
   * Vider le cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Annuler les requêtes en cours
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Obtenir la taille du cache
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Supprimer une entrée du cache
   * @param query - Requête à supprimer du cache
   */
  removeCacheEntry(query: string): void {
    const { autocompleteUrl } = this.config;
    if (autocompleteUrl) {
      const cacheKey = `${autocompleteUrl}:${query}`;
      this.cache.delete(cacheKey);
    }
  }
}