const BASE_URL = "https://assignment.devotel.io";

export type FormField = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  dependsOn?: {
    field: string;
    value: string | boolean | number;
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  fields?: FormField[];
  apiEndpoint?: string;
  dependentField?: string;
};

export type FormStructure = {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
};

export type Application = {
  id: string;
  [key: string]: any;
};

export type ColumnDef = {
  id: string;
  label: string;
  accessorKey: string;
  sortable?: boolean;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: number;
};

export async function getFormStructure(): Promise<FormStructure> {
  const response = await fetch(`${BASE_URL}/api/insurance/forms`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch form structure");
  }

  return response.json();
}

export async function submitForm(formData: any): Promise<ApiResponse<any>> {
  const response = await fetch(`${BASE_URL}/api/insurance/forms/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to submit form");
  }

  return response.json();
}

export async function getSubmissions(): Promise<ApiResponse<Application[]>> {
  const response = await fetch(`${BASE_URL}/api/insurance/forms/submissions`, {
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  return response.json();
}

// Helper function to get dynamic options based on a dependent field
export async function getDynamicOptions(
  endpoint: string,
  dependentValue: string
): Promise<{ label: string; value: string }[]> {
  // In a real app, you would fetch from the actual endpoint
  // For demo purposes, we'll simulate API call with mock data

  // Mock data for states based on country
  const mockData: Record<string, { label: string; value: string }[]> = {
    USA: [
      { label: "California", value: "CA" },
      { label: "New York", value: "NY" },
      { label: "Texas", value: "TX" },
      { label: "Florida", value: "FL" },
    ],
    Canada: [
      { label: "Ontario", value: "ON" },
      { label: "Quebec", value: "QC" },
      { label: "British Columbia", value: "BC" },
    ],
    UK: [
      { label: "England", value: "ENG" },
      { label: "Scotland", value: "SCO" },
      { label: "Wales", value: "WLS" },
    ],
  };

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockData[dependentValue] || [];
}
