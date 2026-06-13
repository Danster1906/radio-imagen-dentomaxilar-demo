# Radio Imagen Dentomaxilar - Portal de doctores

Interfaz inicial para que doctores generen órdenes digitales y Radio Imagen/Radiodiagnóstico pueda darles seguimiento operativo.

- Panel del doctor.
- Captura de orden digital.
- Seleccion de estudios.
- Consulta de resultados.
- Perfil profesional del doctor.
- Login con correo o Google simulado.
- Vista futura para agenda, finanzas y KPIs como servicio aparte.

## Documentación

- `PDR_RADIO_IMAGEN.md`: definición funcional del producto.
- `PDR_CAMBIOS.md`: registro de cambios de producto.
- `LOGICA_INFORMACION.md`: lógica de datos, permisos y seguimiento.
- `LOGICA_PUNTOS_SOCIOS.md`: reglas de puntos, niveles, cashback y auditoría del programa de socios.
- `CONFIG_SUPABASE_STORAGE_TEMPORAL.md`: configuración propuesta para usar Supabase como almacenamiento temporal bajo demanda.
- `REPLIT_DEPLOYMENT.md`: guía para publicar el portal en Replit y conectarlo con Supabase/agente local.
- `DATA_MODEL.md`: estructura escalable de base de datos.
- `database/`: base SQLite demo, esquema, datos semilla y consultas de prueba.
- `local-agent/`: agente local Node.js para subir resultados a Supabase bajo demanda.

## Uso local

Abre `index.html` en el navegador.

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

Puedes subir estos archivos a un Repl estatico de HTML/CSS/JS. No requiere instalacion de dependencias ni backend para probar el flujo visual.
