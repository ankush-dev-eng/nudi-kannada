const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk(path.resolve(__dirname, '../src'));
let issues = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /(?:import|from)\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const resolvedBase = path.resolve(path.dirname(file), importPath);
      const possibleExtensions = ['', '.ts', '.tsx', '.d.ts', '.css', '/index.ts', '/index.tsx', '.json'];
      let found = false;
      for (const ext of possibleExtensions) {
        const fullCandidate = resolvedBase + ext;
        if (fs.existsSync(fullCandidate)) {
          const dir = path.dirname(fullCandidate);
          const base = path.basename(fullCandidate);
          const actualFiles = fs.readdirSync(dir);
          const exact = actualFiles.find((f) => f === base);
          if (!exact) {
            console.error(`Case mismatch in ${file}: imported "${importPath}", found on disk as "${base}"`);
            issues++;
          }
          found = true;
          break;
        }
      }
      if (!found && !importPath.endsWith('.svg') && !importPath.endsWith('?raw')) {
        console.error(`File not found: ${file} imported "${importPath}"`);
        issues++;
      }
    }
  }
}

if (issues === 0) {
  console.log('✓ All import paths perfectly match filesystem casing!');
} else {
  console.error(`Found ${issues} casing or missing file issues.`);
  process.exit(1);
}
