"use client";

import { useQuery } from "@tanstack/react-query";
import { getFormStructure, type FormStructure } from "@/lib/api";
import { z } from "zod";

export function useFormStructure() {
  return useQuery({
    queryKey: ["formStructure"],
    queryFn: getFormStructure,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFormSchema(formStructure: FormStructure | undefined) {
  if (!formStructure) return null;

  const schemaFields: Record<string, any> = {};

  const buildSchemaForFields = (fields: FormStructure["fields"]) => {
    fields.forEach((field) => {
      let fieldSchema: any;

      if (field.type === "text" || field.type === "email") {
        fieldSchema = z.string();
        if (field.required)
          fieldSchema = fieldSchema.min(1, {
            message: `${field.label} is required`,
          });
        if (field.type === "email")
          fieldSchema = fieldSchema.email({ message: "Invalid email address" });
        if (field.validation?.pattern) {
          const regex = new RegExp(field.validation.pattern);
          fieldSchema = fieldSchema.regex(regex, {
            message:
              field.validation.message || `Invalid format for ${field.label}`,
          });
        }
      } else if (field.type === "number") {
        fieldSchema = z.preprocess(
          (val) => (val === "" ? undefined : Number(val)),
          z.number({
            invalid_type_error: `${field.label} must be a number`,
          })
        );
        if (field.validation?.min !== undefined) {
          fieldSchema = fieldSchema.min(field.validation.min, {
            message: `${field.label} must be at least ${field.validation.min}`,
          });
        }
        if (field.validation?.max !== undefined) {
          fieldSchema = fieldSchema.max(field.validation.max, {
            message: `${field.label} must be at most ${field.validation.max}`,
          });
        }
      } else if (field.type === "select") {
        fieldSchema = z.string();
        if (field.required)
          fieldSchema = fieldSchema.min(1, {
            message: `${field.label} is required`,
          });
      } else if (field.type === "checkbox") {
        fieldSchema = z.boolean().optional();
      } else if (field.type === "radio") {
        fieldSchema = z.string();
        if (field.required)
          fieldSchema = fieldSchema.min(1, {
            message: `${field.label} is required`,
          });
      } else if (field.type === "group" && field.fields) {
        const groupSchemaFields: Record<string, any> = {};
        buildSchemaForFields(field.fields);
        field.fields.forEach((subField) => {
          groupSchemaFields[subField.id] = schemaFields[subField.id];
          delete schemaFields[subField.id];
        });
        fieldSchema = z.object(groupSchemaFields);
      } else {
        fieldSchema = z.any();
      }

      if (!field.required && field.type !== "checkbox") {
        fieldSchema = fieldSchema.optional();
      }

      schemaFields[field.id] = fieldSchema;
    });
  };

  buildSchemaForFields(formStructure.fields);
  return z.object(schemaFields);
}
