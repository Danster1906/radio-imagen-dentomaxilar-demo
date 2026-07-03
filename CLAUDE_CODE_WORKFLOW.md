# Integracion de Claude Code con Codex

## Objetivo

Usar Claude Code y Codex sobre el mismo proyecto sin perder control de cambios, mezclas accidentales o decisiones de producto.

## Regla principal

Codex y Claude Code no deben editar los mismos archivos al mismo tiempo. La integracion mas estable es por GitHub:

1. Codex trabaja en esta carpeta local y documenta cambios en `PDR_CAMBIOS.md`.
2. Claude Code trabaja desde la terminal en una rama separada.
3. Cada cambio se sube como commit o pull request.
4. El otro agente revisa, prueba y continua desde la rama actualizada.

## Instalacion base de Claude Code

Requisitos:

- Node.js 18 o superior.
- Cuenta de Anthropic o acceso a Claude.
- Este repositorio clonado localmente.

Comando recomendado por la documentacion oficial:

```bash
npm install -g @anthropic-ai/claude-code
```

Para actualizar:

```bash
npm install -g @anthropic-ai/claude-code@latest
```

Evitar `sudo npm install -g` para no crear problemas de permisos.

## Flujo recomendado

### 1. Rama por agente

Para Claude Code:

```bash
git checkout -b claude/feature-nombre
```

Para Codex:

```bash
git checkout -b codex/feature-nombre
```

### 2. Prompt para Claude Code

```text
Lee README.md, DOCUMENTO_MAESTRO.md, DATA_MODEL.md, LOGICA_INFORMACION.md,
LOGICA_PUNTOS_SOCIOS.md y PDR_CAMBIOS.md.

Objetivo: hacer solamente el cambio solicitado sin modificar archivos no relacionados.
Despues de cambiar, actualiza PDR_CAMBIOS.md con fecha, alcance, archivos modificados
y riesgos pendientes.
```

### 3. Revision cruzada

Cuando Claude Code termine:

```bash
git status
git diff
git commit -m "Describe el cambio"
git push origin claude/feature-nombre
```

Luego se le puede pedir a Codex:

```text
Revisa la rama claude/feature-nombre. Verifica bugs, riesgos y si el cambio respeta
la logica del producto. No reescribas el estilo visual salvo que sea necesario.
```

## Roles sugeridos

Codex:

- Producto, UX, estructura visual y documentacion.
- Revision de consistencia.
- Preparacion para Replit y GitHub.

Claude Code:

- Cambios puntuales en codigo.
- Refactors controlados.
- Automatizaciones o scripts.
- Pruebas desde terminal.

## Para este proyecto

Archivos que deben leerse antes de tocar la logica:

- `DOCUMENTO_MAESTRO.md`
- `DATA_MODEL.md`
- `LOGICA_INFORMACION.md`
- `LOGICA_PUNTOS_SOCIOS.md`
- `CONFIG_SUPABASE_STORAGE_TEMPORAL.md`
- `REPLIT_DEPLOYMENT.md`
- `PDR_CAMBIOS.md`

## Deployment en Replit

Claude Code no sustituye Replit. El flujo recomendado es:

1. Subir cambios a GitHub.
2. Importar o sincronizar el repositorio en Replit.
3. Configurar variables de entorno en Replit.
4. Usar Codex o Claude Code para revisar errores antes de publicar.

