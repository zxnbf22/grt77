import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const TEACHER_PASSWORD = "teacher123";

export default function TeacherLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === TEACHER_PASSWORD) {
      localStorage.setItem("teacherAuth", "true");
      toast.success(t("teacher.welcome"));
      setLocation("/teacher-dashboard");
    } else {
      toast.error(t("teacher.wrongPassword"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t("teacher.title")}</CardTitle>
          <CardDescription>{t("teacher.password")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={t("teacher.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {t("teacher.login")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
