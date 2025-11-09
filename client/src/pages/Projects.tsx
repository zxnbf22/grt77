import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Home, Moon, Sun, Languages, Trash2, Plus, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';

export default function Projects() {
  const [userType, setUserType] = useState<'teacher' | 'student' | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [teacherLoggedIn, setTeacherLoggedIn] = useState(false);
  const [showTeacherMessage, setShowTeacherMessage] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentFiles, setStudentFiles] = useState<File[]>([]);
  const [studentSubmitted, setStudentSubmitted] = useState(false);
  const [showStudentMessage, setShowStudentMessage] = useState(false);
  const [, navigate] = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { addTeacherLogin, addStudentSubmission } = useData();

  const handleTransition = (callback: () => void) => {
    setFadeOut(true);
    setTimeout(() => {
      callback();
      setFadeOut(false);
    }, 300);
  };

  const handleTeacherLogin = () => {
    if (teacherName.trim() && teacherPassword === 'mmss22') {
      const now = new Date();
      const timeStr = now.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
      addTeacherLogin({ name: teacherName, time: timeStr });
      handleTransition(() => {
        setTeacherLoggedIn(true);
        setShowTeacherMessage(true);
      });
      setTimeout(() => setShowTeacherMessage(false), 5000);
    } else if (!teacherName.trim()) {
      alert(language === 'ar' ? 'الرجاء إدخال الاسم' : 'Please enter your name');
    } else {
      alert(language === 'ar' ? 'كلمة السر غير صحيحة' : 'Incorrect password');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (studentFiles.length + newFiles.length > 10) {
        alert(language === 'ar' ? 'الحد الأقصى 10 ملفات فقط' : 'Maximum 10 files allowed');
        return;
      }
      setStudentFiles([...studentFiles, ...newFiles]);
    }
  };

  const handleDeleteFile = (index: number) => {
    setStudentFiles(studentFiles.filter((_, i) => i !== index));
  };

  const handleSubmitStudent = async () => {
    if (studentName.trim() && studentFiles.length > 0) {
      try {
        const submissionId = Date.now().toString();
        
        const filesWithBase64 = await Promise.all(
          studentFiles.map(file => {
            return new Promise((resolve: any) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = (e.target?.result as string)?.split(',')[1] || '';
                resolve({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  base64: base64,
                });
              };
              reader.readAsDataURL(file);
            });
          })
        );
        
        // إرسال البيانات إلى Supabase
        await addStudentSubmission({
          id: submissionId,
          name: studentName,
          files: filesWithBase64,
          timestamp: new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US'),
        });
        
        handleTransition(() => {
          setStudentSubmitted(true);
          setShowStudentMessage(true);
        });
        setTimeout(() => setShowStudentMessage(false), 5000);
      } catch (error) {
        console.error('Error submitting:', error);
        alert(language === 'ar' ? 'حدث خطأ في الإرسال' : 'Error submitting');
      }
    } else {
      alert(language === 'ar' ? 'الرجاء إدخال الاسم وإضافة ملف واحد على الأقل' : 'Please enter your name and add at least one file');
    }
  };

  if (!userType) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{language === 'ar' ? 'صفحة المشاريع' : 'Projects'}</h1>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Languages className="w-5 h-5" />
              </button>
              <button onClick={() => handleTransition(() => navigate('/'))} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teacher Login */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{language === 'ar' ? 'المعلم' : 'Teacher'}</h2>
                <p className="text-gray-400 mb-6">{language === 'ar' ? 'دخول المعلم' : 'Teacher Login'}</p>
                <Button
                  onClick={() => setUserType('teacher')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {language === 'ar' ? 'دخول' : 'Login'}
                </Button>
              </div>

              {/* Student Login */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-green-500 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{language === 'ar' ? 'الطالب' : 'Student'}</h2>
                <p className="text-gray-400 mb-6">{language === 'ar' ? 'إرسال المشروع' : 'Submit Project'}</p>
                <Button
                  onClick={() => setUserType('student')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {language === 'ar' ? 'إرسال' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher View
  if (userType === 'teacher' && !teacherLoggedIn) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{language === 'ar' ? 'دخول المعلم' : 'Teacher Login'}</h1>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Languages className="w-5 h-5" />
              </button>
              <button onClick={() => handleTransition(() => setUserType(null))} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{language === 'ar' ? 'دخول المعلم' : 'Teacher Login'}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {language === 'ar' ? 'كلمة السر' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleTeacherLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  {language === 'ar' ? 'دخول' : 'Login'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Logged In View
  if (userType === 'teacher' && teacherLoggedIn) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{language === 'ar' ? 'أهلا بك' : 'Welcome'}</h1>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Languages className="w-5 h-5" />
              </button>
              <button onClick={() => handleTransition(() => navigate('/'))} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showTeacherMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-40 animate-in fade-in slide-in-from-top">
            <CheckCircle className="w-5 h-5" />
            <span>{language === 'ar' ? `شكراً لك على تسجيل دخولك يا ${teacherName}` : `Thank you ${teacherName} for logging in`}</span>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">{language === 'ar' ? 'أهلا وسهلا بك' : 'Welcome'}</h2>
            <p className="text-gray-400 mb-4">
              {language === 'ar' ? `مرحباً ${teacherName}، شكراً لك على تسجيل دخولك` : `Welcome ${teacherName}, thank you for logging in`}
            </p>
            <Button
              onClick={() => handleTransition(() => navigate('/'))}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Student View
  if (userType === 'student' && !studentSubmitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{language === 'ar' ? 'إرسال المشروع' : 'Submit Project'}</h1>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Languages className="w-5 h-5" />
              </button>
              <button onClick={() => handleTransition(() => setUserType(null))} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{language === 'ar' ? 'إرسال المشروع' : 'Submit Project'}</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'اسمك' : 'Your Name'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white placeholder:text-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'الملفات (حد أقصى 10)' : 'Files (Max 10)'}
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">{language === 'ar' ? 'اضغط لإضافة ملفات' : 'Click to add files'}</p>
                  </label>
                </div>
              </div>

              {studentFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">{language === 'ar' ? 'الملفات المضافة' : 'Added Files'}</h3>
                  <div className="space-y-2">
                    {studentFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <span className="text-gray-300 text-sm">{file.name}</span>
                        <button
                          onClick={() => handleDeleteFile(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmitStudent}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
              >
                {language === 'ar' ? 'إرسال' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Submitted View
  if (userType === 'student' && studentSubmitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{language === 'ar' ? 'تم الإرسال' : 'Submitted'}</h1>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Languages className="w-5 h-5" />
              </button>
              <button onClick={() => handleTransition(() => navigate('/'))} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showStudentMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-40 animate-in fade-in slide-in-from-top">
            <CheckCircle className="w-5 h-5" />
            <span>{language === 'ar' ? `شكراً لك على إرسال طلبك يا ${studentName}` : `Thank you ${studentName} for submitting your request`}</span>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{language === 'ar' ? 'تم الإرسال بنجاح' : 'Successfully Submitted'}</h2>
            <p className="text-gray-400 mb-6">
              {language === 'ar' ? `شكراً لك على إرسال طلبك يا ${studentName}. سيتم مراجعته من قبل المطور` : `Thank you ${studentName} for submitting your request. It will be reviewed by the developer`}
            </p>
            <Button
              onClick={() => handleTransition(() => navigate('/'))}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
