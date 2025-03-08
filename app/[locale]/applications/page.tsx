"use client";

import { ApplicationsList } from "@/components/applications-list";
import { useTranslations } from "next-intl";

export default function ApplicationsPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        {t("applications.title")}
      </h1>
      <ApplicationsList />
    </div>
  );
}
