<?php
// examples/test-comboselect.php

// Si c'est une soumission AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
    header('Content-Type: application/json');
    
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);
    
    // Debug et traitement
    $response = [
        'success' => true,
        'timestamp' => date('Y-m-d H:i:s'),
        'received_data' => $data,
        'count' => is_array($data) ? count($data) : 0,
        'raw_input' => $rawData,
        'server_info' => [
            'method' => $_SERVER['REQUEST_METHOD'],
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
        ],
        'cities_count' => isset($data['cities']) ? count($data['cities']) : 0,
        'country_selected' => isset($data['country']) && !empty($data['country']) ? 'Yes' : 'No',
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}

// Si c'est une soumission de formulaire classique
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $response = [
        'success' => true,
        'timestamp' => date('Y-m-d H:i:s'),
        'post_data' => $_POST,
        'files' => $_FILES,
        'message' => 'Form submitted successfully!'
    ];
    
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ComboSelect PHP Test</title>
    <link rel="stylesheet" href="comboselect.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            margin-bottom: 2rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #374151;
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 0.5rem;
        }

        .badge.multiple { background: #667eea; color: white; }
        .badge.single { background: #10b981; color: white; }
        .badge.max { background: #f59e0b; color: white; }
        .badge.counter { background: #8b5cf6; color: white; }

        .description {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 0.25rem;
        }

        input[type="text"]:not(.comboselect-input) {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 1rem;
        }

        input[type="text"]:not(.comboselect-input):focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn-group {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        }

        button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1rem;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #e5e7eb;
            color: #374151;
        }

        .btn-secondary:hover {
            background: #d1d5db;
        }

        .result-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .result-container h2 {
            color: #111827;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 3px solid #667eea;
        }

        .debug-output {
            background: #1f2937;
            color: #f9fafb;
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 500px;
            overflow-y: auto;
            line-height: 1.5;
        }

        .debug-output:empty::before {
            content: 'Soumettez le formulaire pour voir les résultats...';
            color: #9ca3af;
            font-style: italic;
        }

        .status {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            display: none;
        }

        .status.success {
            background: #d1fae5;
            color: #065f46;
            border-left: 4px solid #10b981;
            display: block;
        }

        .status.error {
            background: #fee2e2;
            color: #991b1b;
            border-left: 4px solid #ef4444;
            display: block;
        }

        .status.loading {
            background: #dbeafe;
            color: #1e40af;
            border-left: 4px solid #3b82f6;
            display: block;
        }

        .info-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 1rem;
            border-radius: 6px;
            margin-bottom: 2rem;
        }

        .info-box strong {
            color: #1e40af;
            display: block;
            margin-bottom: 0.5rem;
        }

        .info-box code {
            background: #dbeafe;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.875rem;
        }

        .tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        }

        .tab {
            padding: 0.75rem 1.5rem;
            background: none;
            border: none;
            border-radius: 8px 8px 0 0;
            cursor: pointer;
            font-weight: 600;
            color: #6b7280;
            transition: all 0.2s;
        }

        .tab.active {
            background: white;
            color: #667eea;
            border-bottom: 3px solid #667eea;
            margin-bottom: -2px;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }

        .stat-card {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .stat-card .stat-label {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.25rem;
        }

        .stat-card .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 ComboSelect PHP Test</h1>
            <p>Test complet de soumission et débogage avec la vraie librairie</p>
        </div>

        <div class="info-box">
            <strong>📋 Instructions</strong>
            <p>1. Sélectionnez des villes et un pays</p>
            <p>2. Cliquez sur "Soumettre (AJAX)" pour voir la réponse JSON du serveur</p>
            <p>3. Les données sélectionnées seront affichées dans les onglets ci-dessous</p>
            <p style="margin-top: 0.5rem;">
                Serveur démarré : <code>cd examples && php -S localhost:8000 test-comboselect.php</code>
            </p>
        </div>

        <div class="card">
            <h2 style="margin-bottom: 1.5rem; color: #111827; border-bottom: 3px solid #667eea; padding-bottom: 0.75rem;">
                Formulaire de Test
            </h2>

            <form id="testForm">
                <div class="form-group">
                    <label for="cities">
                        Sélectionner des villes
                        <span class="badge multiple">Multiple</span>
                        <span class="badge max">Max 10</span>
                        <span class="badge counter">+Counter</span>
                    </label>
                    <input type="text" id="cities" name="cities" />
                    <p class="description">
                        Tapez pour rechercher. Après 3 tags, un compteur +N s'affichera. 
                        Les doublons sont automatiquement évités.
                    </p>
                </div>

                <div class="form-group">
                    <label for="country">
                        Sélectionner un pays
                        <span class="badge single">Single</span>
                    </label>
                    <input type="text" id="country" name="country" />
                    <p class="description">Sélection simple d'un pays avec drapeau.</p>
                </div>

                <div class="form-group">
                    <label for="languages">
                        Langages de programmation
                        <span class="badge multiple">Multiple</span>
                        <span class="badge max">Max 5</span>
                        <span class="badge counter">+Counter</span>
                    </label>
                    <input type="text" id="languages" name="languages" />
                    <p class="description">Sélectionnez vos langages préférés. Après 2 tags, un compteur s'affiche.</p>
                </div>

                <div class="form-group">
                    <label for="name">Votre nom (input classique)</label>
                    <input type="text" id="name" name="name" placeholder="Entrez votre nom...">
                    <p class="description">Input HTML standard pour comparaison.</p>
                </div>

                <div class="form-group">
                    <label for="email">Email (input classique)</label>
                    <input type="text" id="email" name="email" placeholder="votre@email.com">
                </div>

                <div class="btn-group">
                    <button type="submit" class="btn-primary">
                        📤 Soumettre (AJAX)
                    </button>
                    <button type="button" class="btn-secondary" onclick="clearForm()">
                        🗑️ Vider tout
                    </button>
                    <button type="button" class="btn-secondary" onclick="getValues()">
                        👁️ Voir valeurs
                    </button>
                    <button type="button" class="btn-secondary" onclick="populateForm()">
                        ✨ Remplir exemple
                    </button>
                </div>
            </form>
        </div>

        <div class="result-container">
            <h2>📊 Résultats du Débogage</h2>
            
            <div id="status" class="status"></div>

            <div class="stats-grid" id="stats" style="display: none;">
                <div class="stat-card">
                    <div class="stat-label">Villes sélectionnées</div>
                    <div class="stat-value" id="stat-cities">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Langages sélectionnés</div>
                    <div class="stat-value" id="stat-languages">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Pays sélectionné</div>
                    <div class="stat-value" id="stat-country">Non</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Temps de réponse</div>
                    <div class="stat-value" id="stat-time">-</div>
                </div>
            </div>

            <div class="tabs">
                <button class="tab active" onclick="switchTab('response')">Réponse Serveur</button>
                <button class="tab" onclick="switchTab('values')">Valeurs JavaScript</button>
                <button class="tab" onclick="switchTab('raw')">Données POST</button>
                <button class="tab" onclick="switchTab('objects')">Objets Complets</button>
            </div>

            <div id="response-tab" class="tab-content active">
                <pre id="serverResponse" class="debug-output"></pre>
            </div>

            <div id="values-tab" class="tab-content">
                <pre id="jsValues" class="debug-output"></pre>
            </div>

            <div id="raw-tab" class="tab-content">
                <pre id="rawData" class="debug-output"></pre>
            </div>

            <div id="objects-tab" class="tab-content">
                <pre id="objectsData" class="debug-output"></pre>
            </div>
        </div>
    </div>

    <!-- Importer la vraie librairie ComboSelect depuis le build -->
    <script type="module">
        import { ComboSelect } from '/comboselect.js';

        // Données de test
        const cities = [
            { id: 1, name: 'Paris', country: 'France', population: 2161000 },
            { id: 2, name: 'Marseille', country: 'France', population: 869000 },
            { id: 3, name: 'Lyon', country: 'France', population: 516000 },
            { id: 4, name: 'Toulouse', country: 'France', population: 471000 },
            { id: 5, name: 'Nice', country: 'France', population: 341000 },
            { id: 6, name: 'Nantes', country: 'France', population: 303000 },
            { id: 7, name: 'Bordeaux', country: 'France', population: 249000 },
            { id: 8, name: 'Lille', country: 'France', population: 232000 },
            { id: 9, name: 'Rennes', country: 'France', population: 216000 },
            { id: 10, name: 'Reims', country: 'France', population: 183000 },
        ];

        const countries = [
            { code: 'FR', name: 'France', flag: '🇫🇷' },
            { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
            { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
            { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
            { code: 'IT', name: 'Italie', flag: '🇮🇹' },
            { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
            { code: 'BE', name: 'Belgique', flag: '🇧🇪' },
            { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱' },
        ];

        const languages = [
            { id: 1, name: 'JavaScript', category: 'Web', color: '#f7df1e' },
            { id: 2, name: 'TypeScript', category: 'Web', color: '#3178c6' },
            { id: 3, name: 'Python', category: 'Backend', color: '#3776ab' },
            { id: 4, name: 'PHP', category: 'Backend', color: '#777bb4' },
            { id: 5, name: 'Java', category: 'Backend', color: '#007396' },
            { id: 6, name: 'C#', category: 'Backend', color: '#239120' },
            { id: 7, name: 'Go', category: 'Backend', color: '#00add8' },
            { id: 8, name: 'Rust', category: 'Systems', color: '#000000' },
        ];

        // Initialiser ComboSelect pour les villes
        const citiesCombo = new ComboSelect('#cities', {
            dataSource: cities,
            labelSuggestion: 'name',
            valueSuggestion: 'id',
            multiple: true,
            maxItems: 10,
            incrementValueSize: 3,
            placeholder: 'Tapez pour rechercher une ville...',
            closeOnSelect: false,
            renderSuggestion: (city) => {
                return `
                    <div style="padding: 0.25rem 0;">
                        <strong>${city.name}</strong>
                        <div style="font-size: 0.875rem; color: #6b7280;">
                            ${city.country} • ${city.population.toLocaleString()} hab.
                        </div>
                    </div>
                `;
            }
        });

        // Initialiser ComboSelect pour les pays
        const countryCombo = new ComboSelect('#country', {
            dataSource: countries,
            labelSuggestion: 'name',
            valueSuggestion: 'code',
            multiple: false,
            placeholder: 'Sélectionner un pays...',
            renderSuggestion: (country) => {
                return `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">${country.flag}</span>
                        <span>${country.name}</span>
                    </div>
                `;
            },
            renderTag: (item) => {
                return `${item.original.flag} ${item.label}`;
            }
        });

        // Initialiser ComboSelect pour les langages
        const languagesCombo = new ComboSelect('#languages', {
            dataSource: languages,
            labelSuggestion: 'name',
            valueSuggestion: 'id',
            multiple: true,
            maxItems: 5,
            incrementValueSize: 2,
            placeholder: 'Sélectionner des langages...',
            closeOnSelect: false,
            renderSuggestion: (lang) => {
                return `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${lang.color};"></span>
                        <strong>${lang.name}</strong>
                        <span style="font-size: 0.875rem; color: #6b7280;">(${lang.category})</span>
                    </div>
                `;
            }
        });

        // Gestion de la soumission du formulaire
        document.getElementById('testForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const statusDiv = document.getElementById('status');
            const serverResponse = document.getElementById('serverResponse');
            const jsValues = document.getElementById('jsValues');
            const rawData = document.getElementById('rawData');
            const objectsData = document.getElementById('objectsData');
            const statsDiv = document.getElementById('stats');

            const startTime = Date.now();

            try {
                // Récupérer toutes les valeurs
                const citiesValue = citiesCombo.getValue();
                const countryValue = countryCombo.getValue();
                const languagesValue = languagesCombo.getValue();
                const nameValue = document.getElementById('name').value;
                const emailValue = document.getElementById('email').value;

                const formData = {
                    cities: citiesValue,
                    country: countryValue,
                    languages: languagesValue,
                    name: nameValue,
                    email: emailValue
                };

                // Afficher les valeurs JS (version simplifiée)
                const simplifiedData = {
                    cities: citiesValue.map(c => ({ id: c.value, name: c.label })),
                    country: countryValue.length > 0 ? { code: countryValue[0].value, name: countryValue[0].label } : null,
                    languages: languagesValue.map(l => ({ id: l.value, name: l.label })),
                    name: nameValue,
                    email: emailValue
                };
                jsValues.textContent = JSON.stringify(simplifiedData, null, 2);

                // Afficher les objets complets
                objectsData.textContent = JSON.stringify(formData, null, 2);

                // Données POST (ce qui sera envoyé)
                rawData.textContent = JSON.stringify(formData, null, 2);

                // Statut loading
                statusDiv.textContent = '⏳ Envoi en cours...';
                statusDiv.className = 'status loading';
                statusDiv.style.display = 'block';

                // Envoyer en AJAX
                const response = await fetch('test-comboselect.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                // Afficher la réponse serveur
                serverResponse.textContent = JSON.stringify(result, null, 2);

                // Mettre à jour les stats
                document.getElementById('stat-cities').textContent = citiesValue.length;
                document.getElementById('stat-languages').textContent = languagesValue.length;
                document.getElementById('stat-country').textContent = countryValue.length > 0 ? 'Oui' : 'Non';
                document.getElementById('stat-time').textContent = responseTime + 'ms';
                statsDiv.style.display = 'grid';

                // Statut de succès
                statusDiv.textContent = `✅ Données envoyées avec succès ! (${responseTime}ms)`;
                statusDiv.className = 'status success';

            } catch (error) {
                statusDiv.textContent = '❌ Erreur : ' + error.message;
                statusDiv.className = 'status error';
                serverResponse.textContent = 'Erreur: ' + error.message + '\n\n' + error.stack;
            }
        });

        // Fonctions globales
        window.clearForm = () => {
            citiesCombo.clear();
            countryCombo.clear();
            languagesCombo.clear();
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('serverResponse').textContent = '';
            document.getElementById('jsValues').textContent = '';
            document.getElementById('rawData').textContent = '';
            document.getElementById('objectsData').textContent = '';
            document.getElementById('status').style.display = 'none';
            document.getElementById('stats').style.display = 'none';
        };

        window.getValues = () => {
            const values = {
                cities: citiesCombo.getValue(),
                country: countryCombo.getValue(),
                languages: languagesCombo.getValue(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value
            };
            console.log('Current values:', values);
            alert('Voir la console (F12) pour les valeurs complètes');
        };

        window.populateForm = () => {
            // Ajouter quelques valeurs par défaut
            citiesCombo.setValue([
                { label: 'Paris', value: 1, original: cities[0] },
                { label: 'Lyon', value: 3, original: cities[2] },
                { label: 'Nice', value: 5, original: cities[4] },
                { label: 'Bordeaux', value: 7, original: cities[6] }
            ]);

            countryCombo.setValue([
                { label: 'France', value: 'FR', original: countries[0] }
            ]);

            languagesCombo.setValue([
                { label: 'JavaScript', value: 1, original: languages[0] },
                { label: 'TypeScript', value: 2, original: languages[1] },
                { label: 'Python', value: 3, original: languages[2] }
            ]);

            document.getElementById('name').value = 'Jean Dupont';
            document.getElementById('email').value = 'jean.dupont@example.com';
        };

        window.switchTab = (tabName) => {
            // Cacher tous les contenus
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Désactiver tous les onglets
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Activer l'onglet cliqué
            document.getElementById(tabName + '-tab').classList.add('active');
            event.target.classList.add('active');
        };

        console.log('✅ ComboSelect initialisé avec succès !');
        console.log('📊 Statistiques:');
        console.log('  - Villes disponibles:', cities.length);
        console.log('  - Pays disponibles:', countries.length);
        console.log('  - Langages disponibles:', languages.length);
    </script>
</body>
</html>