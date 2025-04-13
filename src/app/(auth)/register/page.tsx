'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { Input } from '@/components/Input'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()


  return (
    <div  className='flex w-full h-full justify-center gap-8 ' >
      <div className='w-1/3 flex flex-col justify-end '>
        <h1 className="text-3xl">Register Now</h1>

        <form>

          <div>
            <label htmlFor="name" className='text-sm'>Name</label>
            <Input placeholder='Email' type='email' {...register("name", { required: true })} />
            {errors.name && <span className='text-red-500 text-sm'>This field is required</span>}
          </div>

        </form>

      </div>
      <div className='relative w-1/3 min-h-full '>
        <Image src={"/call-to-action-logs.svg"} alt="logo"  fill className='object-contain object-bottom rounded-2xl' />
      </div>
    </div>
  )
}

export default Register
