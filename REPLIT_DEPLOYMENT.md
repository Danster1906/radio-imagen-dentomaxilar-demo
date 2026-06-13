# Deployment en Replit

## Arquitectura recomendada

```text
Replit
-> Portal web del doctor
-> Login y llamadas a backend/API

Supabase
-> Base de datos
-> Auth
-> Storage temporal
-> Solicitudes de descarga

Computadora local Radio Imagen
-> Archivos maestros por 3 meses
-> Agente local
-> Sube archivos a Supabase solo bajo demanda
```

## Qué va en Replit

Replit debe alojar:

- `index.html`
- `styles.css`
- `app.js`
- Futuro backend/API si decidimos hacerlo en Node/Express.

Para el MVP visual actual, puede ser un Static Deployment porque es HTML/CSS/JS.

Replit documenta Static Deployments como una forma de hospedar archivos HTML, CSS y JavaScript en servidor cloud. También permite importar repositorios existentes desde GitHub.

## Qué NO va en Replit

No debe ir:

- `SUPABASE_SERVICE_ROLE_KEY`.
- Archivos pesados de estudios.
- Rutas locales de la computadora de Radio Imagen visibles al usuario.
- El agente local con acceso al disco de Radio Imagen.

## Pasos para desplegar el frontend

1. Abrir Replit.
2. Importar desde GitHub:

```text
https://github.com/Danster1906/radio-imagen-dentomaxilar-demo
```

3. Confirmar que carguen:

```text
index.html
styles.css
app.js
```

4. Probar el portal en Replit.
5. Crear un Static Deployment.

## Pasos para conectar Supabase

1. Crear proyecto Supabase.
2. Crear bucket privado:

```text
result-temp
```

3. Crear tablas:

```text
result_files
download_requests
```

4. Crear políticas de seguridad.
5. Crear endpoint seguro para que el doctor solicite descarga.
6. Configurar el agente local con `.env`.

## Flujo de descarga con Replit

```text
Doctor entra a Replit app
-> click Solicitar descarga
-> Replit/Supabase crea download_request
-> agente local ve solicitud
-> agente sube archivo a Supabase Storage
-> Supabase genera signed URL
-> doctor descarga desde Supabase
```

## Primer MVP recomendado

Fase 1:

- Replit solo como frontend publicado.
- Supabase como base de datos y storage temporal.
- Agente local corriendo manualmente en la computadora de Radio Imagen.

Fase 2:

- Agregar backend/API.
- Agregar Auth real.
- Conectar órdenes y resultados reales.

Fase 3:

- Automatizar agente local como servicio.
- Borrado automático de nube.
- Limpieza local a los 3 meses.

## Comandos útiles

Para correr el frontend local:

```bash
python3 -m http.server 8003
```

Para correr el agente local:

```bash
cd local-agent
npm install
cp .env.example .env
npm run once
npm start
```

## Decisión importante

El agente local no debe depender de Replit para acceder al disco local.

Replit vive en la nube. No puede leer directamente el disco de Radio Imagen.

Por eso el patrón correcto es:

```text
Replit crea solicitud
Agente local la procesa
Supabase entrega temporalmente
```
