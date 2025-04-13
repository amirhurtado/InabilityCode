'use client'
import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { Input } from '@/components/Input'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/Button'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [seePassword, setSeePassword] = useState(false)

  const handleSeePassword = () => {
    setSeePassword(!seePassword)
  }


  return (
    <div  className='flex w-full h-full justify-center gap-12 ' >
      <div className='w-1/3 flex flex-col justify-end gap-10 p-3 '>
        <h1 className="text-3xl">Register Now</h1>

        <form className='flex flex-col gap-6 '>


        <div className='flex flex-col gap-2'> 
            <label htmlFor="username" className='text-sm text-slate-500'>Nombre de usuario</label>
            <Input placeholder='Username' type='text' {...register("username", { required: true })} />
            {errors.name && <span className='text-red-500 text-sm'>This field is required</span>}
          </div>

          <div className='flex flex-col gap-2'> 
            <label htmlFor="Email" className='text-sm text-slate-500'>Email</label>
            <Input placeholder='Email' type='email' {...register("email", { required: true })} />
            {errors.name && <span className='text-red-500 text-sm'>This field is required</span>}
          </div>

          <div className='flex flex-col gap-2  relative '> 
            <label htmlFor="Password" className='text-sm text-slate-500'>Contraseña</label>
            <Input placeholder='Contraseña' type={seePassword ? 'text' : 'password'} {...register("password", { required: true })} />
            {errors.name && <span className='text-red-500 text-sm'>This field is required</span>}
            <div className='absolute right-3 top-[2.2rem] '>
              {seePassword ? <Eye size={19} onClick={handleSeePassword}/> : <EyeOff size={19} onClick={handleSeePassword}/> } 
            </div>
          </div>


          <Button type='submit' variant='default' className='w-full mt-8'>Crear cuenta</Button>

        </form>

      </div>
      <div className='relative w-1/3 min-h-full '>
        <Image src={"/call-to-action-logs.svg"} alt="logo"  fill className='object-contain object-bottom rounded-2xl' />
      </div>
    </div>
  )
}

export default Register
