"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/HoverCard";
import { Button } from "../Button";


const columns: ColumnDef<Incapacidad>[] = [
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "startDate",
    header: "Inicio",
  },
  {
    accessorKey: "endDate",
    header: "Fin",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const value = row.getValue("status") as string;
      return <span className="text-slate-500">{value === "pending" ? "Pendiente" : value}</span>;
    },
  },
  {
    accessorKey: "pdfUrl",
    header: "PDF",
    cell: ({ row }) => {
      const url = row.original.pdfUrl;
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-primary hover:underline text-sm">
              Ver PDF
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-[400px] h-[300px] p-0">
            <iframe src={url} width="100%" height="100%" />
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];

export default function Historial() {
  const [data, setData] = useState<Incapacidad[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      console.log("User:", user);
      if (!user) return;
      console.log("Fetching data for user:", user.uid);

      const db = getFirestore();
      const q = query(collection(db, "incapacidades"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const docs = querySnapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          type: d.type,
          startDate: d.startDate,
          endDate: d.endDate,
          observations: d.observations,
          pdfUrl: d.pdfUrl,
          status: d.status,
        };
      });

      setData(docs);
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-slate-500 py-10">
                  No se encontraron registros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
