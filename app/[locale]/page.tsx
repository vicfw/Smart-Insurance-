"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("home.title")}
        </h1>
        <p className="text-muted-foreground max-w-[600px] text-sm md:text-base">
          {t("home.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">
                {t("home.newApplication.title")}
              </CardTitle>
              <CardDescription>
                {t("home.newApplication.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-sm md:text-base">
                {t("home.newApplication.content")}
              </p>
            </CardContent>
            <CardFooter className="p-4 md:p-6">
              <Link href="/apply" className="w-full">
                <Button className="w-full">
                  {t("home.newApplication.button")}
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">
                {t("home.myApplications.title")}
              </CardTitle>
              <CardDescription>
                {t("home.myApplications.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="text-sm md:text-base">
                {t("home.myApplications.content")}
              </p>
            </CardContent>
            <CardFooter className="p-4 md:p-6">
              <Link href="/applications" className="w-full">
                <Button variant="outline" className="w-full">
                  {t("home.myApplications.button")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
