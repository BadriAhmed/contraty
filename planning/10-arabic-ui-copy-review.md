# Arabic UI Copy — Review of the Tunisian Used

Generated for verification. Sources: frontend components, i18n messages, FAQ, template field metadata (labels/help/hints). Legal article texts are excluded.

## 1. i18n messages (frontend/src/messages/ar.json)

- `site.title`: كونتراتي — عقود قانونية تونسية
- `site.description`: أنشئ عقودًا قانونية تونسية ثنائية اللغة بسهولة. 22 نموذجًا تغطي السكن، العمل، المعاملات المالية، السيارات، الشركات والإجراءات الإدارية.
- `site.disclaimer`: تحذير: النماذج المقدمة إرشادية ولم يراجعها محامٍ. لا تشكل استشارة قانونية. راجع محاميًا قبل الاستخدام.
- `site.disclaimerCheckbox`: أقر بأن هذا النموذج إرشادي ولم يراجعه محامٍ، وأنه لا يغني عن استشارة قانونية.
- `nav.home`: الرئيسية
- `nav.contracts`: النماذج
- `nav.generate`: إنشاء عقد
- `home.hero`: عقود قانونية تونسية
- `home.heroSub`: 22 نموذجًا ثنائي اللغة — أنشئ عقدك في دقائق
- `home.cta`: اختر نموذجًا
- `home.domains`: اختر المجال
- `home.popular`: الأكثر طلبًا
- `wizard.title`: إنشاء عقد
- `wizard.step`: الخطوة {current} من {total}
- `wizard.next`: التالي
- `wizard.back`: السابق
- `wizard.generate`: إنشاء العقد
- `wizard.downloadPdf`: تحميل PDF
- `wizard.fieldRequired`: هذا الحقل مطلوب
- `wizard.disclaimerRequired`: يجب الموافقة على إخلاء المسؤولية
- `contract.legalBasis`: الإطار القانوني
- `contract.fields`: عدد الحقول
- `contract.generateThis`: إنشاء هذا العقد
- `contract.modelUsed`: النموذج المستخدم
- `contract.generationTime`: مدة الإنشاء

## 2. FAQ (FAQAccordion.tsx)

- q_ar: "هل النماذج مجانية؟",
- "نعم. جميع النماذج الـ22 مجانية بالكامل. تُموَّل المنصة بالإعلانات غير المزعجة التي تظهر خلال أوقات الانتظار (الإنشاء والتحميل).",
- q_ar: "هل العقود متوافقة مع القانون التونسي؟",
- "جميع نماذجنا مبنية على المجلات القانونية التونسية: مجلة الالتزامات والعقود، مجلة الشغل، ومجلة الشركات التجارية. يذكر كل نموذج أساسه القانوني.",
- q_ar: "كيف أستخدم المنصة؟",
- "ثلاث خطوات: اختر نموذجًا من بين 22 عقدًا، املأ الحقول (الاسم، بطاقة التعريف، المبالغ...)، ثم حمّل عقدك بصيغة PDF أو Word جاهز للتوقيع.",
- q_ar: "هل بياناتي آمنة؟",
- "لا يتم تخزين بياناتك. يتم الإنشاء في الجلسة: بمجرد تحميل العقد، تُحذف معلوماتك. لا حاجة لإنشاء حساب.",
- q_ar: "هل العقود متاحة بالعربية والفرنسية؟",
- "نعم، كل نموذج متاح بالعربية والفرنسية. يمكنك التبديل بين اللغتين في أي وقت من شريط التنقل.",
- q_ar: "هل أحتاج إلى محامٍ؟",
- "تغطي نماذجنا الحالات الشائعة. في الحالات المعقدة أو البنود المخصصة، ننصح باستشارة محامٍ. يبقى العقد المُنشأ نقطة انطلاق متينة.",

## 3. Frontend UI strings (components / app / lib)

