import { X, Code, Zap, Palette } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: any;
}

const languageDetails: Record<string, any> = {
  "React": {
    name: "React",
    level: 90,
    description: "A JavaScript library for building user interfaces with reusable components and efficient rendering.",
    descriptionAr: "مكتبة جافا سكريبت لبناء واجهات المستخدم مع مكونات قابلة لإعادة الاستخدام والعرض الفعال.",
    features: ["Component-based", "Virtual DOM", "Hooks", "JSX Syntax", "Unidirectional Data Flow"],
    featuresAr: ["قائمة على المكونات", "DOM افتراضي", "Hooks", "بناء جملة JSX", "تدفق البيانات أحادي الاتجاه"],
    uses: ["Web Applications", "Single Page Applications", "Progressive Web Apps", "Mobile Apps (React Native)"],
    usesAr: ["تطبيقات الويب", "تطبيقات صفحة واحدة", "تطبيقات الويب التقدمية", "تطبيقات الهاتف المحمول"],
    color: "from-blue-500 to-cyan-500"
  },
  "TypeScript": {
    name: "TypeScript",
    level: 85,
    description: "A typed superset of JavaScript that compiles to plain JavaScript, adding static typing and better tooling.",
    descriptionAr: "مجموعة فائقة مكتوبة من جافا سكريبت تجمع إلى جافا سكريبت عادي، مع إضافة الكتابة الثابتة والأدوات الأفضل.",
    features: ["Static Typing", "Interfaces", "Generics", "Enums", "Decorators"],
    featuresAr: ["الكتابة الثابتة", "الواجهات", "الأنواع العامة", "التعدادات", "المزخرفات"],
    uses: ["Large Scale Projects", "Enterprise Applications", "Type-Safe Development", "Better IDE Support"],
    usesAr: ["المشاريع الكبيرة", "تطبيقات المؤسسات", "التطوير الآمن من النوع", "دعم IDE أفضل"],
    color: "from-blue-600 to-blue-400"
  },
  "Node.js": {
    name: "Node.js",
    level: 80,
    description: "A JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript execution.",
    descriptionAr: "وقت تشغيل جافا سكريبت مبني على محرك V8 من Chrome، مما يتيح تنفيذ جافا سكريبت من جانب الخادم.",
    features: ["Event-Driven", "Non-Blocking I/O", "NPM Ecosystem", "Scalable", "Cross-Platform"],
    featuresAr: ["موجه بالأحداث", "I/O غير محجوب", "نظام NPM البيئي", "قابل للتوسع", "عبر الأنظمة الأساسية"],
    uses: ["Backend Development", "REST APIs", "Real-time Applications", "Microservices"],
    usesAr: ["تطوير الواجهة الخلفية", "واجهات برمجة التطبيقات REST", "تطبيقات الوقت الفعلي", "الخدمات الدقيقة"],
    color: "from-green-500 to-emerald-500"
  },
  "Tailwind CSS": {
    name: "Tailwind CSS",
    level: 88,
    description: "A utility-first CSS framework for rapidly building custom designs without leaving your HTML.",
    descriptionAr: "إطار عمل CSS موجه نحو الأداة المساعدة لبناء التصاميم المخصصة بسرعة دون مغادرة HTML الخاص بك.",
    features: ["Utility-First", "Responsive Design", "Dark Mode", "Customizable", "Performance Optimized"],
    featuresAr: ["موجه نحو الأداة المساعدة", "التصميم المتجاوب", "الوضع الداكن", "قابل للتخصيص", "محسّن الأداء"],
    uses: ["Rapid UI Development", "Responsive Websites", "Design Systems", "Component Libraries"],
    usesAr: ["تطوير واجهة المستخدم السريع", "مواقع الويب المتجاوبة", "أنظمة التصميم", "مكتبات المكونات"],
    color: "from-cyan-500 to-blue-500"
  },
  "JavaScript": {
    name: "JavaScript",
    level: 92,
    description: "A versatile programming language that powers interactive web applications and modern development.",
    descriptionAr: "لغة برمجة متعددة الاستخدامات تشغل تطبيقات الويب التفاعلية والتطوير الحديث.",
    features: ["Dynamic Typing", "First-Class Functions", "Prototypal Inheritance", "Asynchronous", "Event-Driven"],
    featuresAr: ["الكتابة الديناميكية", "الدوال من الدرجة الأولى", "الوراثة النموذجية", "غير متزامن", "موجه بالأحداث"],
    uses: ["Frontend Development", "Backend Development", "Full-Stack Development", "Automation Scripts"],
    usesAr: ["تطوير الواجهة الأمامية", "تطوير الواجهة الخلفية", "تطوير المكدس الكامل", "نصوص الأتمتة"],
    color: "from-yellow-500 to-orange-500"
  },
  "HTML/CSS": {
    name: "HTML/CSS",
    level: 95,
    description: "The foundation of web development - HTML provides structure and CSS provides styling and layout.",
    descriptionAr: "أساس تطوير الويب - يوفر HTML البنية و CSS توفر التصميم والتخطيط.",
    features: ["Semantic HTML", "Responsive Design", "CSS Grid", "Flexbox", "Animations"],
    featuresAr: ["HTML دلالي", "التصميم المتجاوب", "شبكة CSS", "Flexbox", "الرسوم المتحركة"],
    uses: ["Web Page Structure", "Responsive Layouts", "Visual Design", "Accessibility"],
    usesAr: ["هيكل صفحة الويب", "التخطيطات المتجاوبة", "التصميم البصري", "إمكانية الوصول"],
    color: "from-orange-500 to-red-500"
  }
};

export default function LanguageModal({ isOpen, onClose, language: selectedLang }: LanguageModalProps) {
  const { language } = useLanguage();
  
  if (!selectedLang || !isOpen) return null;
  
  const langData = languageDetails[selectedLang.name];
  const isArabic = language === "ar";

  if (!langData) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${langData.color}`}>
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{langData.name}</h2>
              <p className="text-sm text-slate-400 mt-1">{isArabic ? "الكفاءة" : "Proficiency"}: {selectedLang.level}%</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-200">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              {isArabic ? "نبذة عن اللغة" : "About"}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {isArabic ? langData.descriptionAr : langData.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              {isArabic ? "المميزات الرئيسية" : "Key Features"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(isArabic ? langData.featuresAr : langData.features).map((feature: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-700/50 rounded-lg p-3 border border-slate-600 hover:border-slate-500 transition-colors"
                >
                  <p className="text-sm text-slate-300">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              {isArabic ? "حالات الاستخدام" : "Common Uses"}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(isArabic ? langData.usesAr : langData.uses).map((use: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-blue-900/30 rounded-lg p-3 border border-blue-700/50 hover:border-blue-600 transition-colors"
                >
                  <p className="text-sm text-slate-300">{use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
