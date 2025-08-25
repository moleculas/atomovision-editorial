# Archivos para el Servidor

Esta carpeta contiene los archivos necesarios para configurar el servidor de archivos.

## Archivos incluidos:

1. **`.htaccess`** - Configuración para permitir CORS y optimizar el servidor

## Instrucciones:

1. Sube el archivo `.htaccess` a la raíz de tu carpeta atomovision en el servidor:
   ```
   /home/anomalia/public_html/atomovision/.htaccess
   ```

2. Este archivo permite:
   - Acceso CORS desde cualquier origen (necesario para que Next.js pueda cargar las imágenes)
   - Tipos MIME correctos para EPUBs
   - Caché optimizado para imágenes
   - Prevención de listado de directorios

## Importante:

- El archivo `.htaccess` debe estar en la carpeta `/atomovision/`, no en las subcarpetas
- Los permisos del archivo deben ser 644
- Si tienes problemas, verifica que tu hosting permite archivos .htaccess
