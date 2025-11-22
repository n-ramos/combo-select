import type { ComboSelectConfig } from '../types/index';
import { Validators } from '@utils/Validators';

export class Config {
  private config: ComboSelectConfig;

  private static readonly DEFAULT_CONFIG: ComboSelectConfig = {
    placeholder: 'Sélectionner...',
    minChars: 1,
    debounceDelay: 300,
    httpMethod: 'GET',
    searchParam: 'q',
    labelSuggestion: 'label',
    valueSuggestion: null,
    multiple: false,
    closeOnSelect: true,
    clearOnSelect: false,
    allowCreate: false,
    httpHeaders: {
      'Content-Type': 'application/json',
    },
  };

  constructor(userConfig: Partial<ComboSelectConfig>) {
    Validators.validateConfig(userConfig);
    
    this.config = {
      ...Config.DEFAULT_CONFIG,
      ...userConfig,
    };
  }

  get<K extends keyof ComboSelectConfig>(key: K): ComboSelectConfig[K] {
    return this.config[key];
  }

  getAll(): Readonly<ComboSelectConfig> {
    return Object.freeze({ ...this.config });
  }

  update(updates: Partial<ComboSelectConfig>): void {
    Validators.validateConfig(updates);
    this.config = {
      ...this.config,
      ...updates,
    };
  }
}