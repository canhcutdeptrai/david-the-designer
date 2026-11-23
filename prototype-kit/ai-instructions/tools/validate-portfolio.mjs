import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..', '..');
const activeRoots = [
  'AGENTS.md',
  'README.md',
  'PORTFOLIO-CONTENT-GUIDE.md',
  'rule-chung.md',
  'prototypes',
  'design-system/core',
  'design-system/patterns',
  'design-system/sd-components',
  'design-system/shell'
];
const textExtensions = new Set(['.html', '.css', '.js', '.mjs', '.md', '.json']);
const forbidden = [
  ['legacy brand namespace', /\bOMEU\b/i],
  ['legacy product name', /AAM\s+Portal/i],
  ['legacy learning prototype', /\bHSK\b|tiếng\s+Trung/i],
  ['legacy domain', /\bTreasury\b|tín\s+dụng|CNPQ|fins-treasury|Vietcombank|BIDV/i]
];
const errors = [];

function walk(target) {
  const absolute = path.join(root, target);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [absolute];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(absolute, entry.name);
    return entry.isDirectory() ? walk(path.relative(root, child)) : [child];
  });
}

const files = activeRoots.flatMap(walk).filter((file) => textExtensions.has(path.extname(file)));

for (const file of files) {
  const relative = path.relative(root, file);
  const source = fs.readFileSync(file, 'utf8');
  for (const [label, pattern] of forbidden) {
    if (pattern.test(source)) errors.push(`${relative}: contains ${label}`);
  }

  if (path.extname(file) !== '.html' || !relative.startsWith('prototypes/')) continue;
  if (!/<main\b/i.test(source)) errors.push(`${relative}: missing <main>`);
  if (!/<h1\b/i.test(source) && !/data-case-study/i.test(source)) errors.push(`${relative}: missing <h1>`);

  const ids = Array.from(source.matchAll(/\bid=["']([^"']+)["']/g), (match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`${relative}: duplicate id ${[...new Set(duplicateIds)].join(', ')}`);

  const resourcePattern = /(?:href|src)=["']([^"']+)["']/g;
  for (const match of source.matchAll(resourcePattern)) {
    const resource = match[1];
    if (!resource || resource.startsWith('#') || /^(https?:|mailto:|tel:|javascript:|data:)/i.test(resource)) continue;
    const clean = resource.split('#')[0].split('?')[0];
    if (!clean) continue;
    const resolved = path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) errors.push(`${relative}: broken resource ${resource}`);
  }
}

if (fs.existsSync(path.join(root, 'prototypes', 'hsk1'))) {
  errors.push('prototypes/hsk1: legacy prototype still exists');
}

const dataFile = path.join(root, 'prototypes', 'portfolio', 'portfolio-data.js');
if (fs.existsSync(dataFile)) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(dataFile, 'utf8'), sandbox, { filename: dataFile });
  const portfolio = sandbox.window.PORTFOLIO_DATA;
  const requiredProjectFields = ['slug', 'title', 'timeframe', 'role', 'disciplines', 'summary', 'challenge', 'contributions', 'deliverables', 'outcomes', 'disclosure'];
  const allowedDisciplines = new Set(['design', 'analysis', 'ai', 'systems']);
  if (!portfolio || !Array.isArray(portfolio.projects)) {
    errors.push('prototypes/portfolio/portfolio-data.js: missing projects array');
  } else {
    const slugs = portfolio.projects.map((project) => project.slug);
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    if (duplicateSlugs.length) errors.push(`portfolio-data.js: duplicate project slug ${[...new Set(duplicateSlugs)].join(', ')}`);
    portfolio.projects.forEach((project, index) => {
      requiredProjectFields.forEach((field) => {
        if (project[field] == null || project[field] === '' || (Array.isArray(project[field]) && project[field].length === 0)) {
          errors.push(`portfolio-data.js: project ${index + 1} missing ${field}`);
        }
      });
      (project.disciplines || []).forEach((discipline) => {
        if (!allowedDisciplines.has(discipline)) errors.push(`portfolio-data.js: project ${project.slug} has unknown discipline ${discipline}`);
      });
    });
  }
}

if (errors.length) {
  console.error(`Portfolio validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Portfolio validation passed: ${files.length} active source files checked.`);

