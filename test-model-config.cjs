const { prebuiltAppConfig } = require("@mlc-ai/web-llm");
const fs = require('fs');

const model = prebuiltAppConfig.model_list.find(m => m.model_id === 'Llama-3.2-1B-Instruct-q4f16_1-MLC');
console.log(JSON.stringify(model, null, 2));
