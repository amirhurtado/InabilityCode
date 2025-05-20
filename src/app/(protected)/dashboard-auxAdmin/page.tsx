"use client";
import { Typewriter } from "react-simple-typewriter";
import HistorialGlobalAuxAdmin from "@/components/historial/auxAdmin/HistorialAuxAdmin";

const Home = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h1>
          <span className="text-[.9rem]">
            <Typewriter
              words={["Bienvenido de nuevo Auxiliar Administrativo"]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </span>
        </h1>
      </div>

      <HistorialGlobalAuxAdmin />
    </div>
  );
};

export default Home;
