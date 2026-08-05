const fs = require('fs');
const content = fs.readFileSync('c:/Users/Admin/Desktop/zoniraz 1/frontend/src/components/ProductDetailPage.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('product-') || line.includes('product/')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
