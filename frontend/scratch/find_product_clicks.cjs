const fs = require('fs');
const path = require('path');
const dir = 'c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src\\components';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('product/') || line.includes('product_slug') || line.includes('slug') || line.includes('pushState')) {
        if (line.trim().startsWith('*') || line.trim().startsWith('//')) return;
        console.log(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
