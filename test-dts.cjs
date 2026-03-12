const fs = require('fs');
const path = require('path');
const dts = fs.readFileSync(path.join(__dirname, 'node_modules/@mlc-ai/web-llm/lib/index.d.ts'), 'utf8');
console.log(dts.substring(0, 1000));
