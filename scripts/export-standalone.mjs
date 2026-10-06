import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
let html = await readFile(resolve(dist, 'index.html'), 'utf8');
const script = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const style = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (!script || !style) throw new Error('Expected a single bundled script and stylesheet.');
const scriptText = await readFile(resolve(dist, script[1].replace(/^\//, '')), 'utf8');
const styleText = await readFile(resolve(dist, style[1].replace(/^\//, '')), 'utf8');
const icon = await readFile(resolve(root, 'public/favicon.svg'));
html = html.replace(script[0], () => `<script type="module">${scriptText.replace(/<\/script/gi, '<\\/script')}</script>`);
html = html.replace(style[0], () => `<style>${styleText}</style>`);
html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml;base64,${icon.toString('base64')}"`);
const output = resolve(dist, 'gyeol-consult.html');
await writeFile(output, html);
console.log(`Standalone consultation app: ${output} (${Buffer.byteLength(html).toLocaleString()} bytes)`);
