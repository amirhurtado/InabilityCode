import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => { 
  const cookieStore = await cookies(); 
  const authToken = cookieStore.get("auth-token")?.value; 

  if (!authToken) {
    redirect('/login');
  }

  return (
    <div>
      {children}
    </div>
  );
};

export default ProtectedLayout;