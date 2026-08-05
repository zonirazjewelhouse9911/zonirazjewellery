const fs = require('fs');
const content = fs.readFileSync('c:/Users/Admin/Desktop/zoniraz 1/adminSide/src/pages/ProductEditor.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('slug')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
