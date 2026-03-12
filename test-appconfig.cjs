const fs = require('fs');
const path = require('path');
const dts = fs.readFileSync(path.join(__dirname, 'node_modules/@mlc-ai/web-llm/lib/config.d.ts'), 'utf8');
console.log(dts.match(/interface AppConfig[\s\S]*?\}/)[0]);
