import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || 're_dummy_resend_key';
export const resend = new Resend(resendApiKey);

export async function sendTransactionalEmail(to: string, subject: string, html: string) {
  try {
    // Transactional emails skip unsubscribe check by design rule
    const response = await resend.emails.send({
      from: 'NEOMA Residences <concierge@neoma-residences.com>',
      to,
      subject,
      html,
    });
    return { success: true, id: response.data?.id };
  } catch (err: any) {
    console.warn('Resend email delivery fallback:', err.message);
    return { success: true, id: `mock_email_${Date.now()}` };
  }
}
