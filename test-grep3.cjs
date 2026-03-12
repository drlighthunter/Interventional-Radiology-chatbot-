const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
try {
  const out = execSync('grep -rI "requestDevice" node_modules/@mlc-ai/').toString();
  console.log(out);
} catch (e) {
  console.log("No matches");
}
