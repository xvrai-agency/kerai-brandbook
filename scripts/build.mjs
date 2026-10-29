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

const typekitFile = resolve(root, 'static/kerai-typekit-integration.txt');
const typekitIntegration = (await readFile(typekitFile, 'utf8')).trim();
const [typekitHeadCode, typekitCssCode] = typekitIntegration.split(/\r?\n\s*\r?\n/);
if (!typekitHeadCode?.includes('use.typekit.net/yqf6rur.css') || !typekitCssCode?.includes('abacaxi-latin-variable')) {
  throw new Error('El fragmento de integración de Typekit no contiene el kit y la familia tipográfica de KERAI.');
}

const bibliographyPattern = /<div class="source-documents"><h3>Base documental<\/h3>[\s\S]*?<\/div>/g;
const bibliographyMarker = '<div class="source-documents"><h3>Base documental</h3>';
const resourceMarkerIndex = text.indexOf(bibliographyMarker);
if (resourceMarkerIndex < 0 || text.indexOf(bibliographyMarker, resourceMarkerIndex + bibliographyMarker.length) >= 0) {
  throw new Error('No se encontró una única ubicación para el recurso de tipografía web.');
}
const typekitResourceRow = '<div class="download-row font-resource-row"><div><h3>Cosi Azure Bold · nombre y producto</h3><p>Versión modificada para el nombre de marca; fuente original para los nombres de producto en web.</p></div><a class="text-action" href="/CosiAzureBold.zip" download>Descargar fuente ZIP <svg aria-hidden="true" class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.45" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"></path></svg></a></div><div class="download-row typekit-resource-row"><div><h3>Tipografía web · Abacaxi</h3><p>Código de integración de Adobe Fonts / Typekit para proyectos web.</p></div><a class="text-action" href="/kerai-typekit-integration.txt" download>Descargar código TXT <svg aria-hidden="true" class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.45" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"></path></svg></a></div>';
const textWithResource = text.slice(0, resourceMarkerIndex) + typekitResourceRow + text.slice(resourceMarkerIndex);
const bibliographyMatches = textWithResource.match(bibliographyPattern) ?? [];
if (bibliographyMatches.length !== 1) {
  throw new Error(`Se esperaba una única sección final Base documental; encontradas: ${bibliographyMatches.length}.`);
}
let publishableText = textWithResource.replace(bibliographyPattern, '');

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const typographyStandards = `<section class="type-standards" aria-labelledby="type-standards-title"><div class="type-standards-intro"><span class="eyebrow">Norma de uso · catálogo KERAI</span><h3 id="type-standards-title">La ligereza lleva la jerarquía.</h3></div><div class="type-weight-grid"><article class="type-weight-card type-weight-light"><div class="type-weight-label"><span>Titulares y descriptores</span><strong>300 · Light</strong></div><p class="type-weight-sample">El aplique cilíndrico de pared.</p><p class="type-weight-note">Peso preferente para titulares editoriales, mensajes de marca y descriptores de producto.</p></article><article class="type-weight-card"><div class="type-weight-label"><span>Texto de lectura</span><strong>400 · Regular</strong></div><p class="type-weight-sample type-weight-body">Aplique de pared de superficie, 39 mm × 40 mm. 8 W con CRI &gt;90.</p><p class="type-weight-note">Para párrafos, descripciones y explicaciones técnicas. Mantén una lectura cómoda en tamaños pequeños.</p></article><article class="type-weight-card"><div class="type-weight-label"><span>Datos y microtexto</span><strong>500 · Medium</strong></div><p class="type-weight-sample type-weight-data">W39 · 8 W · CRI &gt;90</p><p class="type-weight-note">Para etiquetas, navegación, acciones y encabezados de tablas. Reserva 600 para énfasis breve.</p></article></div><p class="type-weight-footnote">El logotipo KERAI parte de Cosi Azure Bold con un dibujo de letras modificado. En la web, usa Cosi Azure Bold para los nombres de producto; reserva Abacaxi para titulares editoriales, descripciones y datos.</p></section>`;
const typekitGuide = `<div class="typekit-guide" aria-labelledby="typekit-guide-title"><div class="typekit-guide-heading"><div><span class="eyebrow">Integración web · Adobe Fonts / Typekit</span><h3 id="typekit-guide-title">Usar Abacaxi en proyectos web</h3></div></div><p>Añade el kit una vez dentro de <code>&lt;head&gt;</code> y aplica la familia desde tu CSS.</p><div class="typekit-code-grid"><section class="typekit-code-card"><div class="typekit-code-heading"><span class="eyebrow">HTML · dentro de &lt;head&gt;</span><button class="copy-button" data-copy="kerai-typekit-head">Copiar</button></div><pre><code id="kerai-typekit-head">${escapeHtml(typekitHeadCode)}</code></pre></section><section class="typekit-code-card"><div class="typekit-code-heading"><span class="eyebrow">CSS · aplicar Abacaxi</span><button class="copy-button" data-copy="kerai-typekit-css">Copiar</button></div><pre><code id="kerai-typekit-css">${escapeHtml(typekitCssCode)}</code></pre></section></div><p class="typekit-license-note">Para sitios de terceros, utiliza el proyecto de Adobe Fonts de su titular.</p></div>`;
const typeSectionMarker = '</div>\n</div>\n<a class="next-chapter" href="#universo"';
const typeSectionMarkerIndex = publishableText.indexOf(typeSectionMarker);
if (typeSectionMarkerIndex < 0 || publishableText.indexOf(typeSectionMarker, typeSectionMarkerIndex + typeSectionMarker.length) >= 0) {
  throw new Error('No se encontró una única ubicación para el bloque de integración tipográfica.');
}
publishableText = publishableText.slice(0, typeSectionMarkerIndex) + `</div>\n${typographyStandards}\n${typekitGuide}\n</div>\n<a class="next-chapter" href="#universo"` + publishableText.slice(typeSectionMarkerIndex + typeSectionMarker.length);

const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const page = publishableText
  .replace('</head>', '  <link rel="stylesheet" href="/brandbook-refinements.css">\n</head>')
  .replace('</body>', '  <script src="/brandbook-refinements.js"></script>\n</body>');
if (page === publishableText) throw new Error('No s’han pogut inserir els ajustos del brandbook.');
await writeFile(resolve(dist, 'index.html'), page, 'utf8');
for (const name of ['404.html', '_headers', 'robots.txt', 'brandbook-refinements.css', 'brandbook-refinements.js', 'kerai-typekit-integration.txt', 'CosiAzureBold.zip']) {
  await copyFile(resolve(root, 'static', name), resolve(dist, name));
}
console.log(`Fuente original conservada: ${html.length} bytes.`);
console.log(`SHA-256 de origen: ${createHash('sha256').update(html).digest('hex')}`);
console.log('Ajustos de marca, interacción y fotografías insertados en dist/.');
console.log('Se omitió la lista final Base documental: no enlazaba a los documentos descargables.');
console.log('La norma de pesos, los recursos Abacaxi / Typekit y la fuente Cosi Azure Bold se incluyen en Tipografía y Recursos.');

