var C = Object.defineProperty;
var I = (l, e, t) => e in l ? C(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var n = (l, e, t) => I(l, typeof e != "symbol" ? e + "" : e, t);
class y {
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
const f = class f {
  constructor(e) {
    n(this, "config");
    y.validateConfig(e), this.config = {
      ...f.DEFAULT_CONFIG,
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
    y.validateConfig(e), this.config = {
      ...this.config,
      ...e
    };
  }
};
n(f, "DEFAULT_CONFIG", {
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
let b = f;
class A {
  constructor() {
    n(this, "events");
    this.events = /* @__PURE__ */ new Map();
  }
  /**
   * Enregistrer un listener pour un événement
   */
  on(e, t) {
    this.events.has(e) || this.events.set(e, /* @__PURE__ */ new Set());
    const o = this.events.get(e);
    o && o.add(t);
  }
  /**
   * Retirer un listener pour un événement
   */
  off(e, t) {
    const o = this.events.get(e);
    o && o.delete(t);
  }
  /**
   * Émettre un événement avec des arguments typés
   */
  emit(e, ...t) {
    const o = this.events.get(e);
    o && o.forEach((i) => {
      try {
        i(...t);
      } catch (r) {
        console.error(`Error in event handler for "${e}":`, r);
      }
    });
  }
  /**
   * Vider tous les événements
   */
  clear() {
    this.events.clear();
  }
}
const m = {
  /** Placeholder par défaut */
  PLACEHOLDER: "Sélectionner...",
  /** Nombre minimum de caractères avant recherche */
  MIN_CHARS: 1,
  /** Délai de debounce en millisecondes */
  DEBOUNCE_DELAY: 300,
  /** Méthode HTTP par défaut */
  HTTP_METHOD: "GET",
  /** Paramètre de recherche par défaut */
  SEARCH_PARAM: "q",
  /** Clé de label par défaut */
  LABEL_KEY: "label",
  /** Hauteur d'un item dans la liste (pour virtual scrolling) */
  ITEM_HEIGHT: 40,
  /** Nombre d'items visibles dans la dropdown */
  VISIBLE_ITEMS: 10
}, z = {
  // Container
  CONTAINER: "comboselect-container",
  // Control
  CONTROL: "comboselect-control",
  CONTROL_OPEN: "comboselect-control--open",
  CONTROL_DISABLED: "comboselect-control--disabled",
  CONTROL_LOADING: "comboselect-control--loading",
  // Input
  INPUT: "comboselect-input",
  INPUT_WRAPPER: "comboselect-input-wrapper",
  // Dropdown
  DROPDOWN: "comboselect-dropdown",
  DROPDOWN_OPEN: "comboselect-dropdown--open",
  // Suggestions
  SUGGESTIONS: "comboselect-suggestions",
  SUGGESTION_ITEM: "comboselect-suggestion",
  SUGGESTION_ACTIVE: "comboselect-suggestion--active",
  SUGGESTION_DISABLED: "comboselect-suggestion--disabled",
  // Tags
  TAGS_CONTAINER: "comboselect-tags",
  TAG: "comboselect-tag",
  TAG_LABEL: "comboselect-tag-label",
  TAG_REMOVE: "comboselect-tag-remove",
  TAG_COUNTER: "comboselect-tag-counter",
  // States
  LOADING: "comboselect-loading",
  LOADING_SPINNER: "comboselect-loading-spinner",
  NO_RESULTS: "comboselect-no-results",
  ERROR: "comboselect-error",
  // Utilities
  DISABLED: "disabled",
  OPEN: "open",
  HIDDEN: "hidden"
}, B = {
  SELECT: "select",
  REMOVE: "remove",
  CHANGE: "change",
  OPEN: "open",
  CLOSE: "close",
  SEARCH: "search",
  ERROR: "error",
  LOAD: "load",
  CREATE: "create",
  NAVIGATE: "navigate",
  DISABLED: "disabled",
  ENABLED: "enabled"
}, G = {
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ENTER: "Enter",
  ESCAPE: "Escape",
  BACKSPACE: "Backspace",
  TAB: "Tab",
  DELETE: "Delete"
}, j = {
  ROLE_COMBOBOX: "combobox",
  ROLE_LISTBOX: "listbox",
  ROLE_OPTION: "option",
  AUTOCOMPLETE: "list",
  EXPANDED: "aria-expanded",
  HASPOPUP: "aria-haspopup",
  ACTIVEDESCENDANT: "aria-activedescendant",
  SELECTED: "aria-selected",
  DISABLED: "aria-disabled",
  LABEL: "aria-label",
  LABELLEDBY: "aria-labelledby"
}, p = {
  INVALID_SELECTOR: "Invalid selector: element not found",
  NOT_INPUT_ELEMENT: "Element must be an input element",
  MAX_ITEMS_INVALID: "maxItems must be greater than 0",
  MIN_CHARS_INVALID: "minChars cannot be negative",
  DEBOUNCE_INVALID: "debounceDelay cannot be negative",
  INCREMENT_SIZE_INVALID: "incrementValueSize must be greater than 0",
  NO_DATA_SOURCE: "Neither autocompleteUrl nor dataSource provided",
  FETCH_ERROR: "Error fetching data",
  PARSE_ERROR: "Error parsing response"
}, O = {
  "Content-Type": "application/json",
  Accept: "application/json"
}, k = {
  /** Délai avant fermeture automatique du dropdown (ms) */
  AUTO_CLOSE: 5e3,
  /** Délai d'animation CSS (ms) */
  ANIMATION: 200,
  /** Délai avant retry en cas d'erreur (ms) */
  RETRY_DELAY: 1e3,
  /** Timeout pour les requêtes HTTP (ms) */
  HTTP_TIMEOUT: 1e4
};
class T {
  constructor(e) {
    n(this, "config");
    n(this, "cache", /* @__PURE__ */ new Map());
    n(this, "abortController", null);
    this.config = e;
  }
  /**
   * Charger les données selon la configuration
   * @param query - Requête de recherche (pour API)
   * @returns Promesse avec les données
   */
  async loadData(e) {
    if (this.config.dataSource)
      return this.loadLocalData();
    if (this.config.autocompleteUrl)
      return this.loadRemoteData(e || "");
    throw new Error(p.NO_DATA_SOURCE);
  }
  /**
   * Charger les données locales
   * @private
   */
  async loadLocalData() {
    const { dataSource: e } = this.config;
    if (!e)
      return [];
    if (typeof e == "function") {
      const t = e();
      return t instanceof Promise ? await t : t;
    }
    return e;
  }
  /**
   * Charger les données depuis une API
   * @param query - Requête de recherche
   * @private
   */
  async loadRemoteData(e) {
    const { autocompleteUrl: t, searchParam: o, httpMethod: i, httpHeaders: r } = this.config;
    if (!t)
      throw new Error(p.NO_DATA_SOURCE);
    const s = `${t}:${e}`, d = this.cache.get(s);
    if (d)
      return d;
    this.abortController && this.abortController.abort(), this.abortController = new AbortController();
    try {
      let a = t;
      const u = {
        signal: this.abortController.signal,
        headers: {
          ...O,
          ...r
        }
      }, h = i || m.HTTP_METHOD, w = o || m.SEARCH_PARAM;
      if (h === "GET") {
        const x = a.includes("?") ? "&" : "?";
        a = `${a}${x}${w}=${encodeURIComponent(e)}`, u.method = "GET";
      } else
        u.method = "POST", u.body = JSON.stringify({ [w]: e });
      const E = setTimeout(() => {
        this.abortController?.abort();
      }, k.HTTP_TIMEOUT), g = await fetch(a, u);
      if (clearTimeout(E), !g.ok)
        throw new Error(`${p.FETCH_ERROR}: ${g.status} ${g.statusText}`);
      const S = await g.json(), v = this.extractResults(S);
      return this.cache.set(s, v), v;
    } catch (a) {
      if (a instanceof Error) {
        if (a.name === "AbortError")
          return [];
        throw new Error(`${p.FETCH_ERROR}: ${a.message}`);
      }
      throw a;
    }
  }
  /**
   * Extraire les résultats de la réponse API
   * @param data - Données brutes de l'API
   * @private
   */
  extractResults(e) {
    const { resultsKey: t, transformResponse: o } = this.config;
    if (o)
      try {
        return o(e);
      } catch (i) {
        throw console.error(i), new Error(p.PARSE_ERROR + " ");
      }
    if (t)
      try {
        const i = Array.isArray(t) ? t : t.split(".");
        let r = e;
        for (const s of i)
          if (r && typeof r == "object" && s in r)
            r = r[s];
          else
            throw new Error(`Key "${s}" not found in response`);
        if (Array.isArray(r))
          return r;
        throw new Error("Results is not an array");
      } catch (i) {
        throw console.error("Error extracting results:", i), new Error(p.PARSE_ERROR);
      }
    if (Array.isArray(e))
      return e;
    throw new Error(p.PARSE_ERROR);
  }
  /**
   * Filtrer les données localement
   * @param data - Données à filtrer
   * @param query - Requête de recherche
   * @returns Données filtrées
   */
  filterData(e, t) {
    if (!t || t.trim() === "")
      return e;
    const o = t.toLowerCase().trim(), { labelSuggestion: i } = this.config, r = i || m.LABEL_KEY;
    return e.filter((s) => this.getItemLabel(s, r).toLowerCase().includes(o));
  }
  /**
   * Obtenir le label d'un item
   * @param item - Item
   * @param labelKey - Clé du label
   * @private
   */
  getItemLabel(e, t) {
    if (typeof e == "string")
      return e;
    if (typeof e == "object" && e !== null) {
      const o = e[t];
      return o != null ? String(o) : "";
    }
    return String(e);
  }
  /**
   * Vider le cache
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Annuler les requêtes en cours
   */
  abort() {
    this.abortController && (this.abortController.abort(), this.abortController = null);
  }
  /**
   * Obtenir la taille du cache
   */
  getCacheSize() {
    return this.cache.size;
  }
  /**
   * Supprimer une entrée du cache
   * @param query - Requête à supprimer du cache
   */
  removeCacheEntry(e) {
    const { autocompleteUrl: t } = this.config;
    if (t) {
      const o = `${t}:${e}`;
      this.cache.delete(o);
    }
  }
}
class L {
  constructor(e, t) {
    n(this, "config");
    n(this, "dataService");
    n(this, "debounceTimer", null);
    n(this, "lastQuery", "");
    n(this, "isSearching", !1);
    // Callbacks
    n(this, "onResults", null);
    n(this, "onError", null);
    n(this, "onSearchStart", null);
    n(this, "onSearchEnd", null);
    this.config = e, this.dataService = t;
  }
  /**
   * Effectuer une recherche
   * @param query - Requête de recherche
   */
  search(e) {
    const t = this.config.minChars ?? m.MIN_CHARS;
    if (e.length < t) {
      this.clearResults();
      return;
    }
    if (e === this.lastQuery)
      return;
    this.lastQuery = e, this.cancelDebounce();
    const o = this.config.debounceDelay ?? m.DEBOUNCE_DELAY;
    this.debounceTimer = window.setTimeout(() => {
      this.performSearch(e);
    }, o);
  }
  /**
   * Effectuer la recherche immédiatement (sans debounce)
   * @param query - Requête de recherche
   */
  searchImmediate(e) {
    this.cancelDebounce(), this.lastQuery = e, this.performSearch(e);
  }
  /**
   * Effectuer la recherche réelle
   * @param query - Requête de recherche
   * @private
   */
  async performSearch(e) {
    if (!this.isSearching) {
      if (this.isSearching = !0, this.onSearchStart?.(), this.config.onSearch)
        try {
          await this.config.onSearch(e);
        } catch (t) {
          console.error("Error in onSearch callback:", t);
        }
      try {
        const t = await this.dataService.loadData(e);
        let o = t;
        this.config.dataSource && (o = this.dataService.filterData(t, e));
        const i = this.transformToSuggestions(o);
        if (this.onResults?.(i), this.config.onLoad)
          try {
            await this.config.onLoad(o);
          } catch (r) {
            console.error("Error in onLoad callback:", r);
          }
      } catch (t) {
        const o = t instanceof Error ? t : new Error("Search failed");
        if (this.onError?.(o), this.config.onError)
          try {
            await this.config.onError(o);
          } catch (i) {
            console.error("Error in onError callback:", i);
          }
      } finally {
        this.isSearching = !1, this.onSearchEnd?.();
      }
    }
  }
  /**
   * Transformer les données en SuggestionItems
   * @param data - Données brutes
   * @private
   */
  transformToSuggestions(e) {
    const { labelSuggestion: t, valueSuggestion: o } = this.config, i = t || m.LABEL_KEY, r = o;
    return e.map((s) => {
      let d, a;
      if (typeof s == "string")
        d = s, a = s;
      else if (typeof s == "object" && s !== null) {
        const u = s;
        d = String(u[i] ?? ""), a = r ? u[r] : u[i];
      } else
        d = String(s), a = s;
      return {
        label: d,
        value: a,
        original: s,
        disabled: !1,
        highlighted: !1
      };
    });
  }
  /**
   * Vider les résultats
   */
  clearResults() {
    this.lastQuery = "", this.onResults?.([]);
  }
  /**
   * Annuler le debounce en cours
   */
  cancelDebounce() {
    this.debounceTimer !== null && (clearTimeout(this.debounceTimer), this.debounceTimer = null);
  }
  /**
   * Annuler toutes les requêtes en cours
   */
  abort() {
    this.cancelDebounce(), this.dataService.abort(), this.isSearching = !1;
  }
  /**
   * Définir le callback pour les résultats
   * @param callback - Fonction appelée avec les résultats
   */
  setOnResults(e) {
    this.onResults = e;
  }
  /**
   * Définir le callback pour les erreurs
   * @param callback - Fonction appelée en cas d'erreur
   */
  setOnError(e) {
    this.onError = e;
  }
  /**
   * Définir le callback pour le début de recherche
   * @param callback - Fonction appelée au début de la recherche
   */
  setOnSearchStart(e) {
    this.onSearchStart = e;
  }
  /**
   * Définir le callback pour la fin de recherche
   * @param callback - Fonction appelée à la fin de la recherche
   */
  setOnSearchEnd(e) {
    this.onSearchEnd = e;
  }
  /**
   * Vérifier si une recherche est en cours
   */
  get searching() {
    return this.isSearching;
  }
  /**
   * Obtenir la dernière requête
   */
  getLastQuery() {
    return this.lastQuery;
  }
  /**
   * Réinitialiser le service
   */
  reset() {
    this.abort(), this.clearResults(), this.lastQuery = "";
  }
}
class c {
  static createElement(e, t, o) {
    const i = document.createElement(e);
    return t && (i.className = t), o && Object.entries(o).forEach(([r, s]) => {
      i.setAttribute(r, s);
    }), i;
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
    let o = t;
    for (; o; ) {
      if (o === e)
        return !0;
      o = o.parentElement;
    }
    return !1;
  }
}
class R {
  constructor(e) {
    n(this, "config");
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
class D {
  constructor(e, t) {
    n(this, "element");
    n(this, "config");
    n(this, "events");
    this.config = e, this.events = t, this.element = this.create(), this.attachEvents();
  }
  create() {
    return c.createElement("input", "comboselect-input", {
      type: "text",
      placeholder: this.config.get("placeholder") || "Sélectionner...",
      autocomplete: "off",
      role: "combobox",
      "aria-autocomplete": "list",
      "aria-expanded": "false"
    });
  }
  attachEvents() {
    this.element.addEventListener("input", () => {
      const e = this.element.value;
      this.events.emit("search", e);
    }), this.element.addEventListener("keydown", (e) => {
      this.handleKeyDown(e);
    });
  }
  handleKeyDown(e) {
    const t = e.key;
    t === "ArrowUp" ? (e.preventDefault(), this.events.emit("navigate", "up")) : t === "ArrowDown" ? (e.preventDefault(), this.events.emit("navigate", "down")) : t === "Enter" ? (e.preventDefault(), this.events.emit("navigate", "select")) : t === "Escape" && (e.preventDefault(), this.events.emit("close"));
  }
  focus() {
    this.element.focus();
  }
  clear() {
    this.element.value = "";
  }
  getValue() {
    return this.element.value;
  }
  setValue(e) {
    this.element.value = e;
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
  getElement() {
    return this.element;
  }
  destroy() {
  }
}
class N {
  constructor(e, t) {
    n(this, "element");
    n(this, "events");
    n(this, "renderService");
    n(this, "suggestions");
    n(this, "focusedIndex");
    n(this, "isOpen");
    this.events = e, this.renderService = t, this.suggestions = [], this.focusedIndex = -1, this.isOpen = !1, this.element = this.create(), this.attachEvents();
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
    if (this.suggestions = e, this.focusedIndex = -1, c.removeAllChildren(this.element), e.length === 0) {
      this.element.innerHTML = this.renderService.renderNoResults(), this.open();
      return;
    }
    e.forEach((t, o) => {
      const i = this.createOption(t, o);
      this.element.appendChild(i);
    }), this.open();
  }
  renderLoading() {
    c.removeAllChildren(this.element), this.element.innerHTML = this.renderService.renderLoading(), this.open();
  }
  createOption(e, t) {
    const o = c.createElement("div", "comboselect-option", {
      role: "option",
      "data-index": String(t)
    });
    return o.innerHTML = this.renderService.renderSuggestion(e), e.disabled && (o.classList.add("disabled"), o.setAttribute("aria-disabled", "true")), o.addEventListener("mousedown", (i) => {
      i.preventDefault(), e.disabled || this.selectOption(t);
    }), o.addEventListener("mouseenter", () => {
      e.disabled || this.focusOption(t);
    }), o;
  }
  handleNavigation(e) {
    if (!this.isOpen || this.suggestions.length === 0)
      return;
    if (e === "select") {
      this.focusedIndex >= 0 && this.selectOption(this.focusedIndex);
      return;
    }
    const t = this.suggestions.length - 1;
    let o = this.focusedIndex;
    for (e === "down" ? o = this.focusedIndex < t ? this.focusedIndex + 1 : 0 : e === "up" && (o = this.focusedIndex > 0 ? this.focusedIndex - 1 : t); this.suggestions[o]?.disabled; )
      if (e === "down" ? o = o < t ? o + 1 : 0 : o = o > 0 ? o - 1 : t, o === this.focusedIndex)
        return;
    this.focusOption(o);
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
class _ {
  constructor(e, t, o) {
    n(this, "element");
    n(this, "item");
    n(this, "events");
    this.item = e, this.events = o, this.element = this.create(t);
  }
  create(e) {
    const t = c.createElement("span", "comboselect-tag");
    t.setAttribute("data-value", JSON.stringify(this.item.value));
    const o = c.createElement("span");
    o.innerHTML = e, t.appendChild(o);
    const i = c.createElement("button", "comboselect-tag-remove", {
      type: "button",
      "aria-label": `Retirer ${this.item.label}`
    });
    return i.innerHTML = "&times;", i.addEventListener("click", (r) => {
      r.stopPropagation(), this.remove();
    }), t.appendChild(i), t;
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
class V {
  constructor(e, t, o, i) {
    n(this, "container");
    n(this, "config");
    n(this, "events");
    n(this, "renderService");
    n(this, "tags");
    n(this, "counterElement");
    this.container = e, this.config = t, this.events = o, this.renderService = i, this.tags = [];
  }
  add(e) {
    const t = this.tags.findIndex((r) => {
      const s = JSON.stringify(r.getItem().value), d = JSON.stringify(e.value);
      return s === d;
    });
    if (t !== -1)
      return console.warn("Item already selected:", e), this.highlightTag(t), !1;
    const o = this.renderService.renderTag(e), i = new _(e, o, this.events);
    return this.tags.push(i), this.render(), !0;
  }
  hasItem(e) {
    return this.tags.some((t) => {
      const o = JSON.stringify(t.getItem().value), i = JSON.stringify(e.value);
      return o === i;
    });
  }
  highlightTag(e) {
    const t = this.tags[e];
    if (!t)
      return;
    const o = t.getElement();
    o.classList.add("comboselect-tag-highlight"), setTimeout(() => {
      o.classList.remove("comboselect-tag-highlight");
    }, 600);
  }
  remove(e) {
    const t = this.tags.findIndex(
      (o) => JSON.stringify(o.getItem().value) === JSON.stringify(e.value)
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
      this.tags.slice(0, e).forEach((i) => {
        this.container.appendChild(i.getElement());
      });
      const o = this.tags.length - e;
      this.renderCounter(o);
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
class H {
  constructor(e, t = {}) {
    n(this, "originalInput");
    n(this, "config");
    n(this, "events");
    n(this, "container");
    n(this, "controlElement");
    n(this, "tagsContainer");
    n(this, "hiddenInput");
    n(this, "rootElement");
    n(this, "clickHandler");
    // Services - Utiliser un type générique plutôt que any
    n(this, "dataService");
    n(this, "searchService");
    n(this, "renderService");
    // Components
    n(this, "input");
    n(this, "dropdown");
    n(this, "tagList");
    // State
    n(this, "isDisabled");
    let o;
    if (typeof e == "string") {
      const r = document.querySelector(e);
      if (!r || !(r instanceof HTMLInputElement))
        throw new Error(`Element "${e}" not found or is not an input element`);
      o = r;
    } else if (e instanceof HTMLInputElement)
      o = e;
    else
      throw new Error("Selector must be a string or an HTMLInputElement");
    this.originalInput = o, this.rootElement = o.getRootNode(), this.config = new b(t), this.events = new A(), this.isDisabled = !1;
    const i = this.config.getAll();
    this.dataService = new T(i), this.searchService = new L(
      i,
      this.dataService
    ), this.renderService = new R(this.config), this.container = this.createContainer(), this.controlElement = this.createControl(), this.tagsContainer = this.createTagsContainer(), this.hiddenInput = this.createHiddenInput(), this.input = new D(this.config, this.events), this.dropdown = new N(this.events, this.renderService), this.tagList = new V(this.tagsContainer, this.config, this.events, this.renderService), this.assemble(), this.attachEvents(), this.setupSearchCallbacks(), this.loadCustomCSS(), this.originalInput.style.display = "none", this.loadInitialValues();
  }
  /**
   * Charger les valeurs initiales depuis la config ou l'attribut value
   */
  loadInitialValues() {
    let e = this.config.get("values");
    if (!e || !Array.isArray(e) || e.length === 0) {
      const o = this.originalInput.value;
      if (o && o.trim())
        try {
          const i = JSON.parse(o);
          Array.isArray(i) && (e = i);
        } catch (i) {
          console.warn("Failed to parse input value as JSON:", i);
          return;
        }
    }
    if (!e || !Array.isArray(e) || e.length === 0)
      return;
    const t = this.convertToSelectedItems(e);
    setTimeout(() => {
      this.setValue(t);
    }, 0);
  }
  // AJOUT - Nouvelle méthode privée
  /**
   * Convertir différents formats en SelectedItem[]
   */
  /**
   * Convertir différents formats en SelectedItem[]
   */
  convertToSelectedItems(e) {
    const t = this.config.get("labelSuggestion") || "label", o = this.config.get("valueSuggestion");
    return e.map((i) => {
      if (this.isSelectedItem(i))
        return {
          label: i.label,
          value: i.value,
          original: i.original || i
        };
      if (typeof i == "object" && i !== null) {
        const s = i, d = String(s[t] || s.label || s.name || ""), a = o ? s[o] : s.value !== void 0 ? s.value : s.id;
        return {
          label: d,
          value: a,
          original: s
        };
      }
      const r = i;
      return {
        label: String(r),
        value: r,
        original: { value: r }
      };
    });
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
  setupSearchCallbacks() {
    this.searchService.setOnResults((e) => {
      const t = this.tagList.getItems(), o = new Set(t.map((r) => JSON.stringify(r.value))), i = e.map((r) => ({
        ...r,
        disabled: o.has(JSON.stringify(r.value))
      }));
      this.dropdown.render(i);
    }), this.searchService.setOnError((e) => {
      console.error("Search error:", e), this.dropdown.render([]);
    }), this.searchService.setOnSearchStart(() => {
      this.dropdown.renderLoading();
    });
  }
  attachEvents() {
    this.events.on("search", (e) => {
      typeof e == "string" && this.searchService.search(e);
    }), this.events.on("select", (e) => {
      this.isSelectedItem(e) && this.handleSelect(e);
    }), this.events.on("remove", (e) => {
      if (this.isSelectedItem(e)) {
        this.tagList.remove(e), this.updateHiddenInput(), this.input.focus();
        const t = this.config.get("onRemove");
        t && t(e);
        const o = this.config.get("onChange");
        o && o(this.getValue());
      }
    }), this.events.on("open", () => {
      this.input.setAriaExpanded(!0);
      const e = this.config.get("onOpen");
      e && e();
    }), this.events.on("close", () => {
      this.dropdown.close(), this.input.setAriaExpanded(!1);
      const e = this.config.get("onClose");
      e && e();
    }), this.clickHandler = (e) => {
      const t = e, o = t.composedPath ? t.composedPath() : [];
      let i = !1;
      for (const r of o)
        if (r === this.container) {
          i = !0;
          break;
        }
      !i && t.target && (i = this.container.contains(t.target)), !i && this.dropdown.isDropdownOpen() && this.dropdown.close();
    }, document.addEventListener("click", this.clickHandler, !0), this.input.getElement().addEventListener("blur", () => {
      setTimeout(() => {
        const e = document.activeElement, t = this.rootElement instanceof ShadowRoot ? this.rootElement.activeElement : null;
        !(this.container.contains(e) || t && this.container.contains(t)) && this.dropdown.isDropdownOpen() && this.dropdown.close();
      }, 200);
    });
  }
  // Type guard pour vérifier si un objet est un SelectedItem
  isSelectedItem(e) {
    return typeof e == "object" && e !== null && "label" in e && "value" in e && typeof e.label == "string";
  }
  async handleSelect(e) {
    if (this.config.get("multiple") || this.tagList.clear(), !this.tagList.canAddMore()) {
      console.warn("Maximum number of items reached");
      return;
    }
    if (this.tagList.hasItem(e)) {
      console.warn("Item already selected, skipping:", e);
      return;
    }
    if (this.tagList.add(e)) {
      this.updateHiddenInput(), this.config.get("clearOnSelect") && this.input.clear(), this.config.get("closeOnSelect") && this.dropdown.close(), this.input.focus();
      const i = this.config.get("onChange");
      i && await i(this.getValue());
      const r = this.config.get("onSelect");
      r && await r(e);
    }
  }
  updateHiddenInput() {
    const t = this.tagList.getItems().map((o) => o.value);
    this.hiddenInput.value = JSON.stringify(t), this.originalInput.value = this.hiddenInput.value;
  }
  loadCustomCSS() {
    const e = this.config.get("cssUrl");
    if (e) {
      const t = document.createElement("link");
      t.rel = "stylesheet", t.href = e, this.rootElement instanceof ShadowRoot ? this.rootElement.appendChild(t) : document.head.appendChild(t);
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
    this.tagList.clear(), this.input.clear(), this.dropdown.close(), this.updateHiddenInput(), this.searchService.reset();
  }
  disable() {
    this.isDisabled = !0, this.input.disable(), this.controlElement.classList.add("disabled"), this.dropdown.close();
  }
  enable() {
    this.isDisabled = !1, this.input.enable(), this.controlElement.classList.remove("disabled");
  }
  destroy() {
    this.clickHandler && document.removeEventListener("click", this.clickHandler, !0), this.searchService.abort(), this.events.clear(), this.input.destroy(), this.dropdown.destroy(), this.tagList.destroy(), this.container.remove(), this.originalInput.style.display = "";
  }
  open() {
    if (!this.isDisabled) {
      const e = this.input.getValue();
      e && this.searchService.searchImmediate(e);
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
const M = '@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-border-style:solid;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-ease:initial;--tw-duration:initial;--tw-font-weight:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-500:oklch(63.7% .237 25.331);--color-red-600:oklch(57.7% .245 27.325);--color-green-500:oklch(72.3% .219 149.579);--color-gray-50:oklch(98.5% .002 247.839);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-700:oklch(37.3% .034 259.733);--color-white:#fff;--spacing:.25rem;--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--font-weight-medium:500;--radius-md:.375rem;--radius-lg:.5rem;--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-spin:spin 1s linear infinite;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-comboselect-primary:#3b82f6;--color-comboselect-border:#d1d5db;--color-comboselect-border-focus:#3b82f6;--color-comboselect-background:#fff;--color-comboselect-background-hover:#f3f4f6;--color-comboselect-text:#111827;--color-comboselect-text-secondary:#6b7280;--color-comboselect-tag:#eff6ff;--color-comboselect-tag-text:#1e40af;--color-comboselect-tag-hover:#dbeafe;--shadow-comboselect-dropdown:0 4px 6px -1px #0000001a,0 2px 4px -2px #0000001a;--shadow-comboselect-focus:0 0 0 3px #3b82f61a;--animate-comboselect-dropdown:comboselect-dropdown .15s ease-out;--animate-comboselect-tag:comboselect-tag .2s ease-out}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.static{position:static}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.block{display:block}.contents{display:contents}.flex{display:flex}.grid{display:grid}.hidden{display:none}.table{display:table}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.flex-wrap{flex-wrap:wrap}.border{border-style:var(--tw-border-style);border-width:1px}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}}@keyframes comboselect-dropdown{0%{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes comboselect-tag{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}.comboselect-wrapper{width:100%;position:relative}.comboselect-control{min-height:calc(var(--spacing)*10);cursor:text;align-items:center;gap:calc(var(--spacing)*1);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-comboselect-border);background-color:var(--color-comboselect-background);padding-inline:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*2);transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));--tw-duration:.2s;flex-wrap:wrap;transition-duration:.2s;display:flex;position:relative}.comboselect-control:focus-within{border-color:var(--color-comboselect-border-focus);--tw-shadow:var(--shadow-comboselect-focus);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);--tw-outline-style:none;outline-style:none}.comboselect-control.disabled{cursor:not-allowed;background-color:var(--color-gray-50);opacity:.6}.comboselect-tags{align-items:center;gap:calc(var(--spacing)*1);flex-wrap:wrap;flex:1;display:flex}.comboselect-tag{animation:var(--animate-comboselect-tag);align-items:center;gap:calc(var(--spacing)*1.5);border-radius:var(--radius-md);background-color:var(--color-comboselect-tag);padding-inline:calc(var(--spacing)*2);padding-block:calc(var(--spacing)*1);font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);color:var(--color-comboselect-tag-text);transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));--tw-duration:.2s;transition-duration:.2s;display:inline-flex}.comboselect-tag:hover{background-color:var(--color-comboselect-tag-hover)}.comboselect-tag-remove{height:calc(var(--spacing)*4);width:calc(var(--spacing)*4);cursor:pointer;color:var(--color-comboselect-tag-text);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));border-radius:.25rem;justify-content:center;align-items:center;display:inline-flex}@media(hover:hover){.comboselect-tag-remove:hover{color:var(--color-red-600)}}.comboselect-tag-counter{border-radius:var(--radius-md);background-color:var(--color-gray-200);padding-inline:calc(var(--spacing)*2);padding-block:calc(var(--spacing)*1);font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height));--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium);color:var(--color-gray-700);justify-content:center;align-items:center;display:inline-flex}.comboselect-input{border-style:var(--tw-border-style);min-width:120px;color:var(--color-comboselect-text);--tw-outline-style:none;background-color:#0000;border-width:0;outline-style:none;flex:1}.comboselect-input::placeholder{color:var(--color-comboselect-text-secondary)}.comboselect-input:disabled{cursor:not-allowed}.comboselect-dropdown{right:calc(var(--spacing)*0);left:calc(var(--spacing)*0);z-index:50;margin-top:calc(var(--spacing)*1);max-height:calc(var(--spacing)*60);animation:var(--animate-comboselect-dropdown);border-radius:var(--radius-lg);border-style:var(--tw-border-style);border-width:1px;border-color:var(--color-comboselect-border);background-color:var(--color-comboselect-background);--tw-shadow:var(--shadow-comboselect-dropdown);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow);position:absolute;overflow:auto}.comboselect-dropdown.hidden{display:none}.comboselect-option{cursor:pointer;padding-inline:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*2);color:var(--color-comboselect-text);transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration));--tw-duration:.15s;transition-duration:.15s}.comboselect-option:hover{background-color:var(--color-comboselect-background-hover)}.comboselect-option.selected{background-color:var(--color-comboselect-primary);color:var(--color-white)}.comboselect-option.focused{background-color:var(--color-comboselect-background-hover)}.comboselect-option.disabled{cursor:not-allowed;opacity:.5}.comboselect-no-results{padding-inline:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*2);text-align:center;color:var(--color-comboselect-text-secondary);font-style:italic}.comboselect-loading{justify-content:center;align-items:center;gap:calc(var(--spacing)*2);padding-inline:calc(var(--spacing)*3);padding-block:calc(var(--spacing)*2);text-align:center;color:var(--color-comboselect-text-secondary);display:flex}.comboselect-loading-spinner{height:calc(var(--spacing)*4);width:calc(var(--spacing)*4);animation:var(--animate-spin);border-style:var(--tw-border-style);border-width:2px;border-color:var(--color-comboselect-primary);border-top-color:#0000;border-radius:3.40282e38px;display:inline-block}.comboselect-wrapper.error .comboselect-control{border-color:var(--color-red-500)}.comboselect-wrapper.error .comboselect-control:focus-within{border-color:var(--color-red-500);--tw-shadow:0 0 0 3px var(--tw-shadow-color,#ef44441a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.comboselect-wrapper.success .comboselect-control{border-color:var(--color-green-500)}.comboselect-wrapper.success .comboselect-control:focus-within{border-color:var(--color-green-500);--tw-shadow:0 0 0 3px var(--tw-shadow-color,#22c55e1a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}@keyframes tag-highlight{0%,to{background-color:var(--color-comboselect-tag);transform:scale(1)}25%{background-color:#fef3c7;transform:scale(1.1)}50%{background-color:#fde68a;transform:scale(1.05)}75%{background-color:#fef3c7;transform:scale(1.1)}}.comboselect-tag-highlight{animation:.6s ease-in-out tag-highlight}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@keyframes spin{to{transform:rotate(360deg)}}';
class U extends HTMLElement {
  constructor() {
    super();
    n(this, "comboSelect");
    n(this, "inputElement");
    n(this, "_dataSource");
    n(this, "_initialValues");
    this.attachShadow({ mode: "open" });
  }
  /**
   * Attributs observés pour les changements
   */
  static get observedAttributes() {
    return [
      "placeholder",
      "multiple",
      "max-items",
      "min-chars",
      "debounce-delay",
      "label-suggestion",
      "value-suggestion",
      "increment-value-size",
      "disabled",
      "autocomplete-url",
      "results-key",
      "close-on-select",
      "values"
    ];
  }
  /**
   * Appelé quand l'élément est ajouté au DOM
   */
  connectedCallback() {
    if (this.render(), this.initComboSelect(), this._initialValues && this.comboSelect) {
      const t = this._initialValues;
      setTimeout(() => {
        this.comboSelect && t && this.comboSelect.setValue(t);
      }, 100);
    }
  }
  /**
   * Appelé quand l'élément est retiré du DOM
   */
  disconnectedCallback() {
    this.comboSelect?.destroy();
  }
  /**
   * Appelé quand un attribut change
   */
  attributeChangedCallback(t, o, i) {
    o !== i && this.comboSelect && this.updateConfig();
  }
  /**
   * Créer la structure HTML dans le Shadow DOM
   */
  render() {
    if (!this.shadowRoot)
      return;
    const t = document.createElement("style");
    t.textContent = M, this.inputElement = document.createElement("input"), this.inputElement.type = "text", this.inputElement.className = "comboselect-internal-input", this.inputElement.id = "combo-input", this.shadowRoot.appendChild(t), this.shadowRoot.appendChild(this.inputElement);
  }
  /**
   * Initialiser le ComboSelect
   */
  initComboSelect() {
    if (!this.inputElement || !this.shadowRoot)
      return;
    const t = this.buildConfig(), o = this.shadowRoot.querySelector("#combo-input");
    if (!o)
      return;
    this.comboSelect = new H(o, t);
    const i = this.getAttribute("values");
    i && this.parseAndSetValues(i);
  }
  parseAndSetValues(t) {
    try {
      const o = JSON.parse(t);
      if (!Array.isArray(o)) {
        console.warn("Values attribute must be a JSON array");
        return;
      }
      const i = o.map((r) => typeof r == "object" && r !== null && "label" in r && "value" in r ? {
        label: String(r.label),
        value: r.value,
        original: r.original || r
      } : {
        label: String(r),
        value: r,
        original: r
      });
      this.comboSelect ? this.comboSelect.setValue(i) : this._initialValues = i;
    } catch (o) {
      console.error("Failed to parse values attribute:", o);
    }
  }
  /**
   * Construire la configuration depuis les attributs
   */
  buildConfig() {
    const t = {
      placeholder: this.getAttribute("placeholder") || "Sélectionner...",
      multiple: this.hasAttribute("multiple"),
      labelSuggestion: this.getAttribute("label-suggestion") || "label",
      valueSuggestion: this.getAttribute("value-suggestion") || null
    }, o = this.getAttribute("max-items");
    o && (t.maxItems = parseInt(o, 10));
    const i = this.getAttribute("min-chars");
    i && (t.minChars = parseInt(i, 10));
    const r = this.getAttribute("debounce-delay");
    r && (t.debounceDelay = parseInt(r, 10));
    const s = this.getAttribute("increment-value-size");
    s && (t.incrementValueSize = parseInt(s, 10)), this._dataSource && (t.dataSource = this._dataSource);
    const d = this.getAttribute("autocomplete-url");
    d && (t.autocompleteUrl = d);
    const a = this.getAttribute("results-key");
    a && (t.resultsKey = a);
    const u = this.getAttribute("close-on-select");
    return u !== null && (t.closeOnSelect = u === "true"), t.onSelect = (h) => {
      this.dispatchEvent(new CustomEvent("comboselect-select", {
        detail: h,
        bubbles: !0,
        composed: !0
      }));
    }, t.onChange = (h) => {
      this.dispatchEvent(new CustomEvent("comboselect-change", {
        detail: h,
        bubbles: !0,
        composed: !0
      })), this.dispatchEvent(new CustomEvent("change", {
        detail: h,
        bubbles: !0,
        composed: !0
      }));
    }, t.onRemove = (h) => {
      this.dispatchEvent(new CustomEvent("comboselect-remove", {
        detail: h,
        bubbles: !0,
        composed: !0
      }));
    }, t.onOpen = () => {
      this.dispatchEvent(new CustomEvent("comboselect-open", {
        bubbles: !0,
        composed: !0
      }));
    }, t.onClose = () => {
      this.dispatchEvent(new CustomEvent("comboselect-close", {
        bubbles: !0,
        composed: !0
      }));
    }, t.onSearch = (h) => {
      this.dispatchEvent(new CustomEvent("comboselect-search", {
        detail: { query: h },
        bubbles: !0,
        composed: !0
      }));
    }, t.onLoad = (h) => {
      this.dispatchEvent(new CustomEvent("comboselect-load", {
        detail: h,
        bubbles: !0,
        composed: !0
      }));
    }, t.onError = (h) => {
      console.error("ComboSelect error:", h), this.dispatchEvent(new CustomEvent("comboselect-error", {
        detail: h,
        bubbles: !0,
        composed: !0
      }));
    }, t;
  }
  /**
   * Mettre à jour la configuration
   */
  updateConfig() {
    this.comboSelect && (this.comboSelect.destroy(), this.initComboSelect());
  }
  // ===========================
  // API PUBLIQUE
  // ===========================
  /**
   * Obtenir la source de données
   */
  get dataSource() {
    return this._dataSource;
  }
  /**
   * Définir la source de données
   */
  set dataSource(t) {
    this._dataSource = t, this.comboSelect && this.updateConfig();
  }
  /**
   * Obtenir les valeurs sélectionnées
   */
  getValue() {
    return this.comboSelect?.getValue() || [];
  }
  get values() {
    return this.comboSelect?.getValue() || [];
  }
  set values(t) {
    this.comboSelect ? this.comboSelect.setValue(t) : this._initialValues = t;
  }
  /**
   * Définir les valeurs sélectionnées
   */
  setValue(t) {
    this.comboSelect?.setValue(t);
  }
  /**
   * Vider toutes les sélections
   */
  clear() {
    this.comboSelect?.clear();
  }
  /**
   * Ouvrir le dropdown
   */
  open() {
    this.comboSelect?.open();
  }
  /**
   * Fermer le dropdown
   */
  close() {
    this.comboSelect?.close();
  }
  /**
   * Obtenir l'état désactivé
   */
  get disabled() {
    return this.hasAttribute("disabled");
  }
  /**
   * Définir l'état désactivé
   */
  set disabled(t) {
    t ? (this.setAttribute("disabled", ""), this.comboSelect?.disable()) : (this.removeAttribute("disabled"), this.comboSelect?.enable());
  }
}
customElements.get("combo-select") || customElements.define("combo-select", U);
export {
  j as ARIA_ATTRIBUTES,
  z as CSS_CLASSES,
  H as ComboSelect,
  U as ComboSelectElement,
  m as DEFAULTS,
  B as EVENTS,
  G as KEYBOARD_KEYS
};
//# sourceMappingURL=comboselect.js.map
