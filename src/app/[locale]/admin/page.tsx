'use client';

import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/i18n/formatters';
import { uploadMediaAsset } from '@/lib/supabase/storage';
import { Shield, Building, Home, MessageSquare, Upload, Star, Plus, Trash2, Calendar, MapPin, Inbox, Bell, CheckCircle, Clock, UserCheck, RefreshCw, Eye, Sparkles, Activity, PieChart, ShieldAlert } from 'lucide-react';

export default function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const isAr = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'leads' | 'followups' | 'crm_monitor' | 'ai_review' | 'consent_report' | 'calendar' | 'landmarks' | 'storage'>('leads');
  const [leadChannelFilter, setLeadChannelFilter] = useState<'all' | 'consultations' | 'inquiries' | 'brochures' | 'viewings' | 'whatsapp'>('all');

  // Agent Roster State
  const [agentsRoster] = useState([
    { id: 'f1a2b3c4-0002-4000-8000-000000000002', name: 'Agent Tariq Al-Mansoor', role: 'agent' },
    { id: 'f1a2b3c4-0003-4000-8000-000000000003', name: 'Agent Sarah Kensington', role: 'agent' },
  ]);

  // Consultation Followups Triage State
  const [followups, setFollowups] = useState([
    {
      id: 'fol_1',
      consultation_id: 'c_101',
      client_name: 'H.E. Sheikh Faisal Al-Otaibi',
      email: 'faisal@example.com',
      property_interest: 'The Imperial Sky Penthouse',
      status: 'pending',
      assigned_agent_id: 'f1a2b3c4-0002-4000-8000-000000000002',
      crm_sync_status: 'synced',
      crm_external_id: 'hs_deal_998811',
      created_at: '2026-07-31 14:30',
    },
    {
      id: 'fol_2',
      consultation_id: 'c_102',
      client_name: 'Lord Charles Kensington',
      email: 'charles@example.co.uk',
      property_interest: 'Diriyah Royal Estates',
      status: 'pending',
      assigned_agent_id: '',
      crm_sync_status: 'failed',
      crm_external_id: '',
      created_at: '2026-07-31 12:15',
    },
  ]);

  // AI Recommendations Audit State
  const [aiRecsAudit] = useState([
    {
      id: 'rec_101',
      session_id: 'sess_9921',
      recommended_properties: ['The Imperial Sky Penthouse', 'Diriyah Royal Estates'],
      reasoning_summary: '[Status: hot_lead] User requested verified price for 5-bed penthouses in KAFD. Tool [get_property_price] returned SAR 45,000,000.',
      created_at: '2026-07-31 15:10',
    },
    {
      id: 'rec_102',
      session_id: 'sess_9922',
      recommended_properties: ['Coral Sanctuary Villa'],
      reasoning_summary: '[Status: qualified] User inquired about Red Sea waterfront sanctuaries. Tool [check_availability] returned 3 available units.',
      created_at: '2026-07-31 11:45',
    },
  ]);

  // Session Consent Report Data
  const sessionStats = {
    totalSessions: 1420,
    consentGivenCount: 1180,
    consentPercentage: 83.1,
  };

  // Unified Leads Mock State
  const [unifiedLeads, setUnifiedLeads] = useState([
    {
      id: 'l1',
      channel: 'private_viewings',
      name: 'H.E. Sheikh Faisal Al-Otaibi',
      contact: 'faisal@example.com | +966 50 123 4567',
      details: 'Viewing for The Imperial Sky Penthouse on 2026-08-15 at 02:00 PM',
      status: 'pending',
      device: 'desktop',
      created_at: '2026-07-31 14:30',
      preferred_date: '2026-08-15',
      preferred_time: '02:00 PM',
      property_title: 'The Imperial Sky Penthouse',
    },
  ]);

  const pendingViewingsCount = unifiedLeads.filter(
    (l) => l.channel === 'private_viewings' && l.status === 'pending'
  ).length;

  const handleAssignAgent = (followupId: string, agentId: string) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === followupId ? { ...f, assigned_agent_id: agentId } : f))
    );
  };

  const handleUpdateFollowupStatus = (followupId: string, newStatus: string) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === followupId ? { ...f, status: newStatus } : f))
    );
  };

  const handleRetryCrmSync = (followupId: string) => {
    setFollowups((prev) =>
      prev.map((f) =>
        f.id === followupId
          ? { ...f, crm_sync_status: 'synced', crm_external_id: `hs_deal_retry_${Date.now()}` }
          : f
      )
    );
  };

  const failedCrmSyncs = followups.filter((f) => f.crm_sync_status === 'failed');

  return (
    <div className="min-h-screen pt-28 pb-20 bg-neoma-black text-neoma-ivory px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="glass-panel p-8 rounded-3xl border-neoma-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-neoma-gold/20 text-neoma-gold border border-neoma-gold/40">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-neoma-emerald/20 text-neoma-emerald border border-neoma-emerald/40 text-[10px] font-mono uppercase">
                  Super Admin Authorized
                </span>
                {pendingViewingsCount > 0 && (
                  <span className="px-3 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Bell className="w-3 h-3 animate-bounce" />
                    {pendingViewingsCount} Pending Viewings
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-neoma-ivory mt-1">
                {isAr ? 'لوحة التحكم الإدارية لنيوما — المرحلة الثالثة' : 'NEOMA Executive Control Portal — Phase 3'}
              </h1>
            </div>
          </div>

          <div className="text-xs font-mono text-neoma-gray-400">
            Role: <span className="text-neoma-gold font-bold">super_admin</span> • RLS Active
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 border-b border-neoma-gold/20 pb-4">
          {[
            { key: 'leads', label: isAr ? 'الوارد الموحد' : 'Unified Leads Inbox', icon: Inbox, badge: pendingViewingsCount },
            { key: 'followups', label: isAr ? 'متابعة الوكلاء' : 'Agent Follow-up Triage', icon: UserCheck },
            { key: 'crm_monitor', label: isAr ? 'مراقبة CRM' : 'CRM Sync Monitor', icon: Activity, badge: failedCrmSyncs.length },
            { key: 'ai_review', label: isAr ? 'مراجعة الذكاء' : 'AI Recs Review', icon: Sparkles },
            { key: 'consent_report', label: isAr ? 'تقرير الخصوصية' : 'Session Consent Report', icon: PieChart },
            { key: 'calendar', label: isAr ? 'جدول المعاينات' : 'Viewing Calendar', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border relative ${
                  activeTab === tab.key
                    ? 'bg-gold-gradient text-neoma-black border-transparent font-bold shadow-gold-glow'
                    : 'glass-panel text-neoma-gray-300 border-neoma-gold/20 hover:border-neoma-gold'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tab 2: Agent Follow-up Triage */}
        {activeTab === 'followups' && (
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-playfair font-bold text-neoma-ivory flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-neoma-gold" />
                <span>Consultation Follow-ups & Agent Assignment</span>
              </h2>
              <span className="text-xs font-mono text-neoma-gold">
                Super Admin Assignment Control
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neoma-surface text-neoma-gold uppercase border-b border-neoma-gold/20">
                  <tr>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Property Interest</th>
                    <th className="p-4">Assigned Agent (Manual Dropdown)</th>
                    <th className="p-4">CRM Sync Status</th>
                    <th className="p-4">Followup Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neoma-gold/10">
                  {followups.map((f) => (
                    <tr key={f.id} className="hover:bg-neoma-surface/50">
                      <td className="p-4 font-bold text-neoma-ivory">
                        {f.client_name}
                        <span className="block text-[10px] text-neoma-gray-400 font-normal">{f.email}</span>
                      </td>
                      <td className="p-4 text-neoma-gray-300">{f.property_interest}</td>
                      <td className="p-4">
                        <select
                          value={f.assigned_agent_id}
                          onChange={(e) => handleAssignAgent(f.id, e.target.value)}
                          className="px-3 py-1.5 rounded bg-neoma-surface border border-neoma-gold/30 text-neoma-gold font-bold text-xs"
                        >
                          <option value="">-- Unassigned --</option>
                          {agentsRoster.map((ag) => (
                            <option key={ag.id} value={ag.id}>
                              {ag.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          f.crm_sync_status === 'synced' ? 'bg-neoma-emerald/20 text-neoma-emerald' : 'bg-red-950 text-red-400 border border-red-500/30'
                        }`}>
                          {f.crm_sync_status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={f.status}
                          onChange={(e) => handleUpdateFollowupStatus(f.id, e.target.value)}
                          className="px-2 py-1 rounded bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory text-[11px]"
                        >
                          <option value="pending">pending</option>
                          <option value="contacted">contacted</option>
                          <option value="qualified">qualified</option>
                          <option value="booked">booked</option>
                          <option value="closed">closed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: CRM Sync Monitor */}
        {activeTab === 'crm_monitor' && (
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-playfair font-bold text-neoma-ivory flex items-center gap-2">
                <Activity className="w-5 h-5 text-neoma-gold" />
                <span>CRM Sync Monitor (HubSpot Reference Adapter)</span>
              </h2>
              <span className="text-xs font-mono text-neoma-gold">
                Failed Syncs: {failedCrmSyncs.length}
              </span>
            </div>

            {failedCrmSyncs.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-neoma-emerald bg-neoma-surface rounded-2xl border border-neoma-emerald/30">
                All CRM contact and deal syncs are synchronized with HubSpot.
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                {failedCrmSyncs.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neoma-ivory">{f.client_name} ({f.email})</h4>
                      <span className="text-red-400 text-[11px]">Sync Failure: HubSpot API Timeout / Retry Threshold</span>
                    </div>
                    <button
                      onClick={() => handleRetryCrmSync(f.id)}
                      className="px-4 py-2 rounded-full bg-gold-gradient text-neoma-black font-bold uppercase text-[11px] flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Manual Sync Retry
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: AI Recommendations Review */}
        {activeTab === 'ai_review' && (
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-playfair font-bold text-neoma-ivory flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neoma-gold" />
              <span>AI Concierge Recommendations Audit Log</span>
            </h2>

            <div className="space-y-4 font-mono text-xs">
              {aiRecsAudit.map((rec) => (
                <div key={rec.id} className="p-5 rounded-2xl bg-neoma-surface border border-neoma-gold/20 space-y-2">
                  <div className="flex items-center justify-between text-neoma-gold font-bold">
                    <span>Session: {rec.session_id}</span>
                    <span className="text-[11px] text-neoma-gray-400 font-normal">{rec.created_at}</span>
                  </div>
                  <p className="text-neoma-ivory bg-neoma-black/60 p-3 rounded-xl border border-neoma-gold/10">
                    {rec.reasoning_summary}
                  </p>
                  <div className="text-[11px] text-neoma-gray-300">
                    Recommended: {rec.recommended_properties.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Session Consent Report */}
        {activeTab === 'consent_report' && (
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-playfair font-bold text-neoma-ivory flex items-center gap-2">
              <PieChart className="w-5 h-5 text-neoma-gold" />
              <span>Session Consent & Personalization Audit Report</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center font-mono">
              <div className="p-6 rounded-2xl bg-neoma-surface border border-neoma-gold/20">
                <span className="block text-xs text-neoma-gray-400 uppercase mb-1">Total Browser Sessions</span>
                <span className="text-3xl font-bold text-neoma-ivory">{sessionStats.totalSessions}</span>
              </div>
              <div className="p-6 rounded-2xl bg-neoma-surface border border-neoma-gold/20">
                <span className="block text-xs text-neoma-gray-400 uppercase mb-1">Consent Granted</span>
                <span className="text-3xl font-bold text-neoma-emerald">{sessionStats.consentGivenCount}</span>
              </div>
              <div className="p-6 rounded-2xl bg-neoma-surface border border-neoma-gold/20">
                <span className="block text-xs text-neoma-gray-400 uppercase mb-1">Consent Compliance Rate</span>
                <span className="text-3xl font-bold text-neoma-gold">{sessionStats.consentPercentage}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
