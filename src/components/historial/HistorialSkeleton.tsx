import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";

const HistorialSkeleton = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-8 w-20" />
            </TableHead>
            {[...Array(4)].map((_, index) => (
              <TableHead key={index}>
              <Skeleton className="h-6 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(4)].map((_, i) => (
            <TableRow key={i}>
              {[...Array(5)].map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistorialSkeleton;
