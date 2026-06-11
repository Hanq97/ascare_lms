import { getSession } from "@/lib/auth/session";
import { ScreenPlaceholder } from "@/components/ui";

export default async function AppHome() {
  const user = await getSession();
  const isStudent = user?.role === "STUDENT";
  return (
    <ScreenPlaceholder
      title={isStudent ? "ホーム" : "ダッシュボード"}
      sub={isStudent ? "受講できるコースと学習の続き。" : "所属学生の学習状況サマリー。"}
      note="この画面は Phase E で実装します。"
    />
  );
}
