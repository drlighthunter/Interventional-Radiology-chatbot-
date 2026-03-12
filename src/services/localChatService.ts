import { Language, Message, PatientDemographics } from "../types";

const KNOWLEDGE_BASE = {
  general: {
    whatIsIR: {
      keywords: ["what is ir", "what is interventional radiology", "define ir", "about ir", "ir à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ", "ir à®Žà®©à¯à®±à®¾à®²à¯ à®Žà®©à¯à®©", "ir à°…à°‚à°Ÿà±‡ à°à°®à°¿à°Ÿà°¿"],
      response: `### What is Interventional Radiology (IR)?
Interventional Radiology is a medical specialty that harnesses the power of advanced imaging techniques (X-ray, Ultrasound, CT, MRI, Fluoroscopy) to look inside the body, pinpoint problems, and treat them in real-time using minimally invasive procedures.

<img src="https://picsum.photos/seed/radiology/800/450" alt="Radiology Imaging" referrerPolicy="no-referrer" className="rounded-lg my-4 shadow-md w-full" />
*Advanced imaging allows doctors to see inside the body without large incisions.*`
    },
    benefits: {
      keywords: ["benefits", "why ir", "advantages", "risk", "recovery", "à¤²à¤¾à¤", "à®¨à®©à¯à®®à¯ˆà®•à®³à¯", "à°ªà±à°°à°¯à±‹à°œà°¨à°¾à°²à±"],
      response: `### Benefits of Interventional Radiology
- **Lower Risk**: Procedures carry lower risks than traditional surgery.
- **Less Pain**: Minimally invasive techniques mean less trauma to the body.
- **Shorter Recovery**: Patients often go home the same day and return to normal activities faster.
- **Local Anesthesia**: Most procedures don't require general anesthesia.
- **Cost-Effective**: Shorter hospital stays reduce overall costs.`
    },
    specialist: {
      keywords: ["specialist", "doctor", "who performs", "radiologist"],
      response: `### The IR Specialist
Interventional radiologists are highly trained doctors who combine expertise in medical imaging with minimally invasive surgical skills. They provide patient evaluation, procedure execution, and post-procedural care.`
    }
  },
  procedures: [
    {
      name: "Angioplasty and Stenting",
      keywords: ["angioplasty", "stent", "blocked artery", "vessel", "narrowing", "à¤à¤‚à¤œà¤¿à¤¯à¥‹à¤ªà¥à¤²à¤¾à¤¸à¥à¤Ÿà¥€", "à¤¸à¥à¤Ÿà¥‡à¤‚à¤Ÿ", "à®†à®žà¯à®šà®¿à®¯à¯‹à®ªà®¿à®³à®¾à®¸à¯à®Ÿà®¿", "à°†à°‚à°œà°¿à°¯à±‹à°ªà±à°²à°¾à°¸à±à°Ÿà±€"],
      description: "A procedure to open narrowed or blocked blood vessels using a small balloon and sometimes a metal mesh tube called a stent.",
      preOp: "Fasting (NPO) for 6 hours before. Hold blood thinners for 5-7 days. Hold Metformin for 48 hours.",
      postOp: "Rest for 4-6 hours. Avoid heavy lifting for 2 days. Stay hydrated."
    },
    {
      name: "Embolization (UFE, PAE, etc.)",
      keywords: ["embolization", "ufe", "pae", "fibroid", "prostate", "bleeding", "à¤à¤®à¥à¤¬à¥‹à¤²à¤¾à¤‡à¤œà¥‡à¤¶à¤¨", "à®Žà®®à¯à®ªà¯‹à®²à®¿à®šà¯‡à®·à®©à¯", "à°Žà°‚à°¬à±‹à°²à±ˆà°œà±‡à°·à°¨à±"],
      description: "Blocking blood flow to a specific area to treat tumors, fibroids, or stop bleeding.",
      preOp: "No solid food after midnight. Stop NSAIDs 3 days before.",
      postOp: "Expect some pain/cramping for 24-48 hours. Rest at home for 1 week."
    },
    {
      name: "Biopsy",
      keywords: ["biopsy", "sample", "tissue", "needle"],
      description: "Using imaging guidance to take a small tissue sample for testing.",
      preOp: "Light meal allowed. Check blood clotting tests.",
      postOp: "Keep the site dry for 24 hours. Watch for bleeding."
    },
    {
      name: "Ablation",
      keywords: ["ablation", "tumor ablation", "microwave", "radiofrequency"],
      description: "Using heat or cold to destroy tumors in the liver, kidney, or lung.",
      preOp: "Fasting for 6-8 hours. Continue BP medications.",
      postOp: "Overnight stay may be required. Mild fever is common."
    }
  ],
  symptoms: [
    {
      keywords: ["leg pain", "claudication", "walking pain"],
      diagnosis: "Peripheral Artery Disease (PAD)",
      explanation: "Narrowing of the arteries in the legs reduces blood flow during exercise.",
      procedure: "Angioplasty and Stenting"
    },
    {
      keywords: ["heavy periods", "pelvic pain", "fibroids"],
      diagnosis: "Uterine Fibroids",
      explanation: "Non-cancerous growths in the uterus causing pressure and bleeding.",
      procedure: "Uterine Fibroid Embolization (UFE)"
    }
  ]
};

