'use client'
import React from 'react'
import { useForm } from 'react-hook-form'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()


  return (
    <div  className='gap-2'>
      <h1>LogIn</h1>
    </div>
  )
}

export default Register
