const fs = require('fs');
const fileContent = fs.readFileSync('c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src\\index.css', 'utf8');
const lines = fileContent.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('nav') || line.includes('menu') || line.includes('Header') || line.includes('header')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
