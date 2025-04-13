import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { Eye, EyeOff } from "lucide-react";
import { onSubmitLogIn, onSubmitRegister } from "@/app/services/auth/client";

const LogForm = ({ type }: { type: string }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<logsProps>();
  const [seePassword, setSeePassword] = useState(false);


  const onSubmit = async (data: logsProps) => {
    if (type === "register") {
      await onSubmitRegister(data);
    } else {
      await onSubmitLogIn(data);
    }
  };

  const handleSeePassword = () => {
    setSeePassword(!seePassword);
  };

  return (
    <form className="flex flex-col gap-6 " onSubmit={handleSubmit(onSubmit)}>
      {type === "register" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm text-slate-500">
            Nombre de usuario
          </label>
          <Input
            placeholder="Username"
            type="text"
            {...register("username", { required: true })}
          />

          {errors.username && (
            <span className="text-red-500 text-sm">This field is required</span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="Email" className="text-sm text-slate-500">
          Email
        </label>
        <Input
          placeholder="Email"
          type="email"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">This field is required</span>
        )}
      </div>

      <div className="flex flex-col gap-2  relative ">
        <label htmlFor="Password" className="text-sm text-slate-500">
          Contraseña
        </label>
        <Input
          placeholder="Contraseña"
          type={seePassword ? "text" : "password"}
          {...register("password", { required: true, minLength: 5 })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">This field is required</span>
        )}
        <div className="absolute right-3 top-[2.2rem] ">
          {seePassword ? (
            <Eye size={19} onClick={handleSeePassword} />
          ) : (
            <EyeOff size={19} onClick={handleSeePassword} />
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        className="w-full mt-8 cursor-pointer"
      >
        Crear cuenta
      </Button>
    </form>
  );
};

export default LogForm;
