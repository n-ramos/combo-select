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

  add(item: SelectedItem): boolean {
    const existingTagIndex = this.tags.findIndex((tag) => {
      const existingValue = JSON.stringify(tag.getItem().value);
      const newValue = JSON.stringify(item.value);
      return existingValue === newValue;
    });

    if (existingTagIndex !== -1) {
      console.warn('Item already selected:', item);
      this.highlightTag(existingTagIndex);
      return false;
    }

    const renderContent = this.renderService.renderTag(item);
    const tag = new Tag(item, renderContent, this.events);
    this.tags.push(tag);
    this.render();
    return true;
  }

  public hasItem(item: SelectedItem): boolean {
    return this.tags.some((tag) => {
      const existingValue = JSON.stringify(tag.getItem().value);
      const newValue = JSON.stringify(item.value);
      return existingValue === newValue;
    });
  }

  private highlightTag(index: number): void {
    const tag = this.tags[index];
    if (!tag) return;

    const element = tag.getElement();
    element.classList.add('comboselect-tag-highlight');
    
    setTimeout(() => {
      element.classList.remove('comboselect-tag-highlight');
    }, 600);
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
      const visibleTags = this.tags.slice(0, incrementSize);
      visibleTags.forEach((tag) => {
        this.container.appendChild(tag.getElement());
      });

      const remainingCount = this.tags.length - incrementSize;
      this.renderCounter(remainingCount);
    } else {
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