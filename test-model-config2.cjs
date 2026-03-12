const { prebuiltAppConfig } = require("@mlc-ai/web-llm");
const model = prebuiltAppConfig.model_list.find(m => m.model_id === 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC-1k');
console.log(JSON.stringify(model, null, 2));
