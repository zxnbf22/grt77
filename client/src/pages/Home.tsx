import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Languages, Code, Palette, Zap, GraduationCap, PenTool, ChevronRight, Sparkles, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";
import AnimatedBackground from "@/components/AnimatedBackground";
import AIAssistant from "@/components/AIAssistant";
import LanguageModal from "@/components/LanguageModal";
import { useState } from "react";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const programmingLanguages = [
    { name: "React", level: 90, icon: Code, color: "from-blue-500 to-cyan-500" },
    { name: "TypeScript", level: 85, icon: Code, color: "from-blue-600 to-blue-400" },
    { name: "Node.js", level: 80, icon: Zap, color: "from-green-500 to-emerald-500" },
    { name: "Tailwind CSS", level: 88, icon: Palette, color: "from-cyan-500 to-blue-500" },
    { name: "JavaScript", level: 92, icon: Code, color: "from-yellow-500 to-orange-500" },
    { name: "HTML/CSS", level: 95, icon: Code, color: "from-orange-500 to-red-500" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLanguageClick = (lang: any) => {
    setSelectedLanguage(lang);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatedBackground />
      <AIAssistant />
      
      {/* Language Modal */}
      <LanguageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        language={selectedLanguage}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">104-مدرسة عوف</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("home")} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {language === "ar" ? "الرئيسية" : "Home"}
            </button>
            <button onClick={() => scrollToSection("about")} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {language === "ar" ? "عني" : "About"}
            </button>
            <button onClick={() => scrollToSection("skills")} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {language === "ar" ? "المهارات" : "Skills"}
            </button>
            <Link href="/works" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {language === "ar" ? "الأعمال" : "Works"}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setLanguage(language === "ar" ? "en" : "ar")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Languages className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium Design */}
      <section id="home" className="py-20 md:py-40 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {language === "ar" ? "مرحباً بك في محفظتي" : "Welcome to my portfolio"}
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t("hero.greeting")}
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                  {language === "ar" ? "عبدالرحمن طه احمد سحاقي" : "Abdulrahman Taha Ahmad Sahaki"}
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {language === "ar" 
                    ? "طالب متفاني في تعلم البرمجة وتطوير الويب. أحب إنشاء تطبيقات جميلة وفعالة باستخدام أحدث التقنيات."
                    : "A dedicated student passionate about programming and web development. I love creating beautiful and efficient applications using the latest technologies."
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/developer">
                  <Button className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    {language === "ar" ? "المطور" : "Developer"}
                    <Code className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    {language === "ar" ? "تسجيل الدخول" : "Login"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Visual Element */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                  <GraduationCap className="w-24 h-24 mb-4" />
                  <h3 className="text-2xl font-bold text-center">{language === "ar" ? "طالب متميز" : "Outstanding Student"}</h3>
                  <p className="text-center mt-4 text-sm opacity-90">104 - {language === "ar" ? "مدرسة عوف" : "Awf School"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("about.title")}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? "أنا طالب في الأول ثانوي بمدرسة عوف، مهتم بالبرمجة وتطوير الويب. أتمتع بشغف كبير لتعلم التقنيات الحديثة وتطبيقها في مشاريع عملية."
                  : "I'm a first-year secondary student at Awf School, interested in programming and web development. I have a great passion for learning modern technologies and applying them in practical projects."
                }
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {language === "ar"
                  ? "أؤمن بأهمية التعليم المستمر والابتكار. أسعى دائماً لتحسين مهاراتي وتطوير نفسي في مجال التكنولوجيا."
                  : "I believe in continuous learning and innovation. I always strive to improve my skills and develop myself in the field of technology."
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{language === "ar" ? "الخبرة" : "Experience"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">2+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{language === "ar" ? "سنوات" : "Years"}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{language === "ar" ? "المشاريع" : "Projects"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">5+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{language === "ar" ? "مشاريع" : "Projects"}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{language === "ar" ? "المهارات" : "Skills"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">10+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{language === "ar" ? "مهارات" : "Skills"}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-700 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{language === "ar" ? "الشهادات" : "Certificates"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">2</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{language === "ar" ? "شهادات" : "Certificates"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{language === "ar" ? "لغات البرمجة المستخدمة" : "Programming Languages"}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programmingLanguages.map((lang, index) => (
              <div 
                key={index}
                onClick={() => handleLanguageClick(lang)}
                className="group cursor-pointer h-full"
              >
                <div className={`bg-gradient-to-br ${lang.color} p-8 rounded-2xl text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-4 relative overflow-hidden h-full flex flex-col justify-between`}>
                  {/* Background effect */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-3xl font-bold group-hover:text-white transition-colors duration-300">{lang.name}</h3>
                      <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                        <lang.icon className="w-8 h-8 opacity-100" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold opacity-90">{language === 'ar' ? 'المستوى' : 'Level'}</span>
                          <span className="text-lg font-bold bg-white/20 px-3 py-1 rounded-full">{lang.level}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                          <div 
                            className="bg-white h-4 rounded-full transition-all duration-700 shadow-lg"
                            style={{ width: `${lang.level}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {language === 'ar' ? 'اضغط لمزيد من التفاصيل' : 'Click for more details'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 الطالب عبدالرحمن طه احمد سحاقي - 104</p>
          <p className="text-gray-500 text-sm mt-2"></p>
        </div>
      </footer>
    </div>
  );
}
