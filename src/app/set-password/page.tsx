import SetPasswordForm from "./SetPasswordForm";

export const dynamic = "force-dynamic";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <SetPasswordForm token={token ?? ""} />;
}
