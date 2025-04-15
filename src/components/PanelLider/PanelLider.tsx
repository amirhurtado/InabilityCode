"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../../../lib/firebase";

import { formatDate } from "@/lib/utils";
import { getUserInfo } from "@/app/services/disability/client";
import HistorialSkeleton from "@/components/historial/HistorialSkeleton";
import { Table2 } from "lucide-react";
import AssignReplacementButton from "./AssignReplacementButton";
import DisabilityLiderTable from "./DisabilyLiderTable";

export default function PanelLider() {
  const [data, setData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replacedDisabilityIds, setReplacedDisabilityIds] = useState<string[]>(
    []
  );

  const handleReplacementAssigned = (id: string) => {
    setReplacedDisabilityIds((prev) => [...prev, id]);
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
        <span className="text-sm">{formatDate(row.original.startDate)}</span>
      ),
    },
    {
      accessorKey: "endDate",
      header: "Fin",
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.original.endDate)}</span>
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
            userId={row.original.userId}
            startDate={row.original.startDate}
            endDate={row.original.endDate}
            disabilityId={id}
            disabled={disabled}
            onAssigned={handleReplacementAssigned}
          />
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
          status: d.status,
        };
      })
    );

    const transcritas = solicitudes.filter(
      (item) => item.status === "transcrita" || item.status === "pagada"
    );
    setData(transcritas);

    // Obtener ids de discapacidades ya reemplazadas
    const reemplazosSnap = await getDocs(collection(db, "reemplazos"));
    const ids = reemplazosSnap.docs.map((doc) => doc.data().disabilityId);
    setReplacedDisabilityIds(ids);

    setIsLoading(false);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full mt-6">
      {isLoading ? (
        <HistorialSkeleton />
      ) : (
        <>
          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <Table2 size={24} />
            <h2 className="text-lg font-semibold text-primary">
              Asignación de reemplazos
            </h2>
          </div>

          <div className="rounded-md border">
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
