const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
try {
  const out = execSync('grep -rI "maxComputeWorkgroupStorageSize" node_modules/@mlc-ai/web-llm/').toString();
  console.log(out);
} catch (e) {
  console.log("No matches");
}
