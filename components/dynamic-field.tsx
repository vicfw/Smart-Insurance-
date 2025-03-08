"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormField as FormFieldType } from "@/lib/api";
import { useDynamicOptions } from "@/hooks/use-dynamic-options";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface DynamicFieldProps {
  field: FormFieldType;
  form: UseFormReturn<any>;
  watchedValues: any;
  parentField?: string;
}

export function DynamicField({
  field,
  form,
  watchedValues,
  parentField,
}: DynamicFieldProps) {
  const t = useTranslations();
  const locale = useLocale();
  const fieldName = parentField ? `${parentField}.${field.id}` : field.id;

  // Get dependent field value if this field has a dependency
  const dependentValue = field.dependentField
    ? form.watch(field.dependentField)
    : undefined;

  // Fetch dynamic options if apiEndpoint is provided
  const { data: dynamicOptions, isLoading: isLoadingOptions } =
    useDynamicOptions(
      field.apiEndpoint,
      dependentValue,
      !!field.dependentField ? !!dependentValue : true
    );

  const shouldShowField = (fieldToCheck: FormFieldType): boolean => {
    if (!fieldToCheck.dependsOn) return true;

    const { dependsOn } = fieldToCheck;
    const dependentFieldName = parentField
      ? `${parentField}.${dependsOn.field}`
      : dependsOn.field;

    const dependentValue = form.watch(dependentFieldName);
    return dependentValue === dependsOn.value;
  };

  if (!shouldShowField(field)) {
    return null;
  }

  if (field.type === "group" && field.fields) {
    return (
      <Card className="border border-muted">
        <CardContent className="p-4 md:p-6">
          <div className="font-medium text-lg mb-4">{field.label}</div>
          <div className="space-y-4">
            {field.fields.map(
              (subField) =>
                shouldShowField(subField) && (
                  <DynamicField
                    key={subField.id}
                    field={subField}
                    form={form}
                    watchedValues={watchedValues}
                    parentField={fieldName}
                  />
                )
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: formField }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm md:text-base">
            {field.label}
            {field.required ? ` * (${t("common.required")})` : ""}
          </FormLabel>
          <FormControl>
            {field.type === "text" && (
              <Input
                {...formField}
                placeholder={field.placeholder}
                type="text"
                className="h-10 md:h-11 text-sm md:text-base"
              />
            )}

            {field.type === "email" && (
              <Input
                {...formField}
                placeholder={field.placeholder}
                type="email"
                className="h-10 md:h-11 text-sm md:text-base"
              />
            )}

            {field.type === "number" && (
              <Input
                {...formField}
                placeholder={field.placeholder}
                type="number"
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  formField.onChange(value === "" ? undefined : value);
                }}
                value={formField.value === undefined ? "" : formField.value}
                className="h-10 md:h-11 text-sm md:text-base"
              />
            )}

            {field.type === "textarea" && (
              <Textarea
                {...formField}
                placeholder={field.placeholder}
                className="min-h-[80px] text-sm md:text-base"
              />
            )}

            {field.type === "select" && (
              <Select
                onValueChange={formField.onChange}
                defaultValue={formField.value}
                value={formField.value}
              >
                <SelectTrigger className="h-10 md:h-11 text-sm md:text-base">
                  {isLoadingOptions ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <SelectValue
                      placeholder={field.placeholder || t("common.select")}
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {(field.apiEndpoint ? dynamicOptions : field.options)?.map(
                    (option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-sm md:text-base"
                      >
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            )}

            {field.type === "checkbox" && (
              <div className="flex items-center space-x-2 h-10 pl-1">
                <Checkbox
                  id={fieldName}
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  className="h-5 w-5 md:h-6 md:w-6"
                />
                <label
                  htmlFor={fieldName}
                  className="text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.placeholder || "Yes"}
                </label>
              </div>
            )}

            {field.type === "radio" && (
              <RadioGroup
                onValueChange={formField.onChange}
                defaultValue={formField.value}
                className="flex flex-col space-y-2"
              >
                {field.options?.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${fieldName}-${option.value}`}
                      className="h-5 w-5 md:h-6 md:w-6"
                    />
                    <Label
                      htmlFor={`${fieldName}-${option.value}`}
                      className="text-sm md:text-base"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </FormControl>
          <FormMessage className="text-xs md:text-sm" />
        </FormItem>
      )}
    />
  );
}
