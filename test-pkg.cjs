const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('node_modules/@mlc-ai/web-llm/package.json', 'utf8'));
console.log(pkg.main, pkg.module, pkg.exports);
