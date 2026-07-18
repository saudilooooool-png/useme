// محتوى الموقع بلغتين (عربي/إنجليزي) — مصدر واحد للحقيقة لكل النصوص.

export type Lang = "ar" | "en";

export interface Feature {
  icon: string;
  title: string;
  desc: string;
  benefits: string[];
}

export interface Step {
  n: string;
  title: string;
  desc: string;
}

export interface Content {
  dir: "rtl" | "ltr";
  nav: { features: string; how: string; caseStudy: string; pricing: string; cta: string };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    platforms: string;
  };
  stats: { value: string; label: string }[];
  featuresSection: { heading: string; sub: string; items: Feature[] };
  howSection: { heading: string; sub: string; steps: Step[] };
  caseStudy: {
    heading: string;
    quote: string;
    author: string;
    metrics: { value: string; label: string }[];
  };
  spotlight: {
    heading: string;
    sub: string;
    cards: { tag: string; title: string; desc: string; points: string[] }[];
  };
  recoTypes: {
    heading: string;
    sub: string;
    types: { icon: string; name: string; desc: string }[];
    dashboardTitle: string;
    dashboardDesc: string;
    dashboardPoints: string[];
  };
  pricing: {
    heading: string;
    sub: string;
    plans: { name: string; price: string; period: string; features: string[]; cta: string; popular?: boolean }[];
  };
  finalCta: { heading: string; sub: string; button: string };
  footer: { tagline: string; rights: string };
}

