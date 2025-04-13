"use client";

import Link from "next/link";

import LogForm from "@/components/LogForm";
import ImageForm from "@/components/ImageForm";


const LogIn = () => {

  return (
    <div className="flex w-full h-full justify-center gap-15 ">
       <ImageForm />
      <div className="w-1/3 flex flex-col justify-center gap-15 p-3 ">
        <h1 className="text-3xl">Inicia Sesion</h1>

        <LogForm type="signin" />

        <h3 className="text-md text-slate-500 text-end">
          ¿No tienes cuenta? <Link className="text-primary" href={'/register'}>Registrate </Link>
        </h3>
      </div>
    </div>
  );
};

export default LogIn;
