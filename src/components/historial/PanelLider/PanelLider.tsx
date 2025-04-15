"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../../../../lib/firebase";

import { formatDate } from "@/lib/utils";
import { getUserInfo } from "@/app/services/disability/client";
import HistorialSkeleton from "@/components/historial/HistorialSkeleton";
import { Table2 } from "lucide-react";
import AssignReplacementButton from "./AssignReplacementButton";
import DisabilityLiderTable from "./DisabilyLiderTable";
import AssignedInfoIcon from "./AssignedInfoIcon";
import HistorialFilters from "../HistorialFilters";

export default function PanelLider() {
  const [data, setData] = useState<DisabilityProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replacedDisabilityIds, setReplacedDisabilityIds] = useState<string[]>(
    []
  );
  const [replacements, setReplacements] = useState<Record<string, string>>({});

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReplacements = async () => {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "reemplazos"));

    const map: Record<string, string> = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      map[data.disabilityId] = data.replacementEmail;
    });

    setReplacements(map);
    const ids = Object.keys(map);
    setReplacedDisabilityIds(ids);
  };

  const handleAssignedReplacement = (
    disabilityId: string,
    replacementEmail: string
  ) => {
    setReplacements((prev) => ({
      ...prev,
      [disabilityId]: replacementEmail,
    }));
    setReplacedDisabilityIds((prev) => [...prev, disabilityId]);
  };

  const columns: ColumnDef<DisabilityProps>[] = [
    {
      accessorKey: "email",
      header: "Correo",
      cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
    },
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
      id: "acciones",
      header: "Acción",
      cell: ({ row }) => {
        const id = row.original.id;
        const disabled = replacedDisabilityIds.includes(id);

        return (
          <AssignReplacementButton
            userEmail={row.original.email!}
            startDate={row.original.startDate}
            endDate={row.original.endDate}
            disabilityId={id}
            disabled={disabled}
            onAssigned={handleAssignedReplacement}
          />
        );
      },
    },
    {
      id: "reemplazoInfo",
      header: () => null,
      cell: ({ row }) => {
        const disabilityId = row.original.id;
        const replacementEmail = replacements[disabilityId];
        if (!replacementEmail) return null;
        return <AssignedInfoIcon email={replacementEmail} />;
      },
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
        fetchReplacements();
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
          status: d.status,
        };
      })
    );
    const transcritas = solicitudes.filter(
      (item) => item.status === "transcrita" || item.status === "pagada"
    );
    setData(transcritas);
    setIsLoading(false);
  };

  const filteredData = data.filter((item) => {
    const matchSearch = item.email
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const itemStartDate = new Date(item.startDate);
    const matchStart =
      !startDate || itemStartDate >= new Date(startDate + "T00:00");
    const matchEnd = !endDate || itemStartDate <= new Date(endDate + "T23:59");
    return matchSearch && matchStart && matchEnd;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
  });

  return (
    <div className="w-full mt-6">
      {isLoading ? (
        <HistorialSkeleton />
      ) : (
        <>
          <div className="flex flex-col gap-5 mb-10">
            <div className="flex items-center gap-2 text-slate-500">
              <Table2 size={24} />
              <h2 className="text-lg font-semibold text-primary">
                Asignación de reemplazos
              </h2>
            </div>

            <HistorialFilters
              isLider={true}
              isAdmin={true}
              search={search}
              onSearchChange={setSearch}
              allStatuses={[]}
              selectedStatuses={[]}
              onToggleStatus={() => {}}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          <div className="rounded-md border ">
            <DisabilityLiderTable
              table={table}
              columns={columns}
              emptyMessage="No hay incapacidades transcritas."
            />
          </div>
        </>
      )}
    </div>
  );
}
