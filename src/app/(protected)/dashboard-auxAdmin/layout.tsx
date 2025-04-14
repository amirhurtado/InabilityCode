import { redirect } from "next/navigation";
import { getUser } from "../../services/auth/actions";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => { 
    const user = await getUser();
    if (user?.role !== "auxAdmin") {
      redirect("/dashboard");
    }
  return (
    <div>
      {children}
    </div>
  );
};

export default ProtectedLayout;