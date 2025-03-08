import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

export default function Home() {
  // Redirect to the default locale
  redirect(`/${defaultLocale}`);
}
