export type Language = "en" | "hi";

export interface Translations {
  // Utility & Header
  govOfIndia: string;
  madeInIndia: string;
  skipToMain: string;
  accessibilityOptions: string;
  portalTitle: string;
  portalSubtitle: string;
  
  // Navigation
  navHome: string;
  navCopilot: string;
  navTrackStatus: string;
  navMyHistory: string;
  navFaq: string;
  navResponseAnalysis: string;
  navFirstAppeal: string;
  navFileRti: string;
  loginRegister: string;
  signIn: string;
  signOut: string;

  // Hero Section
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  heroCtaFileNow: string;
  heroCtaCopilot: string;
  heroTrackPlaceholder: string;
  heroTrackButton: string;

  // Stats
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;

  // How it works
  howItWorksBadge: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Features
  featuresBadge: string;
  featuresTitle: string;
  featuresSubtitle: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Title: string;
  feat4Desc: string;
  feat5Title: string;
  feat5Desc: string;
  feat6Title: string;
  feat6Desc: string;

  // Modal (Choice Modal)
  modalTitle1: string;
  modalTitle2: string;
  modalSubtitle: string;
  modalCopilotBadge: string;
  modalCopilotTitle: string;
  modalCopilotDesc: string;
  modalCopilotBtn: string;
  modalManualTitle: string;
  modalManualDesc: string;
  modalManualFeature1: string;
  modalManualFeature2: string;
  modalManualBtn: string;

  // Copilot Page
  copilotStep1: string;
  copilotStep2: string;
  copilotStep3: string;
  copilotStep4: string;
  copilotHeroTitle: string;
  copilotHeroSubtitle: string;
  copilotInputLabel: string;
  copilotInputPlaceholder: string;
  copilotDocUploadTitle: string;
  copilotDocUploadDesc: string;
  copilotSampleQueriesTitle: string;
  copilotGenerateBtn: string;
  copilotGeneratingText: string;
  copilotReviewTitle: string;
  copilotReviewSubtitle: string;
  copilotRecommendedAuth: string;
  copilotAuthReason: string;
  copilotSubjectLabel: string;
  copilotQuestionsLabel: string;
  copilotCharCount: string;
  copilotProceedToPay: string;
  copilotEditDraft: string;
  copilotPaymentTitle: string;
  copilotPaymentSubtitle: string;
  copilotStandardFee: string;
  copilotBplExemption: string;
  copilotPayAndSubmit: string;
  copilotSuccessTitle: string;
  copilotSuccessSubtitle: string;
  copilotAppIdLabel: string;
  copilotDownloadReceipt: string;
  copilotTrackNowBtn: string;

  // Manual File RTI Page
  fileRtiTitle: string;
  fileRtiSubtitle: string;
  applicantInfoTitle: string;
  fullNameLabel: string;
  emailLabel: string;
  mobileLabel: string;
  addressLabel: string;
  stateLabel: string;
  districtLabel: string;
  pincodeLabel: string;
  categoryTitle: string;
  bplQuestion: string;
  bplCardNoLabel: string;
  ministryLabel: string;
  selectMinistry: string;
  departmentLabel: string;
  selectDepartment: string;
  subjectLineLabel: string;
  rtiTextLabel: string;
  rtiTextPlaceholder: string;
  attachDocLabel: string;
  submitRtiBtn: string;

  // Track & History
  trackTitle: string;
  trackSubtitle: string;
  enterAppIdPlaceholder: string;
  trackSearchBtn: string;
  appDetailsTitle: string;
  submittedOn: string;
  currentStatus: string;
  daysRemainingLabel: string;
  timelineTitle: string;
  actionFirstAppealBtn: string;
  actionAnalyzeRespBtn: string;
  historyTitle: string;
  historySubtitle: string;
  allFilter: string;
  activeFilter: string;
  completedFilter: string;
  noApplicationsFound: string;

