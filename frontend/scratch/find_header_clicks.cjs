const fs = require('fs');
const fileContent = fs.readFileSync('c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src\\components\\Header.jsx', 'utf8');
const lines = fileContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('product/') || line.includes('product_slug') || line.includes('onClick') || line.includes('img')) {
    if (line.trim().startsWith('*') || line.trim().startsWith('//')) return;
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
