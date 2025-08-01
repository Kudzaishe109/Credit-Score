import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to convert JSON to CSV
function jsonToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) return ''
  
  const keys = headers || Object.keys(data[0])
  const csvHeaders = keys.join(',')
  
  const csvRows = data.map(row => {
    return keys.map(key => {
      const value = row[key]
      // Handle nested objects and arrays
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      }
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value || '')
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })
  
  return [csvHeaders, ...csvRows].join('\n')
}

// Helper function to format report data for CSV export
function formatReportForCSV(report: any): string {
  const reportType = report.report_type
  const data = report.generated_data
  
  switch (reportType) {
    case 'credit_score_summary':
      const scoreHistory = data.score_history || []
      const csvData = scoreHistory.map((score: any) => ({
        date: score.calculation_date,
        score: score.score,
        payment_history: score.payment_history_score,
        credit_utilization: score.credit_utilization_score,
        credit_history_length: score.credit_history_length_score,
        credit_mix: score.credit_mix_score,
        new_credit: score.new_credit_score,
        income_factor: score.income_factor,
        status: score.status
      }))
      return jsonToCSV(csvData)
      
    case 'financial_overview':
      const monthlyData = data.monthly_breakdown || []
      return jsonToCSV(monthlyData)
      
    case 'audit_trail':
      const auditEvents = data.audit_events || []
      const auditCsvData = auditEvents.map((event: any) => ({
        timestamp: event.timestamp,
        action: event.action,
        resource_type: event.resource_type,
        resource_id: event.resource_id,
        ip_address: event.ip_address,
        success: event.success,
        error_message: event.error_message || ''
      }))
      return jsonToCSV(auditCsvData)
      
    default:
      return JSON.stringify(data, null, 2)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the JWT token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get report ID from URL path
    const url = new URL(req.url)
    const reportId = url.pathname.split('/').pop()
    const format = url.searchParams.get('format') || 'json'

    if (!reportId) {
      return new Response(
        JSON.stringify({ error: 'Report ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Fetch the report
    const { data: report, error: fetchError } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (fetchError || !report) {
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if user has access to this report
    if (report.user_id !== user.id) {
      // Check if user is admin or bank official
      const { data: userRole } = await supabaseClient
        .from('user_roles')
        .select('role, bank')
        .eq('id', user.id)
        .single()

      if (!userRole || !['admin', 'bank_official'].includes(userRole.role)) {
        return new Response(
          JSON.stringify({ error: 'Access denied' }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Mark report as downloaded
    await supabaseClient.rpc('mark_report_downloaded', { p_report_id: reportId })

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `${report.report_type}_${timestamp}.${format}`

    // Return report based on format
    switch (format.toLowerCase()) {
      case 'csv':
        const csvContent = formatReportForCSV(report)
        return new Response(csvContent, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        })

      case 'json':
      default:
        const jsonContent = JSON.stringify({
          report_info: {
            id: report.id,
            title: report.title,
            description: report.description,
            report_type: report.report_type,
            date_from: report.date_from,
            date_to: report.date_to,
            generated_at: report.created_at,
            download_count: report.download_count + 1
          },
          data: report.generated_data
        }, null, 2)

        return new Response(jsonContent, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        })
    }

  } catch (error) {
    console.error('Error downloading report:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to download report',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
