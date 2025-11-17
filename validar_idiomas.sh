#!/bin/bash

# Script de validación de idiomas para VoiceScribe Extension
# Verifica que todos los idiomas estén correctamente configurados

echo "🔍 Validando idiomas de VoiceScribe Extension..."
echo ""

# Contar idiomas
TOTAL_IDIOMAS=$(ls -1 _locales/ | wc -l | tr -d ' ')
echo "📊 Total de idiomas: $TOTAL_IDIOMAS"
echo ""

# Verificar que todos tienen 75 claves
echo "✅ Verificando número de claves por idioma:"
IDIOMAS_CORRECTOS=0
IDIOMAS_INCORRECTOS=0

for dir in _locales/*/; do
    IDIOMA=$(basename "$dir")
    CLAVES=$(cat "$dir/messages.json" | grep -c '"message"')
    
    if [ "$CLAVES" -eq 75 ]; then
        IDIOMAS_CORRECTOS=$((IDIOMAS_CORRECTOS + 1))
    else
        echo "  ⚠️  $IDIOMA: $CLAVES claves (esperado: 75)"
        IDIOMAS_INCORRECTOS=$((IDIOMAS_INCORRECTOS + 1))
    fi
done

echo "  ✅ Idiomas con 75 claves: $IDIOMAS_CORRECTOS"
if [ "$IDIOMAS_INCORRECTOS" -gt 0 ]; then
    echo "  ❌ Idiomas con claves incorrectas: $IDIOMAS_INCORRECTOS"
fi
echo ""

# Validar JSON
echo "🔧 Validando sintaxis JSON:"
JSON_VALIDOS=0
JSON_INVALIDOS=0

for dir in _locales/*/; do
    IDIOMA=$(basename "$dir")
    if python3 -m json.tool "$dir/messages.json" > /dev/null 2>&1; then
        JSON_VALIDOS=$((JSON_VALIDOS + 1))
    else
        echo "  ❌ $IDIOMA: JSON inválido"
        JSON_INVALIDOS=$((JSON_INVALIDOS + 1))
    fi
done

echo "  ✅ JSON válidos: $JSON_VALIDOS"
if [ "$JSON_INVALIDOS" -gt 0 ]; then
    echo "  ❌ JSON inválidos: $JSON_INVALIDOS"
fi
echo ""

# Verificar claves requeridas
echo "🔑 Verificando claves críticas:"
CLAVES_CRITICAS=("extName" "extDescription" "sectionRating" "rateUsTitle" "voiceLanguageLabel")
FALTANTES=0

for dir in _locales/*/; do
    IDIOMA=$(basename "$dir")
    for CLAVE in "${CLAVES_CRITICAS[@]}"; do
        if ! grep -q "\"$CLAVE\"" "$dir/messages.json"; then
            echo "  ⚠️  $IDIOMA: Falta clave '$CLAVE'"
            FALTANTES=$((FALTANTES + 1))
        fi
    done
done

if [ "$FALTANTES" -eq 0 ]; then
    echo "  ✅ Todas las claves críticas presentes en todos los idiomas"
else
    echo "  ⚠️  Se encontraron $FALTANTES claves faltantes"
fi
echo ""

# Verificar manifest.json
echo "📄 Verificando manifest.json:"
if grep -q "default_locale" manifest.json; then
    DEFAULT_LOCALE=$(grep "default_locale" manifest.json | cut -d'"' -f4)
    echo "  ✅ default_locale configurado: '$DEFAULT_LOCALE'"
    
    if [ -d "_locales/$DEFAULT_LOCALE" ]; then
        echo "  ✅ Carpeta del idioma por defecto existe"
    else
        echo "  ❌ Carpeta del idioma por defecto NO existe"
    fi
else
    echo "  ❌ default_locale NO configurado en manifest.json"
fi
echo ""

# Listar todos los idiomas
echo "📋 Lista de idiomas disponibles:"
ls -1 _locales/ | sort | awk '{printf "  %s", $0; if (NR % 7 == 0) printf "\n"} END {printf "\n"}'
echo ""

# Resumen final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN FINAL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  📦 Total de idiomas: $TOTAL_IDIOMAS"
echo "  ✅ Idiomas correctos: $IDIOMAS_CORRECTOS"
echo "  🔧 JSON válidos: $JSON_VALIDOS"

if [ "$IDIOMAS_CORRECTOS" -eq "$TOTAL_IDIOMAS" ] && [ "$JSON_INVALIDOS" -eq 0 ] && [ "$FALTANTES" -eq 0 ]; then
    echo ""
    echo "  🎉 ¡VALIDACIÓN EXITOSA!"
    echo "  ✨ La extensión está lista para Chrome Web Store"
    echo ""
    exit 0
else
    echo ""
    echo "  ⚠️  Se encontraron problemas"
    echo "  🔧 Revisa los errores arriba"
    echo ""
    exit 1
fi