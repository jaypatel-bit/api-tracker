import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface Classification {
  title: string;
  changeType: string;
  severity: string;
  confidence: number;
  affectedAreas: string[];
  suggestedActions: string[];
  summary: string;
}

const VALID_CHANGE_TYPES = [
  "breaking_change", "deprecation", "new_endpoint", "removed_endpoint",
  "new_parameter", "removed_parameter", "enum_change", "auth_change",
  "rate_limit_change", "webhook_change", "sdk_release", "migration_notice",
  "sunset_date", "pricing_change", "docs_change", "bug_fix",
  "behavior_change", "other",
];

const VALID_SEVERITIES = ["critical", "high", "medium", "low", "informational"];

export async function classifyChange(
  diffText: string,
  providerName: string
): Promise<Classification> {
  const prompt = `You are an API change classifier. Analyze the following diff from the ${providerName} API changelog.

Return ONLY a valid JSON object (no markdown, no code blocks) with these fields:
- title: short specific title for the change, max 80 characters
- changeType: one of [${VALID_CHANGE_TYPES.join(", ")}]
- severity: one of [${VALID_SEVERITIES.join(", ")}]
- confidence: integer 0-100
- affectedAreas: array of specific endpoints, parameters, or SDK names affected
- suggestedActions: array of 1-3 concrete next steps
- summary: 2-3 sentence plain English explanation

Diff content (truncated to relevant portion):
${diffText.substring(0, 3000)}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and sanitize
    return {
      title: String(parsed.title || "Unknown change").substring(0, 80),
      changeType: VALID_CHANGE_TYPES.includes(parsed.changeType)
        ? parsed.changeType
        : "other",
      severity: VALID_SEVERITIES.includes(parsed.severity)
        ? parsed.severity
        : "medium",
      confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 70)),
      affectedAreas: Array.isArray(parsed.affectedAreas)
        ? parsed.affectedAreas.map(String).slice(0, 10)
        : [],
      suggestedActions: Array.isArray(parsed.suggestedActions)
        ? parsed.suggestedActions.map(String).slice(0, 3)
        : [],
      summary: String(parsed.summary || "Change detected.").substring(0, 500),
    };
  } catch (error) {
    console.error("AI classification failed:", error);
    // Graceful fallback
    return {
      title: `Change detected in ${providerName}`,
      changeType: "other",
      severity: "medium",
      confidence: 30,
      affectedAreas: [],
      suggestedActions: ["Review the changelog manually"],
      summary: `A change was detected in the ${providerName} changelog. Automatic classification failed — please review manually.`,
    };
  }
}
