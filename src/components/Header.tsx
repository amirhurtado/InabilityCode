import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <div className="container">
      <div className="relative h-20">
        <Image
          src="/logo.svg"
          alt="logo"
          fill
          className="object-contain object-left"
        />
      </div>
    </div>
  );
};

export default Header;
