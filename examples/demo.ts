import { ComboSelect } from '../src/index';
import type { SelectedItem } from '../src/types';

// Données mockées pour les exemples
const mockCities = [
  { id: 1, name: 'Paris', country: 'France', population: 2161000 },
  { id: 2, name: 'Marseille', country: 'France', population: 869000 },
  { id: 3, name: 'Lyon', country: 'France', population: 516000 },
  { id: 4, name: 'Toulouse', country: 'France', population: 471000 },
  { id: 5, name: 'Nice', country: 'France', population: 341000 },
  { id: 6, name: 'Nantes', country: 'France', population: 303000 },
  { id: 7, name: 'Strasbourg', country: 'France', population: 277000 },
  { id: 8, name: 'Montpellier', country: 'France', population: 281000 },
  { id: 9, name: 'Bordeaux', country: 'France', population: 249000 },
  { id: 10, name: 'Lille', country: 'France', population: 232000 },
  { id: 11, name: 'Rennes', country: 'France', population: 216000 },
  { id: 12, name: 'Reims', country: 'France', population: 183000 },
  { id: 13, name: 'Brive-la-Gaillarde', country: 'France', population: 47000 },
  { id: 14, name: 'Limoges', country: 'France', population: 132000 },
];

const mockCountries = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹' },
];

const mockLanguages = [
  { id: 1, name: 'JavaScript', category: 'Web', color: '#f7df1e' },
  { id: 2, name: 'TypeScript', category: 'Web', color: '#3178c6' },
  { id: 3, name: 'Python', category: 'Backend', color: '#3776ab' },
  { id: 4, name: 'Java', category: 'Backend', color: '#007396' },
  { id: 5, name: 'PHP', category: 'Backend', color: '#777bb4' },
  { id: 6, name: 'Ruby', category: 'Backend', color: '#cc342d' },
  { id: 7, name: 'Go', category: 'Backend', color: '#00add8' },
  { id: 8, name: 'Rust', category: 'Systems', color: '#000000' },
  { id: 9, name: 'C++', category: 'Systems', color: '#00599c' },
  { id: 10, name: 'Swift', category: 'Mobile', color: '#fa7343' },
];

const mockUsers = [
  { id: 1, name: 'Jean Dupont', email: 'jean.dupont@example.com', avatar: '👨' },
  { id: 2, name: 'Marie Martin', email: 'marie.martin@example.com', avatar: '👩' },
  { id: 3, name: 'Pierre Bernard', email: 'pierre.bernard@example.com', avatar: '👨‍💼' },
  { id: 4, name: 'Sophie Dubois', email: 'sophie.dubois@example.com', avatar: '👩‍💼' },
  { id: 5, name: 'Luc Thomas', email: 'luc.thomas@example.com', avatar: '👨‍🔧' },
];

// Simulation d'une API
function simulateAPI(data: any[], query: string, delay: number = 300): Promise<any[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, delay);
  });
}

// ===== EXEMPLE 1: Simple =====
const simpleSelect = new ComboSelect('#simple-select', {
  dataSource: async () => {
    // Simule un appel API
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCities;
  },
  labelSuggestion: 'name',
  valueSuggestion: 'id',
  placeholder: 'Rechercher une ville...',
  onSelect: (item) => {
    console.log('Ville sélectionnée:', item);
  },
});

(window as any).getSimpleValue = () => {
  const values = simpleSelect.getValue();
  document.getElementById('simple-output')!.textContent = JSON.stringify(values, null, 2);
};

(window as any).clearSimple = () => {
  simpleSelect.clear();
  document.getElementById('simple-output')!.textContent = '';
};

// ===== EXEMPLE 2: Multiple =====
const multipleSelect = new ComboSelect('#multiple-select', {
  dataSource: mockCities,
  labelSuggestion: 'name',
  valueSuggestion: 'id',
  multiple: true,
  maxItems: 5,
  placeholder: 'Sélectionner des villes...',
  closeOnSelect: false,
  onChange: (items) => {
    console.log('Sélection changée:', items);
  },
});

(window as any).getMultipleValue = () => {
  const values = multipleSelect.getValue();
  document.getElementById('multiple-output')!.textContent = JSON.stringify(values, null, 2);
};

