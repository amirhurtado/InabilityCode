"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Settings, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/DropdownMenu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/AlertDialog";
import { changePasswordClient } from "@/app/services/auth/client";


type PasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

const ConfigMenu = () => {
  const [open, setOpen] = useState(false);
  const [seeNewPassword, setSeeNewPassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<PasswordForm>();

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: PasswordForm) => {
    if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden.",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      await changePasswordClient(data.newPassword);
      alert("Contraseña cambiada con éxito");
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("newPassword", {
        type: "manual",
        message: "Error al cambiar la contraseña",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Cambiar contraseña
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Cambiar contraseña</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="flex flex-col gap-4 mt-2">
              {/* Nueva contraseña */}
              <div className="relative">
                <Input
                  type={seeNewPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  {...register("newPassword", {
                    required: "Campo obligatorio",
                    minLength: {
                      value: 6,
                      message: "Debe tener al menos 6 caracteres",
                    },
                  })}
                />
                <div
                  className="absolute right-3 top-[0.65rem] cursor-pointer"
                  onClick={() => setSeeNewPassword((prev) => !prev)}
                >
                  {seeNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="relative">
                <Input
                  type={seeConfirmPassword ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  {...register("confirmPassword", {
                    required: "Campo obligatorio",
                    minLength: {
                      value: 6,
                      message: "Debe tener al menos 6 caracteres",
                    },
                  })}
                />
                <div
                  className="absolute right-3 top-[0.65rem] cursor-pointer"
                  onClick={() => setSeeConfirmPassword((prev) => !prev)}
                >
                  {seeConfirmPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel type="button" onClick={() => setOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  "Guardar"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConfigMenu;
