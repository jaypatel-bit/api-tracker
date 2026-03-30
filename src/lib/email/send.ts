import { Resend } from "resend";
import { buildDigestHtml, type DigestItem } from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDigestEmail(
  to: string,
  name: string,
  changes: DigestItem[]
) {
  const from = process.env.EMAIL_FROM || "APIRadar <notifications@apiradar.dev>";

  await resend.emails.send({
    from,
    to,
    subject: `APIRadar Digest: ${changes.length} new change${changes.length !== 1 ? "s" : ""}`,
    html: buildDigestHtml(name, changes),
  });
}