  // Response Analysis & Appeal
  respAnalysisTitle: string;
  respAnalysisSubtitle: string;
  originalQuestionsLabel: string;
  pastedResponseLabel: string;
  analyzeBtn: string;
  analysisSummaryTitle: string;
  statusAnswered: string;
  statusPartial: string;
  statusUnanswered: string;
  firstAppealTitle: string;
  firstAppealSubtitle: string;
  appealReasonLabel: string;
  reasonNoResponse: string;
  reasonUnsatisfactory: string;
  generateAppealBtn: string;
  generatedAppealTitle: string;
  copyTextBtn: string;
  copiedText: string;

  // Footer
  footerDisclaimer: string;
  footerHelpline: string;
  footerCopyright: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Utility & Header
    govOfIndia: "Government of India",
    madeInIndia: "Made in India",
    skipToMain: "Skip to Main Content",
    accessibilityOptions: "Accessibility Options",
    portalTitle: "RTI Online",
    portalSubtitle: "An initiative of Department of Personnel & Training",

    // Navigation
    navHome: "Home",
    navCopilot: "RTI Copilot",
    navTrackStatus: "Track Status",
    navMyHistory: "My History",
    navFaq: "FAQ",
    navResponseAnalysis: "Response Analyzer",
    navFirstAppeal: "First Appeal",
    navFileRti: "File RTI",
    loginRegister: "Login / Register",
    signIn: "Sign In",
    signOut: "Sign Out",

    // Hero Section
    heroBadge: "Right to Information Act, 2005",
    heroTitle1: "Ask the government.",
    heroTitle2: "We'll handle the complexity.",
    heroSubtitle:
      "India's first AI-assisted RTI filing portal. Draft legally sound queries, discover the exact public authority, and track responses in minutes.",
    heroCtaFileNow: "File an RTI Now",
    heroCtaCopilot: "Try AI Copilot",
    heroTrackPlaceholder: "Enter Registration / Application ID (e.g. RTI/2026/7829142)",
    heroTrackButton: "Track Application",

    // Stats
    stat1Value: "600+",
    stat1Label: "Public Authorities & Ministries Mapped",
    stat2Value: "₹10",
    stat2Label: "Standard Government Statutory Fee",
    stat3Value: "30 Days",
    stat3Label: "Statutory Time Limit for Response",
    stat4Value: "100%",
    stat4Label: "Free Assistance for BPL Citizens",

    // How it works
    howItWorksBadge: "Simple 4-Step Process",
    howItWorksTitle: "How RTI Online Works",
    howItWorksSubtitle: "Exercising your constitutional right to information has never been simpler.",
    step1Title: "1. State Your Question",
    step1Desc: "Type in plain words what you want to know about government spending, tenders, or policies.",
    step2Title: "2. AI Frames Legal Draft",
    step2Desc: "Our AI auto-selects the competent ministry/department and drafts precise, legally sound questions.",
    step3Title: "3. Quick Review & Submit",
    step3Desc: "Review your applicant details, pay the standard ₹10 government fee (free for BPL), and submit.",
    step4Title: "4. Track & Analyze Response",
    step4Desc: "Get automated deadline alerts, track status, analyze government replies, and file appeals if needed.",

    // Features
    featuresBadge: "Next-Gen Citizen Features",
    featuresTitle: "Everything you need to exercise your RTI right",
    featuresSubtitle: "Powerful AI and transparent tracking built to assist citizens at every stage.",
    feat1Title: "AI Copilot & Smart RAG",
    feat1Desc: "Upload supporting PDFs, notices, or tenders to automatically ground and extract key facts for your RTI.",
    feat2Title: "Public Authority Discovery",
    feat2Desc: "Identifies whether your query belongs to Central, State, or Municipal bodies with exact department mapping.",
    feat3Title: "Legal Quality Assurance",
    feat3Desc: "Validates your draft against RTI Act Section 6(1) standards, character limits, and precision criteria.",
    feat4Title: "Live Status Tracking",
    feat4Desc: "Interactive timeline tracking nodal officer receipt, CPIO assignment, and remaining statutory days.",
    feat5Title: "Government Response Analyzer",
    feat5Desc: "Paste government replies to automatically detect answered, partial, or evaded questions.",
    feat6Title: "1-Click First Appeal Draft",
    feat6Desc: "If replies are delayed or unsatisfactory, instantly generate a formal Section 19(1) First Appeal.",

