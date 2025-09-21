import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      challenges: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          icon: string;
          category: string;
          status: 'active' | 'pending' | 'completed';
          start_date: string;
          end_date: string;
          total_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          icon: string;
          category: string;
          status?: 'active' | 'pending' | 'completed';
          start_date: string;
          end_date: string;
          total_days: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          icon?: string;
          category?: string;
          status?: 'active' | 'pending' | 'completed';
          start_date?: string;
          end_date?: string;
          total_days?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      challenge_entries: {
        Row: {
          id: string;
          challenge_id: string;
          day: number;
          date: string;
          completed: boolean;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          day: number;
          date: string;
          completed?: boolean;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          day?: number;
          date?: string;
          completed?: boolean;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};