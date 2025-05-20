import { CircleHelp } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => { 
  const cookieStore = await cookies(); 
  const authToken = cookieStore.get("auth-token")?.value; 

  if (!authToken) {
    redirect('/login');
  }
  return (
    <div className="relative h-full w-full border-4 border-amber-400">
      {children}
      <div className="flex mt-[20rem]">
        <h1 className="+">Hola</h1>
       <CircleHelp size={32}/>
      </div>
    </div>
  );
};

export default ProtectedLayout;