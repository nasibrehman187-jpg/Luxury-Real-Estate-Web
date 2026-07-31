export interface CRMContact {
  email: string;
  name: string;
  phone: string;
  country?: string;
  source?: string;
}

export interface CRMLead {
  contact: CRMContact;
  propertyInterest?: string;
  preferredDate?: string;
  message?: string;
  leadStatus?: 'new' | 'contacted' | 'qualified' | 'booked' | 'closed';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface CRMFollowup {
  followupId: string;
  consultationId: string;
  status: string;
  notes?: string;
  assignedAgentId?: string;
}

export interface CrmProvider {
  syncContact(contact: CRMContact): Promise<{ success: boolean; externalId?: string; error?: string }>;
  syncLead(lead: CRMLead): Promise<{ success: boolean; dealId?: string; error?: string }>;
  logFollowup(followup: CRMFollowup): Promise<{ success: boolean; error?: string }>;
}
