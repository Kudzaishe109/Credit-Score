import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';

export interface Report {
  id: string;
  user_id: string;
  report_type: 'credit_score_summary' | 'financial_overview' | 'audit_trail' | 'user_activity' | 'bank_portfolio' | 'system_analytics';
  report_format: 'json' | 'csv' | 'pdf';
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'expired';
  title: string;
  description: string;
  parameters: any;
  generated_data: any;
  file_url?: string;
  file_size_bytes?: number;
  generated_by?: string;
  date_from: string;
  date_to: string;
  created_at: string;
  completed_at?: string;
  expires_at: string;
  download_count: number;
  last_downloaded_at?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  report_type: string;
  description: string;
  default_parameters: any;
  is_active: boolean;
}

export interface GenerateReportParams {
  reportType: string;
  dateFrom: string;
  dateTo: string;
  format?: 'json' | 'csv' | 'pdf';
}

export const useReports = () => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user's reports
  const {
    data: reports,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports
  } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Report[];
    },
  });

  // Fetch report templates
  const {
    data: templates,
    isLoading: templatesLoading,
    error: templatesError
  } = useQuery({
    queryKey: ['report-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as ReportTemplate[];
    },
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (params: GenerateReportParams) => {
      setIsGenerating(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  // Download report function
  const downloadReport = useCallback(async (reportId: string, format: 'json' | 'csv' = 'json') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/download-report/${reportId}?format=${format}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download report');
      }

      // Get filename from response headers or create default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `report_${reportId}.${format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh reports to update download count
      refetchReports();
      
      return { success: true, filename };
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }, [refetchReports]);

  // Delete report mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  // Get report by ID
  const getReport = useCallback(async (reportId: string) => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;
    return data as Report;
  }, []);

  return {
    // Data
    reports,
    templates,
    
    // Loading states
    reportsLoading,
    templatesLoading,
    isGenerating,
    
    // Errors
    reportsError,
    templatesError,
    
    // Actions
    generateReport: generateReportMutation.mutate,
    generateReportAsync: generateReportMutation.mutateAsync,
    downloadReport,
    deleteReport: deleteReportMutation.mutate,
    getReport,
    refetchReports,
    
    // Mutation states
    isGeneratingReport: generateReportMutation.isPending,
    generateReportError: generateReportMutation.error,
    isDeletingReport: deleteReportMutation.isPending,
    deleteReportError: deleteReportMutation.error,
  };
};
