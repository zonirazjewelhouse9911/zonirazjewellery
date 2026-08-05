const fs = require('fs');
const fileContent = fs.readFileSync('c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src\\App.jsx', 'utf8');
const lines = fileContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('popstate') || line.includes('selectedProductId') || line.includes('selectedProduct') || line.includes('product_slug') || line.includes('currentView')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
