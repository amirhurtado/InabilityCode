'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()


  return (
    <div  className='flex w-full h-full justify-center ' >
      <div className='w-1/3 flex flex-col justify-end'>
        <h1 className="text-3xl">Register Now</h1>

      </div>
      <div className='relative w-1/3 min-h-full '>
        <Image src={"/call-to-action-logs.svg"} alt="logo"  fill className='object-contain object-bottom rounded-2xl' />
      </div>
    </div>
  )
}

export default Register