const MEDIA_RESOURCES = `
### Educational Media
- **What is IR? (Video)**: [Watch on YouTube](https://www.youtube.com/results?search_query=what+is+interventional+radiology)
- **Patient Stories**: [The II Patient Stories](https://theii.org/patient-stories/)
- **Procedure Animations**: [SIR Patient Center](https://www.sirweb.org/patient-center/)
`;

const EXTERNAL_LINKS = `
### Official Resources
- **CIRSE**: [https://www.cirse.org/](https://www.cirse.org/)
- **SIR**: [https://www.sirweb.org/](https://www.sirweb.org/)
- **ICMR**: [https://www.icmr.gov.in/](https://www.icmr.gov.in/)
- **The II**: [https://theii.org/](https://theii.org/)
` + MEDIA_RESOURCES;

const TRANSLATIONS: Record<Language, any> = {
  en: {
    welcome: "I am currently in **Local Mode** (Offline). How can I help you with Interventional Radiology?",
    insurance_title: "### Insurance Justification Letter (Draft)",
    insurance_subject: "**Subject:** Medical Necessity for IR Procedure",
    potential_diagnosis: "Potential Diagnosis",
    understanding_condition: "Understanding the Condition",
    recommended_procedure: "Recommended IR Procedure",
    benefits: "Key Benefits of IR",
    benefits_list: "Minimally invasive, quick recovery, performed under local anesthesia.",
    resources: "Official Resources",
    pre_op: "Pre-Procedure Instructions",
    post_op: "Post-Procedure Care",
    default_response: "I can help you with: What is IR?, Benefits, Procedures (Angioplasty, Embolization, Biopsy, Ablation), and Pre/Post-op instructions. Try asking 'What is angioplasty?'"
  },
  hi: {
    welcome: "à¤®à¥ˆà¤‚ à¤…à¤à¥€ **à¤²à¥‹à¤•à¤² à¤®à¥‹à¤¡** (à¤‘à¤«à¤²à¤¾à¤‡à¤¨) à¤®à¥¥ à¤¹à¥‚à¤à¥¤ à¤®à¥ˆà¤‚ à¤‡à¤¨à¥à¤Ÿà¤°à¤µà¥‡à¤‚à¤¶à¤¨à¤² à¤°à¥‡à¤¡à¤¿à¤¯à¥‹à¤²à¥‹à¤œà¥€ à¤®à¥¥ à¤†à¤ªà¤•à¥€ à¤•à¥ˆà¤¸à¥‡ à¤®à¤¦à¤¦ à¤•à¤° à¤¸à¤•à¤¤à¤¾ à¤¹à¥‚à¤à?",
    insurance_title: "### à¤¬à¥€à¤®à¤¾ à¤”à¤šà¤¿à¤¤à¥à¤¯ à¤ªà¤¤à¥à¤° (à¤¡à¥à¤°à¤¾à¤«à¥à¤Ÿ)",
    insurance_subject: "**à¤µà¤¿à¤·à¤¯:** IR à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥€ à¤šà¤¿à¤•à¤¿à¤¤à¥à¤¸à¥€à¤¯ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾",
    potential_diagnosis: "à¤¸à¤‚à¤à¤¾à¤µà¤¿à¤¤ à¤¨à¤¿à¤¦à¤¾à¤¨",
    understanding_condition: "à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤•à¥‹ à¤¸à¤®à¤à¤¨à¤¾",
    recommended_procedure: "à¤…à¤¨à¥à¤¶à¤‚à¤¸à¤¿à¤¤ IR à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾",
    benefits: "IR à¤•à¥‡ à¤®à¥à¤–à¥à¤¯ à¤²à¤¾à¤",
    benefits_list: "à¤¨à¥à¤¯à¥‚à¤¨à¤¤à¤® à¤†à¤•à¥à¤°à¤¾à¤®à¤•, à¤¤à¥à¤µà¤°à¤¿à¤¤ à¤¸à¥à¤µà¤¸à¥à¤¥ à¤¹à¥‹à¤¨à¤¾, à¤¸à¥à¤¥à¤¾à¤¨à¥€à¤¯ à¤ à¤¨à¥€à¤¸à¥à¤¥à¥€à¤¸à¤¿à¤¯à¤¾ à¤•à¥‡ à¤¤à¤¹à¤¤ à¤•à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾à¥¤",
    resources: "à¤†à¤§à¤¿à¤•à¤¾à¤°à¤¿à¤• à¤¸à¤‚à¤¸à¤¾à¤§à¤¨",
    pre_op: "à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤•à¥‡ à¤¨à¤¿à¤°à¥à¤¦à¥‡à¤¶",
    post_op: "à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤•à¥‡ à¤¬à¤¾à¤¦ à¤•à¥€ à¤¦à¥‡à¤–à¤à¤¾à¤²",
    default_response: "à¤®à¥ˆà¤‚ à¤†à¤ªà¤•à¥€ à¤®à¤¦à¤¦ à¤•à¤° à¤¸à¤•à¤¤à¤¾ à¤¹à¥‚à¤: IR à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?, à¤²à¤¾à¤, à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾à¤ à¤‚ (à¤à¤‚à¤œà¤¿à¤¯à¥‹à¤ªà¥à¤²à¤¾à¤¸à¥à¤Ÿà¥€, à¤à¤®à¥à¤¬à¥‹à¤²à¤¾à¤‡à¤œà¥‡à¤¶à¤¨, à¤¬à¤¾à¤¯à¥‹à¤ªà¥à¤¸à¥€, à¤à¤¬à¥à¤²à¥‡à¤¶à¤¨)à¥¤ 'à¤à¤‚à¤œà¤¿à¤¯à¥‹à¤ªà¥à¤²à¤¾à¤¸à¥à¤Ÿà¥€ à¤•à¥à¤¯à¤¾ à¤¹à¥ˆ?' à¤ªà¥‚à¤›à¤•à¤° à¤¦à¥‡à¤–à¥‡à¤‚à¥¤"
  },
  // Add more languages as needed, defaulting to English for now if missing
  ta: { welcome: "à®¨à®¾à®©à¯ à®¤à®±à¯à®ªà¯‹à®¤à¯ à®‰à®³à¯à®³à¯‚à®°à¯ à®®à¯à®±à¯ˆà®¯à®¿à®²à¯ (Offline) à®‰à®³à¯à®³à¯‡à®©à¯. IR à®ªà®±à¯à®±à®¿ à®¨à®¾à®©à¯ à®‰à®™à¯à®•à®³à¯à®•à¯à®•à¯ à®Žà®µà¯à®µà®¾à®±à¯ à®‰à®¤à®µ à®®à¯à®Ÿà®¿à®¯à¯à®®à¯?", default_response: "IR à®Žà®©à¯à®±à®¾à®²à¯ à®Žà®©à¯à®©?, à®¨à®©à¯à®®à¯ˆà®•à®³à¯, à®šà®¿à®•à®¿à®šà¯à®šà¯ˆà®•à®³à¯ à®ªà®±à¯à®±à®¿ à®¨à®¾à®©à¯ à®‰à®¤à®µ à®®à¯à®Ÿà®¿à®¯à¯à®®à¯." },
  te: { welcome: "à°¨à±‡à°¨à± à°ªà±à°°à°¸à±à°¤à±à°¤à°‚ à°²à±‹à°•à°²à± à°®à±‹à°¡à±â€Œà°²à±‹ (Offline) à°‰à°¨à±à°¨à°¾à°¨à±. IR à°—à±±à°°à°¿à°‚à°šà°¿ à°¨à±‡à°¨à± à°®à±€à°•à± à°Žà°²à°¾ à°¸à°¹à°¾à°¯à°ªà°¡à°—à°²à°¨à±?", default_response: "IR à°…à°‚à°Ÿà±‡ à°à°®à°¿à°Ÿà°¿?, à°ªà±à°°à°¯à±‹à°œà°¨à°¾à°²à±, à°šà°¿à°•à°¿à°¤à±à°¸à°² à°—à±±à°°à°¿à°‚à°šà°¿ à°¨à±‡à°¨à± à°¸à°¹à°¾à°¯à°ªà°¡à°—à°²à°¨à±." },
  kn: { welcome: "à²¨à²¾à²¨à³ à²ªà³à²°à²¸à³à²¤à³à²¤ à²²à³‹à²•à²²à³ à²®à³‹à²¡à³â€Œà²¨à²²à³à²²à²¿à²¦à³à²¦à³‡à²¨à³† (Offline). IR à²¬à²—à³à²—à³† à²¨à²¾à²¨à³ à²¨à²¿à²®à²—à³† à²¹à³‡à²—à³† à²¸à²¹à²¾à²¯ à²®à²¾à²¡à²¬à²²à³à²²à³†?", default_response: "IR à²Žà²‚à²¦à²°à³†à²¨à³?, à²…à²¨à³à²•à³‚à²²à²—à²³à³, à²šà²¿à²•à²¿à²¤à³à²¸à³†à²—à²³ à²¬à²—à³à²—à³† à²¨à²¾à²¨à³ à²¨à²¿à²®à²—à³† à²¸à²¹à²¾à²¯ à²®à²¾à²¡à²¬à²²à³à²²à³†." },
  ml: { welcome: "à´žà´¾à´¨àµâ€ à´‡à´ªàµà´ªàµ‹à´³àµâ€ à´²àµ‹à´•àµà´•à´²àµâ€ à´®àµ‹à´¡à´¿à´²à´¾à´£àµâ€ (Offline). IR-à´¨àµ†à´•àµà´•àµà´±à´¿à´šàµà´šàµ à´žà´¾à´¨àµâ€ à´Žà´™àµà´™à´¨àµ† à´¸à´¹à´¾à´¯à´¿à´•àµà´•à´£à´‚?", default_response: "IR à´Žà´¨àµà´¨à´¾à´²àµâ€ à´Žà´¨àµà´¤à´¾à´£àµâ€?, à´—àµà´£à´™àµà´™à´³àµâ€, à´šà´¿à´•à´¿à´¤àµà´¸à´•à´³àµâ€ à´Žà´¨àµà´¨à´¿à´µà´¯àµ†à´•àµà´•àµà´±ിà´šàµà´šàµ à´žà´¾à´¨àµâ€ à´¸à´¹à´¾à´¯à´¿à´•àµà´•à´¾à´‚." },
  bn: { welcome: "à¦†à¦®à¦¿ à¦¬à¦°à¥à¦¤à¦®à¦¾à¦¨à§‡ à¦²à§‹à¦•à¦¾à¦² à¦®à§‹à¦¡à§‡ (Offline) à¦†à¦›à¦¿à¥¤ IR à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡ à¦†à¦®à¦¿ à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦•à¦¿à¦à¦¾à¦¬à§‡ à¦¸à¦¾à¦¹à¦¾à¦¯à§à¦¯ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¿?", default_response: "IR à¦•à¦¿?, à¦¸à§à¦¬à¦¿à¦§à¦¾, à¦ªà§à¦°à¦•à§à¦°à¦¿à§à§à¦¾ à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡ à¦†à¦®à¦¿ à¦¸à¦¾à¦¹à¦¾à¦¯à§à¦¯ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¿à¥¤" },
  mr: { welcome: "à¤®à¥€ à¤¸à¤§à¥à¤¯à¤¾ à¤²à¥‹à¤•à¤² à¤®à¥‹à¤¡à¤®à¤§à¥à¤¯à¥‡ (Offline) à¤†à¤¹à¥‡. IR à¤¬à¤¦à¥à¤¦à¤² à¤®à¥€ à¤¤à¥à¤®à¥à¤¹à¤¾à¤²à¤¾ à¤•à¤¶à¥€ à¤®à¤¦à¤¤ à¤•à¤°à¥‚ à¤¶à¤•à¤¤à¥‹?", default_response: "IR à¤®à¥à¤¹à¤£à¤œà¥‡ à¤•à¤¾à¤¯?, à¤«à¤¾à¤¯à¤¦à¥‡, à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤¬à¤¦à¥à¤¦à¤² à¤®à¥€ à¤®à¤¦à¤¤ à¤•à¤°à¥‚ à¤¶à¤•à¤¤à¥‹." },
  gu: { welcome: "àª¹à«àª‚ àª…àª¤à«àª¯àª¾àª°à« àª²à«‹àª•àª² àª®à«‹àª¡àª®àª¾àª‚ (Offline) àª›à«àª‚. IR àªµàª¿àª·à«‡ àª¹à«àª‚ àª¤àª®àª¨à«‡ àª•à«‡àªµà«€ àª°à«€àª¤à«‡ àª®àª¦àª¦ àª•àª°à«€ àª¶àª•à«àª‚?", default_response: "IR àª¶à«àª‚ àª›à«‡?, àª«àª¾àª¯àª¦àª¾, àªªà«àª°àª•à¥àª°àª¿àª¯àª¾àª“ àªµàª¿àª·à«‡ àª¹à«àª‚ àª®àª¦àª¦ àª•àª°à«€ àª¶àª•à«àª‚." },
  or: { welcome: "à¬®àu0b41à¬ à¬¬à¬°àu0b4dà¬¤àu0b4dà¬¤à¬®à¬¾à¬¨ à¬²àu0b4bà¬•à¬¾à¬² à¬®àu0b4bà¬¡àu0b4dâ€Œà¬°àu0b47 (Offline) à¬…à¬›à¬¿ | IR à¬¬à¬¿à¬·à¬¯à¬°àu0b47 à¬®àu0b41à¬ à¬†à¬ªà¬£à¬™àu0b4dà¬•àu0b41 à¬•à¬¿à¬ªà¬°à¬¿ à¬¸à¬¾à¬¹à¬¾à¬¯àu0b4dà¬¯ à¬•à¬°à¬¿à¬ªà¬¾à¬°à¬¿à¬¬à¬¿?", default_response: "IR à¬•âu0b4dâu0b09à¬£?, à¬¸àu0b41à¬¬à¬¿à¬§à¬¾, à¬ªàu0b4dà¬°à¬•àu0b4dà¬°à¬¿à§à¬¾ à¬¬à¬¿à¬·à¬¯à¬°àu0b47 à¬®àu0b41à¬ à¬¸à¬¾à¬¹à¬¾à¬¯àu0b4dà¬¯ à¬•à¬°à¬¿à¬ªà¬¾à¬°à¬¿à¬¬à¬¿ |" }
};

