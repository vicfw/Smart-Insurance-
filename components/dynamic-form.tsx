"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DynamicField } from "./dynamic-field";
import { useFormStructure, useFormSchema } from "@/hooks/use-from-structure";
import { useSubmitApplication } from "@/hooks/use-applications";
import { useFormDraft } from "@/hooks/use-form-draft";
import type { FormStructure } from "@/lib/api";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function DynamicForm() {
  const t = useTranslations();
  const { data: formStructure, isLoading, error } = useFormStructure();
  const formSchema = useFormSchema(formStructure);
  const { mutate: submitApplication, isPending: isSubmitting } =
    useSubmitApplication();

  const form = useForm<any>({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
    defaultValues: {},
    mode: "onChange",
  });

  const { clearDraft, saveDraft } = useFormDraft(form);
  const watchedValues = form.watch();

  const shouldShowField = (field: FormStructure["fields"][0]): boolean => {
    if (!field.dependsOn) return true;

    const { dependsOn } = field;
    const dependentValue = form.watch(dependsOn.field);

    return dependentValue === dependsOn.value;
  };

  const onSubmit = (data: any) => {
    submitApplication(data);
    // Clear draft after successful submission
    localStorage.removeItem("formDraft");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("common.loading")}</span>
      </div>
    );
  }

  if (error || !formStructure) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("common.error")}</AlertTitle>
        <AlertDescription>
          {t("form.loadError")}
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 ml-2"
          >
            {t("common.retry")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>
            {t("form.renderError")}
            <Button onClick={() => window.location.reload()} className="mt-4">
              {t("common.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      }
    >
      <Card>
        <CardContent className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {formStructure.fields.map(
                  (field) =>
                    shouldShowField(field) && (
                      <DynamicField
                        key={field.id}
                        field={field}
                        form={form}
                        watchedValues={watchedValues}
                      />
                    )
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveDraft}
                  className="w-full sm:w-auto"
                >
                  {t("apply.saveDraft")}
                </Button>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearDraft}
                    className="w-full sm:w-auto"
                  >
                    {t("apply.clearForm")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("apply.submitting")}
                      </>
                    ) : (
                      t("apply.submitApplication")
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
