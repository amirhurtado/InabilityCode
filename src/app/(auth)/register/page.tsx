"use client";

import Image from "next/image";
import Link from "next/link";

import LogForm from "@/components/LogForm";

const Register = () => {

  return (
    <div className="flex w-full h-full justify-center gap-12 ">
      <div className="w-1/3 flex flex-col justify-end gap-10 p-3 ">
        <h1 className="text-3xl">Registrate</h1>

        <LogForm type="register"  />

        <h3 className="text-md text-slate-500 text-end">
          ¿Ya tienes cuenta? <Link className="text-primary" href={'/login'}>Inicia sesion</Link>
        </h3>
      </div>
      <div className="relative w-1/3 min-h-full ">
        <Image
          src={"/call-to-action-logs.svg"}
          alt="logo"
          fill
          className="object-contain object-bottom rounded-2xl"
        />
      </div>
    </div>
  );
};

export default Register;
