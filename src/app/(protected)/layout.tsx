import AIHelpWidget from "@/components/AIHelpWidget";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth-token")?.value;

  if (!authToken) {
    redirect("/login");
  }

  return (
    <div className="relative h-full w-full">
      {children}

      <div className="absolute right-5 bottom-5">
        <AIHelpWidget />
      </div>
    </div>
  );
};

export default ProtectedLayout;
