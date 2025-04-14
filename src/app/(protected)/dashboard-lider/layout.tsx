import { redirect } from "next/navigation";
import { getUser } from "../../services/auth/actions";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();
  if (user?.role !== "lider") {
    if (user?.role === "auxAdmin") {
      redirect("/dashboard-auxAdmin");
    } else {
      redirect("/dashboard");
    }
  }
  return <div>{children}</div>;
};

export default ProtectedLayout;
