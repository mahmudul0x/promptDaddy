import { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn" | "hi" | "es" | "fr" | "ar";

interface translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const TRANSLATIONS: translations = {
  "nav.home": { en: "Home", bn: "হোম", hi: "होम", es: "Inicio", fr: "Accueil", ar: "الرئيسية" },
  "nav.services": { en: "Services", bn: "সেবা", hi: "सेवाएं", es: "Servicios", fr: "Services", ar: "الخدمات" },
  "nav.pricing": { en: "Pricing", bn: "মূল্য", hi: "मूल्य निर्धारण", es: "Precios", fr: "Tarifs", ar: "التسعير" },
  "nav.faq": { en: "FAQ", bn: "প্রশ্নাবলী", hi: "सामान्य प्रश्न", es: "Preguntas", fr: "FAQ", ar: "الأسئلة الشائعة" },
  "nav.contact": { en: "Contact", bn: "যোগাযোগ", hi: "संपर्क", es: "Contacto", fr: "Contact", ar: "اتصل بنا" },
  "nav.demo": { en: "Demo", bn: "ডেমো", hi: "डेमो", es: "Demo", fr: "Demo", ar: "تجربة" },
  "nav.signIn": { en: "Sign In", bn: "সাইন ইন", hi: "साइन इन", es: "Iniciar sesión", fr: "Connexion", ar: "تسجيل الدخول" },
  "nav.getStarted": { en: "Get Started", bn: "শুরু করুন", hi: "शुरू करें", es: "Comenzar", fr: "Commencer", ar: "ابدأ الآن" },
  "nav.dashboard": { en: "Dashboard", bn: "ড্যাশবোর্ড", hi: "डैशबोर्ड", es: "Tablero", fr: "Tableau de bord", ar: "لوحة التحكم" },
  
  "hero.subtitle": { en: "Claude Skills, image prompts & automation templates", bn: "ক্লড স্কিলস, ইমেজ প্রম্পট ও অটোমেশন টেমপ্লেট", hi: "क्लॉड स्किल्स, इमेज प्रॉम्प्ट्स और ऑटोमेशन टेम्पलेट्स", es: "Habilidades de Claude, prompts de imagen y plantillas de automatización", fr: "Compétences Claude, prompts d'image et modèles d'automatisation", ar: "مهارات كلود، أوامر الصور وقوالب الأتمتة" },
  "hero.subtitle2": { en: "— hand-tested for ChatGPT, Claude & Gemini. Updated every week.", bn: "— চ্যাটজিপিটি, ক্লড ও জেমিনির জন্য পরীক্ষিত। প্রতি সপ্তাহে আপডেট।", hi: "— चैटजीपीटी, क्लॉड और जेमिनी के लिए परीक्षणित। हर हफ्ते अपडेट।", es: "— probados para ChatGPT, Claude y Gemini. Actualizados cada semana.", fr: "— testés pour ChatGPT, Claude et Gemini. Mis à jour chaque semaine.", ar: "— مختبرة لـ ChatGPT وClaude وGemini. محدثة كل أسبوع." },
  "hero.prompts": { en: "19,000+ expert prompts ready to use — just copy & paste", bn: "১৯,০০০+ বিশেষজ্ঞ প্রম্পট ব্যবহারের জন্য প্রস্তুত — শুধু কপি করুন", hi: "19,000+ विशेषज्ञ प्रॉम्प्ट्स उपयोग के लिए तैयार — बस कॉपी करें", es: "19,000+ prompts expertos listos para usar — solo copia y pega", fr: "19,000+ prompts experts prêts à utiliser — Copiez et collez", ar: "19,000+ أوامر متخصصة جاهزة للاستخدام — فقط انسخ والصق" },
  
  "services.heading": { en: "One membership. Everything inside.", bn: "একটি মেম্বারশিপ। সব কিছু এর মধ্যে।", hi: "एक सदस्यता। सब कुछ अंदर।", es: "Una membresía. Todo dentro.", fr: "Un adhésions. Tout inclus.", ar: "عضوية واحدة. كل شيء بداخل." },
  "services.subheading": { en: "Ten tools to supercharge your AI workflow.", bn: "দশটি টুল আপনার এআই ওয়ার্কফ্লোকে সুপারচার্জ করতে।", hi: "दस टूल्स आपके AI वर्कफ्लो को सुपरचार्ज करने के लिए।", es: "Diez herramientas para potenciar tu flujo de trabajo de IA.", fr: "Dix outils pour amplifier votre flux de travail IA.", ar: "أدوات عشرة لتعزيز سير عملك في الذكاء الاصطناعي." },
  "services.description": { en: "Every resource is hand-tested, organized, and updated weekly — so you always have what's working right now.", bn: "প্রতিটি রিসোর্স হ্যান্ড-টেস্টেড, অর্গানাইজড এবং সাপ্তাহিক আপডেট — তাই আপনার কাছ সবসময় থাকবে যা এখন কাজ করছে।", hi: "प्रत्येक संसाधन हाथ से परीक्षित, व्यवस्थित और साप्ताहिक अपडेट किया जाता है — ताकि आपके पास हमेशा वही हो जो अभी काम कर रहा है।", es: "Cada recurso se prueba, organiza y actualiza semanalmente — para que siempre tengas lo que funciona ahora.", fr: "Chaque ressource est testée, organisée et mise à jour chaque semaine — pour que vous ayez toujours ce qui fonctionne.", ar: "كل مورد مختبَر ومنظم ومحدَّث أسبوعياً — ليمتلك دائمًا ما يعمل الآن." },
  
  "llm.title": { en: "LLM Prompts", bn: "এলএলএম প্রম্পট", hi: "LLM प्रॉम्प्ट्स", es: "Prompts LLM", fr: "Prompts LLM", ar: "أوامر LLM" },
  "llm.desc": { en: "900+ expert prompts for ChatGPT, Claude & Gemini — organized by category, copy-paste ready.", bn: "৯০০+ বিশেষজ্ঞ প্রম্পট চ্যাটজিপিটি, ক্লড ও জেমিনির জন্য — বিভাগ অনুযায়ী সংগঠিত, কপি-পেস্ট প্রস্তুত।", hi: "900+ विशेषज्ञ प्रॉम्प्ट्स चैटजीपीटी, क्लॉड और जेमिनी के लिए — श्रेणी के अनुसार व्यवस्थित।", es: "900+ prompts expertos para ChatGPT, Claude y Gemini — organizados por categoría.", fr: "900+ prompts experts pour ChatGPT, Claude et Gemini — organisés par catégorie.", ar: "900+ أوامر متخصصة لـ ChatGPT وClaude وGemini — مُنظمة حسب الفئة." },
  
  "image.title": { en: "Image Prompts", bn: "ইমেজ প্রম্পট", hi: "इमेज प्रॉम्प्ट्स", es: "Prompts de imagen", fr: "Prompts d'image", ar: "أوامر الصور" },
  "image.desc": { en: "146+ prompts for Midjourney, DALL·E 3 & Flux. Product photography, UGC, social graphics.", bn: "১৪৬+ প্রম্পট মিডজার্নি, ড্যালি-ই ৩ ও ফ্লাক্সের জন্য। প্রোডাক্ট ফটোগ্রাফি, ইউজিসি, সোশ্যাল গ্রাফিক্স।", hi: "146+ प्रॉम्प्ट्स मिडजर्नी, DALL·E 3 और फ्लक्स के लिए। प्रोडक्ट फोटोग्राफी, UGC, सोशल ग्राफिक्स।", es: "146+ prompts para Midjourney, DALL·E 3 y Flux. Fotografía de producto, UGC, gráficos sociales.", fr: "146+ prompts pour Midjourney, DALL·E 3 et Flux. Photographie produit, UGC, graphiques sociaux.", ar: "146+ أوامر لـ Midjourney وDALL·E 3 وFlux. تصوير المنتجات، ومحتوى Generated by Users، ورسومات للتواصل الاجتماعي." },
  
  "gptimage.title": { en: "GPT Image", bn: "জিপিটি ইমেজ", hi: "GPT इमेज", es: "GPT Imagen", fr: "GPT Image", ar: "صورة GPT" },
  "gptimage.desc": { en: "298+ prompts for OpenAI GPT Image generation with scores and ratings.", bn: "২৯৮+ প্রম্পট ওপেনএআই জিপিটি ইমেজ জেনারেশনের জন্য স্কোর ও রেটিং সহ।", hi: "298+ प्रॉम्प्ट्स OpenAI GPT इमेज जेनरेशन के लिए।", es: "298+ prompts para generación de imágenes GPT de OpenAI.", fr: "298+ prompts pour la génération d'images GPT d'OpenAI.", ar: "298+ أوامر لتوليد صور GPT من OpenAI." },
  
  "grok.title": { en: "Grok Imagine", bn: "গ্রক ইমাজিন", hi: "ग्रोक इमैजिन", es: "Grok Imagina", fr: "Grok Imagine", ar: "تخيل Grok" },
  "grok.desc": { en: "1,200+ prompts for xAI Grok image generation from curated sources.", bn: "১,২০০+ প্রম্পট এক্সএআই গ্রক ইমেজ জেনারেশনের জন্য সিউরেটেড সোর্স থেকে।", hi: "1,200+ प्रॉम्प्ट्स xAI Grok इमेज जेनरेशन के लिए।", es: "1,200+ prompts para generación de imágenes xAI Grok.", fr: "1,200+ prompts pour la génération d'images xAI Grok.", ar: "1,200+ أوامر لتوليد صور xAI Grok." },
  
  "nano.title": { en: "Nano Banana", bn: "ন্যানো ব্যানানা", hi: "नैनो बनाना", es: "Nano Banana", fr: "Nano Banana", ar: "نانو banana" },
  "nano.desc": { en: "13,900+ curated image generation prompts with reference media.", bn: "১৩,৯০০+ কিউরেটেড ইমেজ জেনারেশন প্রম্পট রেফারেন্স মিডিয়া সহ।", hi: "13,900+ क्यूरेटेड इमेज जेनरेशन प्रॉम्प्ट्स।", es: "13,900+ prompts de generación de imágenes curadas.", fr: "13,900+ prompts de génération d'images curés.", ar: "13,900+ أوامر لتوليد الصور." },
  
  "seedance.title": { en: "Seedance", bn: "সিডেন্স", hi: "सीडांस", es: "Seedance", fr: "Seedance", ar: "Seedance" },
  "seedance.desc": { en: "2,300+ AI video generation prompts for Seedance platform.", bn: "২,৩০০+ এআই ভিডিও জেনারেশন প্রম্পট সিডেন্স প্ল্যাটফর্মের জন্য।", hi: "2,300+ AI वीडियो जेनरेशन प्रॉम्प्ट्स।", es: "2,300+ prompts de generación de video IA.", fr: "2,300+ prompts de génération vidéo IA.", ar: "2,300+ أوامر لتوليد الفيديو." },
  
  "claude.title": { en: "Claude Skills", bn: "ক্লড স্কিলস", hi: "क्लॉड स्किल्स", es: "Habilidades Claude", fr: "Compétences Claude", ar: "مهارات Claude" },
  "claude.desc": { en: "50+ instruction sets that turn Claude into a specialist.", bn: "৫০+ ইনস্ট্রাকশন সেট যা ক্লডকে বিশেষজ্ঞ করে তোলে।", hi: "50+ निर्देश सेट जो क्लॉड को विशेषज्ञ बनाते हैं।", es: "50+ conjuntos de instrucciones.", fr: "50+ ensembles d'instructions.", ar: "50+ مجموعات تعليمات." },
  
  "videos.title": { en: "Videos", bn: "ভিডিও", hi: "वीडियो", es: "Videos", fr: "Vidéos", ar: "مقاطع الفيديو" },
  "videos.desc": { en: "32+ video tutorials covering advanced AI techniques.", bn: "৩২+ ভিডিও টিউটোরিয়াল এআই কৌশল কভার করে।", hi: "32+ वीडियो ट्यूटोरियल।", es: "32+ tutoriales en video.", fr: "32+ tutoriels vidéo.", ar: "32+ دروس فيديو." },
  
  "starter.title": { en: "Starter Kit", bn: "স্টার্টার কিট", hi: "स्टार्टर किट", es: "Kit de inicio", fr: "Kit de démarrage", ar: "مجموعة البدء" },
  "starter.desc": { en: "500+ prompts & 20 Claude Skills structured for solopreneurs.", bn: "৫০০+ প্রম্পট ও ২০ ক্লড স্কিলস সোলোপ্রেনিওরদের জন্য স্ট্রাকচার্ড।", hi: "500+ प्रॉम्प्ट्स और 20 क्लॉड स्किल्स।", es: "500+ prompts y 20 habilidades Claude.", fr: "500+ prompts et 20 compétences Claude.", ar: "500+ أوامر و20 مهارات Claude." },
  
  "cta.getAccess": { en: "Get Full Access — ৳199/mo", bn: "সম্পূর্ণ অ্যাক্সেস পান — ৳199/মাস", hi: "पूर्ण पहुंच प्राप्त करें — ₹199/माह", es: "Obtener acceso completo — $9.99/mes", fr: "Accès complet — 9.99$/mois", ar: "الحصول على الوصول الكامل — 9.99$/شهر" },
  "cta.seePlans": { en: "see all plans including Lifetime", bn: "সব প্ল্যান দেখুন সহ লাইফটাইম", hi: "सभी योजनाएं देखें", es: "ver todos los planes", fr: "voir tous les forfaits", ar: "عرض جميع الخطط" },
  
  "how.title": { en: "How It Works", bn: "কিভাবে কাজ করে", hi: "यह कैसे काम करता है", es: "Cómo funciona", fr: "Comment ça marche", ar: "كيف يعمل" },
  "how.step1.title": { en: "Choose Your Tool", bn: "আপনার টুল বেছে নিন", hi: "अपना टूल चुनें", es: "Elige tu herramienta", fr: "Choisissez votre outil", ar: "اختر أداتك" },
  "how.step1.desc": { en: "Browse our curated collections by platform and use case.", bn: "প্ল্যাটফর্ম ও ইউজ কেস অনুযায়ী আমাদের কিউরেটেড কালেকশন ব্রাউজ করুন।", hi: "प्लेटफॉर्म के अनुसार ब्राउज करें।", es: "Explora nuestras colecciones.", fr: "Parcourez nos collections.", ar: "تصفح مجموعاتنا." },
  "how.step2.title": { en: "Copy the Prompt", bn: "প্রম্পট কপি করুন", hi: "प्रॉम्प्ट कॉपी करें", es: "Copia el prompt", fr: "Copiez le prompt", ar: "انسخ الأمر" },
  "how.step2.desc": { en: "Each prompt is optimized for the best results.", bn: "প্রতিটি প্রম্পট সেরা ফলাফলের জন্য অপটিমাইজড।", hi: "प्रत्येक प्रॉम्प्ट ऑप्टिमाइज्ड है।", es: "Cada prompt está optimizado.", fr: "Chaque prompt est optimisé.", ar: "كل أمر مُحسَّن." },
  "how.step3.title": { en: "Get Results", bn: "ফলাফল পান", hi: "परिणाम प्राप्त करें", es: "Obtén resultados", fr: "Obtenez des résultats", ar: "احصل على النتائج" },
  "how.step3.desc": { en: "Paste into ChatGPT, Claude, or Gemini and watch the magic.", bn: "চ্যাটজিপিটি, ক্লড বা জেমিনিতে পেস্ট করুন এবং যাদু দেখুন।", hi: "चैटजीपीटी में पेस्ट करें।", es: "Pega en ChatGPT y observa la magia.", fr: "Collez dans ChatGPT et regardez la magie.", ar: "الصق في ChatCode وشاهد السحر." },
  
  "pricing.title": { en: "Pricing", bn: "মূল্য", hi: "मूल्य निर्धारण", es: "Precios", fr: "Tarifs", ar: "التسعير" },
  "pricing.subtitle": { en: "Simple, transparent pricing for everyone.", bn: "সবার জন্য সহজ, স্বচ্ছ মূল্য।", hi: "सरल, पारदर्शी मूल्य निर्धारण।", es: "Precios simples y transparentes.", fr: "Tarification simple et transparente.", ar: "تسعير بسيط وشفاف للجميع." },
  "pricing.choose": { en: "Choose monthly or pay once and own it forever.", bn: "মাসিক নিন বা একবার দিয়ে চিরদিনের জন্য মালিক হোন।", hi: "मासिक चुनें या एक बार भुगतान करें और हमेशा के लिए रखें।", es: "Elige mensual o paga una vez y ten para siempre.", fr: "Choisissez mensuel ou payez une fois pour garder à vie.", ar: "اختر شهري أو ادفع لمرة واحدة وحافظ عليه للأبد." },
  "pricing.monthly": { en: "Monthly", bn: "মাসিক", hi: "मासिक", es: "Mensual", fr: "Mensuel", ar: "شهري" },
  "pricing.yearly": { en: "Yearly", bn: "বার্ষিক", hi: "वार्षिक", es: "Anual", fr: "Annuel", ar: "سنوي" },
  "pricing.lifetime": { en: "Lifetime", bn: "লাইফটাইম", hi: "आजीवन", es: "De por vida", fr: "À vie", ar: "مدى الحياة" },
  "pricing.oneTime": { en: "One-time", bn: "একবার", hi: "एक बार", es: "Una vez", fr: "Une fois", ar: "لمرة واحدة" },
  
  "how.subtitle": { en: "Up and running in 3 steps.", bn: "৩ ধাপে চালু হোন।", hi: "3 चरणों में शुरू करें।", es: "En funcionamiento en 3 pasos.", fr: "Fonctionne en 3 étapes.", ar: "يعمل في 3 خطوات." },
  "how.description": { en: "No complex setup. No waiting. Just access.", bn: "কোনো জটিল সেটআপ নেই। অপেক্ষা নেই। শুধু অ্যাক্সেস।", hi: "कोई जटिल सेटअप नहीं। बस पहुंच।", es: "Sin configuración compleja. Solo acceso.", fr: "Pas de configuration complexe. Juste l'accès.", ar: "لا إعداد معقد. فقط الوصول." },
  
  "faq.subtitle": { en: "Frequently Asked Questions", bn: "প্রায় জিজ্ঞাসিত প্রশ্ন", hi: "बार पूछे जाने वाले प्रश्न", es: "Preguntas frecuentes", fr: "Questions fréquemment posées", ar: "الأسئلة الشائعة" },
"faq.description": { en: "Quick answers about payment, access, and what's included in your membership.", bn: "মেম্বারশিপে অন্তর্ভুক্ত পেমেন্ট, অ্যাক্সেস এবং কী আছে সে সম্পর্কে দ্রুত উত্তর।", hi: "भुगतान, पहुंच और आपके सदस्यता में क्या शामिल है इसके बारे में त्वरित उत्तर।", es: "Respuestas rápidas sobre pago, acceso y qué está incluido en tu membresía.", fr: "Réponses rapides sur le paiement, l'accès et ce qui est inclus dans votre adhésion.", ar: "إجابات سريعة حول الدفع والوصول وما Included في عضويتك." },
  
  "contact.title": { en: "Contact", bn: "যোগাযোগ", hi: "संपर्क", es: "Contacto", fr: "Contact", ar: "اتصل بنا" },
  "contact.subtitle": { en: "Talk to us", bn: "আমাদের সাথে কথা বলুন", hi: "हमसे बात करें", es: "Contáctanos", fr: "Contactez-nous", ar: "تحدث معنا" },
  "contact.description": { en: "Have a payment issue, account question, or general inquiry? Send us a message and we will get back to you as quickly as possible.", bn: "পেমেন্ট সমস্যা, অ্যাকাউন্ট প্রশ্ন বা সাধারণ জিজ্ঞাসা? আমাদের একটি মেসেজ পাঠান এবং আমরা আপনার কাছে যত দ্রুত সম্ভব ফিরে আসব।", hi: "भुगतान मुद्दा, खाता प्रश्न, या सामान्य पूछताछ? हमें एक संदेश भेजें और हम जितनी जल्दी हो सके वापस आएंगे।", es: "¿Tienes un problema de pago, pregunta de cuenta o consulta general? Envíanos un mensaje y te responderemos lo antes posible.", fr: "Un problème de paiement, une question sur le compte ou une demande générale? Envoyez-nous un message et nous vous répondrons dès que possible.", ar: "هل لديك مشكلة في الدفع أو سؤال عن الحساب أو استعلام عام؟ أرسل لنا رسالة وسنعود إليك في أسرع وقت ممكن." },
  "contact.emailTitle": { en: "Email Support", bn: "ইমেইল সাপোর্ট", hi: "ईमेल सहायता", es: "Soporte por correo", fr: "Support par e-mail", ar: "دعم البريد الإلكتروني" },
  "contact.emailDesc": { en: "Best for payment confirmation, activation issues, and account support.", bn: "পেমেন্ট নিশ্চিতকরণ, অ্যাক্টিভেশন সমস্যা এবং অ্যাকাউন্ট সাপোর্টের জন্য সেরা।", hi: "भुगतान पुष्टि, सक्रियण मुद्दों, और खाता सहायता के लिए सबसे अच्छा।", es: "Lo mejor para confirmación de pago, problemas de activación y soporte de cuenta.", fr: "Idéal pour confirmation de paiement, problèmes d'activation et support de compte.", ar: "الأفضل لتأكيد الدفع ومشاكل التفعيل ودعم الحساب." },
  "contact.telegramTitle": { en: "Telegram Group", bn: "টেলিগ্রাম গ্রুপ", hi: "टेलीग्राम ग्रुप", es: "Grupo de Telegram", fr: "Groupe Telegram", ar: "مجموعة تيليجرام" },
  "contact.telegramDesc": { en: "Join our community for prompts, tips, and AI discussions.", bn: "প্রম্পট, টিপস এবং AI আলোচনার জন্য আমাদের কমিউনিটিতে যোগ দিন।", hi: "प्रॉम्प्ट्स, टिप्स और AI चर्चा के लिए हमारे समुदाय में शामिल हों।", es: "Únete a nuestra comunidad para prompts, consejos y discusiones de IA.", fr: "Rejoignez notre communauté pour les prompts, conseils et discussions IA.", ar: "انضم إلى مجموعتنا للأوامر ونصائح ومناقشات الذكاء الاصطناعي." },
  "contact.formName": { en: "Your name", bn: "আপনার নাম", hi: "आपका नाम", es: "Tu nombre", fr: "Votre nom", ar: "اسمك" },
  "contact.formEmail": { en: "Email address", bn: "ইমেইল ঠিকানা", hi: "ईमेल पता", es: "Dirección de correo", fr: "Adresse e-mail", ar: "عنوان البريد الإلكتروني" },
  "contact.formMessage": { en: "Your message", bn: "আপনার মেসেজ", hi: "आपका संदेश", es: "Tu mensaje", fr: "Votre message", ar: "رسالتك" },
  "contact.formSend": { en: "Send Message", bn: "মেসেজ পাঠান", hi: "संदेश भेजें", es: "Enviar mensaje", fr: "Envoyer le message", ar: "إرسال الرسالة" },
  "contact.formSuccess": { en: "Message sent!", bn: "মেসেজ পাঠানো হয়েছে!", hi: "संदेश भेज दिया!", es: "¡Mensaje enviado!", fr: "Message envoyé!", ar: "تم إرسال الرسالة!" },
  
  "footer.tagline": { en: "PROMPT BETTER. CREATE FASTER. GROW MORE.", bn: "ভালো প্রম্পট। দ্রুত তৈরি। বেশি বৃদ্ধি।", hi: "বেতর প্রম্পট। তেজ নির্মাণ। অধিক বিকাশ।", es: "MEJOR PROMPT. CREA MÁS RÁPIDO. CRECE MÁS.", fr: "MIEUX PROMPTER. CRÉER PLUS VITE. GRANDIR PLUS.", ar: "PROMPT лучше. Создавайте быстрее. Растите больше." },
  "footer.privacy": { en: "Privacy", bn: "গোপনীয়তা", hi: "गोपनीयता", es: "Privacidad", fr: "Confidentialité", ar: "الخصوصية" },
  "footer.terms": { en: "Terms", bn: "শর্তাবলী", hi: "नियम", es: "Términos", fr: "Conditions", ar: "الشروط" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "bn", "hi", "es", "fr", "ar"].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};