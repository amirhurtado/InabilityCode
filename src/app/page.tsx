import { redirect } from 'next/navigation'

export default function page() {
  redirect('/login') 
  return null
}
