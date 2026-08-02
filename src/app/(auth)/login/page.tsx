import { redirect } from "next/navigation";
import { LoginPageContent } from "@/components/auth/login-page";
import { getServerSession } from "@/lib/auth/session";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/board");
  }

  return <LoginPageContent />;
}
