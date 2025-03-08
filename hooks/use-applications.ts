"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubmissions, submitForm, type Application } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Get applications from localStorage
function getLocalApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("applications") || "[]");
  } catch (error) {
    console.error("Failed to parse local applications:", error);
    return [];
  }
}

// Save application to localStorage
function saveLocalApplication(application: Application) {
  if (typeof window === "undefined") return;
  try {
    const applications = getLocalApplications();
    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));
  } catch (error) {
    console.error("Failed to save local application:", error);
  }
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      try {
        // Try to fetch from API
        const apiData = await getSubmissions();
        const localData = getLocalApplications();

        // Combine data from API and localStorage
        return [...(apiData.data || []), ...localData];
      } catch (error) {
        // Fallback to localStorage only
        console.error("Failed to fetch from API, using local data:", error);
        return getLocalApplications();
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useSubmitApplication() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: submitForm,
    onMutate: async (newApplication) => {
      // Optimistically update the UI
      const application = {
        id: Date.now().toString(),
        ...newApplication,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };

      // Save to localStorage for demo purposes
      saveLocalApplication(application);

      // Return context with the optimistic application
      return { application };
    },
    onSuccess: () => {
      toast({
        title: t("success.title"),
        description: t("success.applicationSubmitted"),
      });

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      // Redirect to applications page
      setTimeout(() => {
        router.push("/applications");
      }, 1500);
    },
    onError: (error) => {
      console.error("Failed to submit form:", error);
      toast({
        title: t("common.error"),
        description: error.message || t("form.submitError"),
        variant: "destructive",
      });
    },
  });
}
