import { useState } from 'react';
import { Eye, EyeOff, Code, Trash2, FileText, Image as ImageIcon, Home, LogOut, Moon, Sun, Languages, CheckCircle, XCircle, Clock, Edit2, Pencil, X as XIcon, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';



export default function Developer() {
  const [step, setStep] = useState<'password' | 'dashboard'>('password');
  const [fadeOut, setFadeOut] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [siteTitle, setSiteTitle] = useState('104-مدرسة عوف');
  const [newTitle, setNewTitle] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingContent, setEditingContent] = useState<{type: 'text' | 'image'; content: string; position: {x: number; y: number}}[]>([]);
  const [approvalMessage, setApprovalMessage] = useState<{show: boolean; studentName: string}>({show: false, studentName: ''});
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [, navigate] = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { teacherLogins, studentSubmissions, approveSubmission, rejectSubmission, approvedWorks, deleteApprovedWork } = useData();

  const handleTransition = (callback: () => void) => {
    setFadeOut(true);
    setTimeout(() => {
      callback();
      setFadeOut(false);
    }, 300);
  };

  const CORRECT_PASSWORD = 'mnbvcxzm22';

  const handleVerifyPassword = () => {
    if (password === CORRECT_PASSWORD) {
      handleTransition(() => {
        setStep('dashboard');
      });
    } else {
      alert(language === "ar" ? "كلمة السر غير صحيحة!" : "Incorrect password!");
    }
  };

  const handleApproveSubmission = (id: string) => {
    const submission = studentSubmissions.find(s => s.id === id);
    if (submission) {
      approveSubmission(id);
      setApprovalMessage({show: true, studentName: submission.name});
      setTimeout(() => setApprovalMessage({show: false, studentName: ''}), 5000);
    }
  };

  const handleRejectSubmission = (id: string) => {
    rejectSubmission(id);
    alert(language === 'ar' ? 'تم رفض الطلب!' : 'Request rejected!');
  };

  const handleDeleteSubmission = (id: string) => {
    rejectSubmission(id);
  };

  const handleDeleteFile = (submissionId: string, fileName: string) => {
    // File deletion is handled in the submission
  };

  const handleLogout = () => {
    handleTransition(() => {
      navigate('/');
      setStep('password');
      setPassword('');
      setIsEditingMode(false);
    });
  };

  const handleUpdateTitle = () => {
    if (newTitle.trim()) {
      setSiteTitle(newTitle);
      setNewTitle('');
      setShowEditTitle(false);
      alert(language === 'ar' ? 'تم تحديث العنوان بنجاح!' : 'Title updated successfully!');
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        alert(`${language === 'ar' ? 'تم إضافة الملف:' : 'File added:'} ${file.name}`);
      });
    }
  };

  const downloadFile = (file: any) => {
    const link = document.createElement('a');
    try {
      if (file instanceof File) {
        link.href = URL.createObjectURL(file);
      } else if (file.base64) {
        const byteCharacters = atob(file.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: file.type || 'application/octet-stream' });
        link.href = URL.createObjectURL(blob);
      } else if (file.data) {
        const blob = new Blob([file.data], { type: file.type || 'application/octet-stream' });
        link.href = URL.createObjectURL(blob);
      }
      link.download = file.name || 'download';
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const previewFileContent = (file: any) => {
    console.log('Preview file:', file);
    setPreviewFile(file);
  };

  const handleAddEditContent = (type: 'text' | 'image') => {
    if (type === 'text') {
      const text = prompt(language === 'ar' ? 'أدخل النص' : 'Enter text');
      if (text) {
        setEditingContent([...editingContent, { type: 'text', content: text, position: { x: 0, y: 0 } }]);
      }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
            setEditingContent([...editingContent, { type: 'image', content: event.target.result, position: { x: 0, y: 0 } }]);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleRemoveEditContent = (index: number) => {
    setEditingContent(editingContent.filter((_, i) => i !== index));
  };



  if (step === 'password') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => handleTransition(() => navigate('/'))} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
              <Home className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => setLanguage(language === "ar" ? "en" : "ar")} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
                <Languages className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{language === "ar" ? "دخول المطور" : "Developer Login"}</h1>
              <p className="text-gray-400">{language === "ar" ? "أدخل كلمة السر" : "Enter password"}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === "ar" ? "كلمة السر" : "Password"}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 pr-10"
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
                onClick={handleVerifyPassword}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-2 rounded-lg"
              >
                {language === "ar" ? "دخول" : "Login"}
              </Button>
              <Button
                onClick={() => handleTransition(() => navigate('/'))}
                variant="outline"
                className="w-full text-white border-gray-600 hover:bg-gray-700"
              >
                {language === "ar" ? "رجوع" : "Back"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">{language === "ar" ? "لوحة المطور" : "Developer Dashboard"}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setLanguage(language === "ar" ? "en" : "ar")} className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors">
              <Languages className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleTransition(() => navigate('/'))}
              className="p-2 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Site Settings */}
        <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 border border-indigo-700 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">{language === 'ar' ? 'عنوان الموقع' : 'Site Title'}</p>
              <p className="text-2xl font-bold text-white">{siteTitle}</p>
            </div>
            <button
              onClick={() => setShowEditTitle(!showEditTitle)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit2 size={18} />
              {language === 'ar' ? 'تعديل' : 'Edit'}
            </button>
          </div>

          {showEditTitle && (
            <div className="mt-4 pt-4 border-t border-indigo-600 space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل العنوان الجديد' : 'Enter new title'}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateTitle}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowEditTitle(false);
                    setNewTitle('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Logins Section */}
        <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 border border-cyan-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">{language === 'ar' ? 'تسجيلات دخول المعلمين' : 'Teacher Logins'}</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {teacherLogins.length === 0 ? (
              <p className="text-gray-400">{language === 'ar' ? 'لا توجد تسجيلات' : 'No logins yet'}</p>
            ) : (
              teacherLogins.map((login, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold">{login.name}</p>
                    <p className="text-gray-400 text-sm">{login.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Mode Button */}
        <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 border border-pink-700 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">{language === 'ar' ? 'وضع التحرير' : 'Edit Mode'}</h3>
              <p className="text-gray-400 text-sm mt-1">{isEditingMode ? (language === 'ar' ? 'التحرير مفعل' : 'Editing enabled') : (language === 'ar' ? 'التحرير معطل' : 'Editing disabled')}</p>
            </div>
            <button
              onClick={() => setIsEditingMode(!isEditingMode)}
              className={`px-6 py-2 font-bold rounded-lg transition-all flex items-center gap-2 ${
                isEditingMode
                  ? 'bg-pink-600 hover:bg-pink-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <Pencil size={18} />
              {language === 'ar' ? (isEditingMode ? 'إيقاف' : 'تحرير') : (isEditingMode ? 'Stop' : 'Edit')}
            </button>
          </div>
          {isEditingMode && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAddEditContent('text')}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                {language === 'ar' ? 'إضافة نص' : 'Add Text'}
              </button>
              <button
                onClick={() => handleAddEditContent('image')}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
              </button>
            </div>
          )}
          {editingContent.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-white font-semibold text-sm">{language === 'ar' ? 'المحتوى المضاف:' : 'Added Content:'}</h4>
              {editingContent.map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-2 flex justify-between items-center">
                  <span className="text-gray-300 text-sm">{item.type === 'text' ? '📝 ' : '🖼️ '}{item.content.substring(0, 30)}...</span>
                  <button
                    onClick={() => handleRemoveEditContent(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border border-orange-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold text-white">{language === 'ar' ? 'إضافة ملفات' : 'Add Files'}</h3>
          </div>
          <label className="block">
            <div className="border-2 border-dashed border-orange-500 rounded-lg p-6 text-center cursor-pointer hover:bg-orange-900/20 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleAddFiles}
                className="hidden"
              />
              <p className="text-gray-300 font-semibold">{language === 'ar' ? 'اضغط لإضافة ملفات' : 'Click to add files'}</p>
              <p className="text-gray-400 text-sm mt-1">{language === 'ar' ? 'صور أو ملفات PDF' : 'Images or PDF files'}</p>
            </div>
          </label>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{language === "ar" ? "الطلبات المعلقة" : "Pending Requests"}</p>
                <p className="text-3xl font-bold text-white">{studentSubmissions.length}</p>
              </div>
              <Clock className="w-12 h-12 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{language === "ar" ? "الطلبات المقبولة" : "Approved Requests"}</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{language === "ar" ? "إجمالي الطلبات" : "Total Requests"}</p>
                <p className="text-3xl font-bold text-white">{studentSubmissions.length}</p>
              </div>
              <Code className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">{language === "ar" ? "طلبات الطلاب" : "Student Requests"}</h2>
          {studentSubmissions.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-400">{language === "ar" ? "لا توجد طلبات" : "No requests"}</p>
            </div>
          ) : (
            studentSubmissions.map((submission: any) => (
            <div key={submission.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              {/* Student Info */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{submission.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{submission.timestamp}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveSubmission(submission.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    {language === "ar" ? "قبول" : "Accept"}
                  </button>
                  <button
                    onClick={() => handleDeleteSubmission(submission.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle size={18} />
                    {language === "ar" ? "رفض" : "Reject"}
                  </button>
                </div>
              </div>

              {/* Files */}
              {submission.files.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-gray-300 font-semibold">{language === "ar" ? "الملفات المرفوعة:" : "Uploaded Files:"}</h4>
                  {submission.files.map((file: any) => (
                    <div key={file.name} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {file.type === 'pdf' ? (
                          <FileText className="text-red-400" size={24} />
                        ) : (
                          <ImageIcon className="text-blue-400" size={24} />
                        )}
                        <div>
                          <p className="text-white font-semibold">{file.name}</p>
                          <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => previewFileContent(file)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title={language === 'ar' ? 'معاينة' : 'Preview'}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => downloadFile(file)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          title={language === 'ar' ? 'تحميل' : 'Download'}
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(submission.id, file.name)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">{language === "ar" ? "لا توجد ملفات مرفوعة" : "No files uploaded"}</p>
              )}

              {/* Status Badge */}
              <div className="mt-6 pt-6 border-t border-gray-600">
                {submission.status === 'approved' ? (
                  <span className="inline-block px-4 py-2 bg-green-600/20 text-green-400 rounded-lg font-semibold">
                    ✓ {language === "ar" ? "مقبول" : "Approved"}
                  </span>
                ) : (
                  <span className="inline-block px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg font-semibold">
                    ⏳ {language === "ar" ? "قيد الانتظار" : "Pending"}
                  </span>
                )}
              </div>
            </div>
            ))
          )}
        </div>

        {/* Approved Works */}
        <div className="space-y-6 mt-12">
          <h2 className="text-2xl font-bold text-white">{language === "ar" ? "الأعمال المقبولة" : "Approved Works"}</h2>
          {approvedWorks.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-400">{language === "ar" ? "لا توجد أعمال مقبولة" : "No approved works"}</p>
            </div>
          ) : (
            approvedWorks.map((work: any) => (
              <div key={work.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{work.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{work.timestamp}</p>
                  </div>
                  <button
                    onClick={() => deleteApprovedWork(work.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    {language === "ar" ? "حذف" : "Delete"}
                  </button>
                </div>

                {work.files.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-gray-300 font-semibold">{language === "ar" ? "الملفات:" : "Files:"}</h4>
                    {work.files.map((file: any, index: number) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {file.type && file.type.startsWith('image') ? (
                            <ImageIcon className="text-blue-400" size={24} />
                          ) : (
                            <FileText className="text-red-400" size={24} />
                          )}
                          <div>
                            <p className="text-white font-semibold">{file.name}</p>
                            <p className="text-gray-400 text-sm">{file.size ? (file.size / 1024).toFixed(2) : 0} KB</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => previewFileContent(file)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title={language === 'ar' ? 'معاينة' : 'Preview'}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => downloadFile(file)}
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            title={language === 'ar' ? 'تحميل' : 'Download'}
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">{language === "ar" ? "لا توجد ملفات" : "No files"}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Approval Message */}
      {approvalMessage.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="animate-in fade-in zoom-in duration-500 pointer-events-auto">
            <div className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-3xl p-8 shadow-2xl max-w-md mx-auto text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {language === 'ar' ? 'تم القبول' : 'Approved'}
              </h2>
              <p className="text-white text-lg font-semibold mb-4">{approvalMessage.studentName}</p>
              <p className="text-white/90 text-sm">
                {language === 'ar' ? 'تم قبول عمل الطالب بنجاح' : 'Student work approved successfully'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-white font-bold">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {previewFile.type && previewFile.type.startsWith('image') ? (
                <img 
                  src={previewFile.base64 ? `data:${previewFile.type};base64,${previewFile.base64}` : (previewFile instanceof File ? URL.createObjectURL(previewFile) : previewFile.data ? URL.createObjectURL(new Blob([previewFile.data], { type: previewFile.type })) : '')} 
                  alt={previewFile.name} 
                  className="w-full rounded-lg" 
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">{language === 'ar' ? 'لا يمكن معاينة هذا الملف' : 'Cannot preview this file'}</p>
                  <button
                    onClick={() => downloadFile(previewFile)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {language === 'ar' ? 'تحميل' : 'Download'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
