import React from "react";
import { ModeToggle } from "../ModeToggle";
import { DocumentData } from "firebase-admin/firestore";
import { LogOut } from "lucide-react";
import { Button } from "../Button";
import { logout } from "@/app/services/auth/actions";
import Link from "next/link";
import Logo from "../Logo";
import ConfigMenu from "./ConfigMenu";


const Header = ({ user }: DocumentData) => {
  return (
    <div className="flex justify-between items-center">
      <Link
        href={user ? "/dashboard" : "/"}
        className="flex relative h-20  w-full"
      >
        <Logo />
      </Link>
      <div className="flex items-center gap-10">
        <div className="flex gap-4 items-center">
        <h2 className="italic text-slate-400">{user?.username}</h2> 
        <p>-</p> 
        <h2 className="italic text-slate-400">{user?.email}</h2>    

        </div>


        <div className="flex items-center gap-3">
        <ModeToggle />
        {user && (
          <div className="flex items-center gap-2">
            <ConfigMenu />
            <Button onClick={logout} variant={"destructive"} size={"icon"}>
              <LogOut />
            </Button>
          </div>
        )}
        </div> 
        
      </div>
    </div>
  );
};

export default Header;
