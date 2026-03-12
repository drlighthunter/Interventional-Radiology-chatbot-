const { execSync } = require('child_process');
try {
  const out = execSync('find node_modules/@mlc-ai/ -name "*.js" | xargs grep -n "requestDevice"').toString();
  console.log(out);
} catch (e) {
  console.log("No matches");
}
