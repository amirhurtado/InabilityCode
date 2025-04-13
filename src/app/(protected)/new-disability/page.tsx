"use client";

import { useState } from "react";
import { Input} from "@/components/Input"; 
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import Link from "next/link";

export default function NewDisability() {
  const [type, setType] = useState<string>("");

  const disabilityTypes = [
    "Enfermedad general",
    "Accidente laboral",
    "Accidente de tránsito",
    "Licencia de maternidad",
    "Licencia de paternidad",
  ];

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  return (
    <form 
      action="/colaborador/incapacidades/nueva" 
      method="POST" 
      encType="multipart/form-data" 
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <label className="text-sm  text-slate-500">Tipo de incapacidad</label>
        <select 
          name="tipo" 
          value={type} 
          onChange={handleChangeType} 
          required 
          className=" text-sm block w-[12rem] border rounded p-2 pr-4"
        >
          <option value="" disabled className="" >Seleccione tipo...</option>
          {disabilityTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm  text-slate-500">Fecha de inicio</label>
          <Input type="date" name="fechaInicio" required />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm  text-slate-500">Fecha de fin</label>
          <Input type="date" name="fechaFin" required />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm  text-slate-500">Observaciones</label>
        <Textarea name="observaciones" placeholder="Detalles adicionales (opcional)" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm  text-slate-500">Incapacidad (PDF)</label>
        <Input type="file" name="incapacidadPDF" accept="application/pdf" required />
      </div>

      {type === "Accidente de tránsito" && (
        <div className="flex flex-col gap-3">
          <label className="text-sm  text-slate-500">Formato FURIPS (PDF)</label>
          <Input type="file" name="furipsPDF" accept="application/pdf" required />
        </div>
      )}

      {type === "Licencia de maternidad" && (
        <div    className="flex flex-col gap-3">
          <label className="text-sm  text-slate-500">Certificado médico tratante (PDF)</label>
          <Input type="file" name="certMedPDF" accept="application/pdf" required />
        </div>
      )}


      <div className="flex gap-4 mt-8">
        <Button type="submit" className="w-[12rem] ">Guardar Incapacidad</Button>
        <Button type="button" className="w-[12rem]" variant='destructive'>
            <Link href={'/dashboard'}>
                Cancelar
            </Link>
        </Button>
      </div>
    </form>
  );
}
