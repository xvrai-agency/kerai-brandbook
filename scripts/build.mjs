import { readFile, writeFile, mkdir, rm, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = resolve(root, 'KERAI-Brandbook-v2.1.html');
let html;
try {
  html = await readFile(source);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  throw new Error('Falta KERAI-Brandbook-v2.1.html en la raiz del repositorio. Sube el HTML entregado antes de desplegar. No se generara un sitio vacio.');
}
const text = html.toString('utf8');
for (const marker of ['lang="es"', 'window.KERAI_DATA', 'noindex', 'https://use.typekit.net/yqf6rur.css']) {
  if (!text.includes(marker)) throw new Error(`Contenido inesperado: falta ${marker}`);
}
if (html.length > 25 * 1024 * 1024) throw new Error('El HTML supera el limite configurado de 25 MiB.');

const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const page = text
  .replace('</head>', '  <link rel="stylesheet" href="/brandbook-refinements.css">\n</head>')
  .replace('</body>', '  <script src="/brandbook-refinements.js"></script>\n</body>');
if (page === text) throw new Error('No s’han pogut inserir els ajustos del brandbook.');
await writeFile(resolve(dist, 'index.html'), page, 'utf8');
for (const name of ['404.html', '_headers', 'robots.txt', 'brandbook-refinements.css', 'brandbook-refinements.js']) {
  await copyFile(resolve(root, 'static', name), resolve(dist, name));
}
console.log(`Fuente original conservada: ${html.length} bytes.`);
console.log(`SHA-256 de origen: ${createHash('sha256').update(html).digest('hex')}`);
console.log('Ajustos de marca, interacción y fotografías insertados en dist/.');

