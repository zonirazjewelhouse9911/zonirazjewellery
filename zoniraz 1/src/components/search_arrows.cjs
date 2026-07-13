const fs = require('fs');
const file = "c:\\Users\\ADMIN\\Desktop\\zoniraz $\\zoniraj\\zoniraz 1\\src\\components\\CategoryPage.jsx";
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
let found = 0;
lines.forEach((line, index) => {
  if (line.includes('card-arrow-overlay') || line.includes('card-slider-arrow')) {
    found++;
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
