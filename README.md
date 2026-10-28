# KERAI Brandbook

Edición digital del brandbook KERAI v2.1, publicada en Cloudflare Workers.

## Producción

- Repositorio: `xvrai-agency/kerai-brandbook`.
- Rama de producción: `main`.
- Worker: `kerai-brandbook`.
- Dominio principal: `https://keraibrandbook.xvrai.agency/`.
- URL alternativa: `https://kerai-brandbook.hola-f45.workers.dev/`.
- Los commits de `main` activan Cloudflare Workers Builds.

No se cambia WordPress ni el DNS de `kerai.es`.

## Build

Requiere Node.js 22 o superior. No hay dependencias de build.

```sh
npm run build
```

La salida es `dist/`, con `index.html`, `404.html`, `_headers`, `robots.txt` y los dos recursos `brandbook-refinements.*`. El HTML fuente original se conserva; el build inserta las mejoras visuales e interactivas en la copia publicada.

## Ajustes visuales e interacción

- La portada usa un peso tipográfico más ligero y mantiene el titular en un solo color.
- En la propuesta de valor, cada concepto resalta junto a su frase correspondiente al pasar el cursor, enfocar con teclado o tocarlo. El mapa conserva el mismo acento ámbar en ambas partes.
- La sección de materiales incorpora fotografías de cobre natural, bronce y aluminio natural de [kerai.es/acabados](https://kerai.es/acabados/). Se cargan desde las URLs públicas de `kerai.es`.

La tipografía Abacaxi se sirve desde el proyecto Adobe Fonts autorizado por KERAI: `https://use.typekit.net/yqf6rur.css`. Si Adobe Fonts no está disponible, el contenido se presenta con fuentes de reserva.

## Indexación y acceso

Se conservan las etiquetas `noindex, nofollow`. Esto evita la indexación; no protege el acceso ni vuelve privado el repositorio público. No se ha configurado Cloudflare Access ni analítica.

## Fuente

- Archivo: `KERAI-Brandbook-v2.1.html`.
- Tamaño original: 6.757.176 bytes.
- SHA-256 original: `980f09fac52e3dd0946067921aee6d26bdbbe976b3ed2502f58d16ce04fbdd75`.
