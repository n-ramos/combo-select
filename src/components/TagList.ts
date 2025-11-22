import type { SelectedItem } from '../types/index';
import { Config } from '@core/Config';
import { EventEmitter } from '@core/EventEmitter';
import { RenderService } from '@services/RenderService';
import { Tag } from './Tag';
import { DOMHelpers } from '@utils/DOMHelpers';

export class TagList {
  private container: HTMLElement;
  private config: Config;
  private events: EventEmitter;
  private renderService: RenderService;
  private tags: Tag[];
  private counterElement?: HTMLElement;

  constructor(
    container: HTMLElement,
    config: Config,
    events: EventEmitter,
    renderService: RenderService
  ) {
    this.container = container;
    this.config = config;
    this.events = events;
    this.renderService = renderService;
    this.tags = [];
  }

  /**
   * MODIFIÉ : Vérifie si l'item existe déjà avant de l'ajouter
   */
/**
   * Ajoute un item ou met en surbrillance s'il existe déjà
   */
add(item: SelectedItem): boolean {
    // Vérifier si l'item existe déjà
    const existingTagIndex = this.tags.findIndex((tag) => {
      const existingValue = JSON.stringify(tag.getItem().value);
      const newValue = JSON.stringify(item.value);
      return existingValue === newValue;
    });

    if (existingTagIndex !== -1) {
      console.warn('Item already selected:', item);
      // Ajouter un effet visuel sur le tag existant
      this.highlightTag(existingTagIndex);
      return false;
    }

    const renderContent = this.renderService.renderTag(item);
    const tag = new Tag(item, renderContent, this.events);
    this.tags.push(tag);
    this.render();
    return true;
  }

  /**
   * NOUVEAU : Met en surbrillance un tag existant
   */
  private highlightTag(index: number): void {
    const tag = this.tags[index];
    if (!tag) return;

    const element = tag.getElement();
    
    // Ajouter une classe pour l'animation
    element.classList.add('comboselect-tag-highlight');
    
    // Retirer la classe après l'animation
    setTimeout(() => {
      element.classList.remove('comboselect-tag-highlight');
    }, 600);
  }

  /**
   * NOUVEAU : Vérifie si un item existe déjà dans la liste
   */
  private exists(item: SelectedItem): boolean {
    return this.tags.some((tag) => {
      const existingValue = JSON.stringify(tag.getItem().value);
      const newValue = JSON.stringify(item.value);
      return existingValue === newValue;
    });
  }

  /**
   * NOUVEAU : Méthode publique pour vérifier l'existence
   */
  public hasItem(item: SelectedItem): boolean {
    return this.exists(item);
  }

  remove(item: SelectedItem): void {
    const index = this.tags.findIndex(
      (tag) => JSON.stringify(tag.getItem().value) === JSON.stringify(item.value)
    );

    if (index !== -1) {
      this.tags[index]?.destroy();
      this.tags.splice(index, 1);
      this.render();
    }
  }

  clear(): void {
    this.tags.forEach((tag) => tag.destroy());
    this.tags = [];
    this.render();
  }

  getItems(): SelectedItem[] {
    return this.tags.map((tag) => tag.getItem());
  }

  private render(): void {
    DOMHelpers.removeAllChildren(this.container);

    const incrementSize = this.config.get('incrementValueSize');

    if (incrementSize && this.tags.length > incrementSize) {
      // Afficher seulement les N premiers tags
      const visibleTags = this.tags.slice(0, incrementSize);
      visibleTags.forEach((tag) => {
        this.container.appendChild(tag.getElement());
      });

      // Afficher le compteur
      const remainingCount = this.tags.length - incrementSize;
      this.renderCounter(remainingCount);
    } else {
      // Afficher tous les tags
      this.tags.forEach((tag) => {
        this.container.appendChild(tag.getElement());
      });
    }
  }

  private renderCounter(count: number): void {
    if (this.counterElement) {
      this.counterElement.remove();
    }

    this.counterElement = DOMHelpers.createElement('span', 'comboselect-tag-counter');
    this.counterElement.textContent = `+${count}`;
    this.counterElement.title = `${count} élément(s) supplémentaire(s)`;
    this.container.appendChild(this.counterElement);
  }

  canAddMore(): boolean {
    const maxItems = this.config.get('maxItems');
    return !maxItems || this.tags.length < maxItems;
  }

  destroy(): void {
    this.tags.forEach((tag) => tag.destroy());
    this.tags = [];
    DOMHelpers.removeAllChildren(this.container);
  }
}