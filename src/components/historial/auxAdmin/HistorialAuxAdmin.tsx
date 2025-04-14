"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import HistorialTableAuxAdmin from "../HistorialTable";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../../../../lib/firebase";

import { formatDate } from "@/lib/utils";
import HistorialSkeleton from "../HistorialSkeleton";
import { Table2 } from "lucide-react";

import { getUserInfo } from "@/app/services/disability/client";

import { StatusSelectCell } from "./StatusSelectCell";
import IncapacityFilesCell from "../IncapacityFilesCell";
import HistorialFilters from "../HistorialFilters";

export default function HistorialGlobalAuxAdmin() {
  const [data, setData] = useState<DisabilityProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const columns: ColumnDef<DisabilityProps>[] = [
    {
      accessorKey: "username",
      header: "Colaborador",
      cell: ({ row }) => (
        <span className=" text-sm">{row.original.email || "Sin info"}</span>
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
          return (
            <span className="text-sm text-muted-foreground">
              Sin documentos
            </span>
          );

        return <IncapacityFilesCell files={files} />;
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

  const filteredData = data.filter((item) => {
    const matchStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
    const matchSearch = item.email
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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

            <HistorialFilters
              search={search}
              onSearchChange={setSearch}
              allStatuses={allStatuses}
              selectedStatuses={selectedStatuses}
              onToggleStatus={(status) => {
                setSelectedStatuses((prev) =>
                  prev.includes(status)
                    ? prev.filter((s) => s !== status)
                    : [...prev, status]
                );
              }}
            />
          </div>

          <div className="rounded-md border">
            <HistorialTableAuxAdmin table={table} columns={columns} />
          </div>
        </div>
      )}
    </div>
  );
}
