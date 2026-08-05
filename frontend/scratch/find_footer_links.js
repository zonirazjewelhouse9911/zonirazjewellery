const fs = require('fs');
const content = fs.readFileSync('c:/Users/Admin/Desktop/zoniraz 1/frontend/src/components/Footer.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('href') || line.includes('onClick') || line.includes('product') || line.includes('product-') || line.includes('product/')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
