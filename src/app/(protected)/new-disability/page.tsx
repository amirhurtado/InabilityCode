"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import Link from "next/link";

interface FormData {
  type: string;
  startDate: string;
  endDate: string;
  observations: string;
  disabilityPDF: FileList;
  furipsPDF?: FileList;
  medicalCertPDF?: FileList;
  birthCertPDF?: FileList;
  liveBirthCertPDF?: FileList;
  motherIdPDF?: FileList;
}

export default function NewDisability() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const disabilityType = watch("type");

  const onSubmit = async (data: FormData) => {
    const pdfFile = data.disabilityPDF?.[0];
    if (!pdfFile) {
      alert("Debe adjuntar el archivo de incapacidad.");
      return;
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Buffer listo para validar PDF", buffer);
    console.log({
      type: data.type,
      dates: {
        start: data.startDate,
        end: data.endDate,
      },
      observations: data.observations,
      file: data.disabilityPDF?.[0],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* Tipo de incapacidad */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-500">Tipo de incapacidad</label>
        <select
          {...register("type", { required: true })}
          className="text-sm block w-[12rem] border rounded p-2 pr-4"
        >
          <option value="">Seleccione tipo...</option>
          <option value="Enfermedad general">Enfermedad general</option>
          <option value="Accidente laboral">Accidente laboral</option>
          <option value="Accidente de tránsito">Accidente de tránsito</option>
          <option value="Licencia de maternidad">Licencia de maternidad</option>
          <option value="Licencia de paternidad">Licencia de paternidad</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-500">Fecha de inicio</label>
          <Input type="date" {...register("startDate", { required: true })} />
          {errors.startDate && <p className="text-red-500 text-sm">Campo obligatorio.</p>}
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-500">Fecha de fin</label>
          <Input type="date" {...register("endDate", { required: true })} />
          {errors.endDate && <p className="text-red-500 text-sm">Campo obligatorio.</p>}
        </div>
      </div>

      {/* Observaciones */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-500">Observaciones</label>
        <Textarea {...register("observations")} placeholder="Detalles adicionales (opcional)" />
      </div>

      {/* PDF principal */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-500">Certificado de incapacidad (PDF)</label>
        <Input type="file" accept="application/pdf" {...register("disabilityPDF", { required: true })} />
        {errors.disabilityPDF && <p className="text-red-500 text-sm">Este PDF es requerido.</p>}
      </div>

      {/* Archivos adicionales por tipo */}
      {disabilityType === "Accidente de tránsito" && (
        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-500">FURIPS (PDF)</label>
          <Input type="file" accept="application/pdf" {...register("furipsPDF", { required: true })} />
        </div>
      )}

      {disabilityType === "Licencia de maternidad" && (
        <div className="flex flex-col gap-3">
          <label className="text-sm text-slate-500">Certificado médico tratante (PDF)</label>
          <Input type="file" accept="application/pdf" {...register("medicalCertPDF", { required: true })} />
        </div>
      )}

      {disabilityType === "Licencia de paternidad" && (
        <>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-500">Registro civil del hijo (PDF)</label>
            <Input type="file" accept="application/pdf" {...register("birthCertPDF", { required: true })} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-500">Certificado de nacido vivo (PDF)</label>
            <Input type="file" accept="application/pdf" {...register("liveBirthCertPDF", { required: true })} />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-slate-500">Cédula de la madre (PDF)</label>
            <Input type="file" accept="application/pdf" {...register("motherIdPDF", { required: true })} />
          </div>
        </>
      )}

      {/* Botones */}
      <div className="flex gap-4 mt-8">
        <Button type="submit" className="w-[12rem]">Guardar Incapacidad</Button>
        <Button type="button" className="w-[12rem]" variant="destructive">
          <Link href={'/dashboard'}>Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
