# adoc-draft-orders-sales

Este proyecto está creado con Vue 3 + Typescript en Vite con el framework visual Vuetify.

## Soporte de Tipos para importaciones de `.vue` en TypeScript

TypeScript no puede manejar la información de tipos para importaciones de archivos `.vue` de manera predeterminada, por lo que reemplazamos la CLI de `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje de Typescript reconozca los tipos de archivos `.vue`.

## Configuración del Proyecto

```sh
npm install
```

### Compilación y Hot-Reload para Desarrollo

```sh
npm run dev
```

### Verificación de Tipos, Compilación y Minificación para Producción

```sh
npm run build
```

### Es necesario crear un archivo `.env` para poder hacer funcionar el proyecto con estas variables
```
MODE=
VITE_API_BASE_URL=
VITE_APP_NAME=Shopify - Draft Orders
```
