"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../../../lib/firebase";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/HoverCard";
import { formatDate } from "@/lib/utils";
import { Button } from "../Button";
import HistorialSkeleton from "./HistorialSkeleton";
import { ListFilter, Table2 } from "lucide-react";

import { getLabelFromKey } from "@/lib/utils";
import { getUserInfo } from "@/app/services/disability/client";

import { StatusSelectCell } from "./StatusSelectCell";

export default function HistorialGlobalAuxAdmin() {
  const [data, setData] = useState<DisabilityProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const columns: ColumnDef<DisabilityProps>[] = [
    {
      accessorKey: "username",
      header: "Colaborador",
      cell: ({ row }) => (
        <span className=" text-sm">
          {row.original.email || "Sin info"}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "startDate",
      header: "Inicio",
      cell: ({ row }) => formatDate(row.getValue("startDate")),
    },
    {
      accessorKey: "endDate",
      header: "Fin",
      cell: ({ row }) => formatDate(row.getValue("endDate")),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <StatusSelectCell
          id={row.original.id}
          currentStatus={row.original.status}
          onStatusChange={(newStatus) => {
            const updated = [...data];
            const idx = updated.findIndex((i) => i.id === row.original.id);
            if (idx !== -1) {
              updated[idx].status = newStatus;
              setData(updated); 
            }
          }}
        />
      ),
    },
    
    
    {
      accessorKey: "files",
      header: "Documentos",
      cell: ({ row }) => {
        const files = row.original.files;
        if (!files)
          return <span className="text-sm text-muted-foreground">Sin documentos</span>;
  
        return (
          <div className="flex flex-col gap-2">
            {Object.entries(files).map(([key, url]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground capitalize w-[10rem]">
                  {getLabelFromKey(key)}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="link"
                      className="text-sm text-primary hover:underline p-0 h-auto"
                    >
                      Ver PDF
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[400px] h-[300px] p-0">
                    <iframe src={url} width="100%" height="100%" />
                  </HoverCardContent>
                </HoverCard>
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "incapacidades"));

    const solicitudes = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const d = docSnap.data();
        const userInfo = await getUserInfo(d.userId);

        return {
          id: docSnap.id,
          userId: d.userId,
          username: userInfo?.username,
          email: userInfo?.email,
          type: d.type,
          startDate: d.startDate,
          endDate: d.endDate,
          observations: d.observations,
          status: d.status,
          files: d.files,
        };
      })
    );

    setData(solicitudes);
    setIsLoading(false);
  };

  const filteredData = selectedStatuses.length
    ? data.filter((item) => selectedStatuses.includes(item.status))
    : data;

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
  });

  const allStatuses = Array.from(new Set(data.map((d) => d.status)));

  return (
    <div className="w-full mt-6">
      {isLoading ? (
        <HistorialSkeleton />
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Table2 size={24} />
              <h2 className="text-lg font-semibold text-primary">
                Historial global de incapacidades
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 items-center ">
              <div className="flex items-center gap-2 mr-4">
              <ListFilter />
              <p>Filtrar por estado:</p>
              </div>
              {allStatuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatuses.includes(status) ? "default" : "outline"}
                  onClick={() => {
                    setSelectedStatuses((prev) =>
                      prev.includes(status)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status]
                    );
                  }}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-md uppercase text-primary"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center text-slate-500 py-10"
                    >
                      No se encontraron registros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
