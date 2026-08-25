const fs = require('fs');
const fileContent = fs.readFileSync('c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src\\index.css', 'utf8');
const lines = fileContent.split('\n');
let startLine = -1;
let endLine = -1;

lines.forEach((line, idx) => {
  if (line.includes('.mega-dropdown') && !line.includes('hover') && !line.includes('focus')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
