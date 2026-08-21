import { BUSINESS_CONFIG } from "@/config/business";

export interface QuoteAdminNotificationData {
  quoteId: string;
  name: string;
  email: string;
  phone: string;
  suburb: string;
  service: string;
  description: string;
  preferredContact: string;
  filesCount?: number;
}

export function generateQuoteAdminNotificationEmail(data: QuoteAdminNotificationData): { html: string; text: string; subject: string } {
  const subject = `[NEW QUOTE REQUEST] ${data.service} — ${data.name} (${data.suburb})`;

  const adminLink = `${BUSINESS_CONFIG.websiteUrl}/admin/quotes/${data.quoteId}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background-color: #f7f7f7; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; padding: 40px; }
    .header { font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #111111; border-bottom: 2px solid #111111; padding-bottom: 15px; margin-bottom: 25px; }
    .row { margin-bottom: 12px; font-size: 14px; }
    .row strong { display: inline-block; width: 140px; color: #666666; font-weight: 500; }
    .desc { background: #f9f9f9; padding: 15px; border-left: 3px solid #111111; margin: 20px 0; font-size: 14px; line-height: 1.5; }
    .btn { display: inline-block; background: #111111; color: #ffffff !important; padding: 12px 24px; text-decoration: none; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">New Quote Enquiry Received</div>
    
    <div class="row"><strong>Customer:</strong> ${data.name}</div>
    <div class="row"><strong>Email:</strong> ${data.email}</div>
    <div class="row"><strong>Phone:</strong> ${data.phone}</div>
    <div class="row"><strong>Suburb:</strong> ${data.suburb}</div>
    <div class="row"><strong>Service:</strong> ${data.service}</div>
    <div class="row"><strong>Preferred Contact:</strong> ${data.preferredContact}</div>
    <div class="row"><strong>Files Attached:</strong> ${data.filesCount || 0} file(s)</div>
    
    <div class="desc">
      <strong>Project Description:</strong><br>
      ${data.description}
    </div>

    <a href="${adminLink}" class="btn">Inspect Quote in Dashboard &rarr;</a>
  </div>
</body>
</html>
  `.trim();

  const text = `
New Quote Request Received

Customer: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Suburb: ${data.suburb}
Service: ${data.service}
Preferred Contact: ${data.preferredContact}
Files Attached: ${data.filesCount || 0} file(s)

Project Description:
${data.description}

Dashboard Link: ${adminLink}
  `.trim();

  return { subject, html, text };
}
