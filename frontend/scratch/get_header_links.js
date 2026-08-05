const fs = require('fs');
const content = fs.readFileSync('c:/Users/Admin/Desktop/zoniraz 1/frontend/src/components/Header.jsx', 'utf8');
// Let's print out lines that contain href/links or categories logic
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('href=') || line.includes('categoryName')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
