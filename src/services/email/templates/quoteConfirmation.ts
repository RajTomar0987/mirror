import { BUSINESS_CONFIG } from "@/config/business";

export interface QuoteConfirmationData {
  quoteId: string;
  name: string;
  service: string;
  suburb: string;
  description: string;
}

export function generateQuoteConfirmationEmail(data: QuoteConfirmationData): { html: string; text: string; subject: string } {
  const subject = `Quote Request Received — ${BUSINESS_CONFIG.name}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; background-color: #f7f7f7; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; padding: 40px; }
    .logo { font-size: 16px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #111111; margin-bottom: 30px; border-bottom: 1px solid #eeeeee; padding-bottom: 20px; }
    h1 { font-size: 22px; font-weight: 300; margin-bottom: 16px; color: #111111; }
    p { font-size: 14px; line-height: 1.6; color: #444444; margin-bottom: 20px; }
    .box { background: #f9f9f9; border-left: 3px solid #111111; padding: 20px; margin: 24px 0; }
    .box-item { font-size: 13px; margin-bottom: 8px; }
    .box-item strong { font-weight: 600; color: #111111; }
    .footer { font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; margin-top: 40px; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">${BUSINESS_CONFIG.name}</div>
    <h1>Quote Request Received</h1>
    <p>Dear ${data.name},</p>
    <p>Thank you for reaching out to Complete Glass Innovations. We have successfully received your quote request for architectural glass installation.</p>
    
    <div class="box">
      <div class="box-item"><strong>Reference ID:</strong> ${data.quoteId}</div>
      <div class="box-item"><strong>Service:</strong> ${data.service}</div>
      <div class="box-item"><strong>Location:</strong> ${data.suburb}</div>
      <div class="box-item"><strong>Project Summary:</strong> ${data.description}</div>
    </div>

    <p>Our estimating team is currently reviewing your project specifications and architectural details. We will contact you via your preferred communication method with next steps.</p>
    
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
Quote Request Received — ${BUSINESS_CONFIG.name}

Dear ${data.name},

Thank you for reaching out to Complete Glass Innovations. We have successfully received your quote request for architectural glass installation.

Reference ID: ${data.quoteId}
Service: ${data.service}
Location: ${data.suburb}
Project Summary: ${data.description}

Our estimating team is currently reviewing your project specifications and architectural details. We will contact you via your preferred communication method with next steps.

--
${BUSINESS_CONFIG.name}
Phone: ${BUSINESS_CONFIG.phone} | Email: ${BUSINESS_CONFIG.email}
Website: ${BUSINESS_CONFIG.websiteUrl}
  `.trim();

  return { subject, html, text };
}
