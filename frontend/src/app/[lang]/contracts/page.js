import { redirect } from "next/navigation";

export default async function ContractsPage({ params, searchParams }) {
  const { lang } = await params;
  const sp = await searchParams;
  const domain = sp?.domain;
  const target = `/${lang}${domain ? `?domain=${domain}` : ""}`;
  redirect(target);
}
