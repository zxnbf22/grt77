import { createClient } from '@supabase/supabase-js'

// Use environment variables with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pvfabjiduwxdpaudaphf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2ZmFiamlkdXd4ZHBhdWRhcGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTkwMTYsImV4cCI6MjA3ODAzNTAxNn0.NaBiNlhKn2oRpp35FmAHlo5vTvnhAG0v462YzuclNNM'

console.log('🔌 Supabase URL:', supabaseUrl)
console.log('🔌 Supabase Key loaded:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

// Initialize tables if they don't exist
export const initializeTables = async () => {
  try {
    console.log('📥 Checking if tables exist...')
    
    // Check if tables exist by trying to query them
    const { data: submissions, error: submissionsError } = await supabase
      .from('student_submissions')
      .select('count', { count: 'exact' })
      .limit(1)

    if (submissionsError) {
      console.error('❌ Error checking submissions table:', submissionsError)
    } else {
      console.log('✅ student_submissions table exists')
    }

    const { data: approved, error: approvedError } = await supabase
      .from('approved_works')
      .select('count', { count: 'exact' })
      .limit(1)

    if (approvedError) {
      console.error('❌ Error checking approved_works table:', approvedError)
    } else {
      console.log('✅ approved_works table exists')
    }
  } catch (error) {
    console.error('❌ Error initializing tables:', error)
  }
}

// Setup real-time subscriptions
export const setupRealtimeSubscriptions = (
  onSubmissionsChange: () => void,
  onApprovedChange: () => void
) => {
  console.log('📡 Setting up real-time subscriptions...')

  try {
    // Subscribe to student_submissions changes
    const submissionsSubscription = supabase
      .channel('public:student_submissions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_submissions',
        },
        (payload) => {
          console.log('📡 Student submissions changed:', payload)
          onSubmissionsChange()
        }
      )
      .subscribe((status) => {
        console.log('📡 Submissions subscription status:', status)
      })

    // Subscribe to approved_works changes
    const approvedSubscription = supabase
      .channel('public:approved_works')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'approved_works',
        },
        (payload) => {
          console.log('📡 Approved works changed:', payload)
          onApprovedChange()
        }
      )
      .subscribe((status) => {
        console.log('📡 Approved works subscription status:', status)
      })

    return () => {
      submissionsSubscription.unsubscribe()
      approvedSubscription.unsubscribe()
    }
  } catch (error) {
    console.error('❌ Error setting up subscriptions:', error)
    return () => {}
  }
}