    // Modal
    modalTitle1: "Right to Information",
    modalTitle2: "made accessible.",
    modalSubtitle:
      "Empowering citizens to seek information from the Government of India. Choose how you want to file your request today.",
    modalCopilotBadge: "AI-ASSISTED",
    modalCopilotTitle: "RTI Copilot",
    modalCopilotDesc:
      "Not sure how to write your RTI? Let the Copilot help you prepare it. We will guide you through the process, ensure legal framing, and draft the request for you.",
    modalCopilotBtn: "Start with RTI Copilot",
    modalManualTitle: "File manually",
    modalManualDesc:
      "Submit your RTI request directly if you already know the appropriate public authority and have your query drafted.",
    modalManualFeature1: "Standard submission form",
    modalManualFeature2: "Direct payment gateway",
    modalManualBtn: "Submit Request",

    // Copilot Page
    copilotStep1: "1. Query & Context",
    copilotStep2: "2. AI Review & Edit",
    copilotStep3: "3. Fee Payment",
    copilotStep4: "4. Confirmation",
    copilotHeroTitle: "AI-Powered RTI Assistant",
    copilotHeroSubtitle:
      "Describe what information you need in plain Hindi or English. Optionally attach supporting documents.",
    copilotInputLabel: "What information are you seeking?",
    copilotInputPlaceholder:
      "E.g., I want to know the total expenditure, tender details, and contractor penalties for the delayed road repair in my area...",
    copilotDocUploadTitle: "Upload Supporting Document (Optional)",
    copilotDocUploadDesc: "Upload PDF / TXT / Notice to extract reference numbers, dates, and tender figures.",
    copilotSampleQueriesTitle: "Or choose a sample query to test:",
    copilotGenerateBtn: "Generate RTI Draft with AI",
    copilotGeneratingText: "AI is analyzing jurisdiction & drafting legal RTI questions...",
    copilotReviewTitle: "Review Generated RTI Application",
    copilotReviewSubtitle: "Check the identified public authority, subject, and questions before submission.",
    copilotRecommendedAuth: "Recommended Public Authority",
    copilotAuthReason: "Jurisdiction Basis",
    copilotSubjectLabel: "Subject Line",
    copilotQuestionsLabel: "Information Sought (RTI Questions)",
    copilotCharCount: "Character Count",
    copilotProceedToPay: "Proceed to Fee Payment",
    copilotEditDraft: "Edit Draft Text",
    copilotPaymentTitle: "Statutory RTI Fee Payment",
    copilotPaymentSubtitle: "Standard central government filing fee under Right to Information Rules, 2012.",
    copilotStandardFee: "Standard Statutory Fee: ₹10.00",
    copilotBplExemption: "BPL cardholders are exempt from all application fees.",
    copilotPayAndSubmit: "Pay ₹10 & Submit Application",
    copilotSuccessTitle: "RTI Application Successfully Filed!",
    copilotSuccessSubtitle:
      "Your application has been registered with the competent Public Authority. A receipt has been generated.",
    copilotAppIdLabel: "Application Registration ID",
    copilotDownloadReceipt: "Download PDF Receipt",
    copilotTrackNowBtn: "Track Application Status",

