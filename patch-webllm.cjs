const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js') || file.endsWith('.mjs')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'node_modules/@mlc-ai/web-llm'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (content.includes('32768')) {
    content = content.replace(/32768/g, '16384');
    changed = true;
  }
  if (content.includes('32 << 10')) {
    content = content.replace(/32 << 10/g, '16 << 10');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Patched', file);
  }
});
