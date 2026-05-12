import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ_DATA = {
  q1: {
    q: { en: "How do I make a payment?", bn: "আমি কীভাবে পেমেন্ট করব?", hi: "मैं भुगतान कैसे करूं?", es: "¿Cómo realizo un pago?", fr: "Comment effectuer un paiement?", ar: "كيف أقوم بالدفع?" },
    a: { en: "You can pay using bKash or Nagad. Choose your preferred plan in the Pricing section, send the payment to our number, then submit the transaction ID in the form.", bn: "আপনি bKash বা Nagad দিয়ে পেমেন্ট করতে পারেন। মূল্য বিভাগে আপনার পছন্দের প্ল্যান বেছে নিন, আমাদের নম্বরে পেমেন্ট পাঠান, তারপর ফর্মে ট্রানজ্যাকশন আইডি জমা দিন।", hi: "आप bKash या Nagad से भुगतान कर सकते हैं। मूल्य खंड में अपनी पसंदीदा योजना चुनें, हमें भुगतान भेजें, फिर फॉर्म में लेनदेन ID सबमिट करें।", es: "Puedes pagar con bKash o Nagad. Elige tu plan preferido en la sección de Precios, envía el pago a nuestro número, luego envía el ID de transacción.", fr: "Vous pouvez payer avec bKash ou Nagad. Choisissez votre plan préféré dans la section Tarifs, envoyez le paiement, puis soumettez l'ID de transaction.", ar: "يمكنك الدفع عبر bKash أو Nagad. اختر خطتك المفضلة في قسم التسعير، وأرسل الدفع إلى رقم与我们联系،然后在表格中提交交易ID。" },
  },
  q2: {
    q: { en: "How long does the monthly plan stay active?", bn: "মাসিক প্ল্যান কতদিন সক্রিয় থাকবে?", hi: "मासिक योजना कितने समय के लिए सक्रिय रहती है?", es: "¿Cuánto tiempo dura el plan mensal?", fr: "Combien de temps le plan mensuel reste-t-il actif?", ar: "كم يستمر_plan الشهرية نشطا?" },
    a: { en: "The monthly plan stays active for 30 days from the date of payment. After that, access expires automatically unless you renew.", bn: "পেমেন্টের তারিখ থেকে ৩০ দিন মাসিক প্ল্যান সক্রিয় থাকে। তারপর, আপনি নবায়ন না করলে অ্যাক্সেস স্বয়ংক্রিয়ভাবে মেয়াদ শেষ হয়ে যায়।", hi: "भुगतान की तारीख से 30 दिनों तक मासिक योजना सक्रिय रहती है। उसके बाद, जब तक आप नवीनीकरण नहीं करते, पहुंच स्वचालित रूप से समाप्त हो जाती है।", es: "El plan mensal dura 30 días desde la fecha de pago. Después, el acceso caduca automáticamente.", fr: "Le plan mensuel reste actif pendant 30 jours à compter de la date de paiement. Après, l'accès expire automatiquement.", ar: "يستمر_plan الشهري نشطا لمدة 30 يومامن تاريخ الدفع. بعد ذلك، تنتهي صلاحية الوصول تلقائيا." },
  },
  q3: {
    q: { en: "Should I choose Monthly or Lifetime?", bn: "আমি মাসিক না লাইফটাইম বেছে নেব?", hi: "मैं मासिक या आजीवन चुनूं?", es: "¿Debo elegir Mensual o lifetime?", fr: "Dois-je choisir Mensuel ou À vie?", ar: "هل يجب أن أختار Monthly أم Lifetime?" },
    a: { en: "If you want to try the platform first, the monthly plan is a good starting point. If you plan to keep using the library and tools long term, the lifetime plan gives much better value.", bn: "আপনি যদি প্রথমে প্ল্যাটফর্মটি ট্রাই করতে চান, মাসিক প্ল্যান একটি ভালো শুরুর পয়েন্ট। আপনি যদি দীর্ঘমেয়াদে লাইব্রেরি ও টুল ব্যবহার করার পরিকল্পনা করেন, লাইফটাইম প্ল্যান অনেক বেশি মূল্য দেয়।", hi: "यदि आप पहले मंच का प्रयास करना चाहते हैं, तो मासिक योजना एक अच्छा प्रारंभिक बिंदु है। यदि आप लाइब्रेरी और उपकरणों का दीर्घकालिक उपयोग करने की योजना बनाते हैं, तो आजीवन योजना बहुत बेहतर मूल्य प्रदान करती है।", es: "Si quieres probar la plataforma primero, el plan mensal es un buen punto de partida. Si planeas usar la biblioteca a largo plazo, el plan lifetime ofrece mucho mejor valor.", fr: "Si vous voulez d'abord essayer la plateforme, le plan mensuel est un bon point de départ. Si vous prévoyez d'utiliser la bibliothèque à long terme, le plan à vie offre une bien meilleure valeur.", ar: "إذا كنت تريد تجربة المنصة أولا، فإن الخطة الشهرية هي نقطة انطلاق جيدة. إذا كنت تخطط لاستخدام المكتبة والأدوات على المدى الطويل، فإن الخطة Lifetime تقدم قيمة أفضل بكثير." },
  },
  q4: {
    q: { en: "How long does activation take after payment?", bn: "পেমেন্টের পরে অ্যাক্টিভেশনে কত সময় লাগে?", hi: "भुगतान के बाद सक्रियण में कितना समय लगता है?", es: "¿Cuánto tiempo tarde la activación después del pago?", fr: "Combien de temps faut-il pour activer après le paiement?", ar: "كم من الوقت تستغرق العملية بعد الدفع?" },
    a: { en: "Our team reviews and activates payments as fast as possible. If your account hasn't been unlocked yet, you can contact us directly and we'll sort it out right away.", bn: "আমাদের দল যত দ্রুত সম্ভব পেমেন্ট পর্যালোচনা ও অ্যাক্টিভেট করে। যদি আপনার অ্যাকাউন্ট এখনও আনলক না হয়, আপনি সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন এবং আমরা তাৎক্ষণিক সমাধান করব।", hi: "हमारी टीम जितनी जल्दी हो सके भुगतान की समीक्षा और सक्रियण करती है। यदि आपका खाता अभी तक अनल��क ��हीं हुआ है, तो आप सीधे हमसे संपर्क कर सकते हैं और हम तुरंत इसे ठीक कर देंगे।", es: "Nuestro equipo revisa y activa los pagos lo más rápido posible. Si tu cuenta aún no está desbloqueada, puedes contactarnos directamente.", fr: "Notre équipe examine et active les paiements le plus rapidement possible. Si votre compte n'a pas encore été déverrouillé, vous pouvez nous contacter directement.", ar: "يقوم فريقنا بمراجعة وتفعيل المدفوعات في أسرع وقت ممكن.إذا لم يتم فتح حسابك بعد، فيمكنك التواصل معنا مباشرة." },
  },
  q5: {
    q: { en: "Do I need ChatGPT Plus or Claude Pro to use this platform?", bn: "আমার কি ChatGPT Plus বা Claude Pro প্রয়োজন হবে?", hi: "क्या मुझे इस मंच का उपयोग करने के लिए ChatGPT Plus या Claude Pro की आवश्यकता है?", es: "¿Necesito ChatGPT Plus o Claude Pro para usar esta plataforma?", fr: "Ai-je besoin de ChatGPT Plus ou Claude Pro pour utiliser cette plateforme?", ar: "هل أحتاج إلى ChatGPT Plus أو Claude Pro لاستخدام هذه المنصة?" },
    a: { en: "No. Most prompts and resources can still help you even if you use free versions of AI tools. Paid AI plans can unlock more advanced results, but they are not required.", bn: "না। বেশিরভাগ প্রম্পট ও রিসোর্স এখনও আপনাকে সাহায্য করতে পারে এমনকি আপনি AI টুলের ফ্রি ভার্সন ব্যবহার করলেও। পেইড AI প্ল্যান উন্নত ফলাফল আনলক করতে পারে, কিন্তু তা প্রয়োজন নেই।", hi: "नहीं। अधिकांश प्रॉम्प्ट्स और संसाधन अभी भी आपकी मदद कर सकते हैं भले ही आप AI टूल्स के मुफ्त संस्करण का उपयोग करें। भुगतान किए गए AI योजनाएं अधिक उन्नत परिणामों को अनलॉक कर सकती हैं, लेकिन उनकी आवश्यकता नहीं है।", es: "No. La mayoría de los prompts y recursos aún pueden ayudarte incluso si usas versiones gratuitas de herramientas de IA.", fr: "Non. La plupart des prompts et ressources peuvent toujours vous aider même si vous utilisez des versions gratuites d'outils IA.", ar: "لا. لا يزال معظم الأوامر والموارد قادرة على مساعدتك حتى لو كنت تستخدم إصدارات مجانية من أدوات الذكاء الاصطناعي." },
  },
  q6: {
    q: { en: "Do lifetime members get future updates?", bn: "লাইফটাইম সদস্যরা কি ভবিষ্যতে আপডেট পাবেন?", hi: "क्या आजीवन सदस्यों को भविष्य के अपडेट मिलते हैं?", es: "¿Los miembros lifetime reciben actualizaciones futuras?", fr: "Les membres à vie reçoivent-ils les futures mises à jour?", ar: "هل يحصل أعضاء Lifetime على تحديثات مستقبلية?" },
    a: { en: "Yes. Lifetime members get access to future prompt updates, new resources, and new additions without paying again.", bn: "হ্যাঁ। লাইফটাইম সদস্যরা পুনরায় পেমেন্ট ছাড়াই ভবিষ্যতে প্রম্পট আপডেট, নতুন রিসোর্স এবং নতুন যো��� করার অ্যাক্সেস পান।", hi: "हां। आजीवन सदस्यों को भविष्य के प्रॉम्प्ट अपडेट, नए संसाधनों और नए जोड़ों तक बिना फिर से भुगतान के पहुंच मिलती है।", es: "Sí. Los miembros lifetime tienen acceso a actualizaciones futuras, nuevos recursos y nuevas adiciones sin pagar de nuevo.", fr: "Oui. Les membres à vie ont accès aux futures mises à jour des prompts, aux nouvelles ressources sans payer à nouveau.", ar: "نعم. يحصل أعضاء Lifetime على الوصول إلى تحديثات الأوامر المستقبلية والموارد الجديدة دون الدفع مرة أخرى." },
  },
  q7: {
    q: { en: "What is included inside the platform?", bn: "প্ল্যাটফর্মে কী অন্তর্ভুক্ত?", hi: "मंच के अंदर क्या शामिल है?", es: "¿Qué incluye la plataforma?", fr: "Qu'est-ce qui est inclus dans la plateforme?", ar: "ما الذي included في المنصة?" },
    a: { en: "You get access to expert LLM prompts, image prompts, Claude skills, AI search, prompt enhancers, tutorials, videos, AI news, automation templates, and model recommendations.", bn: "আপনি বিশেষজ্ঞ LLM প্রম্পট, ইমেজ প্রম্পট, Claude স্কিলস, AI সার্চ, প্রম্পট এনহ্যান্সার, টিউটোরিয়াল, ভিডিও, AI নিউজ, অটোমেশন টেমপ্লেট এবং মডেল সুপারিশের অ্যাক্সেস পান।", hi: "आपको विशेषज्ञ LLM प्रॉम्प्ट्स, इमेज प्रॉम्प्ट्स, क्लॉड स्किल्स, AI सर्च, प्रॉम्प्ट एनहांसर, ट्यूटोरियल, वीडियो, AI न्यूज, ऑटोमेशन टेम्पलेट्स और मॉडल सुझावों तक पहुंच मिलती है।", es: "Obtienes acceso a prompts LLM expertos, prompts de imagen, habilidades Claude, búsqueda IA, mejoradores de prompts, tutoriales, videos, noticias IA, plantillas de automatización y recomendaciones de modelos.", fr: "Vous avez accès aux prompts LLM experts, aux prompts d'image, aux compétences Claude, à la recherche IA, aux enhanceurs de prompts, tutoriels, vidéos, Actualités IA, modèles d'automatisation et recommandations de modèles.", ar: "لديك الوصول إلى أوامر LLM المتخصصة، وأوامر الصور، ومهارات Claude، والبحث بالذكاء الاصطناعي، وتحسين الأوامر، والبرامج التعليمية، ومقاطع الفيديو، وأخبار الذكاء الاصطناعي، وقوالب الأتمتة، وتوصيات النماذج." },
  },
  q8: {
    q: { en: "What is your refund policy?", bn: "আপনাদের রিফান্ড পলিসি কী?", hi: "आपकी रिफंड नीति क्या है?", es: "¿Cuál es su política de reembolsos?", fr: "Quelle est votre politique de remboursement?", ar: "ما هي سياسة الاسترداد الخاصة بك?" },
    a: { en: "All sales are final. Because our content is digital and immediately accessible after activation, we do not offer refunds. Exceptions may be made if your payment was confirmed but your account was never activated, or if a duplicate payment was made by mistake. Email mahmudulabin@gmail.com within 7 days with your transaction ID.", bn: "সব বিক্রয় চূড়ান্ত। কারণ আমাদের কন্টেন্ট ডিজিটাল এবং অ্যাক্টিভেশনের পর তাৎক্ষণিক অ্যাক্সেসযোগ্য, আমরা রিফান্ড অফার করি না। ব্যতিক্রম হতে পারে যদি আপনার পেমেন্ট নিশ্চিত হয় কিন্তু আপনার অ্যাকাউন্ট কখনো অ্যাক্টিভেট না হয়, বা ভুলে ডুপ্লিকেট পেমেন্ট করা হয়। ৭ দিনের মধ্যে আপনার ট্রানজ্যাকশন আইডি সহ mahmudulabin@gmail.com ইমেইল করুন।", hi: "सभी बिक्री अंतिम है। क्योंकि हमारी सामग्री डिजिटल है और सक्रियण के तुरंत बाद सुलभ है, हम रिफंड नहीं देते हैं। अपवाद तब किए जा सकते हैं यदि आपका भुगतान की पुष्टि हुई लेकिन आपका खाता कभी सक्रिय नहीं हुआ, या गलती से डुप्लिकेट भुगतान किया गया। अपने लेनदेन ID के ���ा��� 7 दिनों के भीतर mahmudulabin@gmail.com पर ईमेल करें।", es: "Todas las ventas son finales. Como nuestro contenido es digital y accesible inmediatamente después de la activación, no ofrecemos reembolsos.", fr: "Toutes les ventes sont finales. Comme notre contenu est numérique et immédiatement accessible après activation, nous n'offrons pas de remboursements.", ar: "جميع المبيعات نهائية. نظرا لأن المحتوى الخاص بنا رقمي ومتاح فورا بعد التفعيل، فإننا لا نقدم عمليات الاسترداد." },
  },
  q9: {
    q: { en: "Where should I contact you if I face a problem?", bn: "আমি কোথায় যোগাযোগ করব যদি আমার কোনো সমস্যা হয়?", hi: "मुझे कहां संपर्क करना चाहिए अगर मुझे कोई समस्या आए?", es: "¿Dónde puedo contactarte si tengo un problema?", fr: "Où dois-je vous contacter si j'ai un problème?", ar: "أين يجب أن أتصل بك إذا كانت لدي مشكلة?" },
    a: { en: "Use the contact form below or email us directly at mahmudulabin@gmail.com. We usually reply within 1 to 2 hours.", bn: "নিচের যোগাযোগ ফর্ম ব্যবহার করুন বা সরাসরি mahmudulabin@gmail.com ইমেইল করুন। আমরা সাধারণত ১ থেকে ২ ঘণ্টার মধ্যে উত্তর দিই।", hi: "नीचे दिए गए संपर्न फॉर्म का उपयोग करें या सीधे हमें mahmudulabin@gmail.com पर ईमेल करें। हम आमतौर पर 1 से 2 घंटों के भीतर उत्तर देते हैं।", es: "Usa el formulario de contacto abajo o envíanos un correo a mahmudulabin@gmail.com. Por lo general respondemos en 1 a 2 horas.", fr: "Utilisez le formulaire de contact ci-dessous ou envoyez-nous un e-mail à mahmudulabin@gmail.com. Nous répondons généralement dans les 1 à 2 heures.", ar: "استخدم نموذج الاتصال أدناه أو راسلنا مباشرة على mahmudulabin@gmail.com. عادة ما نرد خلال من 1 إلى 2 ساعة." },
  },
};

export const FAQ = () => {
  const { language, t: translate } = useLanguage();

  const faqs = [
    { q: FAQ_DATA.q1.q[language], a: FAQ_DATA.q1.a[language] }, // How to pay
    { q: FAQ_DATA.q4.q[language], a: FAQ_DATA.q4.a[language] }, // Activation time
    { q: FAQ_DATA.q3.q[language], a: FAQ_DATA.q3.a[language] }, // Monthly vs Lifetime
    { q: FAQ_DATA.q7.q[language], a: FAQ_DATA.q7.a[language] }, // What's included
    { q: FAQ_DATA.q8.q[language], a: FAQ_DATA.q8.a[language] }, // Refund policy
  ];

  return (
    <section id="faq" className="relative py-20 sm:py-28 ">
      <div className="faq-inner mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">{translate('faq.title')}</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gradient">{translate('faq.subtitle')}</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            {translate('faq.description')}
          </p>
        </div>
        <Accordion type="single" collapsible className="glass rounded-2xl px-2 sm:px-4">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
              <AccordionTrigger className="text-left text-base font-medium hover:text-primary px-2 sm:px-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed px-2 sm:px-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
