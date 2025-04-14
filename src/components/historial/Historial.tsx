"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/HoverCard";
import { formatDate } from "@/lib/utils";
import { Button } from "../Button";
import HistorialSkeleton from "./HistorialSkeleton";
import { Table2 } from "lucide-react";

interface Incapacidad {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  observations: string;
  status: string;
  files?: Record<string, string>;
}

function getLabel(key: string) {
  const labels: Record<string, string> = {
    disabilityPDF: "Certificado de incapacidad",
    furipsPDF: "FURIPS",
    medicalCertPDF: "Certificado médico tratante",
    birthCertPDF: "Registro civil de nacimiento",
    liveBirthCertPDF: "Certificado de nacido vivo",
    motherIdPDF: "Cédula de la madre",
  };
  return labels[key] || key;
}

const columns: ColumnDef<Incapacidad>[] = [
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
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      return (
        <span className="text-slate-500">
          {value === "pending" ? "Pendiente" : value}
        </span>
      );
    },
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

      return (
        <div className="flex flex-col gap-2">
          {Object.entries(files).map(([key, url]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground capitalize w-[10rem]">
                {getLabel(key)}
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

export default function Historial() {
  const [data, setData] = useState<Incapacidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

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
        };
      });

      setData(docs);
      setIsLoading(false);
    };

    fetchData();
  }, []);

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
        <div className="flex flex-col gap-8">
          <div className="flex gap-2 text-slate-500">
            <Table2 size={24} />
            <h2 className="text-lg ">
            Historial de incapacidades de <span className="italic underline">{user?.email}</span> 
          </h2>

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
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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
