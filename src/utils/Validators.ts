import type { ComboSelectConfig } from '../types/index';

export class Validators {
  static validateConfig(config: Partial<ComboSelectConfig>): void {
    if (config.maxItems !== undefined && config.maxItems < 1) {
      throw new Error('maxItems must be greater than 0');
    }

    if (config.minChars !== undefined && config.minChars < 0) {
      throw new Error('minChars cannot be negative');
    }

    if (config.debounceDelay !== undefined && config.debounceDelay < 0) {
      throw new Error('debounceDelay cannot be negative');
    }

    if (config.incrementValueSize !== undefined && config.incrementValueSize < 1) {
      throw new Error('incrementValueSize must be greater than 0');
    }

    if (!config.autocompleteUrl && !config.dataSource) {
      console.warn('Neither autocompleteUrl nor dataSource provided. ComboSelect will work in manual mode.');
    }

    if (config.autocompleteUrl && config.dataSource) {
      console.warn('Both autocompleteUrl and dataSource provided. dataSource will take precedence.');
    }
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}