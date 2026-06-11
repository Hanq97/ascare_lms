// 管理サイト ログイン (管理者 + 教師)
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { homeFor } from "@/lib/auth/rbac";
import { LoginForm } from "@/components/LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getSession();
  if (user) redirect(homeFor(user.role)); // đã đăng nhập → về trang chủ theo role
  const { next } = await searchParams;
  return <LoginForm site="admin" next={next} />;
}
