import React from 'react'
import Image from "next/image";


const ImageForm = () => {
  return (
    <div className="relative w-[33rem] h-auto rounded-2xl ">
        <Image
          src={"/call-to-action-logs.svg"}
          alt="logo"
          fill
          className="object-contain object-center "
        />
      </div>
  )
}

export default ImageForm
