'use server';

import { cookies } from "next/headers";
import { redirect} from "next/navigation";


export const setAuthCookie = async (token: string) => {

    const cookieStore = await cookies();
    cookieStore.set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
    })

    redirect('/dashboard');
}