- frontend/src/app/[lang]/blank/[type]/page.tsx:117 — <h1 className="text-2xl font-bold text-error mb-2">{lang === "ar" ? "خطأ" : "Erreur"}</h1>
- frontend/src/app/[lang]/blank/[type]/page.tsx:120 — {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
- frontend/src/app/[lang]/blank/[type]/page.tsx:143 — {lang === "ar" ? "نموذج فارغ" : "Modèle vierge"}
- frontend/src/app/[lang]/blank/[type]/page.tsx:147 — {lang === "ar" ? "إغلاق" : "Quitter"}
- frontend/src/app/[lang]/blank/[type]/page.tsx:159 — {lang === "ar" ? "تفاصيل العقد" : "Détails du contrat"}
- frontend/src/app/[lang]/blank/[type]/page.tsx:163 — {lang === "ar" ? "نموذج فارغ" : "Modèle vierge"}: {title}
- frontend/src/app/[lang]/blank/[type]/page.tsx:166 — {lang === "ar" ? "قم بتحميل النموذج واملأه يدوياً، أو استخدم الذكاء الاصطناعي لتخصيصه" : "Téléchargez le modèle et remplissez-le manuellement, ou utilisez l'IA pour le personnaliser"}
- frontend/src/app/[lang]/blank/[type]/page.tsx:176 — <>متأكد؟ التعبئة المسبقة تخليها أسهل بزاف عليك</>
- frontend/src/app/[lang]/blank/[type]/page.tsx:183 — ? "معلوماتك تتدخل وحدها، العقد يتتراجع ويصير جاهز للتوقيع في دقائق — بلا كتابة يدوية."
- frontend/src/app/[lang]/blank/[type]/page.tsx:191 — {lang === "ar" ? "ابدأ الآن" : "Commencer"}
- frontend/src/app/[lang]/blank/[type]/page.tsx:219 — {lang === "ar" ? "تخصيص النموذج عبر الذكاء الاصطناعي" : "Personnaliser avec l'IA"}
- frontend/src/app/[lang]/blank/[type]/page.tsx:223 — ? "صف التعديلات التي تريدها على النموذج (مرة واحدة فقط). مثال: أضف شرط عدم المنافسة لمدة سنتين."
- frontend/src/app/[lang]/blank/[type]/page.tsx:232 — ? "مثال: أضف شرطاً يمنع المستأجر من تغيير النشاط التجاري دون موافقة المالك..."
- frontend/src/app/[lang]/blank/[type]/page.tsx:242 — ? (lang === "ar" ? "جاري التعديل..." : "Modification en cours...")
- frontend/src/app/[lang]/blank/[type]/page.tsx:243 — : (lang === "ar" ? "تطبيق التعديلات" : "Appliquer les modifications")}
- frontend/src/app/[lang]/blank/[type]/page.tsx:251 — {lang === "ar" ? "تم تعديل النموذج حسب طلبك." : "Modèle modifié selon votre demande."}
- frontend/src/app/[lang]/blank/[type]/page.tsx:272 — ? "هذا النموذج فارغ ومخصص للتعبئة اليدوية. لإنشاء عقد مملوء تلقائياً، استخدم المعالج."
- frontend/src/app/[lang]/blank/[type]/page.tsx:277 — {lang === "ar" ? "استخدم المعالج التلقائي" : "Utiliser l'assistant automatique"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:45 — ar: { text: "نص", number: "رقم", cin: "بطاقة تعريف", email: "بريد إلكتروني", phone: "هاتف", date: "تاريخ", percentage: "نسبة", select: "اختيار" },
- frontend/src/app/[lang]/contracts/[type]/page.tsx:58 — {lang === "ar" ? "العقد غير موجود" : "Contrat introuvable"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:61 — {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:104 — title: lang === "ar" ? "املأ الحقول" : "Remplissez les champs",
- frontend/src/app/[lang]/contracts/[type]/page.tsx:106 — ? "أدخل معلوماتك خطوة بخطوة مع تلميحات وتحقق فوري"
- frontend/src/app/[lang]/contracts/[type]/page.tsx:112 — title: lang === "ar" ? "راجع العقد" : "Révisez le contrat",
- frontend/src/app/[lang]/contracts/[type]/page.tsx:114 — ? "تحقق من البنود والاقتراحات قبل التحميل"
- frontend/src/app/[lang]/contracts/[type]/page.tsx:120 — title: lang === "ar" ? "حمّل العقد" : "Téléchargez le contrat",
- frontend/src/app/[lang]/contracts/[type]/page.tsx:122 — ? "PDF أو Word جاهز للتوقيع — في ثوانٍ"
- frontend/src/app/[lang]/contracts/[type]/page.tsx:134 — {lang === "ar" ? "الرئيسية" : "Accueil"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:169 — {lang === "ar" ? "الأساس القانوني" : "Base légale"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:175 — {fieldCount} {lang === "ar" ? (fieldCount === 1 ? "حقل" : fieldCount === 2 ? "حقلان" : "حقول") : (fieldCount > 1 ? "champs" : "champ")}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:181 — {lang === "ar" ? `حوالي ${estMinutes} ${estMinutes === 1 ? "دقيقة" : estMinutes === 2 ? "دقيقتين" : "دقائق"}` : `~${estMinutes} min`}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:187 — {lang === "ar" ? "مجاني" : "Gratuit"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:196 — {lang === "ar" ? "عقد مُنشأ" : "contrats générés"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:205 — {lang === "ar" ? "الأساس القانوني: " : "Base légale : "}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:221 — {lang === "ar" ? "ابدأ الآن" : "Commencer"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:229 — {lang === "ar" ? "تحميل فارغ" : "Modèle vierge"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:236 — {lang === "ar" ? "المعلومات المطلوبة" : "Informations requises"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:239 — {lang === "ar" ? "ستحتاج إلى هذه البيانات لملء العقد" : "Vous aurez besoin de ces informations pour remplir le contrat"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:256 — ({lang === "ar" ? "اختياري" : "facultatif"})
- frontend/src/app/[lang]/contracts/[type]/page.tsx:277 — {lang === "ar" ? "جاهز للبدء؟" : "Prêt à commencer ?"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:280 — {lang === "ar" ? "أنشئ عقدك في دقائق — مجانًا تمامًا" : "Créez votre contrat en quelques minutes — entièrement gratuit"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:312 — {lang === "ar" ? "ثلاث خطوات" : "3 étapes"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:315 — {lang === "ar" ? "كيف يعمل؟" : "Comment ça marche"}
- frontend/src/app/[lang]/contracts/[type]/page.tsx:345 — {lang === "ar" ? "ثلاث خطوات بسيطة" : "3 étapes simples"}
- frontend/src/app/[lang]/error.js:20 — {lang === "ar" ? "حدث خطأ" : "Une erreur est survenue"}
- frontend/src/app/[lang]/error.js:23 — {error?.message || (lang === "ar" ? "يرجى المحاولة مرة أخرى" : "Veuillez réessayer")}
- frontend/src/app/[lang]/error.js:29 — {lang === "ar" ? "إعادة المحاولة" : "Réessayer"}
- frontend/src/app/[lang]/generate/[type]/page.tsx:212 — <h1 className="text-2xl font-bold text-error mb-2">{lang === "ar" ? "خطأ" : "Erreur"}</h1>
- frontend/src/app/[lang]/generate/[type]/page.tsx:215 — {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
- frontend/src/app/[lang]/generate/[type]/page.tsx:238 — {lang === "ar" ? "جلسة آمنة" : "Session sécurisée"}
- frontend/src/app/[lang]/generate/[type]/page.tsx:242 — {lang === "ar" ? "إغلاق" : "Quitter"}
- frontend/src/app/[lang]/generate/[type]/page.tsx:264 — {lang === "ar" ? "رجوع" : "Retour"}
- frontend/src/app/[lang]/generate/[type]/page.tsx:396 — {lang === "ar" ? "التقدم" : "Progression"} · {progressPercent}%
- frontend/src/app/[lang]/layout.js:14 — const title = isAr ? "كونتراتي — عقود قانونية تونسية" : "Contraty — Contrats juridiques tunisiens";
- frontend/src/app/[lang]/layout.js:16 — ? "أول منصة تونسية لإنشاء العقود القانونية ثنائية اللغة. 22 نموذجًا مبنيًا على القانون التونسي."
- frontend/src/app/[lang]/not-found.js:11 — {lang === "ar" ? "الصفحة غير موجودة" : "Page introuvable"}
- frontend/src/app/[lang]/not-found.js:15 — ? "ربما تم نقل الصفحة أو لم تعد موجودة"
- frontend/src/app/[lang]/not-found.js:22 — {lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
- frontend/src/app/[lang]/page.tsx:49 — "أول منصة تونسية للعقود القانونية ثنائية اللغة",
- frontend/src/app/[lang]/page.tsx:66 — عقودك القانونية
- frontend/src/app/[lang]/page.tsx:68 — <span className="text-primary">في دقائق</span>
- frontend/src/app/[lang]/page.tsx:80 — "22 نموذجًا قانونيًا مبنيًا على القانون التونسي. اختر، املأ الحقول، واحصل على عقد بصيغة PDF جاهز للتوقيع.",
- frontend/src/app/[lang]/page.tsx:89 — {t(lang, "ابدأ مجاناً", "Commencer gratuitement")}
- frontend/src/app/[lang]/page.tsx:96 — {t(lang, "تصفح النماذج", "Voir les modèles")}
- frontend/src/app/[lang]/page.tsx:102 — { num: "22", label: t(lang, "نموذج", "modèles") },
- frontend/src/app/[lang]/page.tsx:103 — { num: "6", label: t(lang, "مجالات", "domaines") },
- frontend/src/app/[lang]/page.tsx:104 — { num: "100%", label: t(lang, "مجاني", "gratuit") },
- frontend/src/app/[lang]/page.tsx:144 — <p className="text-[10px] text-text-secondary">{t(lang, "جاهز للتوقيع", "Prêt à signer")}</p>
- frontend/src/app/[lang]/page.tsx:162 — title: t(lang, "سريع ومرن", "Rapide et flexible"),
- frontend/src/app/[lang]/page.tsx:163 — desc: t(lang, "للهاتف والحاسوب — في أي وقت", "Sur mobile et ordinateur — à tout moment"),
- frontend/src/app/[lang]/page.tsx:167 — title: t(lang, "قانون تونسي", "Droit tunisien"),
- frontend/src/app/[lang]/page.tsx:168 — desc: t(lang, "COC، مجلة الشغل، مجلة الشركات", "COC, Code du Travail, Code des Sociétés"),
- frontend/src/app/[lang]/page.tsx:172 — title: t(lang, "آمن وسري", "Sécurisé et privé"),
- frontend/src/app/[lang]/page.tsx:173 — desc: t(lang, "لا تخزين للبيانات — بدون حساب", "Aucune donnée stockée — sans compte"),
- frontend/src/app/[lang]/page.tsx:197 — {t(lang, "لماذا كونتراتي؟", "Pourquoi Contraty ?")}
- frontend/src/app/[lang]/page.tsx:202 — "بسيط، آمن، ومبنى على القانون — هكذا تصنع العقود",
- frontend/src/app/[lang]/page.tsx:211 — eyebrow: t(lang, "سهل وسريع", "Simple et rapide"),
- frontend/src/app/[lang]/page.tsx:212 — title: t(lang, "خطوة بخطوة دون مصطلحات معقدة", "Étape par étape, sans jargon juridique"),
- frontend/src/app/[lang]/page.tsx:215 — "املأ الحقول ببياناتك، ويتولى النظام الباقي. لا حاجة لخبرة قانونية أو تعقيدات إدارية.",
- frontend/src/app/[lang]/page.tsx:222 — eyebrow: t(lang, "خبرة قانونية", "Expertise juridique"),
- frontend/src/app/[lang]/page.tsx:223 — title: t(lang, "مبنى على المجلات التونسية", "Fondé sur les codes tunisiens"),
- frontend/src/app/[lang]/page.tsx:226 — "كل نموذج يستند إلى مجلة الالتزامات والعقود، مجلة الشغل، أو مجلة الشركات التجارية مع ذكر الأساس القانوني.",
- frontend/src/app/[lang]/page.tsx:233 — eyebrow: t(lang, "ثنائي اللغة", "Bilingue"),
- frontend/src/app/[lang]/page.tsx:234 — title: t(lang, "عربي وفرنسي في كل عقد", "Arabe et français pour chaque contrat"),
- frontend/src/app/[lang]/page.tsx:237 — "بدّل بين العربية والفرنسية بنقرة واحدة. كل نموذج متاح باللغتين مع دعم كامل للكتابة من اليمين لليسار.",
- frontend/src/app/[lang]/page.tsx:244 — eyebrow: t(lang, "آمن وسري", "Sécurisé et privé"),
- frontend/src/app/[lang]/page.tsx:245 — title: t(lang, "بياناتك محمية وغير مخزنة", "Vos données sont protégées et non stockées"),
- frontend/src/app/[lang]/page.tsx:248 — "الإنشاء يتم في الجلسة فقط. بمجرد تحميل العقد، تُحذف بياناتك. لا حساب، لا تتبع، لا تسريب.",
- frontend/src/app/[lang]/page.tsx:308 — {t(lang, "ثلاث خطوات بسيطة", "3 étapes simples")}
- frontend/src/app/[lang]/page.tsx:311 — {t(lang, "كيف تعمل المنصة", "Comment ça marche")}
- frontend/src/app/[lang]/page.tsx:319 — title: t(lang, "اختر النموذج", "Choisissez le modèle"),
- frontend/src/app/[lang]/page.tsx:322 — "تصفح 22 نموذجًا عبر 6 مجالات قانونية واختر ما يناسب احتياجك",
- frontend/src/app/[lang]/page.tsx:329 — title: t(lang, "املأ الحقول", "Remplissez les champs"),
- frontend/src/app/[lang]/page.tsx:332 — "أدخل بياناتك (الاسم، بطاقة التعريف، المبالغ...) مع تلميحات وتحقق فوري",
- frontend/src/app/[lang]/page.tsx:339 — title: t(lang, "حمّل العقد", "Téléchargez le contrat"),
- frontend/src/app/[lang]/page.tsx:342 — "احصل على عقدك بصيغة PDF أو Word جاهز للتوقيع — في ثوانٍ",
- frontend/src/app/[lang]/page.tsx:377 — { num: "22", label: t(lang, "نموذج قانوني", "modèles juridiques") },
- frontend/src/app/[lang]/page.tsx:378 — { num: "6", label: t(lang, "مجالات قانونية", "domaines juridiques") },
- frontend/src/app/[lang]/page.tsx:379 — { num: "2", label: t(lang, "لغتان (عربي/فرنسي)", "langues (arabe/français)") },
- frontend/src/app/[lang]/page.tsx:380 — { num: "0", label: t(lang, "د.ت — مجاني", "DT — gratuit") },
- frontend/src/app/[lang]/page.tsx:398 — {t(lang, "أسئلة شائعة", "Questions fréquentes")}
- frontend/src/app/[lang]/page.tsx:411 — {t(lang, "جاهز لبدء عقدك؟", "Prêt à créer votre contrat ?")}
- frontend/src/app/[lang]/page.tsx:416 — "اختر نموذجًا وأنشئ عقدك القانوني في دقائق — مجانًا تمامًا",
- frontend/src/app/[lang]/page.tsx:424 — {t(lang, "ابدأ الآن", "Commencer maintenant")}
- frontend/src/components/ads/Ad.tsx:53 — <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">إعلان · PUBLICITÉ</div>
- frontend/src/components/layout/footer.jsx:20 — ? "منصة العقود القانونية التونسية"
- frontend/src/components/layout/footer.jsx:26 — <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "نماذج" : "Modèles"}</h4>
- frontend/src/components/layout/footer.jsx:29 — {lang === "ar" ? "سكن" : "Logement"}
- frontend/src/components/layout/footer.jsx:32 — {lang === "ar" ? "عمل" : "Travail"}
- frontend/src/components/layout/footer.jsx:35 — {lang === "ar" ? "مؤسسة" : "Entreprise"}
- frontend/src/components/layout/footer.jsx:41 — <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "روابط" : "Liens"}</h4>
- frontend/src/components/layout/footer.jsx:44 — {lang === "ar" ? "كل النماذج" : "Tous les modèles"}
- frontend/src/components/layout/footer.jsx:47 — {lang === "ar" ? "كيف يعمل" : "Comment ça marche"}
- frontend/src/components/layout/footer.jsx:53 — <h4 className="text-sm font-semibold mb-3">{lang === "ar" ? "قانوني" : "Légal"}</h4>
- frontend/src/components/layout/footer.jsx:62 — © {new Date().getFullYear()} Contraty — {lang === "ar" ? "جميع الحقوق محفوظة" : "Tous droits réservés"}
- frontend/src/components/layout/navbar.jsx:26 — aria-label={lang === "ar" ? "بحث" : "Rechercher"}
- frontend/src/components/layout/navbar.jsx:34 — {otherLang === "ar" ? "العربية" : "FR"}
- frontend/src/components/layout/navbar.jsx:46 — placeholder={lang === "ar" ? "ابحث عن نموذج..." : "Rechercher un modèle..."}
- frontend/src/components/v2/DisclaimerStep.tsx:16 — title: "إخلاء مسؤولية قانونية",
- frontend/src/components/v2/DisclaimerStep.tsx:17 — p1: "النماذج المقدمة على منصة كونتراتي هي نماذج إرشادية لم يراجعها محامٍ. لا تشكل استشارة قانونية ولا تغني عن مراجعة مختص.",
- frontend/src/components/v2/DisclaimerStep.tsx:18 — p2: "تقع مسؤولية التحقق من ملاءمة العقد لحالتك الخاصة عليك وحدك. يُنصح بشدة بمراجعة العقد من قبل محامٍ قبل استخدامه.",
- frontend/src/components/v2/DisclaimerStep.tsx:19 — checkbox: "أقر بأنني فهمت هذا الإخلاء وأتحمل كامل المسؤولية عن استخدام العقد المُنشأ.",
- frontend/src/components/v2/DisclaimerStep.tsx:20 — cta: "متابعة",
- frontend/src/components/v2/DisclaimerStep.tsx:41 — اكتب باللغة اللي تريحك — احنا نحولوه لصيغة قانونية
- frontend/src/components/v2/DisclaimerStep.tsx:44 — تونّسها كيما تحب، بالعرّبي، بالفرنساوي، ولا حتى بالدارجة
- frontend/src/components/v2/DisclaimerStep.tsx:45 — (مثال: «ismi Ahmed»، «العمارة رقم 5»، «هو يخلّص في آخر الشهر»).
- frontend/src/components/v2/DisclaimerStep.tsx:46 — Contrati يحوّل إجاباتك لصيغ قانونية صحيحة ومريڤلة في العقد النهائي.
- frontend/src/components/v2/DownloadAdPopup.tsx:29 — ? (lang === "ar" ? "تم التحميل" : "Téléchargement démarré")
- frontend/src/components/v2/DownloadAdPopup.tsx:30 — : (lang === "ar" ? "جاري تجهيز التحميل..." : "Préparation du téléchargement...")}
- frontend/src/components/v2/DownloadAdPopup.tsx:34 — ? (lang === "ar" ? "الملف قيد التحميل" : "Votre fichier est en cours de téléchargement")
- frontend/src/components/v2/DownloadAdPopup.tsx:35 — : (lang === "ar" ? "سيبدأ التحميل تلقائيًا خلال لحظات" : "Votre téléchargement va démarrer automatiquement")}
- frontend/src/components/v2/DownloadAdPopup.tsx:44 — {lang === "ar" ? "إغلاق" : "Fermer"}
- frontend/src/components/v2/DownloadAdPopup.tsx:49 — {lang === "ar" ? "يرجى الانتظار..." : "Veuillez patienter..."}
- frontend/src/components/v2/ExtraNotesStep.tsx:6 — "lettre-demission": { fr: "Ex: Je souhaite ajouter une clause de télétravail durant la période de préavis.", ar: "مثال: أرغب في إضافة شرط ينص على مواصلة العمل عن بعد خلال فترة الإعلام المسبق." },
- frontend/src/components/v2/ExtraNotesStep.tsx:7 — "contrat-cdi": { fr: "Ex: Je stipule une période d'essai de 6 mois conformément à l'article 12 du Code du travail.", ar: "مثال: أشترط مدة تجربة 6 أشهر وفق الفصل 12 من مجلة الشغل." },
- frontend/src/components/v2/ExtraNotesStep.tsx:8 — "contrat-cdd": { fr: "Ex: Je souhaite ajouter une clause de priorité d'embauche en cas d'ouverture d'un poste permanent.", ar: "مثال: أرغب في إضافة بند يمنحني أسبقية التوظيف عند فتح منصب قار." },
- frontend/src/components/v2/ExtraNotesStep.tsx:9 — "bail-habitation": { fr: "Ex: Je souhaite ajouter une clause interdisant les animaux domestiques dans le logement.", ar: "مثال: أريد إضافة بند يمنع تربية الحيوانات الأليفة في المسكن." },
- frontend/src/components/v2/ExtraNotesStep.tsx:10 — "rupture-conventionnelle": { fr: "Ex: Une indemnité de départ de 5000 TND a été convenue.", ar: "مثال: تم الاتفاق على منحة مغادرة بقدر 5000 دينار." },
- frontend/src/components/v2/ExtraNotesStep.tsx:11 — "pret-particuliers": { fr: "Ex: Je veux définir un échéancier : 200 TND par mois à partir du 1er janvier 2027.", ar: "مثال: أريد تحديد جدول سداد: 200 دينار شهريًا بداية من 1 جانفي 2027." },
- frontend/src/components/v2/ExtraNotesStep.tsx:12 — "compromis-vente-immobilier": { fr: "Ex: Je stipule une clause de dédit permettant à l'acheteur de se rétracter sous 10 jours.", ar: "مثال: أشترط إدراج بند فسخي يسمح للمشتري بالرجوع خلال 10 أيام." },
- frontend/src/components/v2/ExtraNotesStep.tsx:34 — ? "مثال: أريد إضافة بند خاص يوضح تفاصيل إضافية للعقد."
- frontend/src/components/v2/ExtraNotesStep.tsx:45 — {lang === "ar" ? "ملاحظات إضافية" : "Remarques supplémentaires"}
- frontend/src/components/v2/ExtraNotesStep.tsx:50 — ? "أي تفاصيل أخرى تود إضافتها إلى العقد؟ (اختياري)"
- frontend/src/components/v2/ExtraNotesStep.tsx:87 — <span className="hidden sm:inline">{lang === "ar" ? "رجوع" : "Retour"}</span>
- frontend/src/components/v2/ExtraNotesStep.tsx:95 — {generating ? loadingMsg : (lang === "ar" ? "إنشاء العقد" : "Générer le contrat")}
- frontend/src/components/v2/FAQAccordion.tsx:16 — q_ar: "هل النماذج مجانية؟",
- frontend/src/components/v2/FAQAccordion.tsx:20 — "نعم. جميع النماذج الـ22 مجانية بالكامل. تُموَّل المنصة بالإعلانات غير المزعجة التي تظهر خلال أوقات الانتظار (الإنشاء والتحميل).",
- frontend/src/components/v2/FAQAccordion.tsx:24 — q_ar: "هل العقود متوافقة مع القانون التونسي؟",
- frontend/src/components/v2/FAQAccordion.tsx:28 — "جميع نماذجنا مبنية على المجلات القانونية التونسية: مجلة الالتزامات والعقود، مجلة الشغل، ومجلة الشركات التجارية. يذكر كل نموذج أساسه القانوني.",
- frontend/src/components/v2/FAQAccordion.tsx:32 — q_ar: "كيف أستخدم المنصة؟",
- frontend/src/components/v2/FAQAccordion.tsx:36 — "ثلاث خطوات: اختر نموذجًا من بين 22 عقدًا، املأ الحقول (الاسم، بطاقة التعريف، المبالغ...)، ثم حمّل عقدك بصيغة PDF أو Word جاهز للتوقيع.",
- frontend/src/components/v2/FAQAccordion.tsx:40 — q_ar: "هل بياناتي آمنة؟",
- frontend/src/components/v2/FAQAccordion.tsx:44 — "لا يتم تخزين بياناتك. يتم الإنشاء في الجلسة: بمجرد تحميل العقد، تُحذف معلوماتك. لا حاجة لإنشاء حساب.",
- frontend/src/components/v2/FAQAccordion.tsx:48 — q_ar: "هل العقود متاحة بالعربية والفرنسية؟",
- frontend/src/components/v2/FAQAccordion.tsx:52 — "نعم، كل نموذج متاح بالعربية والفرنسية. يمكنك التبديل بين اللغتين في أي وقت من شريط التنقل.",
- frontend/src/components/v2/FAQAccordion.tsx:56 — q_ar: "هل أحتاج إلى محامٍ؟",
- frontend/src/components/v2/FAQAccordion.tsx:60 — "تغطي نماذجنا الحالات الشائعة. في الحالات المعقدة أو البنود المخصصة، ننصح باستشارة محامٍ. يبقى العقد المُنشأ نقطة انطلاق متينة.",
- frontend/src/components/v2/FormStep.tsx:12 — required: "هذا الحقل مطلوب",
- frontend/src/components/v2/FormStep.tsx:13 — pattern: "الصيغة غير صالحة",
- frontend/src/components/v2/FormStep.tsx:14 — format: "الصيغة غير صالحة",
- frontend/src/components/v2/FormStep.tsx:15 — min_length: "النص أقصر من الحد الأدنى المطلوب",
- frontend/src/components/v2/FormStep.tsx:16 — max_length: "النص يتجاوز الطول المسموح به",
- frontend/src/components/v2/FormStep.tsx:17 — min_value: "القيمة أقل من الحد الأدنى المسموح به",
- frontend/src/components/v2/FormStep.tsx:18 — max_value: "القيمة تتجاوز الحد الأقصى المسموح به",
- frontend/src/components/v2/FormStep.tsx:80 — ? (lang === "ar" ? "متابعة إلى المراجعة" : "Continuer vers les notes")
- frontend/src/components/v2/FormStep.tsx:81 — : (lang === "ar" ? "تأكيد ومتابعة" : "Confirmer");
- frontend/src/components/v2/FormStep.tsx:99 — {lang === "ar" ? `سؤال ${fieldIndex + 1} من ${totalFields}` : `Question ${fieldIndex + 1} sur ${totalFields}`}
- frontend/src/components/v2/FormStep.tsx:134 — <option value="">{field.placeholder || (lang === "ar" ? "اختر..." : "Sélectionner...")}</option>
- frontend/src/components/v2/FormStep.tsx:169 — <span className="hidden sm:inline">{lang === "ar" ? "رجوع" : "Retour"}</span>
- frontend/src/components/v2/FormStep.tsx:176 — ? (lang === "ar" ? "تأكيد ومتابعة" : "Confirmer")
- frontend/src/components/v2/FormStep.tsx:177 — : (lang === "ar" ? "تأكيد ومتابعة" : "Confirmer")}
- frontend/src/components/v2/LoadingWithAd.tsx:37 — ? { generating: "جاري إنشاء العقد...", wait: "يرجى الانتظار", ready: "اكتمل إنشاء العقد", soon: "سيظهر العقد خلال لحظات" }
- frontend/src/components/v2/PreviewStep.tsx:42 — {lang === "ar" ? "تم إنشاء العقد بنجاح!" : "Contrat généré avec succès !"}
- frontend/src/components/v2/PreviewStep.tsx:47 — ? `تمت المراجعة في ${(generated.review_time_ms / 1000).toFixed(1)}s`
- frontend/src/components/v2/PreviewStep.tsx:61 — {lang === "ar" ? "مراجعة" : "Révision"}
- frontend/src/components/v2/PreviewStep.tsx:115 — ? (lang === "ar" ? "خطأ" : "Erreur")
- frontend/src/components/v2/PreviewStep.tsx:117 — ? (lang === "ar" ? "تحويل" : "Conversion")
- frontend/src/components/v2/PreviewStep.tsx:118 — : (lang === "ar" ? "تنبيه" : "Avertissement")}
- frontend/src/components/v2/PreviewStep.tsx:124 — ? (lang === "ar" ? `سيُكتب: ${w.suggestion_ar}` : `Écrit en arabe : ${w.suggestion_fr}`)
- frontend/src/components/v2/PreviewStep.tsx:133 — ? (lang === "ar" ? "تم التطبيق" : "Appliqué")
- frontend/src/components/v2/PreviewStep.tsx:135 — ? (lang === "ar" ? "تم التصحيح" : "Corrigé")
- frontend/src/components/v2/PreviewStep.tsx:136 — : (lang === "ar" ? "تم القبول" : "Accepté")}
- frontend/src/components/v2/PreviewStep.tsx:140 — {lang === "ar" ? "تم التجاهل" : "Ignoré"}
- frontend/src/components/v2/PreviewStep.tsx:159 — {lang === "ar" ? "حفظ" : "OK"}
- frontend/src/components/v2/PreviewStep.tsx:162 — {lang === "ar" ? "إلغاء" : "Annuler"}
- frontend/src/components/v2/PreviewStep.tsx:168 — {lang === "ar" ? "تعديل" : "Corriger"}
- frontend/src/components/v2/PreviewStep.tsx:171 — {lang === "ar" ? "قبول كما هو" : "Accepter tel quel"}
- frontend/src/components/v2/PreviewStep.tsx:177 — {lang === "ar" ? `تطبيق: ${w.suggested_value}` : `Appliquer: ${w.suggested_value}`}
- frontend/src/components/v2/PreviewStep.tsx:181 — {lang === "ar" ? "تجاهل" : "Ignorer"}
- frontend/src/components/v2/PreviewStep.tsx:199 — {lang === "ar" ? "إعادة الإنشاء بالتعديلات" : "Régénérer avec les corrections"}
- frontend/src/components/v2/PreviewStep.tsx:242 — {lang === "ar" ? "العودة إلى النموذج" : "Retour au formulaire"}
- frontend/src/components/v2/SummarySidebar.tsx:76 — {lang === "ar" ? "التقدم" : "Progression"}
- frontend/src/components/v2/SummarySidebar.tsx:87 — {answeredTotal} / {totalFields} {lang === "ar" ? "حقل مكتمل" : "champs complétés"}
- frontend/src/components/v2/TemplateExplorer.tsx:36 — n === 1 ? "نموذج" : n === 2 ? "نموذجين" : "نماذج";
- frontend/src/components/v2/TemplateExplorer.tsx:43 — {lang === "ar" ? "6 مجالات قانونية" : "6 domaines juridiques"}
- frontend/src/components/v2/TemplateExplorer.tsx:47 — ? `${templates.length} نموذجًا تغطي احتياجاتك القانونية`
- frontend/src/components/v2/TemplateExplorer.tsx:63 — {lang === "ar" ? "الكل" : "Tous"}
- frontend/src/components/v2/TemplateExplorer.tsx:100 — {lang === "ar" ? "لا توجد نماذج في هذا المجال" : "Aucun modèle dans ce domaine"}
- frontend/src/components/v2/TemplateExplorer.tsx:143 — ? tpl.field_count === 1 ? "حقل" : tpl.field_count === 2 ? "حقلان" : "حقول"
- frontend/src/components/v2/TemplateExplorer.tsx:147 — {lang === "ar" ? "ابدأ" : "Démarrer"}
- frontend/src/components/v2/TemplateExplorer.tsx:164 — {lang === "ar" ? "عرض كل النماذج" : "Voir tous les modèles"}
- frontend/src/components/v2/TemplateExplorer.tsx:175 — {lang === "ar" ? "عرض أقل" : "Voir moins"}
- frontend/src/components/v2/TransliterateChip.tsx:23 — باش يتحوّل النصّ للعربيّة وحدو وقت المراجعة
- frontend/src/lib/constants.ts:6 — logement: { ar: "سكن", fr: "Logement", icon: "Home" },
- frontend/src/lib/constants.ts:7 — travail: { ar: "عمل", fr: "Travail", icon: "Briefcase" },
- frontend/src/lib/constants.ts:8 — argent: { ar: "مال وقرض", fr: "Argent & Prêt", icon: "Coins" },
- frontend/src/lib/constants.ts:9 — vehicules: { ar: "عربات", fr: "Véhicules", icon: "Car" },
- frontend/src/lib/constants.ts:10 — entreprise: { ar: "مؤسسة", fr: "Entreprise", icon: "Building2" },
- frontend/src/lib/constants.ts:11 — demarches: { ar: "إجراءات", fr: "Démarches", icon: "FileText" },
- frontend/src/lib/useGeneration.ts:9 — ar: ["جاري إنشاء العقد...", "جاري المراجعة...", "اكتمل!"],
- frontend/src/lib/useWizard.ts:138 — title: i === 0 ? sec.title : `${sec.title} (${lang === "ar" ? "تابع" : "suite"})`,

## 4. Template field metadata (labels, help, hints, placeholders)

### attestation-hebergement

- `NOM_HEBERGEANT`: label_ar='الاسم', help_ar='الاسم الكامل للشخص المستضيف (الذي يأوي شخصًا آخر في منزله).'
- `CIN_HEBERGEANT`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة تعريف الشخص المستضيف (صاحب المسكن).'
- `ADRESSE_HEBERGEANT`: label_ar='العنوان', help_ar='عنوان منزل الشخص المستضيف.'
- `ADRESSE_HEBERGEMENT`: label_ar='العنوان', help_ar='عنوان المسكن الذي يقيم فيه الشخص المستضاف.'
- `NOM_HEBERGE`: label_ar='الاسم', help_ar='الاسم الكامل للشخص المستضاف (الذي يسكن عند المستضيف).'
- `CIN_HEBERGE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة تعريف الشخص المستضاف (الساكن).'
- `DATE_DEBUT_HEBERGEMENT`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `LIEN`: label_ar='الصلة', help_ar='صلة القرابة بالشخص المستضاف (مثال: قرين، أصل).'
- `DESTINATION`: label_ar='التخصيص', help_ar='الغرض أو الاستعمال المقصود لهذه الوثيقة.'
- `LIEU`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'ورقة يصححها شكون مستضيفك في داره، تستحقها كي تجدد بطاقة التعريف أو أوراق أخرى.'

### attestation-honneur

- `NOM`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) .'
- `DATE_NAISSANCE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `LIEU_NAISSANCE`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) .'
- `NATIONALITE`: label_ar='الجنسية', help_ar='جنسية الشخص المعني (مثال: تونسية).'
- `CIN`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام .'
- `DATE_CIN`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية.'
- `ADRESSE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) .'
- `PROFESSION`: label_ar='المهنة', help_ar='مهنة أو حرفة الشخص المعني.'
- `DECLARATION`: label_ar='التصريح', help_ar='صف بإيجاز التصريح .'
- `DESTINATION`: label_ar='التخصيص', help_ar='الغرض أو الاستعمال المقصود لهذه الوثيقة.'
- `LIEU`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `AUTORITE_DELIVRANCE`: label_ar='السلطة المانحة لبطاقة التعريف', placeholder_ar='ولاية تونس', help_ar='السلطة التي منحت بطاقة التعريف الوطنية (مثال: ولاية تونس).'
- *description_ar*: 'تصريح مصحح ومصادق عليه تشهد فيه بصحة معلومة تهمك لقضاء شؤون إدارية.'

### autorisation-parentale-voyage

- `NOM_PARENT`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) .'
- `CIN_PARENT`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام .'
- `ADRESSE_PARENT`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) .'
- `QUALITE`: label_ar='الصفة', help_ar='الصفة التي تتصرف بها (مثال: أب، أم، ولي شرعي).'
- `NOM_ENFANT`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) .'
- `DATE_NAISSANCE_ENFANT`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `LIEU_NAISSANCE_ENFANT`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) .'
- `NUM_EXTRAIT_NAISSANCE`: label_ar='رقم مضمون الولادة', help_ar='رقم تعريف رسمي .'
- `NUM_PIECE_ENFANT`: label_ar='رقم وثيقة هوية الطفل', help_ar='رقم تعريف رسمي .'
- `DESTINATION`: label_ar='الوجهة', help_ar='البلد والمدينة الوجهة لسفر الطفل.'
- `NOM_ACCOMPAGNATEUR`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) .'
- `CIN_ACCOMPAGNATEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام .'
- `DATE_DEPART`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `DATE_RETOUR`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `LIEU`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `NUM_PASSEPORT_ENFANT`: label_ar='رقم جواز سفر الطفل', help_ar='رقم جواز سفر الطفل المسافر.'
- `NUM_PIECE_ACCOMPAGNATEUR`: label_ar='رقم بطاقة التعريف/جواز سفر المرافق', help_ar='رقم بطاقة التعريف أو جواز سفر المرافق.'
- *description_ar*: 'ترخيص مصحح ومصادق عليه من الولي يسمح للطفل القاصر بالسفر لبرا وحده أو مع غيره.'

### bail-habitation

- `NOM_BAILLEUR`: label_ar='الاسم (المسوغ)', help_ar='الاسم الكامل للمكري صاحب العقار الذي يؤجره.'
- `CIN_BAILLEUR`: label_ar='رقم بطاقة التعريف الوطنية (المسوغ)', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية للمكري (صاحب الدار).'
- `ADRESSE_BAILLEUR`: label_ar='العنوان (المسوغ)', help_ar='العنوان الشخصي للمكري صاحب العقار.'
- `NOM_PRENEUR`: label_ar='الاسم (المتسوغ)', help_ar='الاسم الكامل للمكتري الذي سيسكن في الدار.'
- `CIN_PRENEUR`: label_ar='رقم بطاقة التعريف الوطنية (المتسوغ)', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية للمكتري (الساكن).'
- `ADRESSE_PRENEUR`: label_ar='العنوان (المتسوغ)', help_ar='العنوان الحالي للمكتري قبل الانتقال للسكن.'
- `ADRESSE_BIEN`: label_ar='عنوان العقار المسوغ', help_ar='العنوان الكامل للمسكن موضوع عقد الكراء.'
- `DESCRIPTION_BIEN`: label_ar='وصف العين الكرائية', help_ar='وصف المسكن (عدد الغرف، الطابق، التجهيزات).'
- `DUREE_BAIL`: label_ar='مدة التسويغ', help_ar='مدة الكراء (مثال: سنة، 3 سنوات قابلة للتجديد).'
- `DATE_DEBUT`: label_ar='تاريخ مفعول العقد', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للعقد.'
- `PREAVIS_MOIS`: label_ar='أجل الإعلام المسبق بإنهاء الكراء (بالأشهر)', help_ar='المدة بالسنوات أو الأشهر للعقد.'
- `MONTANT_LOYER`: label_ar='المبلغ (معين الكراء الشهري)', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي .'
- `JOUR_PAIEMENT`: label_ar='تاريخ استحقاق الدفع الشهري', help_ar='اليوم من الشهر الذي يدفع فيه الكراء (مثال: 5).'
- `MONTANT_CAUTION`: label_ar='المبلغ (الضمان الكرائي)', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي .'
- `CHARGES_INCLUSES`: label_ar='التكاليف المشمولة بمعين الكراء', help_ar='المصاريف التي يدفعها المالك وهي مشمولة في الكراء (ماء، كهرباء...).'
- `CHARGES_PRENEUR`: label_ar='التكاليف المحمولة على المتسوغ', help_ar='المصاريف على عاتق المكتري، إضافة إلى الكراء.'
- `TRIBUNAL`: label_ar='المحكمة المختصة ترابياً', help_ar='المحكمة المختصة ترابيًا في حالة النزاع (مثال: المحكمة الابتدائية بتونس).'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `CHARGES_PARTIES`: label_ar='مصاريف التسجيل على عاتق', help_ar='الطرف الذي يتحمل مصاريف تسجيل عقد الكراء.'
- *description_ar*: 'إتفاقية بين الملاك والكاري تحدد السوم الشهري، الضمان وشروط السكنى في الدار.'

### compromis-vente-immobilier

- `NOM_VENDEUR`: label_ar='الاسم', help_ar='الاسم الكامل للبائع العقاري.'
- `CIN_VENDEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ETAT_CIVIL_VENDEUR`: label_ar='الحالة المدنية للبائع', help_ar='الحالة المدنية للبائع (أعزب، متزوج/ة، مطلق/ة، أرمل/ة).'
- `ADRESSE_VENDEUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `NOM_ACQUEREUR`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `CIN_ACQUEREUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ETAT_CIVIL_ACQUEREUR`: label_ar='الحالة المدنية للمشتري', help_ar='الحالة المدنية للمشتري (أعزب، متزوج/ة، مطلق/ة، أرمل/ة).'
- `ADRESSE_ACQUEREUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `NATURE`: label_ar='الطبيعة', help_ar='طبيعة العقار (مثال: شقة، فيلا، أرض).'
- `NB_PIECES`: label_ar='عدد الغرف', help_ar='العدد .'
- `ADRESSE_BIEN`: label_ar='عنوان العقار المبيع', help_ar='العنوان الكامل للعقار موضوع البيع.'
- `TITRE_FONCIER`: label_ar='الرسم العقاري', help_ar='رقم الرسم العقاري للعقار.'
- `SUPERFICIE`: label_ar='المساحة', help_ar='مساحة العقار بالمتر المربع.'
- `ORIGINE_PROPRIETE`: label_ar='أصل الملكية', help_ar='كيف تحصل البائع على العقار (مثال: شراء، إرث).'
- `PRIX_TOTAL`: label_ar='الثمن', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي .'
- `AVANCE`: label_ar='التسبيق', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي .'
- `SOLDE`: label_ar='باقي الثمن', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي .'
- `MONTANT_PRET`: label_ar='المبلغ', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي .'
- `DATE_LIMITE_PRET`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `AUTRES_CONDITIONS`: label_ar='شروط أخرى', help_ar='شروط أو كيفيات خاصة .'
- `DATE_LIMITE_VENTE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `CPF_LIEU`: label_ar='مكتب حفظ الأملاك العقارية', placeholder_ar='تونس', help_ar='المدينة التي يقع بها مكتب حفظ الأملاك العقارية المسجل بها العقار.'
- *description_ar*: 'كاتب يربط الشاري والبايع قبل العقد النهائي، يحدد السوم، العربون وأجل الخلاص.'

### contrat-cdd

- `NOM_ENTREPRISE`: label_ar='الاسم', help_ar='الاسم الرسمي للشركة كما هو مسجل بالسجل الوطني للمؤسسات.'
- `RNE`: label_ar='السجل الوطني للمؤسسات', help_ar='الرقم الموحد للسجل الوطني للمؤسسات.'
- `ADRESSE_ENTREPRISE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT`: label_ar='الممثل القانوني', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `NOM_SALARIE`: label_ar='الاسم', help_ar='الاسم الكامل للأجير المنتدب للمهمة محددة المدة.'
- `CIN_SALARIE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة تعريف الأجير بعقد محدد المدة.'
- `ADRESSE_SALARIE`: label_ar='العنوان', help_ar='العنوان الشخصي للأجير الذي تم انتدابه.'
- `MOTIF_CDD`: label_ar='موجب إبرام عقد محدد المدة', help_ar='السبب المبرر للالتجاء إلى عقد محدد المدة (مثال: تعويض، ذروة نشاط).'
- `POSTE`: label_ar='الخطة الوظيفية', help_ar='التسمية الدقيقة للمنصب أو الوظيفة المشغولة.'
- `CLASSIFICATION`: label_ar='التصنيف المهني', help_ar='التصنيف المهني حسب الاتفاقية المشتركة (مثال: إطار، عميل تنفيذ).'
- `DATE_DEBUT`: label_ar='تاريخ مفعول العقد', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للمنصب وظروف العمل.'
- `LIEU_TRAVAIL`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للمنصب وظروف العمل.'
- `DUREE`: label_ar='المدة', help_ar='المدة الكاملة للمهمة (مثال: 6 أشهر، سنة).'
- `DATE_FIN`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ المتوقع لنهاية المهمة.'
- `INDEMNITE_POURCENTAGE`: label_ar='نسبة المنحة', hint_ar='رقم', help_ar='نسبة المنحة (% من مجموع الأجور الخام).'
- `SALAIRE`: label_ar='الراتب', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي للأجر والامتيازات.'
- `JOUR_PAIE`: label_ar='يوم دفع الأجر', help_ar='اليوم من الشهر الذي يدفع فيه الأجر (مثال: 28).'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `CONVENTION_COLLECTIVE`: label_ar='الاتفاقية المهنية القطاعية', placeholder_ar='التجارة', help_ar='اسم الاتفاقية المهنية القطاعية المعمول بها في قطاع نشاط المؤسسة.'
- *description_ar*: 'كونترا خدمة بوقت معين لخدمة مؤقتة، يحدد الشهريّة والمدة وشروط توقيف الخدمة.'

### contrat-cdi

- `NOM_ENTREPRISE`: label_ar='الاسم', help_ar='الاسم الرسمي للشركة كما هو مسجل بالسجل الوطني للمؤسسات.'
- `CAPITAL`: label_ar='رأس المال', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي للطرف المعني.'
- `RNE`: label_ar='السجل الوطني للمؤسسات', help_ar='الرقم الموحد للسجل الوطني للمؤسسات.'
- `ADRESSE_ENTREPRISE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT`: label_ar='الممثل القانوني', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `NOM_SALARIE`: label_ar='الاسم', help_ar='الاسم الكامل للأجير الذي سيتم انتدابه.'
- `CIN_SALARIE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية للأجير.'
- `ADRESSE_SALARIE`: label_ar='العنوان', help_ar='العنوان الشخصي للأجير الذي تم انتدابه.'
- `DATE_DEBUT`: label_ar='تاريخ مفعول العقد', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للمنصب وظروف العمل.'
- `POSTE`: label_ar='الخطة الوظيفية', help_ar='التسمية الدقيقة للمنصب أو الوظيفة المشغولة.'
- `CLASSIFICATION`: label_ar='التصنيف المهني', help_ar='التصنيف المهني حسب الاتفاقية المشتركة (مثال: إطار، عميل تنفيذ).'
- `LIEU_TRAVAIL`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للمنصب وظروف العمل.'
- `DUREE_ESSAI`: label_ar='المدة', help_ar='المدة بالسنوات أو الأشهر لفترة التجربة.'
- `SALAIRE`: label_ar='الراتب', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي للأجر والامتيازات.'
- `JOUR_PAIE`: label_ar='يوم دفع الأجر', help_ar='اليوم من الشهر الذي يدفع فيه الأجر (مثال: 28).'
- `AVANTAGES`: label_ar='الامتيازات', help_ar='الامتيازات العينية أو المنح (مثال: سيارة وظيفية، الشهر 13).'
- `HEURES_SEMAINE`: label_ar='ساعات العمل الأسبوعية', help_ar='عدد ساعات العمل في الأسبوع (مثال: 40).'
- `HORAIRES`: label_ar='أوقات العمل', help_ar='أوقات العمل اليومية (مثال: 8ص-5م).'
- `JOURS_CONGES`: label_ar='أيام الإجازة', help_ar='عدد أيام الراحة مدفوعة الأجر في السنة (مثال: 30).'
- `PREAVIS_MOIS`: label_ar='أجل الإعلام المسبق بإنهاء عقد العمل (بالأشهر)', hint_ar='رقم', help_ar='أجل الإعلام بالفسخ بالأشهر (مثال: شهر واحد).'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'كونترا خدمة مرسمة وموش محددة بوقت، يحدد الشهرية، رخص السنوية وتفاصيل الخدمة.'

### contrat-karama

- `NOM_ENTREPRISE`: label_ar='الاسم', help_ar='اسم المؤسسة المنتدبة في إطار برنامج كرامة.'
- `RNE`: label_ar='السجل الوطني للمؤسسات', help_ar='الرقم الموحد للسجل الوطني للمؤسسات.'
- `ADRESSE_ENTREPRISE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT`: label_ar='الممثل القانوني', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `NOM_SALARIE`: label_ar='الاسم', help_ar='الاسم الكامل للمنتفع ببرنامج كرامة.'
- `CIN_SALARIE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة تعريف المنتفع.'
- `DATE_NAISSANCE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للطرف المعني.'
- `ADRESSE_SALARIE`: label_ar='العنوان', help_ar='عنوان المنتفع.'
- `NUM_DEMANDEUR`: label_ar='رقم طالب الشغل', help_ar='رقم تعريف طالب الشغل (بطاقة الوكالة الوطنية للتشغيل).'
- `POSTE`: label_ar='الخطة الوظيفية', help_ar='التسمية الدقيقة للمنصب أو الوظيفة المشغولة.'
- `DUREE_ANNEE`: label_ar='المدة', help_ar='المدة بالسنوات أو الأشهر في العقد.'
- `DATE_DEBUT`: label_ar='تاريخ مفعول العقد', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة في العقد.'
- `LIEU_TRAVAIL`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) في العقد.'
- `SALAIRE`: label_ar='الراتب', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي للأجر والامتيازات.'
- `SUBVENTION_ETAT`: label_ar='منحة الدولة', help_ar='مبلغ الإعانة التي تدفعها الدولة (برنامج كرامة).'
- `COMPLEMENT_ENTREPRISE`: label_ar='مساهمة المؤسسة', help_ar='تكملة الأجر التي تدفعها المؤسسة.'
- `JOURS_CONGES`: label_ar='أيام الإجازة', help_ar='عدد أيام الراحة مدفوعة الأجر في السنة (مثال: 30).'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `MATRICULE_FISCAL`: label_ar='المعرّف الجبائي (المؤجر)', help_ar='رقم المعرّف الجبائي للمؤسسة المشغّلة.'
- `NUM_CNSS`: label_ar='رقم الضمان الاجتماعي (المؤجر)', help_ar='رقم انتماء المؤجر للصندوق الوطني للضمان الاجتماعي.'
- `LIEU_BUREAU`: label_ar='مكان مكتب التشغيل', placeholder_ar='تونس', help_ar='مدينة مكتب التشغيل والعمل المستقل (برنامج كرامة).'
- *description_ar*: 'كونترا خدمة مدعم من الدولة وموجه لحاملي الشهادات العليا باش يسهل دخولهم لسوق الشغل.'

### contrat-sivp

- `NOM_ENTREPRISE`: label_ar='الاسم', help_ar='اسم المؤسسة المستضيفة للتربص.'
- `RNE`: label_ar='السجل الوطني للمؤسسات', help_ar='الرقم الموحد للسجل الوطني للمؤسسات.'
- `ADRESSE_ENTREPRISE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT`: label_ar='الممثل القانوني', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `NOM_STAGIAIRE`: label_ar='الاسم', help_ar='الاسم الكامل للمتربص في إطار صيغ.'
- `CIN_STAGIAIRE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة تعريف المتربص.'
- `DIPLOME`: label_ar='الشهادة العلمية', help_ar='الشهادة المتحصل عليها (مثال: إجازة في الإعلامية).'
- `ANNEE_DIPLOME`: label_ar='سنة الحصول على الشهادة', hint_ar='رقم', help_ar='سنة الحصول على الشهادة (مثال: 2020).'
- `ADRESSE_STAGIAIRE`: label_ar='العنوان', help_ar='عنوان المتربص.'
- `DOMAINE`: label_ar='الاختصاص', help_ar='مجال الدراسة أو الاختصاص.'
- `DUREE_MOIS`: label_ar='المدة', help_ar='المدة بالسنوات أو الأشهر للعقد.'
- `DATE_DEBUT`: label_ar='تاريخ مفعول العقد', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ بداية التربص.'
- `DATE_FIN`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للعقد.'
- `MONTANT_BOURSE`: label_ar='المبلغ', hint_ar='رقم', help_ar='مبلغ المنحة الشهرية بالدينار التونسي.'
- `PART_ETAT`: label_ar='حصة الدولة', help_ar='نسبة المنحة التي تتحملها الدولة (%).'
- `PART_ENTREPRISE`: label_ar='حصة المؤسسة', help_ar='نسبة المنحة التي تتحملها المؤسسة (%).'
- `PREAVIS_JOURS`: label_ar='مهلة الإعلام', hint_ar='رقم', help_ar='مهلة الإعلام بالأيام عند إنهاء العقد (مثال: 30 يومًا).'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'تربص إعداد للحياة المهنية للخرجين الجدد، بالتنسيق مع مكتب التشغيل وممول من الدولة.'

### etat-des-lieux

- `NOM_BAILLEUR`: label_ar='الاسم (المسوغ)', help_ar='الاسم الكامل للمكري صاحب العقار الذي يؤجره.'
- `CIN_BAILLEUR`: label_ar='رقم بطاقة التعريف الوطنية (المسوغ)', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية للمكري (صاحب الدار).'
- `NOM_PRENEUR`: label_ar='الاسم (المتسوغ)', help_ar='الاسم الكامل للمكتري الذي سيسكن في الدار.'
- `CIN_PRENEUR`: label_ar='رقم بطاقة التعريف الوطنية (المتسوغ)', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية للمكتري (الساكن).'
- `ADRESSE_BIEN`: label_ar='عنوان العقار المسوغ', help_ar='العنوان الكامل للمسكن موضوع عقد الكراء.'
- `TYPE_ETAT`: label_ar='نوع محضر المعاينة', help_ar='حدد ما إذا كان محضر معاينة دخول أو خروج.'
- `SOL_SALON`: label_ar='أرضية الصالون', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `MURS_SALON`: label_ar='جدران الصالون', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `PLAFOND_SALON`: label_ar='سقف الصالون', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `FENETRES_SALON`: label_ar='نوافذ الصالون', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `OBS_SALON`: label_ar='ملاحظات الصالون', help_ar='صف بإيجاز ملاحظات الصالون .'
- `NB_CHAMBRES`: label_ar='عدد غرف النوم', help_ar='العدد .'
- `SOL_CHAMBRES`: label_ar='أرضية غرف النوم', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `MURS_CHAMBRES`: label_ar='جدران غرف النوم', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `PLACARDS_CHAMBRES`: label_ar='خزائن غرف النوم', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `OBS_CHAMBRES`: label_ar='ملاحظات غرف النوم', help_ar='صف بإيجاز ملاحظات غرف النوم .'
- `SOL_CUISINE`: label_ar='أرضية المطبخ', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `MURS_CUISINE`: label_ar='جدران المطبخ', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `EVIER`: label_ar='حوض غسيل المطبخ', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `MEUBLES_CUISINE`: label_ar='أثاث المطبخ', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `OBS_CUISINE`: label_ar='ملاحظات المطبخ', help_ar='صف بإيجاز ملاحظات المطبخ .'
- `NB_SDB`: label_ar='عدد قاعات الاستحمام', help_ar='العدد .'
- `SOL_SDB`: label_ar='أرضية قاعة الاستحمام', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `MURS_SDB`: label_ar='جدران قاعة الاستحمام', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `SANITAIRES`: label_ar='التجهيزات الصحية', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `ROBINETTERIE`: label_ar='الحنفيات', help_ar='حالة هذا العنصر عند الدخول أو الخروج (جيد، متوسط، متدهور).'
- `OBS_SDB`: label_ar='ملاحظات قاعة الاستحمام', help_ar='صف بإيجاز ملاحظات قاعة الاستحمام .'
- `AUTRES_PIECES`: label_ar='أجزاء أخرى', help_ar='الأجزاء الأخرى بالمسكن (مثال: مكتب، مخزن).'
- `DESCRIPTION_AUTRES_PIECES`: label_ar='الوصف', help_ar='وصف مفصّل للأجزاء الأخرى بالمسكن.'
- `INDEX_ELEC`: label_ar='مؤشر عداد الكهرباء', help_ar='قراءة العداد .'
- `NUM_COMPTEUR_ELEC`: label_ar='رقم عداد الكهرباء', help_ar='رقم تعريف رسمي .'
- `INDEX_EAU`: label_ar='مؤشر عداد الماء', help_ar='قراءة العداد .'
- `NUM_COMPTEUR_EAU`: label_ar='رقم عداد الماء', help_ar='رقم تعريف رسمي .'
- `INDEX_GAZ`: label_ar='مؤشر عداد الغاز', help_ar='قراءة العداد .'
- `NUM_COMPTEUR_GAZ`: label_ar='رقم عداد الغاز', help_ar='رقم تعريف رسمي .'
- `NB_CLES`: label_ar='عدد المفاتيح', help_ar='العدد .'
- `LIEU`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `DATE_DELIVRANCE_CIN_B`: label_ar='تاريخ منح بطاقة التعريف للمؤجر', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية للمؤجر.'
- `LIEU_DELIVRANCE_CIN_B`: label_ar='مكان منح بطاقة التعريف للمؤجر', placeholder_ar='تونس', help_ar='مدينة منح بطاقة التعريف الوطنية للمؤجر.'
- `DATE_DELIVRANCE_CIN_P`: label_ar='تاريخ منح بطاقة التعريف للمكتري', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية للمكتري.'
- `LIEU_DELIVRANCE_CIN_P`: label_ar='مكان منح بطاقة التعريف للمكتري', placeholder_ar='تونس', help_ar='مدينة منح بطاقة التعريف الوطنية للمكتري.'
- *description_ar*: 'ورقة توصف حالة الدار بالتفصيل قبل ما تسكن والا كي تخرج، باش تحمي حقك في الماكول والضمان.'

### lettre-demission

- `NOM_SALARIE`: label_ar='الاسم', help_ar='اسمك الكامل — الأجير الذي يقدم استقالته.'
- `ADRESSE_SALARIE`: label_ar='العنوان', help_ar='عنوانك الشخصي الحالي.'
- `TEL_SALARIE`: label_ar='الهاتف', help_ar='رقم هاتفك للاتصال بك عند الحاجة.'
- `POSTE`: label_ar='الخطة الوظيفية', help_ar='المنصب الذي تشغله حاليًا في المؤسسة.'
- `DESTINATAIRE`: label_ar='المرسل إليه', help_ar='اسم المسؤول أو مصلحة الموارد البشرية الموجه إليها هذه الرسالة.'
- `NOM_ENTREPRISE`: label_ar='الاسم', help_ar='اسم المؤسسة التي تغادرها.'
- `ADRESSE_ENTREPRISE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) .'
- `DATE_EMBAUCHE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ انتدابك في هذه المؤسسة.'
- `DUREE_PREAVIS`: label_ar='المدة', help_ar='مدة الإعلام المسبق التي تحترمها قبل مغادرتك.'
- `DATE_EFFET_PREAVIS`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ الذي يبدأ منه سريان مهلة الإعلام المسبق.'
- `DATE_DERNIER_JOUR`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ آخر يوم عمل لك (بعد انتهاء مهلة الإعلام المسبق).'
- `MOTIF_DEMISSION`: label_ar='سبب الاستقالة', help_ar='سبب مغادرتك (اختياري، يمكن أن يكون عامًا).'
- `LIEU`: label_ar='المكان', help_ar='المكان (المدينة) الذي تحرر فيه هذه الرسالة.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ تحرير رسالة الاستقالة.'
- `MODE_ENVOI`: label_ar='طريقة الإرسال', help_ar='طريقة إرسال رسالة الاستقالة.'
- *description_ar*: 'جواب رسمي تبعثو للعرفك باش تعلمو بوقوفك على الخدمة وتحدد فيه تاريخ الخروج والمهلة.'

### mise-en-demeure

- `NOM_EXPEDITEUR`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) .'
- `CIN_EXPEDITEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام .'
- `ADRESSE_EXPEDITEUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) .'
- `NOM_DESTINATAIRE`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) .'
- `CIN_DESTINATAIRE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام .'
- `ADRESSE_DESTINATAIRE`: label_ar='العنوان', help_ar='العنوان الكامل للموجّه إليه الإنذار.'
- `SOCIETE_DESTINATAIRE`: label_ar='الشركة المرسل إليها', help_ar='اسم الشركة الموجّه إليها الإنذار.'
- `OBJET_SOMMAIRE`: label_ar='ملخص الموضوع', help_ar='صف بإيجاز ملخص الموضوع .'
- `ACTE_ORIGINE`: label_ar='العقد الأصلي', help_ar='الوثيقة أو العقد الذي هو أصل الالتزام (مثال: عقد بيع بتاريخ 01/01/2024).'
- `DATE_ACTE_ORIGINE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `OBLIGATION_INITIALE`: label_ar='الالتزام الأصلي', help_ar='صف بإيجاز الالتزام الأصلي .'
- `MANQUEMENT_CONSTATE`: label_ar='الإخلال المعاين', help_ar='صف بإيجاز الإخلال المعاين .'
- `SOMMATION`: label_ar='التنبيه بالإيفاء', help_ar='صف بإيجاز التنبيه بالإيفاء .'
- `DELAI_JOURS`: label_ar='الأجل بالأيام', hint_ar='رقم', help_ar='الأجل الممنوح بالأيام للتنفيذ (مثال: 15 يومًا).'
- `LIEU`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'جواب تنبيه رسمي ومسوقر يتبعت باش تطالب بحقك وتنذر الطرف الآخر قبل ما تمشي للمحكمة.'

### nda-confidentialite

- `NOM_PARTIE_A`: label_ar='الاسم', help_ar='اسم (السبب الاجتماعي) للشركة الطرف أ.'
- `ADRESSE_PARTIE_A`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT_A`: label_ar='الممثل (أ)', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `NOM_PARTIE_B`: label_ar='الاسم', help_ar='اسم (السبب الاجتماعي) للشركة الطرف ب.'
- `ADRESSE_PARTIE_B`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT_B`: label_ar='الممثل (ب)', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `SCOPE_INFOS`: label_ar='مجال المعلومات', help_ar='نوع المعلومات المشمولة بالسرية (مثال: بيانات حرفاء، شفرة مصدر).'
- `OBJET_COLLABORATION`: label_ar='موضوع التعاون', help_ar='هدف التعاون بين الأطراف.'
- `DATE_EFFET`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للعقد.'
- `DUREE_ANNEE`: label_ar='المدة', help_ar='المدة بالسنوات أو الأشهر للعقد.'
- `TRIBUNAL`: label_ar='المحكمة المختصة ترابياً', help_ar='المحكمة المختصة ترابيًا في حالة النزاع (مثال: المحكمة الابتدائية بتونس).'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'إتفاق قانوني باش تحمي بيه أسرار الخدمة والمعلومات الحساسة وميخرجوش للناس لخرين.'

### prestation-services

- `NOM_CLIENT`: label_ar='الاسم', help_ar='اسم الحريف الذي يطلب الخدمة.'
- `ADRESSE_CLIENT`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT_CLIENT`: label_ar='ممثل الحريف', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `NOM_PRESTATAIRE`: label_ar='الاسم', help_ar='اسم الشخص أو المؤسسة التي تنجز الخدمة.'
- `ADRESSE_PRESTATAIRE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT_PRESTATAIRE`: label_ar='ممثل مسدي الخدمات', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `DESCRIPTION_PRESTATIONS`: label_ar='الوصف', help_ar='صف بإيجاز الوصف في العقد.'
- `MONTANT_TOTAL`: label_ar='المبلغ', hint_ar='رقم', help_ar='المبلغ الإجمالي للخدمة بالدينار التونسي (دون الأداء).'
- `MODALITES_PAIEMENT`: label_ar='طرق الخلاص', help_ar='كيف ومتى يتم الدفع (مثال: 50% عند التوقيع، 50% عند التسليم).'
- `DUREE`: label_ar='المدة', help_ar='المدة بالسنوات أو الأشهر للعقد.'
- `DATE_DEBUT`: label_ar='تاريخ مفعول العقد', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للعقد.'
- `PREAVIS_JOURS`: label_ar='مهلة الإعلام', hint_ar='رقم', help_ar='مهلة الإعلام بالأيام عند فسخ العقد (مثال: 30 يومًا).'
- `TRIBUNAL`: label_ar='المحكمة المختصة ترابياً', help_ar='المحكمة المختصة ترابيًا في حالة النزاع (مثال: المحكمة الابتدائية بتونس).'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `QUALITE_REPRESENTANT_CLIENT`: label_ar='صفة ممثل الحريف', placeholder_ar='مدير', help_ar='صفة/وظيفة ممثل الحريف (مثال: مدير، رئيس).'
- `QUALITE_REPRESENTANT_PRESTATAIRE`: label_ar='صفة ممثل مقدم الخدمات', placeholder_ar='مدير', help_ar='صفة/وظيفة ممثل مقدم الخدمات (مثال: مدير، رئيس).'
- `CAPITAL_SOCIAL_CLIENT`: label_ar='رأس مال الحريف (د.ت)', hint_ar='رقم', help_ar='مبلغ رأس مال شركة الحريف بالدينار التونسي.'
- `CAPITAL_SOCIAL_PRESTATAIRE`: label_ar='رأس مال مقدم الخدمات (د.ت)', hint_ar='رقم', help_ar='مبلغ رأس مال شركة مقدم الخدمات بالدينار التونسي.'
- `NUM_RNE_CLIENT`: label_ar='رقم السجل الوطني للمؤسسات للحريف', help_ar='رقم التسجيل بالسجل الوطني للمؤسسات لشركة الحريف.'
- `NUM_RNE_PRESTATAIRE`: label_ar='رقم السجل الوطني للمؤسسات لمقدم الخدمات', help_ar='رقم التسجيل بالسجل الوطني للمؤسسات لشركة مقدم الخدمات.'
- *description_ar*: 'كونترا خدمة بين شكون يقدم في خدمة وحريف، يحدد شنوة المطلوب، الوقت، وسوم الخلاص.'

### pret-particuliers

- `NOM_PRETEUR`: label_ar='الاسم', help_ar='الاسم الكامل للشخص الذي يقرض المال.'
- `CIN_PRETEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_PRETEUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `NOM_EMPRUNTEUR`: label_ar='الاسم', help_ar='الاسم الكامل للشخص الذي يقترض المال.'
- `CIN_EMPRUNTEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_EMPRUNTEUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `MONTANT`: label_ar='المبلغ', hint_ar='رقم', help_ar='المبلغ الكامل للقرض بالدينار التونسي.'
- `DESTINATION_PRET`: label_ar='غاية القرض', help_ar='الغرض من القرض (مثال: شراء عربة، أشغال).'
- `MODALITES`: label_ar='الصيغ والترتيبات', help_ar='شروط أو كيفيات خاصة .'
- `DATE_DEBLOCAGE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `DATE_ECHEANCE_FINALE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `AVEC_INTERET`: label_ar='بفائدة', help_ar='حدد ما إذا كان القرض بفائدة (نعم/لا).'
- `TAUX`: label_ar='النسبة', hint_ar='رقم', help_ar='النسبة المئوية (مثال: 10 تعني 10%).'
- `GARANTIES_PRET`: label_ar='ضمانات القرض', help_ar='الضمانات المقدمة للقرض (مثال: كفالة تضامنية، رهن).'
- `CONDITIONS_ANTICIPE`: label_ar='شروط السداد المبكر', help_ar='شروط أو كيفيات خاصة .'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `NATIONALITE_PRETEUR`: label_ar='جنسية المُقرِض', placeholder_ar='تونسية', help_ar='جنسية الشخص الذي يُقرِض المال.'
- `DATE_CIN_PRETEUR`: label_ar='تاريخ منح بطاقة التعريف للمُقرِض', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية للمُقرِض.'
- `NATIONALITE_EMPRUNTEUR`: label_ar='جنسية المُقترِض', placeholder_ar='تونسية', help_ar='جنسية الشخص الذي يُقترِض المال.'
- `DATE_CIN_EMPRUNTEUR`: label_ar='تاريخ منح بطاقة التعريف للمُقترِض', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية للمُقترِض.'
- *description_ar*: 'كاتب سلف يضمن حق الزوز من الناس، يوثق قداش تسلفت، كيفاش ومتى باش ترجع الفلوس.'

### procuration-speciale

- `NOM_MANDANT`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `CIN_MANDANT`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_MANDANT`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `NOM_MANDATAIRE`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `CIN_MANDATAIRE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_MANDATAIRE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `MISSION_SPECIALE`: label_ar='المهمة الخاصة', help_ar='صف بإيجاز المهمة الخاصة .'
- `DATE_FIN`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للعقد.'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `NATIONALITE_MANDANT`: label_ar='جنسية الموكِل', placeholder_ar='تونسية', help_ar='جنسية الموكِل (الشخص الذي يمنح الوكالة).'
- `NATIONALITE_MANDATAIRE`: label_ar='جنسية الوكيل', placeholder_ar='تونسية', help_ar='جنسية الوكيل (الشخص الذي يتلقى الوكالة).'
- `DATE_DELIVRANCE_CIN_MANDANT`: label_ar='تاريخ منح بطاقة التعريف للموكِل', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية للموكِل.'
- `DATE_DELIVRANCE_CIN_MANDATAIRE`: label_ar='تاريخ منح بطاقة التعريف للوكيل', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية للوكيل.'
- `LIEU_DELIVRANCE_CIN_MANDANT`: label_ar='مكان منح بطاقة التعريف للموكِل', placeholder_ar='تونس', help_ar='مدينة منح بطاقة التعريف الوطنية للموكِل.'
- `LIEU_DELIVRANCE_CIN_MANDATAIRE`: label_ar='مكان منح بطاقة التعريف للوكيل', placeholder_ar='تونس', help_ar='مدينة منح بطاقة التعريف الوطنية للوكيل.'
- *description_ar*: 'توكيل لشخص أخر باش يقضي قضاء معين في بلاصتك ومصادق عليه في البلدية بمدة محددة.'

### quittance-loyer

- `NOM_BAILLEUR`: label_ar='الاسم (المسوغ)', help_ar='الاسم الكامل للمكري صاحب العقار الذي يؤجره.'
- `CIN_BAILLEUR`: label_ar='رقم بطاقة التعريف الوطنية (المسوغ)', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية للمكري (صاحب الدار).'
- `NOM_PRENEUR`: label_ar='الاسم (المتسوغ)', help_ar='الاسم الكامل للمكتري الذي سيسكن في الدار.'
- `MONTANT`: label_ar='المبلغ', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي عن فترة الكراء.'
- `MOIS`: label_ar='الشهر', help_ar='الشهر المعني (مثال: جانفي، فيفري).'
- `ANNEE`: label_ar='السنة', hint_ar='رقم', help_ar='السنة المدنية المقابلة للكراء (مثال: 2024).'
- `ADRESSE_BIEN`: label_ar='عنوان العقار المسوغ', help_ar='العنوان الكامل للمسكن موضوع عقد الكراء.'
- `MODE_PAIEMENT`: label_ar='طريقة الخلاص', help_ar='طريقة دفع الكراء (مثال: نقدًا، صك، تحويل).'
- `LIEU`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `CIN_PRENEUR`: label_ar='بطاقة تعريف المكتري', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية للمكتري.'
- `MONTANT_EN_CHIFFRES`: label_ar='المبلغ بالأرقام (د.ت)', hint_ar='رقم', help_ar='مبلغ الكراء بالأرقام (دينار تونسي).'
- `MONTANT_EN_LETTRES`: label_ar='المبلغ بالحروف', placeholder_ar='خمسمائة', help_ar='مبلغ الكراء مكتوب بالحروف (دينار تونسي).'
- `DATE_CONTRAT_BAIL`: label_ar='تاريخ عقد الكراء', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ عقد الكراء الأصلي الذي تشير إليه الوصل.'
- *description_ar*: 'توصيل يصحح فيه الملاك يثبت إلي الكاري خلص كراه في وقتو وبدون مشاكل.'

### reconnaissance-dette

- `NOM_DEBITEUR`: label_ar='الاسم', help_ar='الاسم الكامل للشخص الذي عليه الدين (المدين).'
- `CIN_DEBITEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_DEBITEUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `NOM_CREANCIER`: label_ar='الاسم', help_ar='الاسم الكامل للشخص الذي يستحق المال (الدائن).'
- `CIN_CREANCIER`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_CREANCIER`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `MONTANT_DETTE`: label_ar='المبلغ', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي للطرف المعني.'
- `MOTIF_DETTE`: label_ar='سبب الدين', help_ar='سبب أو أصل الدين (مثال: قرض، بيع، خدمة).'
- `DATE_REMISE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `MODALITES_REMBOURSEMENT`: label_ar='طرق التسديد', help_ar='كيفية سداد الدين (مثال: شهريًا، دفعة واحدة).'
- `DATE_ECHEANCE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `TAUX_INTERET`: label_ar='النسبة', hint_ar='رقم', help_ar='نسبة الفائدة السنوية (مثال: 5 تعني 5%).'
- `DATE_DEBUT_INTERETS`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `GARANTIES_EVENTUELLES`: label_ar='الضمانات عند الاقتضاء', help_ar='شروط أو كيفيات خاصة لضمانات العقد.'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'كاتب يصحح فيه المطلوب يلتزم فيه بالفلوس إلي سالوهالو وباش يرجعها في تاريخ معين.'

### rupture-conventionnelle

- `NOM_ENTREPRISE`: label_ar='الاسم', help_ar='اسم المشغل الذي يقبل الإنهاء الاتفاقي.'
- `RNE`: label_ar='السجل الوطني للمؤسسات', help_ar='الرقم الموحد للسجل الوطني للمؤسسات.'
- `ADRESSE_ENTREPRISE`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `REPRESENTANT`: label_ar='الممثل القانوني', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `NOM_SALARIE`: label_ar='الاسم', help_ar='الاسم الكامل للأجير المعني بالإنهاء الاتفاقي للعقد.'
- `CIN_SALARIE`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة تعريف الأجير المعني بالإنهاء.'
- `DATE_CDI`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للطرف المعني.'
- `POSTE`: label_ar='الخطة الوظيفية', help_ar='التسمية الدقيقة للمنصب أو الوظيفة المشغولة.'
- `DATE_RUPTURE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة .'
- `INDEMNITE`: label_ar='التعويض', hint_ar='رقم', help_ar='مبلغ تعويض الإنهاء بالدينار التونسي.'
- `BASE_CALCUL`: label_ar='قاعدة الاحتساب', help_ar='أساس احتساب التعويض (مثال: الأجر الخام الشهري × سنوات الأقدمية).'
- `JOURS_CONGES_DUS`: label_ar='أيام الإجازة المستحقة', help_ar='عدد أيام الراحة غير المستعملة والمستحقة الدفع للأجير.'
- `LIEU`: label_ar='المكان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE`: label_ar='تاريخ', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- `QUALITE`: label_ar='صفة ممثل المؤجر', placeholder_ar='مدير', help_ar='صفة/وظيفة ممثل المؤجر (مثال: مدير، رئيس).'
- `DATE_CIN`: label_ar='تاريخ منح بطاقة التعريف للأجير', placeholder_ar='يوم/شهر/سنة', help_ar='تاريخ منح بطاقة التعريف الوطنية للأجير.'
- `ADRESSE_SALARIE`: label_ar='عنوان الأجير', placeholder_ar='12 شارع، المدينة', help_ar='العنوان الكامل للأجير (شارع، مدينة).'
- *description_ar*: 'إتفاق بالتراضي بين الخدّام والشركة باش يقصو الخدمة مع تحديد الهبوط والتعويضات.'

### statuts-sarl

- `DENOMINATION`: label_ar='التسمية الاجتماعية', help_ar='التسمية الاجتماعية (السبب الاجتماعي) للشركة.'
- `OBJET_SOCIAL`: label_ar='الغرض الاجتماعي', help_ar='النشاط الرئيسي للشركة (مثال: تجارة الجملة، خدمات إعلامية).'
- `SIEGE`: label_ar='المقر الاجتماعي', help_ar='العنوان الكامل (النهج، الرقم، المدينة) .'
- `DUREE_ANNEE`: label_ar='المدة', help_ar='المدة بالسنوات أو الأشهر .'
- `CAPITAL`: label_ar='رأس المال', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي للشركة.'
- `NB_PARTS`: label_ar='عدد الحصص الاجتماعية', help_ar='العدد الكلي للحصص الاجتماعية للشركة.'
- `VALEUR_NOMINALE`: label_ar='القيمة الاسمية للحصة', hint_ar='رقم', help_ar='القيمة الاسمية للسهم الواحد بالدينار التونسي.'
- `REPARTITION_PARTS`: label_ar='توزيع الحصص الاجتماعية', help_ar='كيفية توزيع الحصص بين الشركاء (مثال: 50/50).'
- `NOM_GERANT`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) لمسير الشركة.'
- `DUREE_MANDAT_GERANT`: label_ar='المدة', help_ar='المدة بالسنوات أو الأشهر لمسير الشركة.'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'لوراق الرسمية لتأسيس شركة ليميتد، تحدد راس المال، أسماء الشركاء وكيفاش تتسير.'

### vente-moto

- `NOM_VENDEUR`: label_ar='الاسم', help_ar='الاسم الكامل للبائع صاحب العربة.'
- `CIN_VENDEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_VENDEUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `NOM_ACQUEREUR`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `CIN_ACQUEREUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_ACQUEREUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `MARQUE`: label_ar='العلامة', help_ar='خاصية فنية للعربة في العقد.'
- `MODELE`: label_ar='الطراز', help_ar='خاصية فنية للعربة في العقد.'
- `IMMATRICULATION`: label_ar='الماتركل', help_ar='خاصية فنية للعربة في العقد.'
- `NUM_CADRE`: label_ar='رقم الإطار', help_ar='رقم تعريف رسمي في العقد.'
- `NUM_MOTEUR`: label_ar='رقم المحرك', help_ar='رقم تعريف رسمي في العقد.'
- `CYLINDREE`: label_ar='سعة الأسطوانة', help_ar='خاصية فنية للعربة في العقد.'
- `ANNEE_MEC`: label_ar='سنة أول جولان', help_ar='سنة أول جولان للدراجة النارية.'
- `KILOMETRAGE`: label_ar='المسافة المقطوعة', help_ar='خاصية فنية للعربة في العقد.'
- `PRIX`: label_ar='الثمن', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي .'
- `DELAI_JOURS`: label_ar='الأجل بالأيام', hint_ar='رقم', help_ar='الأجل بالأيام لإتمام نقل الملكية.'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'كاتب بيع وشراء موتور، يحدد نوعها، نومرو الشاسي، السوم وتصحيح البلدية لنقل الملكية.'

### vente-voiture

- `NOM_VENDEUR`: label_ar='الاسم', help_ar='الاسم الكامل للبائع صاحب العربة.'
- `CIN_VENDEUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_VENDEUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `NOM_ACQUEREUR`: label_ar='الاسم', help_ar='الاسم الكامل (الاسم واللقب) للطرف المعني.'
- `CIN_ACQUEREUR`: label_ar='بطاقة التعريف', hint_ar='8 أرقام', help_ar='رقم بطاقة التعريف الوطنية المكون من 8 أرقام للطرف المعني.'
- `ADRESSE_ACQUEREUR`: label_ar='العنوان', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للطرف المعني.'
- `MARQUE`: label_ar='العلامة', help_ar='خاصية فنية للعربة في العقد.'
- `MODELE`: label_ar='الطراز', help_ar='خاصية فنية للعربة في العقد.'
- `IMMATRICULATION`: label_ar='الماتركل', help_ar='خاصية فنية للعربة في العقد.'
- `NUM_CHASSIS`: label_ar='رقم الهيكل', help_ar='رقم تعريف رسمي في العقد.'
- `ANNEE_MEC`: label_ar='سنة أول جولان', help_ar='سنة أول جولان للعربة.'
- `CARBURANT`: label_ar='نوع الوقود', help_ar='خاصية فنية للعربة في العقد.'
- `PUISSANCE_FISCALE`: label_ar='القوة الجبائية', help_ar='خاصية فنية للعربة في العقد.'
- `KILOMETRAGE`: label_ar='المسافة المقطوعة', help_ar='خاصية فنية للعربة في العقد.'
- `PRIX`: label_ar='الثمن', hint_ar='رقم', help_ar='المبلغ بالدينار التونسي لعملية البيع.'
- `DELAI_MUTATION_JOURS`: label_ar='أجل نقل الملكية بالأيام', hint_ar='رقم', help_ar='الأجل بالأيام لإتمام نقل الملكية.'
- `LIEU_SIGNATURE`: label_ar='مكان الإمضاء', help_ar='العنوان الكامل (النهج، الرقم، المدينة) للتوقيع.'
- `DATE_SIGNATURE`: label_ar='تاريخ الإمضاء', hint_ar='يوم/شهر/سنة', placeholder_ar='يوم/شهر/سنة', help_ar='التاريخ بصيغة يوم/شهر/سنة للتوقيع.'
- *description_ar*: 'كاتب لبيع وشرا كرهبة، يحدد سومها، نومرو الشاسي باش تبدل الكارطة غريز باسمك في تونس.'
