import nodemailer from "nodemailer";

export interface BookingEmailPayload {
  clientName: string;
  clientEmail: string;
  siteName: string;
  siteCity: string;
  siteArea?: string;
  siteType: string;
  siteSize?: string;
  siteLitType?: string;
  bookingPeriod?: string;
  expiresAt: string;
  staffName: string;
  staffEmail?: string;
  confirmationToken: string;
  appUrl?: string;
}

export async function sendBookingConfirmationEmail(payload: BookingEmailPayload): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  try {
    const baseUrl = payload.appUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const confirmationLink = `${baseUrl}/booking/confirm?token=${payload.confirmationToken}`;
    
    const formattedExpiry = new Date(payload.expiresAt).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Reservation Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                SellAds OOH Media
              </h1>
              <p style="margin: 6px 0 0 0; color: #c7d2fe; font-size: 14px;">
                Hoarding Reservation &amp; Booking Confirmation
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
                Dear ${payload.clientName},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                A site reservation hold has been placed for you by our executive <strong>${payload.staffName}</strong>. Please review the hoarding details below and confirm your reservation.
              </p>

              <!-- Reservation Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #cbd5e1;">
                <tr>
                  <td>
                    <table width="100%" border="0" cellspacing="0" cellpadding="6">
                      <tr>
                        <td width="35%" style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Site Name</td>
                        <td width="65%" style="font-size: 14px; color: #0f172a; font-weight: 700;">${payload.siteName}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Location</td>
                        <td style="font-size: 14px; color: #334155;">${payload.siteCity}${payload.siteArea ? `, ${payload.siteArea}` : ""}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Media Type &amp; Size</td>
                        <td style="font-size: 14px; color: #334155;">${payload.siteType} · ${payload.siteSize || "Standard"} (${payload.siteLitType || "Standard Lighting"})</td>
                      </tr>
                      ${payload.bookingPeriod ? `
                      <tr>
                        <td style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Booking Period</td>
                        <td style="font-size: 14px; color: #4f46e5; font-weight: 600;">${payload.bookingPeriod}</td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Hold Expiry</td>
                        <td style="font-size: 13px; color: #b45309; font-weight: 600;">${formattedExpiry}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Assigned Staff</td>
                        <td style="font-size: 14px; color: #334155;">${payload.staffName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Notice Badge -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;">
                  <strong>Important:</strong> This reservation slot is held for <strong>5 days</strong>. If not confirmed, it will automatically be released for other advertisers.
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${confirmationLink}" target="_blank" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.25);">
                  Confirm Booking Reservation &rarr;
                </a>
              </div>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                Or copy and paste this link in your browser:<br>
                <a href="${confirmationLink}" style="color: #6366f1; word-break: break-all;">${confirmationLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                SellAds Outdoor Advertising Services · Nagpur &amp; Pan-India<br>
                For immediate assistance, please reply directly to this email or contact your executive.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textFallback = `
Dear ${payload.clientName},

A site reservation has been placed for you by ${payload.staffName}.

Site: ${payload.siteName} (${payload.siteCity})
Type: ${payload.siteType} · ${payload.siteSize || "Standard"}
Booking Period: ${payload.bookingPeriod || "5-Day Hold"}
Hold Valid Until: ${formattedExpiry}
Assigned Staff: ${payload.staffName}

Please confirm your reservation within 5 days by opening:
${confirmationLink}

Thank you,
SellAds OOH Media
    `.trim();

    // Check if SMTP environment variables are present
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"SellAds Media" <${smtpUser || "noreply@sellads.in"}>`;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: payload.clientEmail,
        subject: `Booking Reservation Confirmation: ${payload.siteName}`,
        text: textFallback,
        html: emailHtml,
      });

      return { success: true, messageId: info.messageId, simulated: false };
    } else {
      // Graceful fallback for environments without active SMTP credentials
      console.log("=================================================");
      console.log(`[SIMULATED EMAIL DISPATCH] To: ${payload.clientEmail}`);
      console.log(`Subject: Booking Reservation Confirmation: ${payload.siteName}`);
      console.log(`Confirmation Link: ${confirmationLink}`);
      console.log(`Expires At: ${formattedExpiry}`);
      console.log("=================================================");
      
      return {
        success: true,
        simulated: true,
        messageId: `simulated-${Date.now()}`
      };
    }
  } catch (err: any) {
    console.error("sendBookingConfirmationEmail error:", err);
    return { success: false, error: err?.message || "Failed to dispatch email." };
  }
}
