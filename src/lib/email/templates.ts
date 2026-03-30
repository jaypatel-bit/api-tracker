interface DigestItem {
  providerName: string;
  title: string;
  summary: string;
  severity: string;
  changeType: string;
}

const SEVERITY_BG: Record<string, string> = {
  critical: "#fef2f2",
  high: "#fff7ed",
  medium: "#fefce8",
  low: "#f0fdf4",
  informational: "#f0f9ff",
};

const SEVERITY_TEXT: Record<string, string> = {
  critical: "#991b1b",
  high: "#9a3412",
  medium: "#854d0e",
  low: "#166534",
  informational: "#075985",
};

const SEVERITY_BORDER: Record<string, string> = {
  critical: "#fecaca",
  high: "#fed7aa",
  medium: "#fef08a",
  low: "#bbf7d0",
  informational: "#bae6fd",
};

export function buildDigestHtml(userName: string, changes: DigestItem[]): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const changeRows = changes
    .map(
      (c) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${SEVERITY_BG[c.severity] || "#f3f4f6"}; color: ${SEVERITY_TEXT[c.severity] || "#374151"}; border: 1px solid ${SEVERITY_BORDER[c.severity] || "#e5e7eb"};">
              ${c.severity}
            </span>
            <span style="font-size: 11px; color: #6b7280;">${c.providerName}</span>
          </div>
          <div style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 2px;">
            ${c.title}
          </div>
          <div style="font-size: 12px; color: #6b7280;">
            ${c.summary}
          </div>
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px; background: #1e40af;">
              <div style="font-size: 18px; font-weight: 700; color: #ffffff;">APIRadar</div>
              <div style="font-size: 13px; color: #bfdbfe; margin-top: 4px;">Daily Digest</div>
            </td>
          </tr>
          <!-- Greeting -->
          <tr>
            <td style="padding: 20px 24px 8px;">
              <div style="font-size: 14px; color: #374151;">
                Hi ${userName}, here are the API changes that need your attention:
              </div>
            </td>
          </tr>
          <!-- Changes -->
          <tr>
            <td style="padding: 8px 8px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${changeRows}
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding: 0 24px 24px;" align="center">
              <a href="${appUrl}/board" style="display: inline-block; padding: 10px 24px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                View on Board
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
              <div style="font-size: 11px; color: #9ca3af; text-align: center;">
                You're receiving this because you have digest notifications enabled.
                <a href="${appUrl}/settings" style="color: #6b7280;">Manage preferences</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export type { DigestItem };
