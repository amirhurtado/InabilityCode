import Link from "next/link";
import { Button } from "@/components/Button";
import { Send } from "lucide-react";
import Historial from "@/components/historial/user/Historial";

const Home = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-end">
        <Button>
          <Link href={"/new-disability"} className="flex items-center gap-2">
            <Send className="text-backgound" />
            <span>Enviar nueva Incapacidad</span>
          </Link>
        </Button>
      </div>

      <Historial />
    </div>
  );
};

export default Home;
