import React from "react";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
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
        <ModeToggle />
      </div>
  );
};

export default Header;