    // Manual File RTI Page
    fileRtiTitle: "File RTI Application (Standard)",
    fileRtiSubtitle: "Submit an online RTI request directly to Central Ministries, Departments, or CPSEs.",
    applicantInfoTitle: "1. Applicant Information",
    fullNameLabel: "Full Name *",
    emailLabel: "Email Address *",
    mobileLabel: "Mobile Number (10 Digits) *",
    addressLabel: "Postal Address *",
    stateLabel: "State / UT *",
    districtLabel: "District *",
    pincodeLabel: "Pincode *",
    categoryTitle: "2. Category & Authority",
    bplQuestion: "Are you Below Poverty Line (BPL)?",
    bplCardNoLabel: "BPL Card / Ration Card Number",
    ministryLabel: "Select Central Ministry / Apex Body *",
    selectMinistry: "-- Choose Ministry --",
    departmentLabel: "Select Public Authority / Department *",
    selectDepartment: "-- Choose Department --",
    subjectLineLabel: "Subject of Application *",
    rtiTextLabel: "Text of RTI Application (Max 3,000 characters) *",
    rtiTextPlaceholder: "State clearly and specifically the information/documents sought under Section 6(1)...",
    attachDocLabel: "Supporting Document (PDF, max 2MB)",
    submitRtiBtn: "Proceed to Payment & Submit",

    // Track & History
    trackTitle: "Track RTI Application Status",
    trackSubtitle: "Monitor the real-time processing status, nodal officer updates, and statutory deadlines.",
    enterAppIdPlaceholder: "Enter RTI Application ID (e.g. RTI/2026/7829142)",
    trackSearchBtn: "Check Status",
    appDetailsTitle: "Application Overview",
    submittedOn: "Submitted On",
    currentStatus: "Current Stage",
    daysRemainingLabel: "Days Remaining (Statutory 30-Day Window)",
    timelineTitle: "Official Processing Timeline",
    actionFirstAppealBtn: "File First Appeal",
    actionAnalyzeRespBtn: "Analyze Government Reply",
    historyTitle: "My RTI Applications History",
    historySubtitle: "View and manage all your filed RTI applications, status, and appeals.",
    allFilter: "All Applications",
    activeFilter: "Active / Under Process",
    completedFilter: "Resolved / Completed",
    noApplicationsFound: "No RTI applications found under this filter.",

    // Response Analysis & Appeal
    respAnalysisTitle: "AI RTI Response Analyzer",
    respAnalysisSubtitle: "Verify if the government replied adequately to each question or evaded key information.",
    originalQuestionsLabel: "Original RTI Questions Filed",
    pastedResponseLabel: "Paste Government Reply Letter / Text",
    analyzeBtn: "Analyze Response with AI",
    analysisSummaryTitle: "AI Evaluation Summary",
    statusAnswered: "Fully Answered",
    statusPartial: "Partially Answered",
    statusUnanswered: "Unanswered / Evaded",
    firstAppealTitle: "Generate Section 19(1) First Appeal",
    firstAppealSubtitle:
      "Draft a formal First Appeal to the Appellate Authority when responses are denied, incomplete, or delayed.",
    appealReasonLabel: "Grounds for First Appeal",
    reasonNoResponse: "No response received within statutory 30-day period",
    reasonUnsatisfactory: "Information provided is incomplete, misleading, or unsatisfactory",
    generateAppealBtn: "Generate Legal Appeal Draft",
    generatedAppealTitle: "Generated First Appeal Draft",
    copyTextBtn: "Copy Appeal Text",
    copiedText: "Copied to clipboard!",

