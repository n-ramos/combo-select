import type { SuggestionItem, SelectedItem } from '../types/index';
import { Config } from '@core/Config';
import { DOMHelpers } from '@utils/DOMHelpers';

export class RenderService {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  renderSuggestion(item: SuggestionItem): string {
    const customRender = this.config.get('renderSuggestion');
    
    if (customRender) {
      return customRender(item.original);
    }

    return DOMHelpers.escapeHtml(item.label);
  }

  renderTag(item: SelectedItem): string {
    const customRender = this.config.get('renderTag');
    
    if (customRender) {
      return customRender(item);
    }

    return DOMHelpers.escapeHtml(item.label);
  }

  renderNoResults(): string {
    return '<div class="comboselect-no-results">Aucun résultat trouvé</div>';
  }

  renderLoading(): string {
    return `
      <div class="comboselect-loading">
        <span class="comboselect-loading-spinner"></span>
        <span>Chargement...</span>
      </div>
    `;
  }
}