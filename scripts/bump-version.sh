#!/bin/bash

# Script pour créer une nouvelle version de @n-ramos/comboselect

if [ -z "$1" ]; then
  echo "Usage: ./scripts/bump-version.sh [patch|minor|major]"
  echo ""
  echo "Exemples:"
  echo "  ./scripts/bump-version.sh patch  # 0.1.0 -> 0.1.1"
  echo "  ./scripts/bump-version.sh minor  # 0.1.0 -> 0.2.0"
  echo "  ./scripts/bump-version.sh major  # 0.1.0 -> 1.0.0"
  exit 1
fi

VERSION_TYPE=$1

# Vérifier qu'on est sur main
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "❌ Erreur: Vous devez être sur la branche main"
  exit 1
fi

# Vérifier qu'il n'y a pas de changements non commités
if [[ -n $(git status -s) ]]; then
  echo "❌ Erreur: Vous avez des changements non commités"
  git status -s
  exit 1
fi

# Pull les derniers changements
echo "🔄 Pull des derniers changements..."
git pull origin main

echo "📦 Bump de version: $VERSION_TYPE"

# Bump version dans package.json
npm version $VERSION_TYPE -m "chore: release v%s"

# Récupérer la nouvelle version
NEW_VERSION=$(node -p "require('./package.json').version")

echo ""
echo "✅ Nouvelle version: v$NEW_VERSION"
echo "✅ Package: @n-ramos/comboselect@$NEW_VERSION"
echo ""
echo "🚀 Pour publier, exécutez:"
echo "   git push origin main --follow-tags"
echo ""
echo "📦 La GitHub Action va automatiquement:"
echo "   - Tester le code"
echo "   - Builder le projet"
echo "   - Publier sur npm: @n-ramos/comboselect@$NEW_VERSION"
echo "   - Créer une GitHub Release"
```

## 5. .npmrc (optionnel mais recommandé)
```
@n-ramos:registry=https://registry.npmjs.org/
access=public