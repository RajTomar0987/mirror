import { BUSINESS_CONFIG } from "@/config/business";

export interface QuoteStatusEmailData {
  name: string;
  quoteId: string;
  service: string;
  status: string;
  notes?: string;
}

export function generateQuoteStatusEmail(data: QuoteStatusEmailData): { html: string; text: string; subject: string } {
  const statusFormatted = data.status.replace("_", " ").toUpperCase();
  const subject = `Update on Your Quote Request #${data.quoteId} — ${BUSINESS_CONFIG.name}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background-color: #f7f7f7; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; padding: 40px; }
    .logo { font-size: 16px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #111111; margin-bottom: 30px; border-bottom: 1px solid #eeeeee; padding-bottom: 20px; }
    h1 { font-size: 20px; font-weight: 300; margin-bottom: 16px; color: #111111; }
    p { font-size: 14px; line-height: 1.6; color: #444444; margin-bottom: 20px; }
    .status-badge { display: inline-block; background: #111111; color: #ffffff; padding: 6px 14px; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px; }
    .footer { font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; margin-top: 40px; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">${BUSINESS_CONFIG.name}</div>
    <h1>Quote Status Update</h1>
    <p>Dear ${data.name},</p>
    <p>The status of your quote request for <strong>${data.service}</strong> (Ref: #${data.quoteId}) has been updated:</p>
    
    <div class="status-badge">${statusFormatted}</div>

    ${data.notes ? `<p><strong>Notes from Estimating Team:</strong><br>${data.notes}</p>` : ""}

    <p>If you have any questions or require further details, please feel free to reply directly to this email or call our team.</p>
    
    <div class="footer">
      <p><strong>${BUSINESS_CONFIG.name}</strong><br>
      Phone: ${BUSINESS_CONFIG.phone} | Email: ${BUSINESS_CONFIG.email}<br>
      Website: <a href="${BUSINESS_CONFIG.websiteUrl}">${BUSINESS_CONFIG.websiteUrl}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Quote Status Update — ${BUSINESS_CONFIG.name}

Dear ${data.name},

The status of your quote request for ${data.service} (Ref: #${data.quoteId}) has been updated to: ${statusFormatted}.

${data.notes ? `Notes from Estimating Team:\n${data.notes}\n` : ""}

If you have any questions or require further details, please feel free to reply directly to this email or call our team.

--
${BUSINESS_CONFIG.name}
Phone: ${BUSINESS_CONFIG.phone} | Email: ${BUSINESS_CONFIG.email}
Website: ${BUSINESS_CONFIG.websiteUrl}
  `.trim();

  return { subject, html, text };
}
