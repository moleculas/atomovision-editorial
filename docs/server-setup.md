# Configuración del Servidor de Archivos para AtomoVisión

## Estructura de Carpetas en el Servidor

Ya has subido los archivos a:
```
/home/anomalia/public_html/atomovision/
├── libros/
│   ├── epubs/
│   │   ├── el-horizonte-perdido.epub
│   │   └── la-ciudad-de-las-sombras.epub
│   └── portadas/
│       ├── el-horizonte-perdido.jpg
│       └── la-ciudad-de-las-sombras.jpg
```

## URLs Públicas

Los archivos estarán accesibles en:
- EPUBs: `https://anomaliagravitatoria.net/atomovision/libros/epubs/[nombre-archivo].epub`
- Portadas: `https://anomaliagravitatoria.net/atomovision/libros/portadas/[nombre-archivo].jpg`

## Configuración CORS

El archivo `.htaccess` ya está creado en `/docs/server-files/.htaccess`. 
Debes subirlo a: `/home/anomalia/public_html/atomovision/.htaccess`

Este archivo permite:
- ✅ Acceso CORS desde cualquier origen
- ✅ Acceso directo a archivos EPUB y JPG/PNG
- ✅ Caché de 7 días para las imágenes
- 🚫 Prohíbe listar el contenido de directorios

## Instrucciones de Subida de Archivos

### 1. Para Nuevos Libros

Cuando agregues un libro nuevo desde el panel admin:

**Portadas:**
- Formato: JPG o PNG
- Nombre: `slug-del-libro.jpg` (usar el mismo slug que el libro)
- Subir a: `/home/anomalia/public_html/atomovision/libros/portadas/`
- Tamaño recomendado: 800x1200px

**EPUBs:**
- Formato: EPUB
- Nombre: `slug-del-libro.epub` (usar el mismo slug que el libro)
- Subir a: `/home/anomalia/public_html/atomovision/libros/epubs/`

### 2. En el Panel Admin

Al crear/editar un libro, usar estos valores:

**Para la Portada:**
- Campo "URL de Portada": `nombre-archivo.jpg` (solo el nombre, no la URL completa)

**Para el EPUB:**
- Campo "Archivo EPUB": `nombre-archivo.epub` (solo el nombre, no la URL completa)

El sistema automáticamente construirá las URLs completas.

## Verificación

Para verificar que todo funciona:

1. **Probar acceso directo a una portada:**
   ```
   https://anomaliagravitatoria.net/atomovision/libros/portadas/el-horizonte-perdido.jpg
   ```

2. **Probar descarga de EPUB:**
   ```
   https://anomaliagravitatoria.net/atomovision/libros/epubs/el-horizonte-perdido.epub
   ```

3. **Verificar headers CORS:**
   En las herramientas de desarrollo del navegador, en Network, deberías ver:
   ```
   Access-Control-Allow-Origin: *
   ```

## Seguridad

- Los archivos son públicos (cualquiera con la URL puede acceder)
- No se puede listar el contenido de los directorios
- Los EPUBs se descargan tras compra validada por el sistema

## Mantenimiento

### Backup
Recomendamos hacer backup regular de:
- `/home/anomalia/public_html/atomovision/libros/`

### Logs
Si necesitas verificar accesos, revisa los logs de Apache de tu hosting.

## Troubleshooting

**Problema: Las imágenes no se muestran**
- Verificar que el archivo existe en el servidor
- Comprobar que el nombre en la BD coincide exactamente
- Revisar permisos del archivo (debe ser 644)

**Problema: CORS bloqueado**
- Asegurarse de que el .htaccess está en `/atomovision/`
- Verificar que el servidor permite archivos .htaccess
- Comprobar en Network que aparece el header CORS

**Problema: EPUBs no se descargan**
- Verificar que el tipo MIME está configurado correctamente
- Comprobar el tamaño del archivo (límites del hosting)
