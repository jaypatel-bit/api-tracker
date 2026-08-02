export function getCronSecret() {
  const value = process.env.CRON_SECRET?.trim();
  return value ? value : undefined;
}