(window as any).clearMultiple = () => {
  multipleSelect.clear();
  document.getElementById('multiple-output')!.textContent = '';
};

(window as any).setMultipleValue = () => {
  multipleSelect.setValue([
    { label: 'Paris', value: 1, original: mockCities[0] },
    { label: 'Lyon', value: 3, original: mockCities[2] },
    { label: 'Nice', value: 5, original: mockCities[4] },
  ]);
  document.getElementById('multiple-output')!.textContent =
    'Valeurs définies: Paris, Lyon, Nice';
};

// ===== EXEMPLE 3: Avec incrementValueSize =====
const incrementSelect = new ComboSelect('#increment-select', {
  dataSource: mockCountries,
  labelSuggestion: 'name',
  valueSuggestion: 'code',
  multiple: true,
  incrementValueSize: 2,
  placeholder: 'Sélectionner des pays...',
  renderSuggestion: (item) => {
    return `${item.flag} ${item.name}`;
  },
  renderTag: (item) => {
    const country = mockCountries.find((c) => c.code === item.value);
    return `${country?.flag || ''} ${item.label}`;
  },
});

(window as any).getIncrementValue = () => {
  const values = incrementSelect.getValue();
  document.getElementById('increment-output')!.textContent = JSON.stringify(values, null, 2);
};

(window as any).clearIncrement = () => {
  incrementSelect.clear();
  document.getElementById('increment-output')!.textContent = '';
};

// ===== EXEMPLE 4: Source locale =====
const localSelect = new ComboSelect('#local-select', {
  dataSource: mockLanguages,
  labelSuggestion: 'name',
  valueSuggestion: 'id',
  placeholder: 'Rechercher un langage...',
  renderSuggestion: (item) => {
    return `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${item.color};"></span>
        <span><strong>${item.name}</strong> <small style="color: #6b7280;">(${item.category})</small></span>
      </div>
    `;
  },
});

(window as any).getLocalValue = () => {
  const values = localSelect.getValue();
  document.getElementById('local-output')!.textContent = JSON.stringify(values, null, 2);
};

(window as any).clearLocal = () => {
  localSelect.clear();
  document.getElementById('local-output')!.textContent = '';
};

// ===== EXEMPLE 5: Rendu personnalisé =====
const customSelect = new ComboSelect('#custom-select', {
  dataSource: mockUsers,
  labelSuggestion: 'name',
  valueSuggestion: 'id',
  multiple: true,
  placeholder: 'Rechercher des utilisateurs...',
  renderSuggestion: (item) => {
    return `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">${item.avatar}</span>
        <div>
          <div style="font-weight: 600;">${item.name}</div>
          <div style="font-size: 0.875rem; color: #6b7280;">${item.email}</div>
        </div>
      </div>
    `;
  },
  renderTag: (item) => {
    const user = mockUsers.find((u) => u.id === item.value);
    return `${user?.avatar || ''} ${item.label}`;
  },
  closeOnSelect: false,
});

(window as any).getCustomValue = () => {
  const values = customSelect.getValue();
  document.getElementById('custom-output')!.textContent = JSON.stringify(values, null, 2);
};

(window as any).clearCustom = () => {
  customSelect.clear();
  document.getElementById('custom-output')!.textContent = '';
};

// ===== EXEMPLE 6: Disabled =====
const disabledSelect = new ComboSelect('#disabled-select', {
  dataSource: mockCities,
  labelSuggestion: 'name',
  placeholder: 'Input désactivé',
});

disabledSelect.disable();

let isDisabled = true;
(window as any).toggleDisabled = () => {
  if (isDisabled) {
    disabledSelect.enable();
  } else {
    disabledSelect.disable();
  }
  isDisabled = !isDisabled;
};

// ===== EXEMPLE 7: MinChars =====
const minCharsSelect = new ComboSelect('#minchars-select', {
  dataSource: mockCities,
  labelSuggestion: 'name',
  minChars: 3,
  placeholder: 'Tapez au moins 3 caractères...',
});

// Log des événements pour le debug
console.log('ComboSelect démarré! Ouvrez la console pour voir les logs.');