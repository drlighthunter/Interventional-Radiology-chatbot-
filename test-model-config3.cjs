const { prebuiltAppConfig } = require("@mlc-ai/web-llm");
const model = prebuiltAppConfig.model_list.find(m => m.model_id === 'Llama-3.2-1B-Instruct-q4f32_1-MLC');
console.log(JSON.stringify(model, null, 2));
