"use client";

import { DynamicForm } from "@/components/dynamic-form";
import { useTranslations } from "next-intl";

export default function ApplyPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          {t("apply.title")}
        </h1>
        <DynamicForm />
      </div>
    </div>
  );
}
