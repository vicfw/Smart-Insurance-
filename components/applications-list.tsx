"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, Loader2, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useApplications } from "@/hooks/use-applications";
import type { Application, ColumnDef } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n";

export function ApplicationsList() {
  const t = useTranslations();
  const { data: applications = [], isLoading, error } = useApplications();
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize columns from the first application
  useState(() => {
    if (applications.length > 0) {
      const firstApp = applications[0];
      const columnKeys = Object.keys(firstApp).filter((key) => key !== "id");

      const cols = columnKeys.map((key) => ({
        id: key,
        label: key.split(/(?=[A-Z])/).join(" "),
        accessorKey: key,
        sortable: true,
      }));

      setColumns(cols);
      setVisibleColumns(cols.map((col) => col.id));
    }
  });

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  const handleSort = (columnId: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === columnId) {
        return {
          key: columnId,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        key: columnId,
        direction: "asc",
      };
    });
  };

  const filteredApplications = applications.filter((app) => {
    return Object.values(app).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedApplications = sortConfig
    ? [...filteredApplications].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    : filteredApplications;

  // Pagination
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
  const paginatedApplications = sortedApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("common.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("common.error")}</AlertTitle>
        <AlertDescription>
          {t("applications.loadError")}
          <Button onClick={() => window.location.reload()} className="mt-4">
            {t("common.retry")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (applications.length === 0) {
    return (
      <Card className="p-4 md:p-6 text-center">
        <p className="text-muted-foreground">
          {t("applications.noApplications")}
        </p>
        <Link href="/apply">
          <Button className="mt-4">
            {t("applications.createApplication")}
          </Button>
        </Link>
      </Card>
    );
  }

  // Mobile card view for applications
  const MobileApplicationCard = ({
    application,
  }: {
    application: Application;
  }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        {columns
          .filter((column) => visibleColumns.includes(column.id))
          .map((column) => (
            <div
              key={`${application.id}-${column.id}`}
              className="py-2 border-b last:border-b-0"
            >
              <div className="font-medium text-sm text-muted-foreground">
                {column.label}
              </div>
              <div className="mt-1">
                {typeof application[column.accessorKey] === "object"
                  ? JSON.stringify(application[column.accessorKey])
                  : String(application[column.accessorKey] || "")}
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("applications.searchPlaceholder")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">
                {t("applications.columns")}
              </span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={visibleColumns.includes(column.id)}
                onCheckedChange={() => toggleColumnVisibility(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop table view */}
      <div className="rounded-md border hidden md:block">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {columns
                  .filter((column) => visibleColumns.includes(column.id))
                  .map((column) => (
                    <TableHead
                      key={column.id}
                      className={
                        column.sortable
                          ? "cursor-pointer whitespace-nowrap"
                          : "whitespace-nowrap"
                      }
                      onClick={() =>
                        column.sortable && handleSort(column.accessorKey)
                      }
                    >
                      <div className="flex items-center">
                        {column.label}
                        {sortConfig &&
                          sortConfig.key === column.accessorKey && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                      </div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApplications.length > 0 ? (
                paginatedApplications.map((application) => (
                  <TableRow key={application.id}>
                    {columns
                      .filter((column) => visibleColumns.includes(column.id))
                      .map((column) => (
                        <TableCell
                          key={`${application.id}-${column.id}`}
                          className="max-w-[200px] truncate"
                        >
                          {typeof application[column.accessorKey] === "object"
                            ? JSON.stringify(application[column.accessorKey])
                            : String(application[column.accessorKey] || "")}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="h-24 text-center"
                  >
                    {t("common.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden">
        {paginatedApplications.length > 0 ? (
          paginatedApplications.map((application) => (
            <MobileApplicationCard
              key={application.id}
              application={application}
            />
          ))
        ) : (
          <Card className="p-4 text-center">
            <p>{t("common.noResults")}</p>
          </Card>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Show fewer page numbers on mobile */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // On mobile, show only current page and adjacent pages
                if (window.innerWidth < 640) {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                }
                return true;
              })
              .map((page) => (
                <PaginationItem key={page} className="hidden sm:inline-block">
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {/* On mobile, just show current page indicator */}
            <PaginationItem className="sm:hidden">
              <span className="text-sm">
                {t("common.page")} {currentPage} {t("common.of")} {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
