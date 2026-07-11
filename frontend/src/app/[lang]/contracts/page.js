import { redirect } from "next/navigation";

export default function ContractsPage({ params, searchParams }) {
  const { lang } = params;
  const domain = searchParams?.domain;
  const target = `/${lang}${domain ? `?domain=${domain}` : ""}`;
  redirect(target);
}
