// app/(routes)/dashboard/components/consultation-table.tsx
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconClock, IconCalendar, IconFileReport } from "@tabler/icons-react";
import moment from "moment";

export interface Consultation {
  id: string;
  sessionId: string;
  doctor: string;
  specialty: string;
  timestamp: string;
  chiefComplaint: string;
}

interface ConsultationTableProps {
  consultations: Consultation[];
}

export function ConsultationTable({ consultations }: ConsultationTableProps) {
  const columns: ColumnDef<Consultation>[] = [
    {
      accessorKey: "doctor",
      header: "Doctor",
      cell: ({ row }) => (
        <div className="flex flex-col min-w-[150px]">
          <span className="font-medium text-sm">{row.getValue("doctor")}</span>
          <span className="text-xs text-gray-500">{row.original.specialty}</span>
        </div>
      ),
    },
    {
      accessorKey: "chiefComplaint",
      header: "Chief Complaint",
      cell: ({ row }) => (
        <div className="max-w-[250px] min-w-[200px]">
          <span className="text-sm line-clamp-2">{row.getValue("chiefComplaint")}</span>
        </div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp") as string;
        return (
          <div className="flex items-center gap-2 text-sm min-w-[120px]">
            <IconClock className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">
              {moment(timestamp).fromNow()}
            </span>
          </div>
        );
      },
    },
    {
      id: "report",
      header: "Report",
      cell: ({ row }) => (
        <div className="flex justify-end min-w-[100px]">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
            onClick={() => console.log("Show report for:", row.original.sessionId)}
          >
            <IconFileReport className="h-4 w-4" />
            Show
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: consultations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-neutral-900 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <IconCalendar className="h-8 w-8 mb-2" />
                    <p>No consultations found.</p>
                    <p className="text-sm">Your consultation history will appear here.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}