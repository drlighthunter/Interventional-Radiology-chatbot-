# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-03-12

### Added
- **Patient Profile**: Added a dedicated section to input patient demographics (age, gender, location, medical history).
- **Report Analysis**: Support for uploading JPEG and PDF patient reports for AI-driven analysis.
- **Insurance Justification**: New feature to generate formal justification letters for insurance pre-authorization and claims.
- **Multimodal Support**: The AI can now "see" and analyze uploaded medical documents.
- **CIRSE & SIR Knowledge Integration**: Incorporated comprehensive general patient information from CIRSE and the Society of Interventional Radiology (SIR), including definitions of IR, benefits, and imaging techniques.
- **The II Procedure Knowledge**: Added a comprehensive list of IR procedures across various organ systems based on The Interventional Initiative (The II) guidelines.
- **External Resources**: Integrated official links to CIRSE, SIR, ICMR, and The II websites within AI responses for patient education.
- **Visual Aids**: Enabled illustrative image support in AI responses to help patients visualize procedures and anatomy.
- **Local Deployment Mode**: Transitioned the chatbot to a self-contained, rule-based local engine. This allows deployment without external LLM API dependencies (Offline Mode).

## [1.2.0] - 2026-03-12

### Added
- **Copy Response Button**: Added a button to each AI message allowing users to copy the text to their clipboard.
- **Visual Feedback**: Added a checkmark animation to the copy button to confirm successful copying.

## [1.1.0] - 2026-03-12

### Added
- **ICMR Alignment**: Integrated Indian Council of Medical Research (ICMR) Standard Treatment Workflows (STWs) into the clinical guidance logic.
- **ICMR Badge**: Added a visual "ICMR Aligned" indicator in the application header.
- **Pre-Op Knowledge Base**: Expanded the AI's knowledge to include specific pre-operative instructions for Angiography, Embolization, and Ablation.
- **Updated Suggestions**: Added a quick-start suggestion for "Pre-op for angiography".

### Changed
- **Gemini System Prompt**: Updated the system instructions to prioritize national clinical standards (ICMR) for the Indian context.

## [1.0.0] - 2026-03-12

### Added
- **Initial Release**: Launched the IR Patient Information Portal.
- **Multilingual Support**: Support for 10 Indian languages (English, Hindi, Kannada, Tamil, Telugu, Malayalam, Oriya, Bangla, Marathi, Gujarati).
- **Voice Interaction**: Integrated voice-to-text capabilities for hands-free queries.
- **Symptom Assessment**: AI-driven symptom matching with Interventional Radiology treatment options.
- **Analytics**: Basic interaction logging for clinical improvement.
