"use client";

import { useState, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

export function useFormDraft(form: UseFormReturn<any>) {
  const t = useTranslations();
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Auto-save draft every 10 seconds
  useEffect(() => {
    if (!draftLoaded) return;

    const interval = setInterval(() => {
      const formValues = form.getValues();
      if (Object.keys(formValues).length > 0) {
        localStorage.setItem("formDraft", JSON.stringify(formValues));
        toast({
          title: t("apply.draftSaved"),
          description: t("apply.draftSavedDescription"),
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [form, draftLoaded, t]);

  // Load draft on initial render
  useEffect(() => {
    if (draftLoaded) return;

    const draft = localStorage.getItem("formDraft");
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        form.reset(draftData);
        toast({
          title: t("apply.draftLoaded"),
          description: t("apply.draftLoadedDescription"),
        });
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }

    setDraftLoaded(true);
  }, [form, draftLoaded, t]);

  // Function to clear draft
  const clearDraft = () => {
    form.reset({});
    localStorage.removeItem("formDraft");
    toast({
      title: t("apply.draftCleared"),
      description: t("apply.draftClearedDescription"),
    });
  };

  // Function to manually save draft
  const saveDraft = () => {
    const formValues = form.getValues();
    if (Object.keys(formValues).length > 0) {
      localStorage.setItem("formDraft", JSON.stringify(formValues));
      toast({
        title: t("apply.draftSaved"),
        description: t("apply.draftSavedDescription"),
      });
    }
  };

  return { clearDraft, saveDraft };
}
