import React from "react";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import { DocumentData } from "firebase-admin/firestore";
import { LogOut } from 'lucide-react';
import { Button } from "./Button";
import { logout } from "@/app/services/auth/actions";

const Header = ({user} : DocumentData) => {
  return (
      <div className="flex justify-between items-center">
        <div className="relative h-20  w-full">
          <Image
            src="/logo.svg"
            alt="logo"
            fill
            className="object-contain object-left"
          />
        </div>
        <div className="flex items-center gap-5">
          <ModeToggle />
          {user && ( 
            <Button onClick={logout} variant={'destructive'} size={'icon'}> 
            <LogOut   />
          </Button>
          )}
          

        </div>
      </div>
  );
};

export default Header;
