import { createClient } from '@/lib/supabase/server';
import { sendTransactionalEmail } from './resend';
import { renderLuxuryEmailLayout } from './templates';

export async function isEmailUnsubscribed(email: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('email_unsubscribes')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    return !!data;
  } catch (e) {
    return false;
  }
}

export async function triggerNurtureSequence(email: string, name: string, currentLeadStatus: string) {
  // Stop sequence if lead is booked or lost/closed
  if (currentLeadStatus === 'booked' || currentLeadStatus === 'closed') {
    console.log(`[Nurture] Lead ${email} is ${currentLeadStatus} — sequence stopped.`);
    return { status: 'stopped' };
  }

  // Unsubscribe Check prior to marketing nurture send
  const unsubscribed = await isEmailUnsubscribed(email);
  if (unsubscribed) {
    console.log(`[Nurture] Lead ${email} is unsubscribed — send blocked.`);
    return { status: 'unsubscribed' };
  }

  // Step 1 Nurture Email (48h Investment Insight)
  const html = renderLuxuryEmailLayout(
    'NEOMA Investment Intelligence — Saudi Vision 2030 Growth',
    `Dear ${name},\n\nAs a qualified investor exploring Saudi Arabia's premier architectural projects, we invite you to review our latest capital appreciation report projecting +42% 5-year growth across KAFD and Diriyah developments.`,
    'View Investment Prospectus',
    'https://neoma-residences.com/investment'
  );

  await sendTransactionalEmail(email, 'NEOMA Portfolio Investment Insight', html);
  return { status: 'sent_step_1' };
}
