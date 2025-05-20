"use client";
import Link from "next/link";

import LogForm from "@/components/LogForm";
import ImageForm from "@/components/ImageForm";
import { Key } from "lucide-react";

const Register = () => {

  return (
    <div className="flex w-full h-full items-center justify-center gap-15 ">
      <div className="w-1/3 flex flex-col justify-center gap-15 p-3 ">
       <div className="flex items-center gap-3">
        <Key size={24} strokeWidth={1.8} />
         <h1 className="text-3xl">Regístrate.</h1>
       </div>
       

        <LogForm type="register"  />

        <h3 className="text-md text-slate-500 text-end">
          ¿Ya tienes cuenta? <Link className="text-primary" href={'/login'}>Inicia sesion</Link>
        </h3>
      </div>
      <ImageForm />
    </div>
  );
};

export default Register;
