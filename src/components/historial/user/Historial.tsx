"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../../lib/firebase";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { formatDate } from "@/lib/utils";
import HistorialSkeleton from "../HistorialSkeleton";
import { Table2 } from "lucide-react";
import IncapacityFilesCell from "../IncapacityFilesCell";
import DisabilityStatusCell from "./DisabilityStatusCell";
import HistorialTableUser from "../HistorialTable";
import HistorialFilters from "../HistorialFilters";
import ObservationInfoIcon from "../auxAdmin/ObservationInfoIcon";

interface Incapacidad {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  observations: string;
  status: string;
  files?: Record<string, string>;
  observacionRechazo?: string;
}

const columns: ColumnDef<Incapacidad>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "startDate",
    header: "Inicio",
    cell: ({ row }) => (
      <span className="text-[.8rem] text-muted-foreground">
        {formatDate(row.getValue("startDate"))}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Fin",
    cell: ({ row }) => (
      <span className="text-[.8rem] text-muted-foreground">
        {formatDate(row.getValue("endDate"))}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <DisabilityStatusCell
        status={row.getValue("status")}
        motivo={row.original.observacionRechazo}
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
          <span className="text-sm text-muted-foreground">Sin documentos</span>
        );

      return <IncapacityFilesCell files={files} />;
    },
  },
  {
        id: "observaciones",
        header: () => <span className="sr-only">Obs</span>,
        cell: ({ row }) => {
          const obs = row.original.observations;
          if (!obs) return null;
    
          return <ObservationInfoIcon observation={obs} />;
        },
      },
];

export default function Historial() {
  const [data, setData] = useState<Incapacidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        const q = query(
          collection(db, "incapacidades"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const docs = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            type: d.type,
            startDate: d.startDate,
            endDate: d.endDate,
            observations: d.observations,
            status: d.status,
            files: d.files,
            observacionRechazo: d.observacionRechazo,
          };
        });

        setData(docs);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);
    const matchesStartDate = !startDate || item.startDate >= startDate;
    const matchesEndDate = !endDate || item.endDate <= endDate;

    return matchesStatus && matchesStartDate && matchesEndDate;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,

  });

  const allStatuses = Array.from(new Set(data.map((d) => d.status)));

  return (
    <div className="w-full mt-6">
      {isLoading ? (
        <HistorialSkeleton />
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex gap-2 text-slate-500">
            <Table2 size={24} />
            <h2 className="text-lg">
              Historial de incapacidades
            </h2>
          </div>

          <HistorialFilters
            isAdmin={false}
            search=""
            onSearchChange={() => {}}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            allStatuses={allStatuses}
            selectedStatuses={selectedStatuses}
            onToggleStatus={(status) =>
              setSelectedStatuses((prev) =>
                prev.includes(status)
                  ? prev.filter((s) => s !== status)
                  : [...prev, status]
              )
            }
          />

          <div className="rounded-md border">
            <HistorialTableUser table={table} columns={columns} />
          </div>
        </div>
      )}
    </div>
  );
}
