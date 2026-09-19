import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const isAdmin = await getAdminSession();
  if (isAdmin) redirect("/admin");

  return (
    <div className="mx-auto flex max-w-sm flex-col px-5 py-20 sm:px-0">
      <h1 className="mb-2 font-serif text-2xl">Admin Controls</h1>
      <p className="mb-8 text-sm text-ink-muted">
        Sign in to upload or remove photographs from the collection.
      </p>
      <LoginForm />
    </div>
  );
}
