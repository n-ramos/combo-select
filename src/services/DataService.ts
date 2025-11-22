import { Config } from '@core/Config';

export class DataService {
  private config: Config;
  private abortController?: AbortController;
  private cache: Map<string, any[]>;

  constructor(config: Config) {
    this.config = config;
    this.cache = new Map();
  }

  async fetch(query: string): Promise<any[]> {
    // Si dataSource est défini, l'utiliser en priorité
    const dataSource = this.config.get('dataSource');
    if (dataSource) {
      return this.fetchFromDataSource(query, dataSource);
    }

    // Sinon utiliser autocompleteUrl
    const url = this.config.get('autocompleteUrl');
    if (!url) {
      return [];
    }

    return this.fetchFromUrl(query, url);
  }

  private async fetchFromDataSource(
    query: string,
    dataSource: any[] | (() => any[] | Promise<any[]>)
  ): Promise<any[]> {
    let data: any[];

    if (typeof dataSource === 'function') {
      data = await dataSource();
    } else {
      data = dataSource;
    }

    // Filtrer localement
    const labelKey = this.config.get('labelSuggestion') || 'label';
    const queryLower = query.toLowerCase();

    return data.filter((item) => {
      const label = this.getNestedValue(item, labelKey);
      return String(label).toLowerCase().includes(queryLower);
    });
  }

  private async fetchFromUrl(query: string, url: string): Promise<any[]> {
    // Vérifier le cache
    const cacheKey = `${url}:${query}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Annuler la requête précédente
    this.abortController?.abort();
    this.abortController = new AbortController();

    const httpMethod = this.config.get('httpMethod') || 'GET';
    const searchParam = this.config.get('searchParam') || 'q';
    const headers = this.config.get('httpHeaders') || {};

    try {
      let fetchUrl = url;
      let options: RequestInit = {
        method: httpMethod,
        headers,
        signal: this.abortController.signal,
      };

      if (httpMethod === 'GET') {
        const separator = url.includes('?') ? '&' : '?';
        fetchUrl = `${url}${separator}${searchParam}=${encodeURIComponent(query)}`;
      } else {
        options.body = JSON.stringify({ [searchParam]: query });
      }

      const response = await fetch(fetchUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // NOUVEAU : Extraire les résultats selon la configuration
      const results = this.extractResults(data);

      // Mettre en cache
      this.cache.set(cacheKey, results);

      return results;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return [];
      }
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  /**
   * NOUVEAU : Extrait les résultats d'une réponse API selon la configuration
   */
  private extractResults(data: any): any[] {
    // Si une fonction de transformation personnalisée est définie
    const transformResponse = this.config.get('transformResponse');
    if (transformResponse) {
      return transformResponse(data);
    }

    // Si la réponse est déjà un tableau
    if (Array.isArray(data)) {
      return data;
    }

    // Utiliser resultsKey pour extraire les données
    const resultsKey = this.config.get('resultsKey');
    
    if (resultsKey) {
      // Si c'est un tableau de clés (pour chemins imbriqués)
      if (Array.isArray(resultsKey)) {
        let results = data;
        for (const key of resultsKey) {
          results = results?.[key];
          if (!results) break;
        }
        return Array.isArray(results) ? results : [];
      }
      
      // Si c'est une seule clé (peut contenir des points pour chemins imbriqués)
      const results = this.getNestedValue(data, resultsKey);
      return Array.isArray(results) ? results : [];
    }

    // Essayer les clés communes par défaut
    const commonKeys = ['results', 'items', 'data', 'list', 'records', 'rows'];
    for (const key of commonKeys) {
      if (data[key] && Array.isArray(data[key])) {
        return data[key];
      }
    }

    // Si aucune clé ne fonctionne et que c'est un objet avec une seule propriété tableau
    const keys = Object.keys(data);
    if (keys.length === 1 && Array.isArray(data[keys[0]!])) {
      return data[keys[0]!];
    }

    // Dernier recours : retourner un tableau vide
    console.warn('Could not extract results from API response. Consider using resultsKey or transformResponse config.', data);
    return [];
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  clearCache(): void {
    this.cache.clear();
  }

  abort(): void {
    this.abortController?.abort();
  }
}