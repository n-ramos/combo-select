# ComboSelect Documentation
[![npm version](https://img.shields.io/npm/v/@n-ramos/comboselect.svg)](https://www.npmjs.com/package/@n-ramos/comboselect)
[![npm downloads](https://img.shields.io/npm/dm/@n-ramos/comboselect.svg)](https://www.npmjs.com/package/@n-ramos/comboselect)
[![CI](https://github.com/n-ramos/comboselect/actions/workflows/ci.yml/badge.svg)](https://github.com/n-ramos/comboselect/actions/workflows/ci.yml)
[![License](https://img.shields.io/npm/l/@n-ramos/comboselect.svg)](https://github.com/n-ramos/comboselect/blob/main/LICENSE)

**Version:** 1.0.0  
**License:** MIT

---

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Configuration Options](#configuration-options)
5. [Data Sources](#data-sources)
6. [API Integration](#api-integration)
7. [Events & Callbacks](#events--callbacks)
8. [Customization](#customization)
9. [Public Methods](#public-methods)
10. [Examples](#examples)
11. [TypeScript Support](#typescript-support)
12. [Browser Support](#browser-support)

---

## Introduction

**ComboSelect** is a modern, flexible autocomplete component with tag support, built with TypeScript and styled with Tailwind CSS v4.

### Key Features

- ✅ **Single & Multiple Selection**
- ✅ **Local & Remote Data**
- ✅ **Tag System with Counter**
- ✅ **Keyboard Navigation**
- ✅ **Duplicate Prevention**
- ✅ **Customizable Rendering**
- ✅ **TypeScript Support**
- ✅ **Zero Dependencies**

---

## Installation

### NPM
```bash
npm install comboselect
```

### Yarn
```bash
yarn add comboselect
```

### Import
```typescript
import { ComboSelect } from 'comboselect';
import 'comboselect/style.css';
```

---

## Quick Start

### Basic Example
```javascript
const cities = [
  { id: 1, name: 'Paris' },
  { id: 2, name: 'London' }
];

new ComboSelect('#city-select', {
  dataSource: cities,
  labelSuggestion: 'name',
  valueSuggestion: 'id',
  placeholder: 'Select a city...'
});
```

### Multiple Selection
```javascript
new ComboSelect('#cities', {
  dataSource: cities,
  multiple: true,
  maxItems: 5,
  incrementValueSize: 3
});
```

---

## Configuration Options

### Main Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dataSource` | `Array \| Function` | - | Local data |
| `autocompleteUrl` | `string` | - | API endpoint |
| `labelSuggestion` | `string` | `'label'` | Label key |
| `valueSuggestion` | `string \| null` | `null` | Value key |
| `multiple` | `boolean` | `false` | Multiple selection |
| `maxItems` | `number` | - | Max items |
| `incrementValueSize` | `number` | - | Visible tags before +N |
| `placeholder` | `string` | `'Sélectionner...'` | Placeholder |
| `minChars` | `number` | `1` | Min chars |
| `debounceDelay` | `number` | `300` | Debounce (ms) |
| `closeOnSelect` | `boolean` | `true` | Close on select |

---

## Data Sources

### Local Array
```javascript
new ComboSelect('#input', {
  dataSource: [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' }
  ]
});
```

### Async Function
```javascript
new ComboSelect('#input', {
  dataSource: async () => {
    const res = await fetch('/api/data');
    return await res.json();
  }
});
```

### Nested Properties
```javascript
new ComboSelect('#input', {
  dataSource: data,
  labelSuggestion: 'user.profile.name'
});
```

---

## API Integration

### Basic API
```javascript
new ComboSelect('#input', {
  autocompleteUrl: 'https://api.example.com/search'
});
```

### With resultsKey
```javascript
// Response: { items: [...] }
new ComboSelect('#input', {
  autocompleteUrl: 'https://api.example.com/search',
  resultsKey: 'items'
});

// Response: { data: { users: [...] } }
new ComboSelect('#input', {
  autocompleteUrl: 'https://api.example.com/search',
  resultsKey: 'data.users'
});
```

### Custom Transform
```javascript
new ComboSelect('#input', {
  autocompleteUrl: 'https://api.example.com/search',
  transformResponse: (response) => {
    return response.payload.items.map(item => ({
      id: item.identifier,
      label: item.displayName
    }));
  }
});
```

### POST Request
```javascript
new ComboSelect('#input', {
  autocompleteUrl: 'https://api.example.com/search',
  httpMethod: 'POST',
  httpHeaders: {
    'Authorization': 'Bearer TOKEN'
  }
});
```

---

## Events & Callbacks
```javascript
new ComboSelect('#input', {
  onSelect: (item) => {
    console.log('Selected:', item);
  },
  
  onRemove: (item) => {
    console.log('Removed:', item);
  },
  
  onChange: (items) => {
    console.log('All items:', items);
  },
  
  onLoad: (data) => {
    console.log('Data loaded:', data);
  },
  
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

### Available Callbacks

- `onSelect(item)` - When item is selected
- `onRemove(item)` - When item is removed
- `onChange(items)` - When selection changes
- `onLoad(data)` - When data loads
- `onSearch(query)` - When user types
- `onOpen()` - When dropdown opens
- `onClose()` - When dropdown closes
- `onError(error)` - When error occurs

---

## Customization

### Custom Suggestions
```javascript
new ComboSelect('#input', {
  renderSuggestion: (user) => \`
    
      
      
        \${user.name}
        \${user.email}
      
    
  \`
});
```

### Custom Tags
```javascript
new ComboSelect('#input', {
  renderTag: (item) => {
    return \`\${item.original.flag} \${item.label}\`;
  }
});
```

### Custom CSS
```javascript
new ComboSelect('#input', {
  cssUrl: '/path/to/custom-theme.css'
});
```

---

## Public Methods
```javascript
const combo = new ComboSelect('#input', options);

// Get values
const values = combo.getValue(); // Returns: SelectedItem[]

// Set values
combo.setValue([
  { label: 'Paris', value: 1, original: {...} }
]);

// Clear all
combo.clear();

// Add item
combo.addItem({ label: 'Item', value: 1, original: {} });

// Remove item
combo.removeItem({ label: 'Item', value: 1, original: {} });

// Open/Close
combo.open();
combo.close();

// Enable/Disable
combo.enable();
combo.disable();

// Clear cache
combo.clearCache();

// Destroy
combo.destroy();
```

---

## Examples

### Example 1: Cities with Population
```javascript
new ComboSelect('#cities', {
  dataSource: cities,
  labelSuggestion: 'name',
  multiple: true,
  renderSuggestion: (city) => \`
    
      \${city.name}
      
        \${city.population.toLocaleString()} inhabitants
      
    
  \`
});
```

### Example 2: Countries with Flags
```javascript
new ComboSelect('#countries', {
  dataSource: countries,
  labelSuggestion: 'name',
  renderSuggestion: (country) => \`
    \${country.flag} \${country.name}
  \`,
  renderTag: (item) => \`
    \${item.original.flag} \${item.label}
  \`
});
```

### Example 3: GitHub Repositories
```javascript
new ComboSelect('#repos', {
  autocompleteUrl: 'https://api.github.com/search/repositories',
  resultsKey: 'items',
  searchParam: 'q',
  labelSuggestion: 'full_name',
  multiple: true,
  incrementValueSize: 3,
  renderSuggestion: (repo) => \`
    
      \${repo.full_name}
      
        ⭐ \${repo.stargazers_count}
      
    
  \`
});
```

### Example 4: Form Integration
```javascript
const form = document.getElementById('myForm');
const combo = new ComboSelect('#cities', {
  dataSource: cities,
  multiple: true,
  onChange: (items) => {
    console.log('Selected:', items);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const values = combo.getValue();
  
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cities: values })
  });
  
  const result = await response.json();
  console.log('Result:', result);
});
```

---

## TypeScript Support

### Type Definitions
```typescript
import { ComboSelect, ComboSelectConfig, SelectedItem } from 'comboselect';

const config: ComboSelectConfig = {
  dataSource: cities,
  multiple: true,
  maxItems: 5
};

const combo = new ComboSelect('#input', config);
const values: SelectedItem[] = combo.getValue();
```

### SelectedItem Interface
```typescript
interface SelectedItem {
  label: string;
  value: any;
  original: any;
}
```

---

## Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)

**Minimum Requirements:**
- ES2020 support
- Fetch API
- Promise support

---

## Troubleshooting

### Dropdown not showing
- Check that `minChars` requirement is met
- Verify `dataSource` or `autocompleteUrl` is properly configured
- Check browser console for errors

### Styles not applied
- Ensure CSS is imported: `import 'comboselect/style.css'`
- Check for CSS conflicts with your framework

### API calls not working
- Verify `autocompleteUrl` is correct
- Check CORS configuration on your server
- Use `onError` callback to debug

### TypeScript errors
- Ensure `@types` are installed
- Check `tsconfig.json` configuration
- Import types: `import type { ComboSelectConfig } from 'comboselect'`

---

## License

MIT License - see LICENSE file for details

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## Support

- 📧 Email: support@example.com
- 🐛 Issues: https://github.com/yourusername/comboselect/issues
- 📖 Docs: https://comboselect.dev