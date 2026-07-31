import React from 'react';

export function renderLuxuryEmailLayout(title: string, bodyText: string, ctaText?: string, ctaUrl?: string) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>${title}</title>
    </head>
    <body style="background-color: #0B0B0B; color: #F5F5F0; font-family: 'Playfair Display', Georgia, serif; padding: 40px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #161616; border: 1px solid #D4AF37; padding: 40px; border-radius: 24px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #D4AF37; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">NEOMA RESIDENCES</h1>
          <p style="color: #888888; font-size: 11px; font-family: monospace; text-transform: uppercase;">Crafting Iconic Spaces for Extraordinary Lives</p>
        </div>
        <h2 style="font-size: 20px; color: #F5F5F0; margin-bottom: 20px;">${title}</h2>
        <p style="color: #CCCCCC; font-size: 14px; line-height: 1.6; font-family: sans-serif;">${bodyText}</p>
        ${
          ctaText && ctaUrl
            ? `<div style="text-align: center; margin-top: 30px;">
                <a href="${ctaUrl}" style="background: linear-gradient(135deg, #D4AF37, #9A7B1C); color: #0B0B0B; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">${ctaText}</a>
              </div>`
            : ''
        }
        <div style="border-top: 1px solid #333333; margin-top: 40px; padding-top: 20px; text-align: center; font-size: 11px; color: #666666; font-family: monospace;">
          © 2026 NEOMA Residences | Kingdom of Saudi Arabia
        </div>
      </div>
    </body>
  </html>
  `;
}

export function getConsultationConfirmationEmail(name: string) {
  return renderLuxuryEmailLayout(
    'Private Advisory Session Request Confirmed',
    `Dear ${name},\n\nThank you for requesting a private consultation with NEOMA Residences. A senior advisory director has been assigned to your request and will contact you within 24 hours to finalize your itinerary.`,
    'Explore Portfolio',
    'https://neoma-residences.com/properties'
  );
}

export function getViewingBookingConfirmationEmail(name: string, date: string, time: string) {
  return renderLuxuryEmailLayout(
    'Private Viewing Scheduled',
    `Dear ${name},\n\nYour private viewing request for ${date} at ${time} (Riyadh Business Hours) has been received. Our VIP host team will ensure seamless helipad or security detail access.`,
    'View Booking Status',
    'https://neoma-residences.com/admin'
  );
}

export function getPropertyInquiryEmail(name: string, propertyTitle: string) {
  return renderLuxuryEmailLayout(
    'Property Inquiry Received',
    `Dear ${name},\n\nWe have received your direct inquiry regarding ${propertyTitle}. A dedicated luxury agent has been assigned to provide specific floor level configurations and custom payment schedules.`,
    'View Property Details',
    'https://neoma-residences.com/properties'
  );
}

export function getBrochureDeliveryEmail(name: string, signedPdfUrl: string) {
  return renderLuxuryEmailLayout(
    'Your Confidential Prospectus Download',
    `Dear ${name},\n\nThank you for requesting the NEOMA Masterplan Prospectus. Your secure 15-minute encrypted download link is ready below.`,
    'Download Signed Prospectus PDF',
    signedPdfUrl
  );
}

export function getAgentNotificationEmail(agentName: string, clientName: string, leadDetails: string) {
  return renderLuxuryEmailLayout(
    'VIP Lead Assigned — Action Required',
    `Dear ${agentName},\n\nA new VIP luxury real estate lead (${clientName}) has been assigned to your portfolio in NEOMA Executive Portal.\n\nLead Details: ${leadDetails}`,
    'Access Executive Portal',
    'https://neoma-residences.com/admin'
  );
}
