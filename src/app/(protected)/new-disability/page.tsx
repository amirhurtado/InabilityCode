"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";

import {
  validateDisabilityServer,
  saveDisabilityToFirestore,
} from "@/app/services/disability/client";
import { LoaderCircle } from "lucide-react";

import { DatePickerLabeled } from "@/components/DatePickerLabeled";

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

const additionalFieldsMap: Record<
  string,
  { name: keyof FormData; label: string }[]
> = {
  "Accidente de tránsito": [{ name: "furipsPDF", label: "FURIPS (PDF)" }],
  "Licencia de maternidad": [
    { name: "medicalCertPDF", label: "Certificado médico tratante (PDF)" },
  ],
  "Licencia de paternidad": [
    { name: "birthCertPDF", label: "Registro civil del hijo (PDF)" },
    { name: "liveBirthCertPDF", label: "Certificado de nacido vivo (PDF)" },
    { name: "motherIdPDF", label: "Cédula de la madre (PDF)" },
  ],
};

export default function NewDisability() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>();

  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const disabilityType = watch("type");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("observations", data.observations || "");

    const keys: (keyof FormData)[] = [
      "disabilityPDF",
      "furipsPDF",
      "medicalCertPDF",
      "birthCertPDF",
      "liveBirthCertPDF",
      "motherIdPDF",
    ];

    keys.forEach((key) => {
      const fileList = data[key];
      if (fileList && fileList.length > 0) {
        formData.append(key, fileList[0]);
      }
    });

    const result = await validateDisabilityServer(formData);

    if (!result.success && result.errors) {
      alert("Errores encontrados:\n" + result.errors.join("\n"));
      setIsLoading(false);
      return;
    }

    await saveDisabilityToFirestore({
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      observations: data.observations,
      pdfUrl: result.disabilityPDF!,
      furipsUrl: result.furipsPDF,
      medicalCertUrl: result.medicalCertPDF,
      birthCertUrl: result.birthCertPDF,
      liveBirthCertUrl: result.liveBirthCertPDF,
      motherIdUrl: result.motherIdPDF,
    });

    alert("Incapacidad enviada exitosamente.");
    setIsLoading(false);
    reset();
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
    >
      <h1>
                <span className="text-[.9rem]">
                  <Typewriter
                    words={["Diligencia una nueva incapacidad"]}
                    loop={1}
                    cursor
                    cursorStyle="_"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1000}
                  />
                </span>
              </h1>
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
        {errors.type && (
          <p className="text-red-500 text-sm">Este campo es obligatorio.</p>
        )}
      </div>

      {/* Fechas */}
      <div className="flex gap-6">
        <DatePickerLabeled
          label="Fecha de inicio"
          value={watch("startDate")}
          onChange={(val) => setValue("startDate", val)}
        />
        <DatePickerLabeled
          label="Fecha de fin"
          value={watch("endDate")}
          onChange={(val) => setValue("endDate", val)}
        />
      </div>
      {errors.startDate && (
        <p className="text-red-500 text-sm">Campo obligatorio.</p>
      )}
      {errors.endDate && (
        <p className="text-red-500 text-sm">Campo obligatorio.</p>
      )}

      {/* Observaciones */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-500">Observaciones</label>
        <Textarea
          {...register("observations")}
          placeholder="Detalles adicionales (opcional)"
        />
      </div>

      {/* PDF principal */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-500">
          Certificado de incapacidad (PDF)
        </label>
        <Input
          type="file"
          accept="application/pdf"
          {...register("disabilityPDF", { required: true })}
        />
        {errors.disabilityPDF && (
          <p className="text-red-500 text-sm">Este PDF es requerido.</p>
        )}
      </div>

      {/* Archivos adicionales dinámicos */}
      {additionalFieldsMap[disabilityType]?.map(({ name, label }) => (
        <div className="flex flex-col gap-3" key={name}>
          <label className="text-sm text-slate-500">{label}</label>
          <Input
            type="file"
            accept="application/pdf"
            {...register(name, { required: true })}
          />
          {errors[name] && (
            <p className="text-red-500 text-sm">Este PDF es requerido.</p>
          )}
        </div>
      ))}

      {/* Botones */}
      <div className="flex gap-4 mt-8">
        <Button type="submit" className="w-[12rem]">
          {isLoading ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : (
            <span>Enviar incapacidad</span>
          )}
        </Button>
        {!isLoading && (
          <Button type="button" className="w-[12rem]" variant="destructive">
            <Link href="/dashboard">Cancelar</Link>
          </Button>
        )}
      </div>
    </form>
  );
}
