# Radio Imagen Dentomaxilar

Plataforma para digitalizar el flujo de órdenes radiológicas dentales de Radio Imagen Dentomaxilar.

El proyecto se separa en dos superficies:

- Sitio público: landing institucional premium para Neubox con servicios, sucursales, contacto y acceso al portal.
- Portal privado: herramienta operativa para doctores y admin en Replit + Supabase.

El portal usa acceso privado por correo y contraseña asignados por Radio Imagen. No usa Google login.

- Panel del doctor.
- Captura de orden digital.
- Seleccion de estudios.
- Consulta de resultados.
- Perfil profesional del doctor.
- Login real con Supabase Auth.
- Vista admin para alta de doctores, seguimiento de órdenes, validación de pacientes y resultados.
- Vista futura para agenda, finanzas y KPIs como servicio aparte.

## Documentación

- `PDR_RADIO_IMAGEN.md`: definición funcional del producto.
- `PDR_CAMBIOS.md`: registro de cambios de producto.
- `LOGICA_INFORMACION.md`: lógica de datos, permisos y seguimiento.
- `LOGICA_PUNTOS_SOCIOS.md`: reglas de puntos, niveles, cashback y auditoría del programa de socios.
- `CONFIG_SUPABASE_STORAGE_TEMPORAL.md`: configuración propuesta para usar Supabase como almacenamiento temporal bajo demanda.
- `REPLIT_DEPLOYMENT.md`: guía para publicar el portal en Replit y conectarlo con Supabase/agente local.
- `DEPLOY_OPERATIVO_DOCTORES.md`: ruta concreta para publicar el portal e iniciar operación real con doctores.
- `DATA_MODEL.md`: estructura escalable de base de datos.
- `database/`: base SQLite demo, esquema, datos semilla y consultas de prueba.
- `local-agent/`: agente local Node.js para subir resultados a Supabase bajo demanda.

## Uso local

Ejecuta el servidor estático local:

```bash
npm start
```

Luego abre:

- `http://localhost:8003/index.html` para el sitio público.
- `http://localhost:8003/portal.html` para el portal operativo.

## Base de datos demo

Reconstruir la base:

```bash
rm -f database/radio_imagen_demo.sqlite
sqlite3 database/radio_imagen_demo.sqlite < database/schema.sql
sqlite3 database/radio_imagen_demo.sqlite < database/seed.sql
```

Ejecutar reportes demo:

```bash
sqlite3 database/radio_imagen_demo.sqlite < database/demo_queries.sql
```

## Uso en Replit

Importa el repositorio desde GitHub y ejecuta:

```bash
npm start
```

Replit debe alojar el portal operativo conectado a Supabase. Las llaves privadas y archivos maestros de estudios no deben subirse a Replit ni a Neubox.
