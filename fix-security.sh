#!/bin/bash
# Script para limpiar archivos con credenciales

echo "🔧 Limpiando archivos con credenciales..."

# Eliminar el archivo problemático del staging area
git rm --cached .env.production.example 2>/dev/null || true

# Añadir .gitignore actualizado
git add .gitignore

# Añadir el .env.example seguro
git add .env.example

# Hacer commit
git commit -m "fix: Eliminar archivo con formato de credenciales y actualizar .gitignore"

echo "✅ Archivos corregidos. Ahora puedes hacer:"
echo "   git push origin main"
