const fs = require('fs');
const lines = fs.readFileSync('node_modules/@mlc-ai/web-llm/lib/index.js', 'utf8').split('\n');
console.log(lines.slice(3750, 3790).join('\n'));
