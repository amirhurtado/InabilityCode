"use client"
import Link from "next/link";
import { Button } from "@/components/Button";
import { Send } from "lucide-react";
import Historial from "@/components/historial/user/Historial";
import { Typewriter } from 'react-simple-typewriter';



const Home = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
      <h1>
  <span className="!text-[3rem]">
    <Typewriter
      words={['Bienvenido de nuevo']}
      loop={1}
      cursor
      cursorStyle="_"
      typeSpeed={70}
      deleteSpeed={50}
      delaySpeed={1000}
    />
  </span>
</h1>

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
