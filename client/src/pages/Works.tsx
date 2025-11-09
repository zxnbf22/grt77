import { useState, useEffect } from 'react';
import { Home, Moon, Sun, Languages, Download, FileText, Image as ImageIcon, Search, X, Eye } from 'lucide-react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';

export default function Works() {
  const [fadeOut, setFadeOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [, navigate] = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { approvedWorks: contextApprovedWorks } = useData();
  const [approvedWorks, setApprovedWorks] = useState<any[]>([]);

  // تحميل البيانات من Local Storage مباشرة
  useEffect(() => {
    try {
      const savedApprovedWorks = localStorage.getItem('approved_works');
      if (savedApprovedWorks) {
        const parsed = JSON.parse(savedApprovedWorks);
        console.log('Loaded from localStorage:', parsed);
        setApprovedWorks(parsed);
      } else {
        setApprovedWorks(contextApprovedWorks);
      }
    } catch (error) {
      console.error('Error loading approved works:', error);
      setApprovedWorks(contextApprovedWorks);
    }
  }, [contextApprovedWorks]);

  const handleTransition = (callback: () => void) => {
    setFadeOut(true);
    setTimeout(() => {
      callback();
      setFadeOut(false);
    }, 300);
  };

  const downloadFile = (file: any) => {
    try {
      if (!file) {
        console.error('File object is null or undefined');
        return;
      }

      const link = document.createElement('a');
      let hasData = false;
      
      // محاولة الحصول على البيانات من base64
      if (file.base64 && file.base64.length > 0) {
        try {
          const byteCharacters = atob(file.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: file.type || 'application/octet-stream' });
          link.href = URL.createObjectURL(blob);
          link.download = file.name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          hasData = true;
        } catch (e) {
          console.error('Error processing base64:', e, 'base64 length:', file.base64?.length);
        }
      }
      
      // محاولة الحصول على البيانات من data property
      if (!hasData && file.data) {
        try {
          const blob = new Blob([file.data], { type: file.type || 'application/octet-stream' });
          link.href = URL.createObjectURL(blob);
          link.download = file.name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          hasData = true;
        } catch (e) {
          console.error('Error processing data:', e);
        }
      }
      
      if (!hasData) {
        console.error('No valid file data found. File object:', JSON.stringify(file));
        console.log('File keys:', Object.keys(file));
        alert(language === 'ar' ? 'لا توجد بيانات للملف' : 'No file data available');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(language === 'ar' ? 'خطأ في تحميل الملف' : 'Error downloading file');
    }
  };

  const previewFileContent = (file: any) => {
    setPreviewFile(file);
  };

  const filteredWorks = (approvedWorks || []).filter((work: any) =>
    work && work.name && work.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Approved Works from context:', contextApprovedWorks);
  console.log('Approved Works from state:', approvedWorks);
  console.log('Filtered Works:', filteredWorks);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTransition(() => navigate('/'))}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title={language === 'ar' ? 'الرئيسية' : 'Home'}
            >
              <Home className="w-5 h-5 text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-white">{language === 'ar' ? 'الأعمال المقبولة' : 'Approved Works'}</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
            >
              {language === 'ar' ? 'EN' : 'العربية'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-300" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن الأعمال...' : 'Search works...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Works List */}
        {!approvedWorks || filteredWorks.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchQuery 
                ? (language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found')
                : (language === 'ar' ? 'لا توجد أعمال مقبولة حالياً' : 'No approved works yet')
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(approvedWorks || []).map((work: any) => (
              <div key={work.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-colors">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{work.name}</h3>
                  <p className="text-gray-400 text-sm">{work.timestamp}</p>
                </div>

                {work.files && work.files.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-gray-300 font-semibold text-sm">
                      {language === 'ar' ? 'الملفات:' : 'Files:'}
                    </h4>
                    <div className="space-y-2">
                      {(work.files || []).map((file: any, index: number) => (
                        <div key={index} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {file.type && file.type.startsWith('image') ? (
                              <ImageIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
                            )}
                            <span className="text-gray-300 text-sm truncate">{file.name}</span>
                          </div>
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => previewFileContent(file)}
                              className="p-1 hover:bg-gray-600 rounded text-blue-400 hover:text-blue-300 transition-colors"
                              title={language === 'ar' ? 'معاينة' : 'Preview'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadFile(file)}
                              className="p-1 hover:bg-gray-600 rounded text-green-400 hover:text-green-300 transition-colors"
                              title={language === 'ar' ? 'تحميل' : 'Download'}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {previewFile.type && previewFile.type.startsWith('image') && previewFile.base64 ? (
                <img 
                  src={`data:${previewFile.type};base64,${previewFile.base64}`} 
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
