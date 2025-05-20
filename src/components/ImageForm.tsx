"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"; 

const ImageForm = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-[33rem] h-[33rem] rounded-2xl overflow-hidden ">

      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
      )}

      <Image
        src="/call-to-action-logs.svg"
        alt="logo"
        fill
        className={`object-contain object-center transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageForm;
