import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { LogOut, GraduationCap, FileText, Calendar } from "lucide-react";

export default function TeacherDashboard() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const isAuth = localStorage.getItem("teacherAuth");
    if (!isAuth) {
      setLocation("/teacher-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("teacherAuth");
    toast.success(t("teacher.logout"));
    setLocation("/");
  };

  const sections = [
    {
      title: t("teacher.grades"),
      description: "معلومات الدرجات والتقييمات",
      icon: GraduationCap,
      data: [
        { subject: "الرياضيات", grade: "A", percentage: "95%" },
        { subject: "العلوم", grade: "A-", percentage: "90%" },
        { subject: "اللغة العربية", grade: "B+", percentage: "87%" },
      ]
    },
    {
      title: t("teacher.notes"),
      description: "ملاحظات المدرس حول الطالب",
      icon: FileText,
      data: [
        "طالب متميز ومجتهد",
        "يشارك بفعالية في الأنشطة الصفية",
        "يحتاج إلى تحسين في إدارة الوقت"
      ]
    },
    {
      title: t("teacher.attendance"),
      description: "سجل الحضور والغياب",
      icon: Calendar,
      data: [
        { month: "سبتمبر", attendance: "95%", absences: "1 يوم" },
        { month: "أكتوبر", attendance: "100%", absences: "0 يوم" },
        { month: "نوفمبر", attendance: "90%", absences: "2 يوم" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("teacher.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{t("teacher.welcome")}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 me-2" />
            {t("teacher.logout")}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.isArray(section.data) && typeof section.data[0] === 'object' ? (
                    (section.data as any[]).map((item: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {Object.entries(item).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    (section.data as string[]).map((item: string, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                        {item}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