    // Footer
    footerDisclaimer:
      "RTI Online is dedicated to citizen empowerment under the Right to Information Act 2005. Data processed securely.",
    footerHelpline: "National RTI Helpline: 011-24648073 | Email: helpdesk-rti@nic.in",
    footerCopyright: "© 2026 Government of India / RTI Online. All Rights Reserved.",
  },
  hi: {
    // Utility & Header
    govOfIndia: "भारत सरकार",
    madeInIndia: "मेक इन इंडिया",
    skipToMain: "मुख्य सामग्री पर जाएं",
    accessibilityOptions: "सुलभता विकल्प",
    portalTitle: "आरटीआई ऑनलाइन",
    portalSubtitle: "कार्मिक एवं प्रशिक्षण विभाग की एक पहल",

    // Navigation
    navHome: "होम",
    navCopilot: "आरटीआई कोपायलट",
    navTrackStatus: "स्थिति ट्रैक करें",
    navMyHistory: "मेरा इतिहास",
    navFaq: "अक्सर पूछे जाने वाले प्रश्न",
    navResponseAnalysis: "उत्तर विश्लेषण",
    navFirstAppeal: "प्रथम अपील",
    navFileRti: "आरटीआई दर्ज करें",
    loginRegister: "लॉगिन / पंजीकरण",
    signIn: "साइन इन",
    signOut: "साइन आउट",

    // Hero Section
    heroBadge: "सूचना का अधिकार अधिनियम, 2005",
    heroTitle1: "सरकार से पूछें अपने सवाल।",
    heroTitle2: "जटिलता हम संभालेंगे।",
    heroSubtitle:
      "भारत का पहला एआई-सहायक आरटीआई पोर्टल। कुछ ही मिनटों में सटीक सवाल तैयार करें, सही विभाग खोजें और आवेदन की स्थिति ट्रैक करें।",
    heroCtaFileNow: "अभी आरटीआई दर्ज करें",
    heroCtaCopilot: "एआई कोपायलट आजमाएं",
    heroTrackPlaceholder: "पंजीकरण / आवेदन संख्या दर्ज करें (उदा. RTI/2026/7829142)",
    heroTrackButton: "आवेदन ट्रैक करें",

    // Stats
    stat1Value: "600+",
    stat1Label: "मंत्रालय एवं सार्वजनिक प्राधिकरण मैप किए गए",
    stat2Value: "₹10",
    stat2Label: "मानक सरकारी सांविधिक शुल्क",
    stat3Value: "30 दिन",
    stat3Label: "उत्तर प्राप्त करने की वैधानिक समय सीमा",
    stat4Value: "100%",
    stat4Label: "बीपीएल नागरिकों के लिए निःशुल्क सहायता",

    // How it works
    howItWorksBadge: "आसान 4-चरणीय प्रक्रिया",
    howItWorksTitle: "आरटीआई ऑनलाइन कैसे काम करता है",
    howItWorksSubtitle: "सूचना के संवैधानिक अधिकार का उपयोग करना अब पहले से कहीं अधिक सरल है।",
    step1Title: "1. अपना प्रश्न बताएं",
    step1Desc: "सरकारी खर्च, टेंडर या नीतियों के बारे में आप जो जानना चाहते हैं उसे सरल शब्दों में लिखें।",
    step2Title: "2. एआई तैयार करेगा कानूनी मसौदा",
    step2Desc: "हमारा एआई संबंधित मंत्रालय का चयन करता है और सटीक, कानूनी रूप से सही प्रश्न तैयार करता है।",
    step3Title: "3. त्वरित समीक्षा और जमा करें",
    step3Desc: "अपने विवरण की जांच करें, ₹10 का सरकारी शुल्क भरें (बीपीएल के लिए मुफ्त) और आवेदन जमा करें।",
    step4Title: "4. ट्रैक करें और उत्तर का विश्लेषण करें",
    step4Desc: "समय-सीमा के अलर्ट प्राप्त करें, स्थिति ट्रैक करें और संतोषजनक उत्तर न मिलने पर प्रथम अपील करें।",

    // Features
    featuresBadge: "नागरिक केंद्रित सुविधाएं",
    featuresTitle: "आरटीआई अधिकार का उपयोग करने के लिए सभी साधन",
    featuresSubtitle: "हर कदम पर नागरिकों की सहायता के लिए शक्तिशाली एआई और पारदर्शी ट्रैकिंग प्रणाली।",
    feat1Title: "एआई कोपायलट और स्मार्ट आरएजी",
    feat1Desc: "सहायक पीडीएफ या टेंडर नोटिस अपलोड करें और महत्वपूर्ण संदर्भों के आधार पर स्वतः आरटीआई तैयार करें।",
    feat2Title: "प्राधिकरण और मंत्रालय की पहचान",
    feat2Desc: "सटीक रूप से पहचानता है कि आपका मामला केंद्रीय, राज्य या स्थानीय नगर निगम से संबंधित है।",
    feat3Title: "कानूनी गुणवत्ता जांच",
    feat3Desc: "आरटीआई अधिनियम की धारा 6(1) के तहत शब्दों की सीमा और सटीकता की तुरंत जांच करता है।",
    feat4Title: "लाइव स्थिति ट्रैकिंग",
    feat4Desc: "नोडल अधिकारी रसीद, सीपीआईओ आवंटन और शेष दिनों के साथ इंटरैक्टिव टाइमलाइन।",
    feat5Title: "सरकारी उत्तर विश्लेषक",
    feat5Desc: "सरकारी उत्तर को पेस्ट करें और जानें कि किन सवालों का पूरा, अधूरा या कोई जवाब नहीं दिया गया।",
    feat6Title: "1-क्लिक में प्रथम अपील",
    feat6Desc: "समय पर उत्तर न मिलने या असंतोषजनक उत्तर होने पर तुरंत धारा 19(1) के तहत प्रथम अपील तैयार करें।",

    // Modal
    modalTitle1: "सूचना का अधिकार",
    modalTitle2: "अब हुआ आसान।",
    modalSubtitle:
      "भारत सरकार से सूचना प्राप्त करने के लिए नागरिकों का सशक्तिकरण। चुनें कि आप आज अपना आवेदन कैसे दर्ज करना चाहते हैं।",
    modalCopilotBadge: "एआई-सहायता प्राप्त",
    modalCopilotTitle: "आरटीआई कोपायलट (AI Copilot)",
    modalCopilotDesc:
      "आरटीआई लिखना नहीं जानते? कोपायलट की मदद लें। हम आपको सही विभाग खोजने, कानूनी सवाल तैयार करने और आवेदन पूरा करने में मदद करेंगे।",
    modalCopilotBtn: "आरटीआई कोपायलट शुरू करें",
    modalManualTitle: "मैन्युअल दर्ज करें",
    modalManualDesc:
      "यदि आप पहले से ही सही लोक प्राधिकरण जानते हैं और आपका प्रश्न तैयार है, तो सीधे आवेदन दर्ज करें।",
    modalManualFeature1: "मानक ऑनलाइन फॉर्म",
    modalManualFeature2: "सीधा भुगतान गेटवे",
    modalManualBtn: "आवेदन शुरू करें",

    // Copilot Page
    copilotStep1: "1. प्रश्न एवं संदर्भ",
    copilotStep2: "2. एआई समीक्षा एवं संपादन",
    copilotStep3: "3. शुल्क भुगतान",
    copilotStep4: "4. पावती / पुष्टि",
    copilotHeroTitle: "एआई-संचालित आरटीआई सहायक",
    copilotHeroSubtitle:
      "सरल हिंदी या अंग्रेजी में बताएं कि आपको क्या जानकारी चाहिए। चाहें तो संबंधित दस्तावेज भी संलग्न कर सकते हैं।",
    copilotInputLabel: "आप क्या जानकारी प्राप्त करना चाहते हैं?",
    copilotInputPlaceholder:
      "उदा. मेरे क्षेत्र में सड़क मरम्मत में देरी हुई है, मुझे कुल स्वीकृत राशि, टेंडर विवरण और ठेकेदार पर लगे जुर्माने की जानकारी चाहिए...",
    copilotDocUploadTitle: "संबंधित दस्तावेज अपलोड करें (वैकल्पिक)",
    copilotDocUploadDesc: "टेंडर नोटिस / सरकारी पत्र (PDF या TXT) अपलोड करें ताकि एआई संदर्भ संख्या निकाल सके।",
    copilotSampleQueriesTitle: "या इनमें से कोई उदाहरण चुनें:",
    copilotGenerateBtn: "एआई द्वारा आरटीआई मसौदा तैयार करें",
    copilotGeneratingText: "एआई विभाग की पहचान कर रहा है और कानूनी सवाल तैयार कर रहा है...",
    copilotReviewTitle: "तैयार आरटीआई आवेदन की समीक्षा करें",
    copilotReviewSubtitle: "आवेदन जमा करने से पहले अनुशंसित प्राधिकरण, विषय और प्रश्नों की जांच करें।",
    copilotRecommendedAuth: "अनुशंसित लोक प्राधिकरण",
    copilotAuthReason: "अधिकार क्षेत्र का आधार",
    copilotSubjectLabel: "आवेदन का विषय",
    copilotQuestionsLabel: "मांगी गई जानकारी (आरटीआई प्रश्न)",
    copilotCharCount: "अक्षर संख्या",
    copilotProceedToPay: "शुल्क भुगतान के लिए आगे बढ़ें",
    copilotEditDraft: "मसौदे में बदलाव करें",
    copilotPaymentTitle: "सांविधिक आरटीआई शुल्क भुगतान",
    copilotPaymentSubtitle: "सूचना का अधिकार नियम 2012 के तहत मानक केंद्रीय सरकारी शुल्क।",
    copilotStandardFee: "मानक सांविधिक शुल्क: ₹10.00",
    copilotBplExemption: "बीपीएल कार्डधारकों को सभी प्रकार के आवेदन शुल्क से छूट प्राप्त है।",
    copilotPayAndSubmit: "₹10 का भुगतान करें और आवेदन जमा करें",
    copilotSuccessTitle: "आरटीआई आवेदन सफलतापूर्वक दर्ज किया गया!",
    copilotSuccessSubtitle:
      "आपका आवेदन संबंधित लोक प्राधिकरण के पास दर्ज हो गया है। रसीद तैयार कर दी गई है।",
    copilotAppIdLabel: "आवेदन पंजीकरण संख्या",
    copilotDownloadReceipt: "पीडीएफ रसीद डाउनलोड करें",
    copilotTrackNowBtn: "आवेदन की स्थिति ट्रैक करें",

    // Manual File RTI Page
    fileRtiTitle: "आरटीआई आवेदन दर्ज करें (मानक)",
    fileRtiSubtitle: "केंद्रीय मंत्रालयों, विभागों या सार्वजनिक उपक्रमों में सीधे ऑनलाइन आरटीआई अनुरोध भेजें।",
    applicantInfoTitle: "1. आवेदक का विवरण",
    fullNameLabel: "पूरा नाम *",
    emailLabel: "ईमेल पता *",
    mobileLabel: "मोबाइल नंबर (10 अंक) *",
    addressLabel: "पत्राचार का पता *",
    stateLabel: "राज्य / केंद्र शासित प्रदेश *",
    districtLabel: "जिला *",
    pincodeLabel: "पिन कोड *",
    categoryTitle: "2. श्रेणी एवं लोक प्राधिकरण",
    bplQuestion: "क्या आप गरीबी रेखा से नीचे (BPL) हैं?",
    bplCardNoLabel: "बीपीएल कार्ड / राशन कार्ड संख्या",
    ministryLabel: "केंद्रीय मंत्रालय / शीर्ष निकाय चुनें *",
    selectMinistry: "-- मंत्रालय चुनें --",
    departmentLabel: "लोक प्राधिकरण / विभाग चुनें *",
    selectDepartment: "-- विभाग चुनें --",
    subjectLineLabel: "आवेदन का विषय *",
    rtiTextLabel: "आरटीआई आवेदन का विवरण (अधिकतम 3,000 अक्षर) *",
    rtiTextPlaceholder: "धारा 6(1) के तहत स्पष्ट रूप से बताएं कि कौन से दस्तावेज/जानकारी चाहिए...",
    attachDocLabel: "सहायक दस्तावेज (PDF, अधिकतम 2MB)",
    submitRtiBtn: "भुगतान एवं आवेदन जमा करने के लिए आगे बढ़ें",

    // Track & History
    trackTitle: "आरटीआई आवेदन की स्थिति ट्रैक करें",
    trackSubtitle: "वास्तविक समय प्रसंस्करण स्थिति, नोडल अधिकारी अपडेट और वैधानिक समय-सीमा देखें।",
    enterAppIdPlaceholder: "आरटीआई आवेदन संख्या दर्ज करें (उदा. RTI/2026/7829142)",
    trackSearchBtn: "स्थिति जांचें",
    appDetailsTitle: "आवेदन का विवरण",
    submittedOn: "जमा करने की तिथि",
    currentStatus: "वर्तमान चरण",
    daysRemainingLabel: "शेष दिन (30 दिवसीय वैधानिक समय-सीमा)",
    timelineTitle: "आधिकारिक प्रसंस्करण समयरेखा",
    actionFirstAppealBtn: "प्रथम अपील दर्ज करें",
    actionAnalyzeRespBtn: "सरकारी उत्तर का विश्लेषण करें",
    historyTitle: "मेरे आरटीआई आवेदनों का इतिहास",
    historySubtitle: "अपने सभी दर्ज आरटीआई आवेदनों, स्थिति और अपीलों को देखें एवं प्रबंधित करें।",
    allFilter: "सभी आवेदन",
    activeFilter: "सक्रिय / प्रक्रियाधीन",
    completedFilter: "निस्तारित / पूर्ण",
    noApplicationsFound: "इस फ़िल्टर के तहत कोई आरटीआई आवेदन नहीं मिला।",

    // Response Analysis & Appeal
    respAnalysisTitle: "एआई आरटीआई उत्तर विश्लेषक",
    respAnalysisSubtitle: "जांचें कि सरकार ने आपके प्रत्येक प्रश्न का पर्याप्त उत्तर दिया है या जानकारी छिपाई है।",
    originalQuestionsLabel: "दर्ज किए गए मूल आरटीआई प्रश्न",
    pastedResponseLabel: "सरकारी उत्तर पत्र / पाठ यहां पेस्ट करें",
    analyzeBtn: "एआई से उत्तर का विश्लेषण करें",
    analysisSummaryTitle: "एआई मूल्यांकन सारांश",
    statusAnswered: "पूर्ण उत्तर दिया गया",
    statusPartial: "आंशिक उत्तर दिया गया",
    statusUnanswered: "अनुत्तरित / कोई जवाब नहीं",
    firstAppealTitle: "धारा 19(1) प्रथम अपील तैयार करें",
    firstAppealSubtitle:
      "जब जानकारी अस्वीकार कर दी जाए, अधूरी मिले या समय पर न मिले तो प्रथम अपीलीय प्राधिकारी को अपील भेजें।",
    appealReasonLabel: "प्रथम अपील का आधार / कारण",
    reasonNoResponse: "30 दिन की वैधानिक अवधि के भीतर कोई उत्तर नहीं मिला",
    reasonUnsatisfactory: "दी गई जानकारी अधूरी, भ्रामक या असंतोषजनक है",
    generateAppealBtn: "कानूनी अपील का मसौदा बनाएं",
    generatedAppealTitle: "तैयार प्रथम अपील का मसौदा",
    copyTextBtn: "अपील का पाठ कॉपी करें",
    copiedText: "क्लिपबोर्ड पर कॉपी किया गया!",

    // Footer
    footerDisclaimer:
      "आरटीआई ऑनलाइन, सूचना का अधिकार अधिनियम 2005 के तहत नागरिक सशक्तिकरण के लिए समर्पित है। डेटा सुरक्षित रूप से संसाधित होता है।",
    footerHelpline: "राष्ट्रीय आरटीआई हेल्पलाइन: 011-24648073 | ईमेल: helpdesk-rti@nic.in",
    footerCopyright: "© 2026 भारत सरकार / आरटीआई ऑनलाइन। सर्वाधिकार सुरक्षित।",
  },
};
