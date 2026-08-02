import { redirect } from "next/navigation";
import { SignupPageContent } from "@/components/auth/signup-page";
import { getServerSession } from "@/lib/auth/session";

export default async function SignupPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/board");
  }

  return <SignupPageContent />;
}
