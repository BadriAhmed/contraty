# Tunisian Darija (تونسي) — text to verify

This file collects **every** piece of Tunisian Arabic (Darija / تونسي) used in the app so it can be reviewed and corrected.

Modern Standard Arabic (فصحى) is intentionally **excluded** — only Tounsi is listed here.

## Sources

- `data/templates/*.json` → `description_ar` (the short description under each template card)
- `frontend/src/components/v2/DisclaimerStep.tsx` → the "write in your own words" banner on the Arabic wizard's first step
- `frontend/src/components/v2/TransliterateChip.tsx` → the hint shown while typing Latin text in Arabic mode

---

## 1. Template descriptions (`description_ar`)

> Each item shows the Tounsi description with its French counterpart for meaning-checking.

### 1.1 attestation-hebergement — شهادة إيواء

- **تونسي:** ورقة يصححها شكون مستضيفك في داره، تستحقها كي تجدد بطاقة التعريف أو أوراق أخرى.
- **FR:** Prouve que vous logez quelqu'un chez vous. Utile pour renouveler sa carte d'identité (CIN).

### 1.2 attestation-honneur — شهادة على الشرف

- **تونسي:** تصريح مصحح ومصادق عليه تشهد فيه بصحة معلومة تهمك لقضاء شؤون إدارية.
- **FR:** Déclarez officiellement un fait ou une situation pour vos démarches administratives.

### 1.3 autorisation-parentale-voyage — إذن سفر للقاصر

- **تونسي:** ترخيص مصحح ومصادق عليه من الولي يسمح للطفل القاصر بالسفر لبرا وحده أو مع غيره.
- **FR:** Permet à votre enfant mineur de voyager seul ou accompagné hors de Tunisie.

### 1.4 bail-habitation — عقد كراء مسكن

- **تونسي:** إتفاقية بين الملاك والكاري تحدد السوم الشهري، الضمان وشروط السكنى في الدار.
- **FR:** Louez un logement en définissant le loyer, la caution et les règles entre vous.

### 1.5 compromis-vente-immobilier — وعد بالبيع العقاري

- **تونسي:** كاتب يربط الشاري والبايع قبل العقد النهائي، يحدد السوم، العربون وأجل الخلاص.
- **FR:** Engage l'acheteur et le vendeur d'un bien avant de signer l'acte de vente définitif.

### 1.6 contrat-cdd — عقد عمل محدد المدة

- **تونسي:** كونترا خدمة بوقت معين لخدمة مؤقتة، يحدد الشهريّة والمدة وشروط توقيف الخدمة.
- **FR:** Embauchez un salarié pour une durée limitée, un projet précis ou un remplacement.

### 1.7 contrat-cdi — عقد عمل غير محدد المدة

- **تونسي:** كونترا خدمة مرسمة وموش محددة بوقت، يحدد الشهرية، رخص السنوية وتفاصيل الخدمة.
- **FR:** Embauchez un salarié de manière durable, sans fixer de date de fin de mission.

### 1.8 contrat-karama — عقد عمل مدعم — برنامج كرامة

- **تونسي:** كونترا خدمة مدعم من الدولة وموجه لحاملي الشهادات العليا باش يسهل دخولهم لسوق الشغل.
- **FR:** Recrutez un jeune diplômé et bénéficiez de la prise en charge financière de l'État.

### 1.9 contrat-sivp — عقد صيغ — إدماج في الحياة المهنية

- **تونسي:** تربص إعداد للحياة المهنية للخرجين الجدد، بالتنسيق مع مكتب التشغيل وممول من الدولة.
- **FR:** Intégrez un jeune diplômé en stage de préparation à l'emploi avec l'aide de l'ANETI.

### 1.10 etat-des-lieux — محضر معاينة (دخول / خروج)

- **تونسي:** ورقة توصف حالة الدار بالتفصيل قبل ما تسكن والا كي تخرج، باش تحمي حقك في الماكول والضمان.
- **FR:** Décrit précisément l'état de chaque pièce du logement à l'entrée et à la sortie.

### 1.11 lettre-demission — رسالة استقالة

- **تونسي:** جواب رسمي تبعثو للعرفك باش تعلمو بوقوفك على الخدمة وتحدد فيه تاريخ الخروج والمهلة.
- **FR:** Informez officiellement votre employeur de votre départ et fixez le préavis.

