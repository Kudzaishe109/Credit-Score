import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { reportType, dateFrom, dateTo, format = 'json' } = await req.json()

    // Validate required parameters
    if (!reportType) {
      return new Response(
        JSON.stringify({ error: 'Report type is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate date range
    const fromDate = dateFrom ? new Date(dateFrom) : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    const toDate = dateTo ? new Date(dateTo) : new Date()

    if (fromDate > toDate) {
      return new Response(
        JSON.stringify({ error: 'Invalid date range: from date must be before to date' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    let reportId: string

    // Generate report based on type
    switch (reportType) {
      case 'credit_score_summary':
        const { data: creditReportData, error: creditError } = await supabaseClient
          .rpc('generate_credit_score_report', {
            p_user_id: user.id,
            p_date_from: fromDate.toISOString().split('T')[0],
            p_date_to: toDate.toISOString().split('T')[0],
            p_format: format
          })

        if (creditError) throw creditError
        reportId = creditReportData
        break

      case 'financial_overview':
        const { data: financialReportData, error: financialError } = await supabaseClient
          .rpc('generate_financial_overview_report', {
            p_user_id: user.id,
            p_date_from: fromDate.toISOString().split('T')[0],
            p_date_to: toDate.toISOString().split('T')[0],
            p_format: format
          })

        if (financialError) throw financialError
        reportId = financialReportData
        break

      case 'audit_trail':
        const { data: auditReportData, error: auditError } = await supabaseClient
          .rpc('generate_audit_trail_report', {
            p_user_id: user.id,
            p_date_from: fromDate.toISOString().split('T')[0],
            p_date_to: toDate.toISOString().split('T')[0],
            p_format: format
          })

        if (auditError) throw auditError
        reportId = auditReportData
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported report type' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }

    // Get the generated report
    const { data: report, error: fetchError } = await supabaseClient
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (fetchError) throw fetchError

    return new Response(
      JSON.stringify({
        success: true,
        reportId: reportId,
        report: report,
        message: 'Report generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error generating report:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate report',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
