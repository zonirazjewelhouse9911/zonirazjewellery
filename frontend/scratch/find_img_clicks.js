const fs = require('fs');
const fileContent = fs.readFileSync('c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src\\components\\ProductDetailPage.jsx', 'utf8');
const lines = fileContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('img') || line.includes('onClick') || line.includes('Image')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
