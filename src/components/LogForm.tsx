import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { onSubmitLogIn, onSubmitRegister } from "@/app/services/auth/client";
import { getFirebaseErrorMessage } from "@/lib/firebaseError";

const LogForm = ({ type }: { type: string }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<logsProps>();
  const [seePassword, setSeePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState("");
  const [showInvitationField, setShowInvitationField] = useState(false);
  
  const username = watch("username");
  
  useEffect(() => {
    if (username && username.includes("@auxAdmin")) {
      setShowInvitationField(true);
    } else {
      setShowInvitationField(false);
    }
  }, [username]);

  const onSubmit = async (data: logsProps) => {
    setIsLoading(true);
    try {
      if (type === "register") {
        if (showInvitationField && !data.invitationCode) {
          throw new Error("Código de invitación requerido");
        }
        
        await onSubmitRegister({
          ...data,
          invitationCode: showInvitationField ? data.invitationCode : undefined
        });
      } else {
        await onSubmitLogIn(data);
      }
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeePassword = () => {
    setSeePassword(!seePassword);
  };

  return (
    <form className="flex flex-col gap-6 relative" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <span className="absolute top-[-3rem] text-red-500 text-md">{error}</span>
      )}

      {type === "register" && (
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm text-slate-500">
              Nombre de usuario
            </label>
            <Input
              placeholder="Username"
              type="text"
              {...register("username", { 
                required: "El nombre de usuario es requerido",
                validate: (value) => {
                  if (value?.includes("@auxAdmin") && !value?.match(/^[\w@]+$/)) {
                    return "Caracteres no válidos en el nombre de usuario";
                  }
                  return true;
                }
              })}
            />
            {errors.username && (
              <span className="!text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          {showInvitationField && (
            <div className="flex flex-col gap-2">
              <label htmlFor="invitationCode" className="text-sm text-slate-500">
                Código de Invitación
              </label>
              <Input
                placeholder="Código de invitación"
                type="text"
                {...register("invitationCode", { 
                  required: showInvitationField ? "Código de invitación requerido" : false
                })}
              />
              {errors.invitationCode && (
                <span className="!text-red-500 text-sm">
                  {errors.invitationCode.message}
                </span>
              )}
            </div>
          )}
        </>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="Email" className="text-sm text-slate-500">
          Email
        </label>
        <Input
          placeholder="Email"
          type="email"
          {...register("email", { required: "El email es requerido" })}
        />
        {errors.email && (
          <span className="!text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="Password" className="text-sm text-slate-500">
          Contraseña
        </label>
        <Input
          placeholder="Contraseña"
          type={seePassword ? "text" : "password"}
          {...register("password", { 
            required: "La contraseña es requerida", 
            minLength: { 
              value: 6, 
              message: "La contraseña debe tener al menos 6 caracteres" 
            } 
          })}
        />
        {errors.password && (
          <span className="!text-red-500 text-sm">
            {errors.password.message}
          </span>
        )}
        <div className="absolute right-3 top-[2.2rem]">
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
        {isLoading ? (
          <LoaderCircle className="animate-spin" size={20} />
        ) : (
          <span>{type === "register" ? "Registrate" : "Iniciar sesion"}</span>
        )}
      </Button>
    </form>
  );
};

export default LogForm;