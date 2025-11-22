export class DOMHelpers {
    static createElement<K extends keyof HTMLElementTagNameMap>(
      tag: K,
      className?: string,
      attributes?: Record<string, string>
    ): HTMLElementTagNameMap[K] {
      const element = document.createElement(tag);
      
      if (className) {
        element.className = className;
      }
      
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
      }
      
      return element;
    }
  
    static removeAllChildren(element: HTMLElement): void {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  
    static escapeHtml(text: string): string {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  
    static getOffset(element: HTMLElement): { top: number; left: number } {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
    }
  
    static isDescendant(parent: HTMLElement, child: HTMLElement): boolean {
      let node: HTMLElement | null = child;
      while (node) {
        if (node === parent) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    }
  }