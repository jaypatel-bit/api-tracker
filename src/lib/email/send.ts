import { Resend } from "resend";
import {
  buildCriticalAlertHtml,
  buildDigestHtml,
  type DigestItem,
} from "./templates";

let resendClient: Resend | null = null;

function getResend() {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendDigestEmail(
  to: string,
  name: string,
  changes: DigestItem[]
) {
  const from = process.env.EMAIL_FROM || "APIRadar <notifications@apiradar.dev>";

  await getResend().emails.send({
    from,
    to,
    subject: `APIRadar Monthly Digest: ${changes.length} change${changes.length !== 1 ? "s" : ""}`,
    html: buildDigestHtml(name, changes),
  });
}

export async function sendCriticalAlertEmail(
  to: string,
  name: string,
  change: DigestItem
) {
  const from = process.env.EMAIL_FROM || "APIRadar <notifications@apiradar.dev>";

  await getResend().emails.send({
    from,
    to,
    subject: `APIRadar Critical Alert: ${change.providerName}`,
    html: buildCriticalAlertHtml(name, change),
  });
}