### 1.12 mise-en-demeure — إنذار قانوني

- **تونسي:** جواب تنبيه رسمي ومسوقر يتبعت باش تطالب بحقك وتنذر الطرف الآخر قبل ما تمشي للمحكمة.
- **FR:** Demandez formellement à quelqu'un de respecter ses engagements avant de le poursuivre.

### 1.13 nda-confidentialite — اتفاقية سرية

- **تونسي:** إتفاق قانوني باش تحمي بيه أسرار الخدمة والمعلومات الحساسة وميخرجوش للناس لخرين.
- **FR:** Protégez vos idées et vos données secrètes lors d'échanges avec des partenaires.

### 1.14 prestation-services — عقد تقديم خدمات

- **تونسي:** كونترا خدمة بين شكون يقدم في خدمة وحريف، يحدد شنوة المطلوب، الوقت، وسوم الخلاص.
- **FR:** Fixez le prix, les délais et les conditions d'un service rendu par un professionnel.

### 1.15 pret-particuliers — عقد قرض بين الخواص

- **تونسي:** كاتب سلف يضمن حق الزوز من الناس، يوثق قداش تسلفت، كيفاش ومتى باش ترجع الفلوس.
- **FR:** Sécurisez un prêt d'argent entre proches en fixant les conditions de remboursement.

### 1.16 procuration-speciale — وكالة خاصة

- **تونسي:** توكيل لشخص أخر باش يقضي قضاء معين في بلاصتك ومصادق عليه في البلدية بمدة محددة.
- **FR:** Donnez pouvoir à une personne de confiance pour réaliser une démarche précise pour vous.

### 1.17 quittance-loyer — وصل كراء

- **تونسي:** توصيل يصحح فيه الملاك يثبت إلي الكاري خلص كراه في وقتو وبدون مشاكل.
- **FR:** Prouve que le locataire a bien payé son loyer pour un mois ou une période donnée.

### 1.18 reconnaissance-dette — اعتراف بدين

- **تونسي:** كاتب يصحح فيه المطلوب يلتزم فيه بالفلوس إلي سالوهالو وباش يرجعها في تاريخ معين.
- **FR:** Prouve par écrit qu'une personne vous doit de l'argent et s'engage à vous rembourser.

### 1.19 rupture-conventionnelle — اتفاقية إنهاء علاقة الشغل

- **تونسي:** إتفاق بالتراضي بين الخدّام والشركة باش يقصو الخدمة مع تحديد الهبوط والتعويضات.
- **FR:** Mettez fin à un contrat de travail à l'amiable avec l'accord de votre employeur.

### 1.20 statuts-sarl — القانون الأساسي لشركة ذات مسؤولية محدودة

- **تونسي:** لوراق الرسمية لتأسيس شركة ليميتد، تحدد راس المال، أسماء الشركاء وكيفاش تتسير.
- **FR:** Définissez les règles de gestion, le capital et les associés pour créer votre entreprise.

### 1.21 vente-moto — عقد بيع دراجة نارية

- **تونسي:** كاتب بيع وشراء موتور، يحدد نوعها، نومرو الشاسي، السوم وتصحيح البلدية لنقل الملكية.
- **FR:** Sécurisez le transfert de propriété d'un deux-roues en fixant son prix et ses détails.

### 1.22 vente-voiture — عقد بيع سيارة

- **تونسي:** كاتب لبيع وشرا كرهبة، يحدد سومها، نومرو الشاسي باش تبدل الكارطة غريز باسمك في تونس.
- **FR:** Vendez ou achetez un véhicule d'occasion en enregistrant les détails administratifs.

---

## 2. In-app UI copy

### 2.1 `DisclaimerStep.tsx` — banner on the Arabic wizard's first step

- **Heading:** اكتب باللغة اللي تريحك — احنا نحولوه لصيغة قانونية
- **Body:** تونّسها كيما تحب، بالعرّبي، بالفرنساوي، ولا حتى بالدارجة (مثال: «ismi Ahmed»، «العمارة رقم 5»، «هو يخلّص في آخر الشهر»). Contrati يحوّل إجاباتك لصيغ قانونية صحيحة ومريڤلة في العقد النهائي.

### 2.2 `TransliterateChip.tsx` — hint when typing Latin text in Arabic mode

- **Hint:** باش يتحوّل النصّ للعربيّة وحدو وقت المراجعة
