import React from "react";
import { ModeToggle } from "./ModeToggle";
import { DocumentData } from "firebase-admin/firestore";
import { LogOut } from "lucide-react";
import { Button } from "./Button";
import { logout } from "@/app/services/auth/actions";
import Link from "next/link";
import Logo from "./Logo";


const Header = ({ user }: DocumentData) => {
  console.log(user);
  return (
    <div className="flex justify-between items-center">
      <Link
        href={user ? "/dashboard" : "/"}
        className="flex relative h-20  w-full"
      >
        <Logo />
      </Link>
      <div className="flex items-center gap-5">
          <h2 className="italic text-slate-400">{user?.email}</h2>     
        <ModeToggle />
        {user && (
          <div className="flex items-center gap-2">
            <Button onClick={logout} variant={"destructive"} size={"icon"}>
              <LogOut />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
