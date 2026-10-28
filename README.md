# kerai-brandbook
Kerai Brandbook Provisional

## Estado

Configuracion de Cloudflare Workers preparada. Falta incorporar el archivo `KERAI-Brandbook-v2.1.html` a la raiz del repositorio. El build se detiene si falta el brandbook: no publica una pagina vacia.

No hay un despliegue ni una conexion automatica a Cloudflare confirmados.

## Incorporar el brandbook

En GitHub, abre **Add file > Upload files**, sube el archivo `KERAI-Brandbook-v2.1.html` entregado y confirma el commit en `main`.

El HTML contiene las imagenes, logotipos, estilos, interacciones y descargas. No hay que subir los PDF originales ni archivos de fuentes. El build copia el HTML sin modificarlo.

## Cloudflare Workers Builds

Conectar el repositorio `xvrai-agency/kerai-brandbook`:

- Worker: `kerai-brandbook`.
- Rama: `main`.
- Directorio raiz: `/`.
- Build command: `npm run build`.
- Deploy command: `npx wrangler deploy`.
- Assets: `dist/`, ya indicado en `wrangler.jsonc`.

No hace falta cambiar WordPress, DNS ni kerai.es. La conexion a Workers Builds debe completarse en el panel de Cloudflare antes de que los commits activen despliegues automaticos.

## Comprobacion local

Requiere Node.js 22 o superior. No hay dependencias de build.

```sh
npm run build
```

La salida es `dist/`: `index.html`, `404.html`, `_headers` y `robots.txt`. Publicar solo `dist/`, no la raiz del repositorio.

## Tipografia y acceso

Abacaxi se carga desde el proyecto Adobe Fonts autorizado por KERAI: `https://use.typekit.net/yqf6rur.css`. La carga del contenido no espera a la fuente. No se distribuyen archivos tipograficos.

Se conservan `noindex, nofollow`. Esto no protege el acceso ni vuelve privado un repositorio publico. No se ha configurado Cloudflare Access ni analitica.

## Referencia del archivo entregado

- Version: 2.1.
- Tamano: 6757176 bytes.
- SHA-256: `980f09fac52e3dd0946067921aee6d26bdbbe976b3ed2502f58d16ce04fbdd75`.

Este hash identifica la entrega original. Las futuras ediciones pueden tener otro hash.

## Documentacion

- https://developers.cloudflare.com/workers/static-assets/get-started/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
