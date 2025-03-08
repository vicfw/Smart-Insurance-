"use client";

import { useQuery } from "@tanstack/react-query";
import { getDynamicOptions } from "@/lib/api";

export function useDynamicOptions(
  endpoint: string | undefined,
  dependentValue: string | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: ["dynamicOptions", endpoint, dependentValue],
    queryFn: () => getDynamicOptions(endpoint || "", dependentValue || ""),
    enabled: !!endpoint && !!dependentValue && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
