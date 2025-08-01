// Database type definitions for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          role: 'user' | 'bank_official' | 'admin'
          bank: string | null
        }
        Insert: {
          id: string
          role: 'user' | 'bank_official' | 'admin'
          bank?: string | null
        }
        Update: {
          id?: string
          role?: 'user' | 'bank_official' | 'admin'
          bank?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      credit_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          status: 'pending' | 'calculated' | 'manual_review' | 'approved' | 'rejected'
          calculation_date: string
          expiry_date: string
          payment_history_score: number | null
          credit_utilization_score: number | null
          credit_history_length_score: number | null
          credit_mix_score: number | null
          new_credit_score: number | null
          income_factor: number | null
          calculated_by: string | null
          reviewed_by: string | null
          review_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          status?: 'pending' | 'calculated' | 'manual_review' | 'approved' | 'rejected'
          calculation_date?: string
          expiry_date?: string
          payment_history_score?: number | null
          credit_utilization_score?: number | null
          credit_history_length_score?: number | null
          credit_mix_score?: number | null
          new_credit_score?: number | null
          income_factor?: number | null
          calculated_by?: string | null
          reviewed_by?: string | null
          review_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          status?: 'pending' | 'calculated' | 'manual_review' | 'approved' | 'rejected'
          calculation_date?: string
          expiry_date?: string
          payment_history_score?: number | null
          credit_utilization_score?: number | null
          credit_history_length_score?: number | null
          credit_mix_score?: number | null
          new_credit_score?: number | null
          income_factor?: number | null
          calculated_by?: string | null
          reviewed_by?: string | null
          review_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_scores_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_scores_calculated_by_fkey"
            columns: ["calculated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_scores_reviewed_by_fkey"
            columns: ["reviewed_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      financial_reports: {
        Row: {
          id: string
          user_id: string
          report_type: 'income' | 'expense' | 'asset' | 'liability' | 'payment_history'
          amount: number
          currency: string
          description: string | null
          date_recorded: string
          source_document: string | null
          verified: boolean | null
          verified_by: string | null
          verification_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          report_type: 'income' | 'expense' | 'asset' | 'liability' | 'payment_history'
          amount: number
          currency?: string
          description?: string | null
          date_recorded: string
          source_document?: string | null
          verified?: boolean | null
          verified_by?: string | null
          verification_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          report_type?: 'income' | 'expense' | 'asset' | 'liability' | 'payment_history'
          amount?: number
          currency?: string
          description?: string | null
          date_recorded?: string
          source_document?: string | null
          verified?: boolean | null
          verified_by?: string | null
          verification_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_reports_verified_by_fkey"
            columns: ["verified_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          user_id: string
          report_type: 'credit_score_summary' | 'financial_overview' | 'payment_history' | 'audit_trail' | 'user_activity' | 'bank_portfolio' | 'system_analytics'
          report_format: 'json' | 'csv' | 'pdf'
          status: 'pending' | 'generating' | 'completed' | 'failed' | 'expired'
          title: string
          description: string | null
          parameters: Json | null
          generated_data: Json | null
          file_url: string | null
          file_size_bytes: number | null
          generated_by: string | null
          date_from: string | null
          date_to: string | null
          created_at: string
          completed_at: string | null
          expires_at: string | null
          download_count: number | null
          last_downloaded_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          report_type: 'credit_score_summary' | 'financial_overview' | 'payment_history' | 'audit_trail' | 'user_activity' | 'bank_portfolio' | 'system_analytics'
          report_format?: 'json' | 'csv' | 'pdf'
          status?: 'pending' | 'generating' | 'completed' | 'failed' | 'expired'
          title: string
          description?: string | null
          parameters?: Json | null
          generated_data?: Json | null
          file_url?: string | null
          file_size_bytes?: number | null
          generated_by?: string | null
          date_from?: string | null
          date_to?: string | null
          created_at?: string
          completed_at?: string | null
          expires_at?: string | null
          download_count?: number | null
          last_downloaded_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          report_type?: 'credit_score_summary' | 'financial_overview' | 'payment_history' | 'audit_trail' | 'user_activity' | 'bank_portfolio' | 'system_analytics'
          report_format?: 'json' | 'csv' | 'pdf'
          status?: 'pending' | 'generating' | 'completed' | 'failed' | 'expired'
          title?: string
          description?: string | null
          parameters?: Json | null
          generated_data?: Json | null
          file_url?: string | null
          file_size_bytes?: number | null
          generated_by?: string | null
          date_from?: string | null
          date_to?: string | null
          created_at?: string
          completed_at?: string | null
          expires_at?: string | null
          download_count?: number | null
          last_downloaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: 'login' | 'logout' | 'score_calculation' | 'data_update' | 'profile_update' | 'admin_action'
          resource_type: string | null
          resource_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          timestamp: string
          success: boolean
          error_message: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: 'login' | 'logout' | 'score_calculation' | 'data_update' | 'profile_update' | 'admin_action'
          resource_type?: string | null
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
          success?: boolean
          error_message?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: 'login' | 'logout' | 'score_calculation' | 'data_update' | 'profile_update' | 'admin_action'
          resource_type?: string | null
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          timestamp?: string
          success?: boolean
          error_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_credit_score: {
        Args: {
          p_user_id: string
          p_calculated_by?: string
        }
        Returns: string
      }
      generate_credit_score_report: {
        Args: {
          p_user_id: string
          p_date_from?: string
          p_date_to?: string
          p_format?: 'json' | 'csv' | 'pdf'
        }
        Returns: string
      }
      generate_financial_overview_report: {
        Args: {
          p_user_id: string
          p_date_from?: string
          p_date_to?: string
          p_format?: 'json' | 'csv' | 'pdf'
        }
        Returns: string
      }
      generate_audit_trail_report: {
        Args: {
          p_user_id: string
          p_date_from?: string
          p_date_to?: string
          p_format?: 'json' | 'csv' | 'pdf'
        }
        Returns: string
      }
      log_audit_event: {
        Args: {
          p_user_id: string
          p_action: 'login' | 'logout' | 'score_calculation' | 'data_update' | 'profile_update' | 'admin_action'
          p_resource_type?: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
          p_ip_address?: string
          p_user_agent?: string
          p_session_id?: string
          p_success?: boolean
          p_error_message?: string
        }
        Returns: string
      }
      check_rate_limit: {
        Args: {
          p_identifier: string
          p_action_type: string
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      mark_report_downloaded: {
        Args: {
          p_report_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: 'user' | 'bank_official' | 'admin'
      credit_score_status: 'pending' | 'calculated' | 'manual_review' | 'approved' | 'rejected'
      financial_data_type: 'income' | 'expense' | 'asset' | 'liability' | 'payment_history'
      audit_action: 'login' | 'logout' | 'score_calculation' | 'data_update' | 'profile_update' | 'admin_action'
      report_type: 'credit_score_summary' | 'financial_overview' | 'payment_history' | 'audit_trail' | 'user_activity' | 'bank_portfolio' | 'system_analytics'
      report_format: 'json' | 'csv' | 'pdf'
      report_status: 'pending' | 'generating' | 'completed' | 'failed' | 'expired'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