export async function getChatResponse(messages: Message[], language: Language, demographics?: PatientDemographics): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const lastMessage = messages[messages.length - 1].text.toLowerCase();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // 1. Check for Insurance Justification request
  if (lastMessage.includes("insurance") || lastMessage.includes("justification") || lastMessage.includes("à¤¬à¥€à¤®à¤¾")) {
    const missingFields = [];
    if (!demographics?.symptoms) missingFields.push("Current Symptoms");
    if (!demographics?.diagnosis) missingFields.push("Confirmed Diagnosis");
    if (!demographics?.age) missingFields.push("Age");

    if (missingFields.length > 0) {
      return `### Information Needed for Insurance Justification
To generate a precise justification letter, I need a few more details. Please update your **Patient Profile** (user icon at the top) with the following:
${missingFields.map(f => `- **${f}**`).join('\n')}

Once updated, ask me again for the insurance justification.`;
    }

    return `${t.insurance_title}
${t.insurance_subject}

**Patient Context:**
- **Age/Gender:** ${demographics?.age || 'N/A'} / ${demographics?.gender || 'N/A'}
- **Symptoms:** ${demographics?.symptoms || 'N/A'}
- **Diagnosis:** ${demographics?.diagnosis || 'N/A'}
- **Medical History:** ${demographics?.history || 'N/A'}

**Medical Necessity Justification:**
The patient presents with ${demographics?.symptoms || 'clinical symptoms'} and has been diagnosed with ${demographics?.diagnosis || 'the aforementioned condition'}. Given the patient's medical history of ${demographics?.history || 'N/A'}, an Interventional Radiology procedure is medically necessary. 

Compared to traditional open surgery, this IR procedure offers:
1. **Minimally Invasive Approach**: Reduced risk of infection and blood loss.
2. **Faster Recovery**: Shorter hospital stay and quicker return to daily activities.
3. **Cost-Effectiveness**: Lower overall healthcare costs due to reduced complications.

*This is a draft generated for educational purposes. Please have your treating Interventional Radiologist review and sign the final version.*`;
  }

  // 2. Check General Knowledge
  for (const key in KNOWLEDGE_BASE.general) {
    const item = (KNOWLEDGE_BASE.general as any)[key];
    if (item.keywords.some((kw: string) => lastMessage.includes(kw))) {
      return item.response + "\n\n" + EXTERNAL_LINKS;
    }
  }

  // 3. Check Procedures
  for (const proc of KNOWLEDGE_BASE.procedures) {
    if (proc.keywords.some(kw => lastMessage.includes(kw))) {
      let response = `### ${proc.name}\n${proc.description}\n\n`;
      
      if (lastMessage.includes("pre") || lastMessage.includes("before") || lastMessage.includes("instruction") || lastMessage.includes("à¤ªà¤¹à¤²à¥‡")) {
        response += `**${t.pre_op}:**\n${proc.preOp}`;
      } else if (lastMessage.includes("post") || lastMessage.includes("after") || lastMessage.includes("care") || lastMessage.includes("à¤¬à¤¾à¤¦")) {
        response += `**${t.post_op}:**\n${proc.postOp}`;
      } else {
        response += `**Pre-Op:** ${proc.preOp}\n\n**Post-Op:** ${proc.postOp}`;
      }
      
      return response + "\n\n" + EXTERNAL_LINKS;
    }
  }

  // 4. Check Symptoms
  for (const sym of KNOWLEDGE_BASE.symptoms) {
    if (sym.keywords.some(kw => lastMessage.includes(kw))) {
      return `### ${t.potential_diagnosis}
- **Diagnosis**: ${sym.diagnosis}
- **${t.understanding_condition}**: ${sym.explanation}
- **${t.recommended_procedure}**: ${sym.procedure}
- **${t.benefits}**: ${t.benefits_list}

${EXTERNAL_LINKS}`;
    }
  }

  // 5. Default Response
  return t.welcome + "\n\n" + t.default_response + "\n\n" + EXTERNAL_LINKS;
}

export async function logAnalytics(data: any) {
  console.log('Local Analytics Log:', data);
}
