import type { SuggestionItem, SelectedItem } from '../types/index';
import { Config } from '@core/Config';

export class SearchService {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  parseResults(data: any[]): SuggestionItem[] {


    const labelKey = this.config.get('labelSuggestion') || 'label';
    const valueKey = this.config.get('valueSuggestion');

    const results = data.map((item) => {
      const label = this.getNestedValue(item, labelKey);
      const value = valueKey ? this.getNestedValue(item, valueKey) : item;

     

      return {
        label: String(label),
        value,
        original: item,
      };
    });

    return results;
  }

  filterSelected(suggestions: SuggestionItem[], selected: SelectedItem[]): SuggestionItem[] {
    if (!this.config.get('multiple')) {
      return suggestions;
    }

    const selectedValues = new Set(selected.map((item) => JSON.stringify(item.value)));

    const filtered = suggestions.filter((suggestion) => {
      return !selectedValues.has(JSON.stringify(suggestion.value));
    });


    return filtered;
  }

  private getNestedValue(obj: any, path: string): any {
  
    const result = path.split('.').reduce((current, key) => {

      return current?.[key];
    }, obj);
 
    return result;
  }
}