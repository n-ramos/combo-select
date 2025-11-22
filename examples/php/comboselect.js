var b = Object.defineProperty;
var w = (a, e, t) => e in a ? b(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var i = (a, e, t) => w(a, typeof e != "symbol" ? e + "" : e, t);
class m {
  static validateConfig(e) {
    if (e.maxItems !== void 0 && e.maxItems < 1)
      throw new Error("maxItems must be greater than 0");
    if (e.minChars !== void 0 && e.minChars < 0)
      throw new Error("minChars cannot be negative");
    if (e.debounceDelay !== void 0 && e.debounceDelay < 0)
      throw new Error("debounceDelay cannot be negative");
    if (e.incrementValueSize !== void 0 && e.incrementValueSize < 1)
      throw new Error("incrementValueSize must be greater than 0");
    !e.autocompleteUrl && !e.dataSource && console.warn("Neither autocompleteUrl nor dataSource provided. ComboSelect will work in manual mode."), e.autocompleteUrl && e.dataSource && console.warn("Both autocompleteUrl and dataSource provided. dataSource will take precedence.");
  }
  static validateUrl(e) {
    try {
      return new URL(e), !0;
    } catch {
      return !1;
    }
  }
}
const d = class d {
  constructor(e) {
    i(this, "config");
    m.validateConfig(e), this.config = {
      ...d.DEFAULT_CONFIG,
      ...e
    };
  }
  get(e) {
    return this.config[e];
  }
  getAll() {
    return Object.freeze({ ...this.config });
  }
  update(e) {
    m.validateConfig(e), this.config = {
      ...this.config,
      ...e
    };
  }
};
i(d, "DEFAULT_CONFIG", {
  placeholder: "Sélectionner...",
  minChars: 1,
  debounceDelay: 300,
  httpMethod: "GET",
  searchParam: "q",
  labelSuggestion: "label",
  valueSuggestion: null,
  multiple: !1,
  closeOnSelect: !0,
  clearOnSelect: !1,
  allowCreate: !1,
  httpHeaders: {
    "Content-Type": "application/json"
  }
});
let g = d;
class S {
  constructor() {
    i(this, "events");
    this.events = /* @__PURE__ */ new Map();
  }
  on(e, t) {
    this.events.has(e) || this.events.set(e, /* @__PURE__ */ new Set()), this.events.get(e).add(t);
  }
  off(e, t) {
    const s = this.events.get(e);
    s && s.delete(t);
  }
  emit(e, ...t) {
    const s = this.events.get(e);
    s && s.forEach((n) => {
      try {
        n(...t);
      } catch (r) {
        console.error(`Error in event handler for "${e}":`, r);
      }
    });
  }
  clear() {
    this.events.clear();
  }
}
class E {
  constructor(e) {
    i(this, "config");
    i(this, "abortController");
    i(this, "cache");
    this.config = e, this.cache = /* @__PURE__ */ new Map();
  }
  async fetch(e) {
    const t = this.config.get("dataSource");
    if (t)
      return this.fetchFromDataSource(e, t);
    const s = this.config.get("autocompleteUrl");
    return s ? this.fetchFromUrl(e, s) : [];
  }
  async fetchFromDataSource(e, t) {
    let s;
    typeof t == "function" ? s = await t() : s = t;
    const n = this.config.get("labelSuggestion") || "label", r = e.toLowerCase();
    return s.filter((l) => {
      const o = this.getNestedValue(l, n);
      return String(o).toLowerCase().includes(r);
    });
  }
  async fetchFromUrl(e, t) {
    const s = `${t}:${e}`;
    if (this.cache.has(s))
      return this.cache.get(s);
    this.abortController?.abort(), this.abortController = new AbortController();
    const n = this.config.get("httpMethod") || "GET", r = this.config.get("searchParam") || "q", l = this.config.get("httpHeaders") || {};
    try {
      let o = t, h = {
        method: n,
        headers: l,
        signal: this.abortController.signal
      };
      if (n === "GET") {
        const v = t.includes("?") ? "&" : "?";
        o = `${t}${v}${r}=${encodeURIComponent(e)}`;
      } else
        h.body = JSON.stringify({ [r]: e });
      const u = await fetch(o, h);
      if (!u.ok)
        throw new Error(`HTTP error! status: ${u.status}`);
      const p = await u.json(), f = this.extractResults(p);
      return this.cache.set(s, f), f;
    } catch (o) {
      if (o instanceof Error && o.name === "AbortError")
        return [];
      throw console.error("Error fetching data:", o), o;
    }
  }
  /**
   * NOUVEAU : Extrait les résultats d'une réponse API selon la configuration
   */
  extractResults(e) {
    const t = this.config.get("transformResponse");
    if (t)
      return t(e);
    if (Array.isArray(e))
      return e;
    const s = this.config.get("resultsKey");
    if (s) {
      if (Array.isArray(s)) {
        let o = e;
        for (const h of s)
          if (o = o?.[h], !o) break;
        return Array.isArray(o) ? o : [];
      }
      const l = this.getNestedValue(e, s);
      return Array.isArray(l) ? l : [];
    }
    const n = ["results", "items", "data", "list", "records", "rows"];
    for (const l of n)
      if (e[l] && Array.isArray(e[l]))
        return e[l];
    const r = Object.keys(e);
    return r.length === 1 && Array.isArray(e[r[0]]) ? e[r[0]] : (console.warn("Could not extract results from API response. Consider using resultsKey or transformResponse config.", e), []);
  }
  getNestedValue(e, t) {
    return t.split(".").reduce((s, n) => s?.[n], e);
  }
  clearCache() {
    this.cache.clear();
  }
  abort() {
    this.abortController?.abort();
  }
}
class y {
  constructor(e) {
    i(this, "config");
    this.config = e;
  }
  parseResults(e) {
    const t = this.config.get("labelSuggestion") || "label", s = this.config.get("valueSuggestion");
    return e.map((r) => {
      const l = this.getNestedValue(r, t), o = s ? this.getNestedValue(r, s) : r;
      return {
        label: String(l),
        value: o,
        original: r
      };
    });
  }
  filterSelected(e, t) {
    if (!this.config.get("multiple"))
      return e;
    const s = new Set(t.map((r) => JSON.stringify(r.value)));
    return e.filter((r) => !s.has(JSON.stringify(r.value)));
  }
  getNestedValue(e, t) {
    return t.split(".").reduce((n, r) => n?.[r], e);
  }
}
class c {
  static createElement(e, t, s) {
    const n = document.createElement(e);
    return t && (n.className = t), s && Object.entries(s).forEach(([r, l]) => {
      n.setAttribute(r, l);
    }), n;
  }
  static removeAllChildren(e) {
    for (; e.firstChild; )
      e.removeChild(e.firstChild);
  }
  static escapeHtml(e) {
    const t = document.createElement("div");
    return t.textContent = e, t.innerHTML;
  }
  static getOffset(e) {
    const t = e.getBoundingClientRect();
    return {
      top: t.top + window.scrollY,
      left: t.left + window.scrollX
    };
  }
  static isDescendant(e, t) {
    let s = t;
    for (; s; ) {
      if (s === e)
        return !0;
      s = s.parentElement;
    }
    return !1;
  }
}
class C {
  constructor(e) {
    i(this, "config");
    this.config = e;
  }
  renderSuggestion(e) {
    const t = this.config.get("renderSuggestion");
    return t ? t(e.original) : c.escapeHtml(e.label);
  }
  renderTag(e) {
    const t = this.config.get("renderTag");
    return t ? t(e) : c.escapeHtml(e.label);
  }
  renderNoResults() {
    return '<div class="comboselect-no-results">Aucun résultat trouvé</div>';
  }
  renderLoading() {
    return `
      <div class="comboselect-loading">
        <span class="comboselect-loading-spinner"></span>
        <span>Chargement...</span>
      </div>
    `;
  }
}
function I(a, e) {
  let t = null;
  return function(...n) {
    const r = () => {
      t = null, a(...n);
    };
    t && clearTimeout(t), t = setTimeout(r, e);
  };
}
class L {
  constructor(e, t) {
    i(this, "element");
    i(this, "config");
    i(this, "events");
    i(this, "debouncedSearch");
    this.config = e, this.events = t, this.element = this.create(), this.debouncedSearch = I(
      (s) => this.handleSearch(s),
      e.get("debounceDelay") || 300
    ), this.attachEvents();
  }
  create() {
    return c.createElement("input", "comboselect-input", {
      type: "text",
      placeholder: this.config.get("placeholder") || "",
      autocomplete: "off",
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-expanded": "false",
      "aria-haspopup": "listbox"
    });
  }
  attachEvents() {
    this.element.addEventListener("input", (e) => {
      const s = e.target.value.trim(), n = this.config.get("minChars") || 1;
      s.length >= n ? this.debouncedSearch(s) : s.length === 0 && this.events.emit("close");
    }), this.element.addEventListener("focus", () => {
      const e = this.element.value.trim(), t = this.config.get("minChars") || 1;
      e.length >= t && this.handleSearch(e);
    }), this.element.addEventListener("keydown", (e) => {
      this.handleKeydown(e);
    });
  }
  handleSearch(e) {
    this.events.emit("search", e);
  }
  handleKeydown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault(), this.events.emit("navigate", "down");
        break;
      case "ArrowUp":
        e.preventDefault(), this.events.emit("navigate", "up");
        break;
      case "Enter":
        e.preventDefault(), this.events.emit("navigate", "select");
        break;
      case "Escape":
        e.preventDefault(), this.events.emit("close");
        break;
    }
  }
  getElement() {
    return this.element;
  }
  getValue() {
    return this.element.value;
  }
  setValue(e) {
    this.element.value = e;
  }
  clear() {
    this.element.value = "";
  }
  focus() {
    this.element.focus();
  }
  disable() {
    this.element.disabled = !0;
  }
  enable() {
    this.element.disabled = !1;
  }
  setAriaExpanded(e) {
    this.element.setAttribute("aria-expanded", String(e));
  }
  destroy() {
    this.element.remove();
  }
}
class x {
  constructor(e, t, s) {
    i(this, "element");
    // Suppression de la ligne inutilisée 'config'
    i(this, "events");
    i(this, "renderService");
    i(this, "suggestions");
    i(this, "focusedIndex");
    i(this, "isOpen");
    this.events = t, this.renderService = s, this.suggestions = [], this.focusedIndex = -1, this.isOpen = !1, this.element = this.create(), this.attachEvents();
  }
  create() {
    return c.createElement("div", "comboselect-dropdown hidden", {
      role: "listbox"
    });
  }
  attachEvents() {
    this.events.on("navigate", (e) => {
      this.handleNavigation(e);
    });
  }
  open() {
    this.isOpen || (this.element.classList.remove("hidden"), this.isOpen = !0, this.events.emit("open"));
  }
  close() {
    this.isOpen && (this.element.classList.add("hidden"), this.isOpen = !1, this.focusedIndex = -1, this.events.emit("close"));
  }
  render(e) {
    if (console.log("🎨 Dropdown.render called with suggestions:", e), console.log("📊 Number of suggestions:", e.length), this.suggestions = e, this.focusedIndex = -1, c.removeAllChildren(this.element), e.length === 0) {
      console.log('⚠️ No suggestions - showing "no results" message'), this.element.innerHTML = this.renderService.renderNoResults(), this.open();
      return;
    }
    console.log("✅ Rendering", e.length, "suggestions"), e.forEach((t, s) => {
      console.log(`  → Creating option ${s}:`, t);
      const n = this.createOption(t, s);
      this.element.appendChild(n);
    }), this.open();
  }
  renderLoading() {
    c.removeAllChildren(this.element), this.element.innerHTML = this.renderService.renderLoading(), this.open();
  }
  createOption(e, t) {
    const s = c.createElement("div", "comboselect-option", {
      role: "option",
      "data-index": String(t)
    });
    return s.innerHTML = this.renderService.renderSuggestion(e), e.disabled && (s.classList.add("disabled"), s.setAttribute("aria-disabled", "true")), s.addEventListener("mousedown", (n) => {
      n.preventDefault(), e.disabled || this.selectOption(t);
    }), s.addEventListener("mouseenter", () => {
      e.disabled || this.focusOption(t);
    }), s;
  }
  handleNavigation(e) {
    if (!this.isOpen || this.suggestions.length === 0)
      return;
    if (e === "select") {
      this.focusedIndex >= 0 && this.selectOption(this.focusedIndex);
      return;
    }
    const t = this.suggestions.length - 1;
    let s = this.focusedIndex;
    for (e === "down" ? s = this.focusedIndex < t ? this.focusedIndex + 1 : 0 : e === "up" && (s = this.focusedIndex > 0 ? this.focusedIndex - 1 : t); this.suggestions[s]?.disabled; )
      if (e === "down" ? s = s < t ? s + 1 : 0 : s = s > 0 ? s - 1 : t, s === this.focusedIndex)
        return;
    this.focusOption(s);
  }
  focusOption(e) {
    this.focusedIndex >= 0 && this.element.querySelector(`[data-index="${this.focusedIndex}"]`)?.classList.remove("focused"), this.focusedIndex = e;
    const t = this.element.querySelector(`[data-index="${e}"]`);
    t && (t.classList.add("focused"), t.scrollIntoView({ block: "nearest" }));
  }
  selectOption(e) {
    const t = this.suggestions[e];
    t && !t.disabled && this.events.emit("select", {
      label: t.label,
      value: t.value,
      original: t.original
    });
  }
  getElement() {
    return this.element;
  }
  isDropdownOpen() {
    return this.isOpen;
  }
  destroy() {
    this.close(), this.element.remove();
  }
}
class O {
  constructor(e, t, s) {
    i(this, "element");
    i(this, "item");
    i(this, "events");
    this.item = e, this.events = s, this.element = this.create(t);
  }
  create(e) {
    const t = c.createElement("span", "comboselect-tag");
    t.setAttribute("data-value", JSON.stringify(this.item.value));
    const s = c.createElement("span");
    s.innerHTML = e, t.appendChild(s);
    const n = c.createElement("button", "comboselect-tag-remove", {
      type: "button",
      "aria-label": `Retirer ${this.item.label}`
    });
    return n.innerHTML = "&times;", n.addEventListener("click", (r) => {
      r.stopPropagation(), this.remove();
    }), t.appendChild(n), t;
  }
  remove() {
    this.events.emit("remove", this.item), this.element.remove();
  }
  getElement() {
    return this.element;
  }
  getItem() {
    return this.item;
  }
  destroy() {
    this.element.remove();
  }
}
class A {
  constructor(e, t, s, n) {
    i(this, "container");
    i(this, "config");
    i(this, "events");
    i(this, "renderService");
    i(this, "tags");
    i(this, "counterElement");
    this.container = e, this.config = t, this.events = s, this.renderService = n, this.tags = [];
  }
  /**
   * MODIFIÉ : Vérifie si l'item existe déjà avant de l'ajouter
   */
  /**
     * Ajoute un item ou met en surbrillance s'il existe déjà
     */
  add(e) {
    const t = this.tags.findIndex((r) => {
      const l = JSON.stringify(r.getItem().value), o = JSON.stringify(e.value);
      return l === o;
    });
    if (t !== -1)
      return console.warn("Item already selected:", e), this.highlightTag(t), !1;
    const s = this.renderService.renderTag(e), n = new O(e, s, this.events);
    return this.tags.push(n), this.render(), !0;
  }
  /**
   * NOUVEAU : Met en surbrillance un tag existant
   */
  highlightTag(e) {
    const t = this.tags[e];
    if (!t) return;
    const s = t.getElement();
    s.classList.add("comboselect-tag-highlight"), setTimeout(() => {
      s.classList.remove("comboselect-tag-highlight");
    }, 600);
  }
  /**
   * NOUVEAU : Vérifie si un item existe déjà dans la liste
   */
  exists(e) {
    return this.tags.some((t) => {
      const s = JSON.stringify(t.getItem().value), n = JSON.stringify(e.value);
      return s === n;
    });
  }
  /**
   * NOUVEAU : Méthode publique pour vérifier l'existence
   */
  hasItem(e) {
    return this.exists(e);
  }
  remove(e) {
    const t = this.tags.findIndex(
      (s) => JSON.stringify(s.getItem().value) === JSON.stringify(e.value)
    );
    t !== -1 && (this.tags[t]?.destroy(), this.tags.splice(t, 1), this.render());
  }
  clear() {
    this.tags.forEach((e) => e.destroy()), this.tags = [], this.render();
  }
  getItems() {
    return this.tags.map((e) => e.getItem());
  }
  render() {
    c.removeAllChildren(this.container);
    const e = this.config.get("incrementValueSize");
    if (e && this.tags.length > e) {
      this.tags.slice(0, e).forEach((n) => {
        this.container.appendChild(n.getElement());
      });
      const s = this.tags.length - e;
      this.renderCounter(s);
    } else
      this.tags.forEach((t) => {
        this.container.appendChild(t.getElement());
      });
  }
  renderCounter(e) {
    this.counterElement && this.counterElement.remove(), this.counterElement = c.createElement("span", "comboselect-tag-counter"), this.counterElement.textContent = `+${e}`, this.counterElement.title = `${e} élément(s) supplémentaire(s)`, this.container.appendChild(this.counterElement);
  }
  canAddMore() {
    const e = this.config.get("maxItems");
    return !e || this.tags.length < e;
  }
  destroy() {
    this.tags.forEach((e) => e.destroy()), this.tags = [], c.removeAllChildren(this.container);
  }
}
class D {
  constructor(e, t = {}) {
    i(this, "originalInput");
    i(this, "config");
    i(this, "events");
    i(this, "container");
    i(this, "controlElement");
    i(this, "tagsContainer");
    i(this, "hiddenInput");
    // Services
    i(this, "dataService");
    i(this, "searchService");
    i(this, "renderService");
    // Components
    i(this, "input");
    i(this, "dropdown");
    i(this, "tagList");
    // State
    i(this, "isDisabled");
    i(this, "isLoading");
    const s = document.querySelector(e);
    if (!s || !(s instanceof HTMLInputElement))
      throw new Error(`Element "${e}" not found or is not an input element`);
    this.originalInput = s, this.config = new g(t), this.events = new S(), this.isDisabled = !1, this.isLoading = !1, this.dataService = new E(this.config), this.searchService = new y(this.config), this.renderService = new C(this.config), this.container = this.createContainer(), this.controlElement = this.createControl(), this.tagsContainer = this.createTagsContainer(), this.hiddenInput = this.createHiddenInput(), this.input = new L(this.config, this.events), this.dropdown = new x(this.config, this.events, this.renderService), this.tagList = new A(this.tagsContainer, this.config, this.events, this.renderService), this.assemble(), this.attachEvents(), this.loadCustomCSS(), this.originalInput.style.display = "none";
  }
  createContainer() {
    return c.createElement("div", "comboselect-wrapper");
  }
  createControl() {
    const e = c.createElement("div", "comboselect-control");
    return e.addEventListener("click", () => {
      this.isDisabled || this.input.focus();
    }), e;
  }
  createTagsContainer() {
    return c.createElement("div", "comboselect-tags");
  }
  createHiddenInput() {
    return c.createElement("input", "", {
      type: "hidden",
      name: this.originalInput.name || ""
    });
  }
  assemble() {
    this.originalInput.parentNode?.insertBefore(this.container, this.originalInput.nextSibling), this.controlElement.appendChild(this.tagsContainer), this.controlElement.appendChild(this.input.getElement()), this.container.appendChild(this.controlElement), this.container.appendChild(this.dropdown.getElement()), this.container.appendChild(this.hiddenInput);
  }
  attachEvents() {
    this.events.on("search", async (e) => {
      await this.handleSearch(e);
      const t = this.config.get("onSearch");
      t && await t(e);
    }), this.events.on("select", async (e) => {
      await this.handleSelect(e);
      const t = this.config.get("onSelect");
      t && await t(e);
    }), this.events.on("remove", async (e) => {
      this.tagList.remove(e), this.updateHiddenInput(), this.input.focus();
      const t = this.config.get("onRemove");
      t && await t(e);
      const s = this.config.get("onChange");
      s && await s(this.getValue());
    }), this.events.on("open", async () => {
      this.input.setAriaExpanded(!0);
      const e = this.config.get("onOpen");
      e && await e();
    }), this.events.on("close", async () => {
      this.dropdown.close(), this.input.setAriaExpanded(!1);
      const e = this.config.get("onClose");
      e && await e();
    }), document.addEventListener("click", (e) => {
      c.isDescendant(this.container, e.target) || this.dropdown.close();
    });
  }
  async handleSearch(e) {
    if (!this.isLoading)
      try {
        this.isLoading = !0, this.dropdown.renderLoading();
        const t = await this.dataService.fetch(e), s = this.searchService.parseResults(t), n = this.searchService.filterSelected(
          s,
          this.tagList.getItems()
        );
        this.dropdown.render(n);
        const r = this.config.get("onLoad");
        r && await r(t);
      } catch (t) {
        console.error("❌ Error during search:", t), this.dropdown.render([]);
        const s = this.config.get("onError");
        s && t instanceof Error && await s(t);
      } finally {
        this.isLoading = !1;
      }
  }
  async handleSelect(e) {
    if (this.config.get("multiple") || this.tagList.clear(), !this.tagList.canAddMore()) {
      console.warn("Maximum number of items reached");
      return;
    }
    if (this.tagList.hasItem(e)) {
      console.log("Item already selected, skipping:", e);
      return;
    }
    if (this.tagList.add(e)) {
      this.updateHiddenInput(), this.config.get("clearOnSelect") && this.input.clear(), this.config.get("closeOnSelect") && this.dropdown.close(), this.input.focus();
      const n = this.config.get("onChange");
      n && await n(this.getValue());
      const r = this.config.get("onSelect");
      r && await r(e);
    }
  }
  updateHiddenInput() {
    const t = this.tagList.getItems().map((s) => s.value);
    this.hiddenInput.value = JSON.stringify(t), this.originalInput.value = this.hiddenInput.value;
  }
  loadCustomCSS() {
    const e = this.config.get("cssUrl");
    if (e) {
      const t = document.createElement("link");
      t.rel = "stylesheet", t.href = e, document.head.appendChild(t);
    }
  }
  // Public API
  getValue() {
    return this.tagList.getItems();
  }
  setValue(e) {
    this.tagList.clear(), e.forEach((t) => {
      this.tagList.canAddMore() && this.tagList.add(t);
    }), this.updateHiddenInput();
  }
  clear() {
    this.tagList.clear(), this.input.clear(), this.dropdown.close(), this.updateHiddenInput();
  }
  disable() {
    this.isDisabled = !0, this.input.disable(), this.controlElement.classList.add("disabled"), this.dropdown.close();
  }
  enable() {
    this.isDisabled = !1, this.input.enable(), this.controlElement.classList.remove("disabled");
  }
  destroy() {
    this.dataService.abort(), this.events.clear(), this.input.destroy(), this.dropdown.destroy(), this.tagList.destroy(), this.container.remove(), this.originalInput.style.display = "";
  }
  open() {
    if (!this.isDisabled) {
      const e = this.input.getValue();
      e && this.handleSearch(e);
    }
  }
  close() {
    this.dropdown.close();
  }
  addItem(e) {
    this.tagList.canAddMore() && (this.tagList.add(e), this.updateHiddenInput());
  }
  removeItem(e) {
    this.tagList.remove(e), this.updateHiddenInput();
  }
  clearCache() {
    this.dataService.clearCache();
  }
}
export {
  D as ComboSelect
};
//# sourceMappingURL=comboselect.js.map
