import type { SelectedItem } from '../types/index';
import { DOMHelpers } from '@utils/DOMHelpers';
import { EventEmitter } from '@core/EventEmitter';

export class Tag {
  private element: HTMLElement;
  private item: SelectedItem;
  private events: EventEmitter;

  constructor(item: SelectedItem, renderContent: string, events: EventEmitter) {
    this.item = item;
    this.events = events;
    this.element = this.create(renderContent);
  }

  private create(renderContent: string): HTMLElement {
    const tag = DOMHelpers.createElement('span', 'comboselect-tag');
    tag.setAttribute('data-value', JSON.stringify(this.item.value));
    
    const content = DOMHelpers.createElement('span');
    content.innerHTML = renderContent;
    tag.appendChild(content);

    const removeBtn = DOMHelpers.createElement('button', 'comboselect-tag-remove', {
      type: 'button',
      'aria-label': `Retirer ${this.item.label}`,
    });
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.remove();
    });

    tag.appendChild(removeBtn);

    return tag;
  }

  private remove(): void {
    this.events.emit('remove', this.item);
    this.element.remove();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getItem(): SelectedItem {
    return this.item;
  }

  destroy(): void {
    this.element.remove();
  }
}