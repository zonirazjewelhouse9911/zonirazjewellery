const fs = require('fs');
const fileContent = fs.readFileSync('c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src\\components\\CategoryPage.jsx', 'utf8');
const lines = fileContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('product-card') || line.includes('product.image') || line.includes('onClick')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
