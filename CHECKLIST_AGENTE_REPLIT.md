# Checklist para el agente de Claude en la Shell de Replit

> Instrucciones para un agente de Claude (o una persona) que acaba de abrir la
> Shell de Replit y necesita dejar el portal actualizado, verificado y publicado.
> Seguir en orden. Si un paso falla, detenerse y reportar el error exacto en
> lugar de improvisar arreglos sobre producción.

## Contexto mínimo

- App: portal de órdenes de Radio Imagen Dentomaxilar (Node.js sin framework).
- Rama de producción: `main`. El deployment de Replit sirve lo que está en el Repl.
- Base de datos: PostgreSQL de Replit (variable `DATABASE_URL`).
- Archivos de resultados: Object Storage de Replit (bucket en `.replit`).
- Escala esperada: ~20 doctores, ~200 órdenes. No hay problemas de volumen.

## Paso 1. Traer el código más reciente

```bash
git fetch origin
git status
```

- Si `git status` muestra archivos modificados que nadie reconoce, NO hacer
  checkout ni pull destructivo: reportarlos primero.
- Si está limpio:

```bash
git checkout main
git pull origin main
npm install
```

**Esperado**: `Already up to date` o una lista corta de cambios; `npm install`
termina sin errores rojos.

## Paso 2. Verificar los Secrets (variables de entorno)

Revisar en la herramienta Secrets de Replit (o con `env | grep -E 'DATABASE_URL|ADMIN_TOKEN|SMTP|PORTAL_URL'`) que existan:

| Variable | Obligatoria | Notas |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Sin ella la app no arranca |
| `ADMIN_TOKEN` | Sí (recomendada) | Frase larga fija; si falta, el admin se desloguea en cada reinicio |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | No | Solo para correos de aviso de resultados |
| `PORTAL_URL` | No | URL pública del portal, se usa en los correos |

Si falta `ADMIN_TOKEN`: crearlo en Secrets con una frase aleatoria larga y
avisar que se creó.

## Paso 3. Arrancar y revisar los logs

```bash
npm start
```

**Esperado en los logs**:
- `Radio Imagen portal disponible en http://localhost:5000`
- Ningún error de conexión a PostgreSQL.
- Si la base estaba vacía: una línea de siembra desde `data/*.json`.

**Señales de alarma** (reportar, no ignorar):
- `No se pudo inicializar la base de datos PostgreSQL` → revisar `DATABASE_URL`.
- Errores repetidos de `Conexión inactiva de PostgreSQL cerrada` en ráfaga
  continua (uno ocasional es normal y esperado).

## Paso 4. Pruebas funcionales mínimas (smoke test)

Abrir el preview del Repl y probar EN ESTE ORDEN:

1. **Login admin**: entra, ve el panel Admin con las 4 pestañas.
2. **Alta doctor de prueba** (si no existe): pestaña Doctores → Registro rápido.
   Usar correo tipo `prueba+fecha@test.com` para poder borrarlo después.
3. **Login doctor** (en otra ventana o incógnito): entra con esa cuenta.
4. **Crear orden** como doctor: paciente de prueba, un estudio. Verificar que
   aparece en su Panel y en Resultados como "Recibida".
5. **Aislamiento**: el doctor solo ve SUS órdenes (comparar contra el admin).
6. **Cambiar estado** como admin: Recibida → Agendada → Completa. Verificar que
   al marcar Completa suben los puntos del doctor (+100).
7. **Subir resultado** como admin (un PDF pequeño de prueba) y verificar que la
   orden pasa a "Lista para descargar".
8. **Descargar** como doctor y verificar que tras la descarga el archivo ya no
   está disponible (descarga única) y ofrece "Solicitar reenvío".
9. **Foto de perfil**: subirla como doctor, recargar la página y confirmar que
   sigue ahí (persistencia en base).
10. **Limpieza**: cancelar/eliminar la orden de prueba y el doctor de prueba.

Con consola del navegador abierta (F12): no debe haber errores rojos.

## Paso 5. Publicar (deployment)

Si todo lo anterior pasó:

1. Ir a la pestaña **Deployments** de Replit.
2. El deployment debe ser tipo **Autoscale** con comando `npm start`.
3. Clic en **Redeploy** para publicar la versión recién bajada de `main`.
4. Al terminar, abrir la **URL pública** (`https://<nombre>.replit.app`) y
   repetir al menos: login admin + login doctor + ver órdenes.

## Paso 6. Reportar

Entregar un resumen con:
- Commit desplegado (`git log -1 --oneline`).
- Resultado de cada punto del smoke test (✓ / ✗ con el error textual).
- Cualquier Secret que se haya creado o falte.
- La URL pública verificada.

## Reglas de seguridad para el agente

- NUNCA correr `pg_restore`, `DROP`, `DELETE` masivos ni ediciones directas de
  la base en producción sin instrucción explícita de Daniel.
- NUNCA imprimir en el chat el valor de `DATABASE_URL`, `ADMIN_TOKEN` ni `SMTP_PASS`.
- No instalar dependencias nuevas ni cambiar `.replit` salvo que el arranque
  falle y el arreglo sea evidente y mínimo (y reportarlo).
- Los datos de producción son reales: usar siempre cuentas y órdenes de prueba
  identificables (`prueba+...@test.com`) y limpiarlas al final.
