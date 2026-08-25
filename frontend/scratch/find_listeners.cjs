const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        searchDir(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('addEventListener') && line.includes('click')) {
          console.log(`${file}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  });
}

searchDir('c:\\Users\\Admin\\Desktop\\zoniraz 1\\frontend\\src');