export const CONTENT: Record<Lang, Content> = {
  ar: {
    dir: "rtl",
    nav: { features: "المميزات", how: "كيف يعمل", caseStudy: "قصة نجاح", pricing: "الأسعار", cta: "ابدأ الآن" },
    hero: {
      badge: "منصة الموزّعين الذكية — متكاملة مع زد وسلة",
      title: "حوّل ملفات Excel الفوضوية إلى",
      highlight: "مبيعات مؤتمتة على زد وسلة",
      subtitle:
        "نظام تجارة إلكترونية شامل للموزّعين والمستوردين والمنتجين. عالج بياناتك بالذكاء الاصطناعي، وانشرها على زد وسلة بنقرة، وأدر كل طلباتك من لوحة واحدة — دون فريق تقني.",
      ctaPrimary: "احجز عرضًا توضيحيًا",
      ctaSecondary: "شاهد كيف يعمل",
      platforms: "يتكامل مع",
    },
    stats: [
      { value: "+30%", label: "زيادة في الطلبات" },
      { value: "+37%", label: "زيادة في الإيرادات" },
      { value: "200 ساعة", label: "عمل يدوي موفّر" },
      { value: "<3 ساعات", label: "من Excel إلى متجر جاهز" },
    ],
    featuresSection: {
      heading: "كل ما تحتاجه لأتمتة مبيعاتك",
      sub: "أربعة محرّكات ذكية تغطّي دورة البيع كاملة، من البيانات الخام إلى الطلب المشحون.",
      items: [
        {
          icon: "sparkles",
          title: "معالجة البيانات بالذكاء الاصطناعي",
          desc: "ارفع ملف CSV أو Excel أو اربط نظام الـ ERP، وسيولّد الذكاء الاصطناعي عناوين وأوصافًا محسّنة لمحركات البحث، وتصنيفات، وسمات جاهزة للنشر.",
          benefits: ["تحويل البيانات الفوضوية إلى منتجات جاهزة للبيع", "توفير ساعات الإدخال اليدوي", "تحسين ظهور المنتجات في البحث"],
        },
        {
          icon: "sync",
          title: "المزامنة والتسعير المباشر",
          desc: "انشر منتجاتك بنقرة على زد وسلة، مع حساب تلقائي للسعر الأمثل بناءً على هامش الربح ورسوم كل منصة، وتحديث فوري للمخزون.",
          benefits: ["نشر سريع عبر قنوات متعددة", "تسعير ديناميكي يضمن الربحية", "مزامنة فورية للأسعار والمخزون"],
        },
        {
          icon: "orders",
          title: "الطلبات المركزية",
          desc: "كل الطلبات من زد وسلة في لوحة واحدة. توليد تلقائي لبوليصة الشحن (AWB) والفواتير المتوافقة مع نظام «فاتورة» (ZATCA).",
          benefits: ["إدارة موحّدة لكل الطلبات", "تقليل الأخطاء اليدوية", "شحن وفوترة أسرع"],
        },
        {
          icon: "bundle",
          title: "الحزم الذكية واستعادة المخزون",
          desc: "تحليل سلوك الشراء لإنشاء حزم عالية التحويل، ودمج المنتجات الراكدة مع الأكثر مبيعًا لتصفية المخزون دون عناء.",
          benefits: ["رفع متوسط قيمة الطلب (AOV)", "تصفية المخزون الراكد", "كفاءة أعلى في إدارة المخزون"],
        },
      ],
    },
    howSection: {
      heading: "كيف يعمل DistriOS؟",
      sub: "أربع خطوات مؤتمتة بالكامل — أنت ترفع البيانات، والنظام يتولّى الباقي.",
      steps: [
        { n: "01", title: "ارفع بياناتك الخام", desc: "CSV أو Excel أو ربط ERP — يعالجها الذكاء الاصطناعي ويولّد عناوين SEO وأوصافًا وتصنيفات وسمات." },
        { n: "02", title: "المزامنة والتسعير", desc: "نشر بنقرة على زد وسلة، مع حساب تلقائي للأسعار المثلى بناءً على الهوامش ورسوم المنصة." },
        { n: "03", title: "الطلبات المركزية", desc: "توجيه كل الطلبات إلى لوحة واحدة، وتوليد تلقائي لبوليصة الشحن والفاتورة المتوافقة مع «فاتورة»." },
        { n: "04", title: "الحزم الذكية", desc: "تحليل سلوك الشراء لإنشاء حزم ترفع قيمة السلة، ودمج الراكد مع الأكثر مبيعًا." },
      ],
    },
    caseStudy: {
      heading: "قصة نجاح",
      quote:
        "انتقلنا من ملفات Excel خام إلى قوائم منتجات محسّنة لمحركات البحث على المتاجر في غضون ساعات، ونمت مبيعاتنا بشكل هائل دون توظيف أي موظف إضافي.",
      author: "أحد عملاء DistriOS — قطاع التوزيع",
      metrics: [
        { value: "+30%", label: "زيادة في الطلبات" },
        { value: "+37%", label: "زيادة في الإيرادات" },
        { value: "200 ساعة", label: "عمل يدوي تم توفيره" },
      ],
    },
    spotlight: {
      heading: "ذكاء اصطناعي حقيقي + واتساب مدمج",
      sub: "ميزتان تصنعان الفرق في السوق السعودي: معالجة بيانات بنموذج لغوي حقيقي، وتواصل مباشر مع عملائك عبر واتساب.",
      cards: [
        {
          tag: "AI",
          title: "معالجة بيانات بنموذج Claude",
          desc: "ليست قوالب جاهزة — بل نموذج لغوي حقيقي (Claude) يقرأ بياناتك الفوضوية ويكتب عناوين وأوصافًا عربية محسّنة لكل منتج.",
          points: [
            "عناوين وأوصاف SEO عربية أصيلة",
            "استخراج تلقائي للسمات والتصنيفات",
            "درجة جودة لكل منتج قبل النشر",
          ],
        },
        {
          tag: "WhatsApp",
          title: "إشعارات واتساب تلقائية",
          desc: "أبقِ عميلك على اطّلاع في كل خطوة عبر واتساب — القناة الأكثر استخدامًا في المملكة — من تأكيد الطلب حتى تسليمه.",
          points: [
            "تأكيد الطلب فور إنشائه",
            "إشعار الشحن مع رقم تتبّع AWB",
            "إرسال الفاتورة المتوافقة مع ZATCA",
          ],
        },
      ],
    },
    recoTypes: {
      heading: "توصيات ذكية بأنواع متعددة — أنت من يوافق",
      sub: "طبقة ذكاء اصطناعي فوق متجرك الجاهز على زد/سلة: تحلّل بياناتك وتقترح إجراءات، وتوافق أنت قبل تطبيقها على المتجر.",
      types: [
        { icon: "🗓", name: "توصيات موسمية", desc: "عروض مرتبطة بالمناسبات (رمضان، الصيف، الجمعة البيضاء) في وقتها المثالي." },
        { icon: "◈", name: "حزم منتجات", desc: "دمج منتجات تُشترى معًا بسعر مقترح يرفع متوسط قيمة السلة." },
        { icon: "⇄", name: "خصومات تقاطعية", desc: "خصم على منتج عند شراء منتج آخر لتحريك المخزون الراكد." },
        { icon: "⚠", name: "تنبيهات المخزون", desc: "تنبيه قبل نفاد المنتجات الرائجة لتفادي فقدان المبيعات." },
        { icon: "🏷", name: "حزم حسب الفئة", desc: "تجميع منتجات من نفس التصنيف في حزمة موضوعية." },
        { icon: "✎", name: "تحسين البيانات", desc: "اقتراح عناوين وأوصاف وتصنيفات أفضل للمنتجات ضعيفة الجودة." },
        { icon: "﷼", name: "تحسين التسعير", desc: "اقتراح تعديلات سعرية مبنية على بيانات المبيعات والهوامش." },
      ],
      dashboardTitle: "لوحة خاصة لكل تاجر",
      dashboardDesc: "كل تاجر لديه واجهته الخاصة التي تجمع كل ما يحتاجه لاتخاذ القرار:",
      dashboardPoints: [
        "تحليل بيانات متجره لحظيًا (بديل الإكسل)",
        "سجلّ التوصيات السابقة والنتائج المتحقّقة منها",
        "التوصيات الجديدة وحالتها: بانتظار التأكيد · تمت الموافقة · مرفوضة",
        "معاينة الصفحة المقترحة كما يراها العميل قبل النشر",
      ],
    },
    pricing: {
      heading: "خطط تناسب حجم أعمالك",
      sub: "ابدأ صغيرًا ووسّع مع نموّك. كل الخطط تشمل التكامل مع زد وسلة.",
      plans: [
        { name: "المبتدئ", price: "٤٩٩", period: "/شهريًا", features: ["حتى ٥٠٠ منتج", "معالجة AI للبيانات", "تكامل مع منصة واحدة", "دعم عبر البريد"], cta: "ابدأ" },
        { name: "النمو", price: "٩٩٩", period: "/شهريًا", features: ["حتى ٥٠٠٠ منتج", "تكامل مع زد وسلة معًا", "الطلبات المركزية + AWB", "الحزم الذكية", "دعم ذو أولوية"], cta: "الأكثر شيوعًا", popular: true },
        { name: "المؤسسات", price: "تواصل معنا", period: "", features: ["منتجات غير محدودة", "ربط ERP مخصّص", "مدير حساب مخصّص", "SLA واتفاقية خدمة"], cta: "تواصل مع المبيعات" },
      ],
    },
    finalCta: {
      heading: "جاهز لأتمتة مبيعاتك على زد وسلة؟",
      sub: "احجز عرضًا توضيحيًا مجانيًا وشاهد بياناتك تتحوّل إلى متجر جاهز خلال ساعات.",
      button: "احجز عرضًا توضيحيًا",
    },
    footer: { tagline: "منصة الموزّعين الذكية لأتمتة البيع على زد وسلة.", rights: "جميع الحقوق محفوظة." },
  },
  en: {
    dir: "ltr",
    nav: { features: "Features", how: "How it works", caseStudy: "Case study", pricing: "Pricing", cta: "Get started" },
    hero: {
      badge: "The smart distributor OS — integrated with Zid & Salla",
      title: "Turn messy Excel files into",
      highlight: "automated sales on Zid & Salla",
      subtitle:
        "A complete e-commerce OS for distributors, importers and producers. Process your data with AI, publish to Zid & Salla in one click, and manage every order from a single dashboard — no tech team required.",
      ctaPrimary: "Book a demo",
      ctaSecondary: "See how it works",
      platforms: "Integrates with",
    },
    stats: [
      { value: "+30%", label: "more orders" },
      { value: "+37%", label: "more revenue" },
      { value: "200 hrs", label: "manual work saved" },
      { value: "<3 hrs", label: "Excel to live store" },
    ],
    featuresSection: {
      heading: "Everything you need to automate sales",
      sub: "Four smart engines covering the full sales cycle, from raw data to shipped order.",
      items: [
        {
          icon: "sparkles",
          title: "AI Data Processing",
          desc: "Upload CSV/Excel or connect your ERP. AI generates SEO-optimized titles, descriptions, categories and attributes ready to publish.",
          benefits: ["Messy data into sales-ready products", "Save hours of manual entry", "Better search visibility"],
        },
        {
          icon: "sync",
          title: "Live Sync & Pricing",
          desc: "Publish to Zid & Salla in one click, with automatic optimal pricing based on your margin and each platform's fees, plus instant stock sync.",
          benefits: ["Fast multi-channel publishing", "Dynamic, profitable pricing", "Instant price & stock sync"],
        },
        {
          icon: "orders",
          title: "Centralized Orders",
          desc: "All orders from Zid & Salla in one dashboard. Automatic AWB tracking numbers and ZATCA-compliant e-invoices.",
          benefits: ["Unified order management", "Fewer manual errors", "Faster shipping & invoicing"],
        },
        {
          icon: "bundle",
          title: "Smart Bundling & Stock Recovery",
          desc: "Analyze buying behavior to build high-converting bundles, and pair slow-moving stock with best-sellers to clear inventory.",
          benefits: ["Raise average order value", "Clear blocked stock", "Better inventory efficiency"],
        },
      ],
    },
    howSection: {
      heading: "How DistriOS works",
      sub: "Four fully automated steps — you upload data, the system does the rest.",
      steps: [
        { n: "01", title: "Upload raw data", desc: "CSV, Excel or ERP link — AI processes it and generates SEO titles, descriptions, categories and attributes." },
        { n: "02", title: "Sync & pricing", desc: "One-click publish to Zid & Salla, with automatic optimal pricing based on margins and platform fees." },
        { n: "03", title: "Centralized orders", desc: "Route every order to one dashboard, with automatic AWB and ZATCA-compliant invoices." },
        { n: "04", title: "Smart bundles", desc: "Analyze buying behavior to build cart-boosting bundles and pair slow stock with best-sellers." },
      ],
    },
    caseStudy: {
      heading: "Success story",
      quote:
        "We moved from raw Excel files to SEO-optimized product listings within hours, and our sales grew massively without hiring a single extra employee.",
      author: "A DistriOS customer — distribution sector",
      metrics: [
        { value: "+30%", label: "more orders" },
        { value: "+37%", label: "more revenue" },
        { value: "200 hrs", label: "manual work saved" },
      ],
    },
    spotlight: {
      heading: "Real AI + built-in WhatsApp",
      sub: "Two features that make the difference in the Saudi market: real LLM-powered data processing, and direct customer communication over WhatsApp.",
      cards: [
        {
          tag: "AI",
          title: "Claude-powered data processing",
          desc: "Not canned templates — a real LLM (Claude) reads your messy data and writes optimized Arabic titles and descriptions for every product.",
          points: [
            "Authentic Arabic SEO titles & descriptions",
            "Automatic attribute & category extraction",
            "A quality score for every product before publishing",
          ],
        },
        {
          tag: "WhatsApp",
          title: "Automatic WhatsApp notifications",
          desc: "Keep your customer in the loop at every step over WhatsApp — the most-used channel in the Kingdom — from order confirmation to delivery.",
          points: [
            "Order confirmation on creation",
            "Shipment notice with AWB tracking",
            "ZATCA-compliant invoice delivery",
          ],
        },
      ],
    },
    recoTypes: {
      heading: "Many smart recommendation types — you approve",
      sub: "An AI layer on top of your ready Zid/Salla store: it analyzes your data and proposes actions, and you approve before anything is applied to the store.",
      types: [
        { icon: "🗓", name: "Seasonal", desc: "Occasion-based offers (Ramadan, summer, White Friday) at the perfect time." },
        { icon: "◈", name: "Bundles", desc: "Merge frequently co-bought products at a proposed price to raise AOV." },
        { icon: "⇄", name: "Cross-sell discounts", desc: "Discount one product when another is bought, to move blocked stock." },
        { icon: "⚠", name: "Restock alerts", desc: "Warn before best-sellers run out so you don't lose sales." },
        { icon: "🏷", name: "Category bundles", desc: "Group products from the same category into a themed bundle." },
        { icon: "✎", name: "Data enhancement", desc: "Suggest better titles, descriptions, and categories for weak products." },
        { icon: "﷼", name: "Pricing optimization", desc: "Data-driven price adjustments based on sales and margins." },
      ],
      dashboardTitle: "A dedicated dashboard per merchant",
      dashboardDesc: "Every merchant gets their own interface with everything needed to decide:",
      dashboardPoints: [
        "Live analysis of their store data (an Excel alternative)",
        "History of past recommendations and their realized results",
        "New recommendations and status: pending · approved · rejected",
        "Preview of the suggested customer page before publishing",
      ],
    },
    pricing: {
      heading: "Plans that fit your business",
      sub: "Start small and scale as you grow. Every plan includes Zid & Salla integration.",
      plans: [
        { name: "Starter", price: "499", period: "/mo", features: ["Up to 500 products", "AI data processing", "One platform integration", "Email support"], cta: "Start" },
        { name: "Growth", price: "999", period: "/mo", features: ["Up to 5,000 products", "Zid + Salla together", "Central orders + AWB", "Smart bundling", "Priority support"], cta: "Most popular", popular: true },
        { name: "Enterprise", price: "Contact us", period: "", features: ["Unlimited products", "Custom ERP integration", "Dedicated account manager", "SLA & service agreement"], cta: "Talk to sales" },
      ],
    },
    finalCta: {
      heading: "Ready to automate your sales on Zid & Salla?",
      sub: "Book a free demo and watch your data become a live store within hours.",
      button: "Book a demo",
    },
    footer: { tagline: "The smart distributor OS for automating sales on Zid & Salla.", rights: "All rights reserved." },
  },
};
