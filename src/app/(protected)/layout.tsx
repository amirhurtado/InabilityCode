import { CircleHelp } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/HoverCard";

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
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="cursor-pointer">
              <CircleHelp size={38} strokeWidth={1} />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="text-xs w-fit px-3 py-2 " side="top">
            Preguntarle a la IA
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default ProtectedLayout;
