import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

interface TeacherLogin {
  name: string;
  time: string;
}

interface StudentSubmission {
  id: string;
  name: string;
  files: any[];
  timestamp: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

interface DataContextType {
  teacherLogins: TeacherLogin[];
  addTeacherLogin: (login: TeacherLogin) => void;
  studentSubmissions: StudentSubmission[];
  addStudentSubmission: (submission: StudentSubmission) => Promise<void>;
  approveSubmission: (id: string) => Promise<void>;
  rejectSubmission: (id: string) => Promise<void>;
  approvedWorks: StudentSubmission[];
  deleteApprovedWork: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teacherLogins, setTeacherLogins] = useState<TeacherLogin[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);
  const [approvedWorks, setApprovedWorks] = useState<StudentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل البيانات من Supabase
  const loadData = useCallback(async () => {
    try {
      console.log('📥 Loading data from Supabase...');
      setError(null);

      // جلب البيانات من Supabase
      const { data: submissions, error: submissionsError } = await supabase
        .from('student_submissions')
        .select('*')
        .eq('status', 'pending')
        .neq('name', 'Test Student')
        .order('created_at', { ascending: false });

      if (submissionsError) {
        console.error('❌ Error loading submissions:', submissionsError);
        setError(`Error loading submissions: ${submissionsError.message}`);
      } else {
        console.log('✅ Submissions loaded:', submissions?.length || 0);
        setStudentSubmissions((submissions || []) as StudentSubmission[]);
      }

      const { data: approved, error: approvedError } = await supabase
        .from('approved_works')
        .select('*')
        .neq('status', 'deleted')
        .neq('name', 'Test Student')
        .order('created_at', { ascending: false });

      if (approvedError) {
        console.error('❌ Error loading approved works:', approvedError);
        setError(`Error loading approved works: ${approvedError.message}`);
      } else {
        console.log('✅ Approved works loaded:', approved?.length || 0);
        setApprovedWorks((approved || []) as StudentSubmission[]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading from Supabase:', error);
      setError(`Unexpected error: ${error}`);
      setIsLoading(false);
    }
  }, []);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    loadData();
  }, [loadData]);

  // الاستماع للتغييرات في الوقت الفعلي
  useEffect(() => {
    console.log('🔌 Setting up real-time listeners...');

    const submissionsChannel = supabase
      .channel('public:student_submissions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_submissions',
        },
        (payload) => {
          console.log('📡 Student submissions changed:', payload);
          loadData();
        }
      )
      .subscribe((status) => {
        console.log('📡 Submissions subscription status:', status);
      });

    const approvedChannel = supabase
      .channel('public:approved_works')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'approved_works',
        },
        (payload) => {
          console.log('📡 Approved works changed:', payload);
          loadData();
        }
      )
      .subscribe((status) => {
        console.log('📡 Approved works subscription status:', status);
      });

    return () => {
      submissionsChannel.unsubscribe();
      approvedChannel.unsubscribe();
    };
  }, [loadData]);

  const addTeacherLogin = (login: TeacherLogin) => {
    setTeacherLogins(prev => [...prev, login]);
  };

  const addStudentSubmission = async (submission: StudentSubmission) => {
    try {
      console.log('📤 Adding submission to Supabase:', submission);
      
      // استخدام UUID بدلاً من Date.now()
      const submissionId = uuidv4();

      const { error } = await supabase
        .from('student_submissions')
        .insert([{
          id: submissionId,
          name: submission.name,
          files: submission.files || [],
          timestamp: submission.timestamp,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('❌ Error adding submission:', error);
        throw error;
      }

      console.log('✅ Submission added successfully');
      // 🪝 Webhook notification
      console.log('🪝 Webhook: New submission received', { id: submissionId, name: submission.name, files: submission.files?.length || 0, timestamp: new Date().toISOString() });
      await loadData();
    } catch (error) {
      console.error('❌ Error in addStudentSubmission:', error);
      throw error;
    }
  };

  const approveSubmission = async (id: string) => {
    try {
      console.log('✅ Approving submission:', id);

      const submission = studentSubmissions.find(sub => sub.id === id);
      if (!submission) {
        console.error('❌ Submission not found:', id);
        return;
      }

      // إضافة في approved_works
      const { error: insertError } = await supabase
        .from('approved_works')
        .insert([{
          id: submission.id,
          name: submission.name,
          files: submission.files || [],
          timestamp: submission.timestamp,
          status: 'approved',
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('❌ Error approving submission:', insertError);
        throw insertError;
      }

      // تحديث الحالة في student_submissions إلى approved
      const { error: updateError } = await supabase
        .from('student_submissions')
        .update({ status: 'approved' })
        .eq('id', id);

      if (updateError) {
        console.error('❌ Error updating submission status:', updateError);
        throw updateError;
      }

      console.log('✅ Submission approved successfully');
      // 🪝 Webhook notification
      console.log('🪝 Webhook: Submission approved', { id, name: submission.name, timestamp: new Date().toISOString() });
      await loadData();
    } catch (error) {
      console.error('❌ Error in approveSubmission:', error);
    }
  };

  const rejectSubmission = async (id: string) => {
    try {
      console.log('❌ Rejecting submission:', id);

      const submission = studentSubmissions.find(sub => sub.id === id);

      const { error } = await supabase
        .from('student_submissions')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) {
        console.error('❌ Error rejecting submission:', error);
        throw error;
      }

      console.log('✅ Submission rejected successfully');
      // 🪝 Webhook notification
      console.log('🪝 Webhook: Submission rejected', { id, name: submission?.name, timestamp: new Date().toISOString() });
      await loadData();
    } catch (error) {
      console.error('❌ Error in rejectSubmission:', error);
    }
  };

  const deleteApprovedWork = async (id: string) => {
    try {
      console.log('🗑️ Deleting approved work:', id);

      const { error } = await supabase
        .from('approved_works')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting approved work:', error);
        throw error;
      }

      console.log('✅ Approved work deleted successfully');
      await loadData();
    } catch (error) {
      console.error('❌ Error in deleteApprovedWork:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      teacherLogins,
      addTeacherLogin,
      studentSubmissions,
      addStudentSubmission,
      approveSubmission,
      rejectSubmission,
      approvedWorks,
      deleteApprovedWork,
      isLoading,
      error,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
